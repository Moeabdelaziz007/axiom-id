use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::{
        self,
        spl_token_2022::{
            self,
            instruction::AuthorityType,
        },
    },
    token_interface::{
        Mint, TokenAccount, TokenInterface,
        mint_to, set_authority, MintTo, SetAuthority,
    },
};

declare_id!("2sKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD");

#[program]
pub mod agent_soul_factory {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, name: String, symbol: String, uri: String) -> Result<()> {
        // Initialize the metadata account instead of trying to set fields on the mint directly
        let metadata = &mut ctx.accounts.metadata;
        metadata.name = name;
        metadata.symbol = symbol;
        metadata.uri = uri;
        
        // Set the mint authority to the program so we can control initial minting
        let cpi_accounts = SetAuthority {
            account_or_mint: ctx.accounts.mint.to_account_info(),
            current_authority: ctx.accounts.authority.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        set_authority(cpi_ctx, AuthorityType::MintTokens, Some(ctx.accounts.agent_soul_factory.key()))?;
        
        Ok(())
    }

    pub fn create_soul_bound_token(
        ctx: Context<CreateSoulBoundToken>,
        amount: u64,
    ) -> Result<()> {
        // Mint the soul-bound tokens to the recipient
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.agent_soul_factory.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let bump = *ctx.bumps.get("agent_soul_factory").unwrap();
        let seeds = &[
            b"agent-soul-factory".as_ref(),
            &[bump],
        ];
        let signer = &[&seeds[..]];
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        mint_to(cpi_ctx, amount)?;
        
        // Remove transfer authority to make it soul-bound
        let cpi_accounts = SetAuthority {
            account_or_mint: ctx.accounts.token_account.to_account_info(),
            current_authority: ctx.accounts.agent_soul_factory.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        set_authority(cpi_ctx, AuthorityType::AccountOwner, None)?;
        
        Ok(())
    }
    
    // New function to create a proper NTT mint with non-transferable extension
    pub fn create_ntt_mint(ctx: Context<CreateNTTMint>, name: String, symbol: String, uri: String) -> Result<()> {
        // This would be implemented with proper CPI calls to Token-2022
        // to create a mint with the NonTransferable extension
        
        // For now, we'll just initialize the metadata
        let metadata = &mut ctx.accounts.metadata;
        metadata.name = name;
        metadata.symbol = symbol;
        metadata.uri = uri;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        mint::token_program = token_program,
        mint::decimals = 0,
        mint::authority = authority,
        seeds = [b"agent-soul-mint"],
        bump
    )]
    pub mint: InterfaceAccount<'info, Mint>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + MintMetadata::INIT_SPACE,
        seeds = [b"agent-soul-metadata", authority.key().as_ref()],
        bump
    )]
    pub metadata: Account<'info, MintMetadata>,
    
    #[account(
        seeds = [b"agent-soul-factory"],
        bump
    )]
    pub agent_soul_factory: AccountInfo<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateSoulBoundToken<'info> {
    #[account(
        mut,
        mint::token_program = token_program,
    )]
    pub mint: InterfaceAccount<'info, Mint>,
    
    #[account(
        init,
        payer = payer,
        token::mint = mint,
        token::authority = recipient,
        token::token_program = token_program,
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        seeds = [b"agent-soul-factory"],
        bump
    )]
    pub agent_soul_factory: AccountInfo<'info>,
    
    /// CHECK: This account can be any valid pubkey
    pub recipient: AccountInfo<'info>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

// New accounts struct for creating NTT mints
#[derive(Accounts)]
pub struct CreateNTTMint<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + MintMetadata::INIT_SPACE,
        seeds = [b"ntt-mint-metadata", authority.key().as_ref()],
        bump
    )]
    pub metadata: Account<'info, MintMetadata>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

// Helper struct for mint metadata
#[account]
#[derive(InitSpace)]
pub struct MintMetadata {
    #[max_len(32)]
    pub name: String,
    #[max_len(10)]
    pub symbol: String,
    #[max_len(200)]
    pub uri: String,
}