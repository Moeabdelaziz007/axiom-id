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

declare_id!("ASoULfAcToRY1111111111111111111111111111111");

#[program]
pub mod agent_soul_factory {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, name: String, symbol: String, uri: String) -> Result<()> {
        let mint = &mut ctx.accounts.mint;
        mint.name = name;
        mint.symbol = symbol;
        mint.uri = uri;
        
        // Set the mint authority to the program so we can control initial minting
        let cpi_accounts = SetAuthority {
            account_or_mint: ctx.accounts.mint.to_account_info(),
            current_authority: ctx.accounts.authority.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        set_authority(cpi_ctx, AuthorityType::MintTokens, Some(ctx.accounts.program_authority.key()))?;
        
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
            authority: ctx.accounts.program_authority.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let seeds = &[
            b"agent-soul-factory",
            &[ctx.bumps.program_authority],
        ];
        let signer = &[&seeds[..]];
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        mint_to(cpi_ctx, amount)?;
        
        // Remove transfer authority to make it soul-bound
        let cpi_accounts = SetAuthority {
            account_or_mint: ctx.accounts.token_account.to_account_info(),
            current_authority: ctx.accounts.program_authority.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        set_authority(cpi_ctx, AuthorityType::AccountOwner, None)?;
        
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
        seeds = [b"agent-soul-factory"],
        bump
    )]
    pub program_authority: AccountInfo<'info>,
    
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
    pub program_authority: AccountInfo<'info>,
    
    /// CHECK: This account can be any valid pubkey
    pub recipient: AccountInfo<'info>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

// Helper struct for mint metadata
#[account]
pub struct MintMetadata {
    pub name: String,
    pub symbol: String,
    pub uri: String,
}