use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::Token2022,
    token_interface::{Mint, TokenAccount, Transfer, transfer, transfer_checked},
};

declare_id!("3sKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD");

#[program]
pub mod axiom_staking {
    use super::*;

    pub fn initialize_pool(ctx: Context<InitializePool>, reward_rate: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.authority = ctx.accounts.authority.key();
        pool.staked_token_mint = ctx.accounts.staked_token_mint.key();
        pool.reward_token_mint = ctx.accounts.reward_token_mint.key();
        pool.reward_rate = reward_rate;
        pool.total_staked = 0;
        pool.acc_reward_per_share = 0;
        pool.last_reward_time = Clock::get()?.unix_timestamp;
        
        Ok(())
    }

    pub fn stake_tokens(ctx: Context<StakeTokens>, amount: u64) -> Result<()> {
        // Transfer tokens from user to pool
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.pool_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer(cpi_ctx, amount)?;

        // Update user stake account
        let user_stake = &mut ctx.accounts.user_stake;
        user_stake.amount = user_stake.amount.checked_add(amount)
            .ok_or(StakingError::Overflow)?;
        user_stake.reward_debt = user_stake.reward_debt.checked_add(
            ((amount as u64).checked_mul(ctx.accounts.pool.acc_reward_per_share as u64)
                .ok_or(StakingError::Overflow)?) as u64
        ).ok_or(StakingError::Overflow)?;

        // Update pool
        let pool = &mut ctx.accounts.pool;
        pool.total_staked = pool.total_staked.checked_add(amount)
            .ok_or(StakingError::Overflow)?;

        Ok(())
    }

    pub fn unstake_tokens(ctx: Context<UnstakeTokens>, amount: u64) -> Result<()> {
        let user_stake = &mut ctx.accounts.user_stake;
        
        // Check if user has enough staked
        if user_stake.amount < amount {
            return err!(StakingError::InsufficientStakedAmount);
        }

        // Calculate pending rewards
        let pending_reward = (((user_stake.amount as u64)
            .checked_mul(ctx.accounts.pool.acc_reward_per_share as u64)
            .ok_or(StakingError::Overflow)?) as u64)
            .checked_sub(user_stake.reward_debt)
            .ok_or(StakingError::Overflow)?;

        // Transfer staked tokens back to user
        let staked_token_mint_key = ctx.accounts.staked_token_mint.key();
        let seeds = &[
            b"staking-pool",
            staked_token_mint_key.as_ref(),
            &[ctx.bumps["pool"]],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.pool_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.pool.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        transfer(cpi_ctx, amount)?;

        // Transfer rewards to user
        if pending_reward > 0 {
            let staked_token_mint_key = ctx.accounts.staked_token_mint.key();
            let seeds = &[
                b"staking-pool",
                staked_token_mint_key.as_ref(),
                &[ctx.bumps["pool"]],
            ];
            let signer = &[&seeds[..]];

            let cpi_accounts = Transfer {
                from: ctx.accounts.reward_token_account.to_account_info(),
                to: ctx.accounts.user_reward_token_account.to_account_info(),
                authority: ctx.accounts.pool.to_account_info(),
            };
            
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
            
            transfer(cpi_ctx, pending_reward)?;
        }

        // Update user stake account
        user_stake.amount = user_stake.amount.checked_sub(amount)
            .ok_or(StakingError::Overflow)?;
        user_stake.reward_debt = ((user_stake.amount as u64)
            .checked_mul(ctx.accounts.pool.acc_reward_per_share as u64)
            .ok_or(StakingError::Overflow)?) as u64;

        // Update pool
        let pool = &mut ctx.accounts.pool;
        pool.total_staked = pool.total_staked.checked_sub(amount)
            .ok_or(StakingError::Overflow)?;

        Ok(())
    }

    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let user_stake = &mut ctx.accounts.user_stake;
        
        // Calculate pending rewards
        let pending_reward = (((user_stake.amount as u64)
            .checked_mul(ctx.accounts.pool.acc_reward_per_share as u64)
            .ok_or(StakingError::Overflow)?) as u64)
            .checked_sub(user_stake.reward_debt)
            .ok_or(StakingError::Overflow)?;

        if pending_reward > 0 {
            let staked_token_mint_key = ctx.accounts.staked_token_mint.key();
            let seeds = &[
                b"staking-pool",
                staked_token_mint_key.as_ref(),
                &[ctx.bumps["pool"]],
            ];
            let signer = &[&seeds[..]];

            let cpi_accounts = Transfer {
                from: ctx.accounts.reward_token_account.to_account_info(),
                to: ctx.accounts.user_reward_token_account.to_account_info(),
                authority: ctx.accounts.pool.to_account_info(),
            };
            
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
            
            transfer(cpi_ctx, pending_reward)?;
        }

        // Update user stake account
        user_stake.reward_debt = ((user_stake.amount as u64)
            .checked_mul(ctx.accounts.pool.acc_reward_per_share as u64)
            .ok_or(StakingError::Overflow)?) as u64;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + StakingPool::INIT_SPACE,
        seeds = [b"staking-pool", staked_token_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, StakingPool>,
    
    pub staked_token_mint: InterfaceAccount<'info, Mint>,
    pub reward_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StakeTokens<'info> {
    #[account(
        mut,
        seeds = [b"staking-pool", staked_token_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, StakingPool>,
    
    #[account(
        init,
        payer = user,
        space = 8 + UserStake::INIT_SPACE,
        seeds = [b"user-stake", pool.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(
        mut,
        token::mint = staked_token_mint,
        token::authority = user,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = staked_token_mint,
        token::authority = pool,
    )]
    pub pool_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub staked_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UnstakeTokens<'info> {
    #[account(
        mut,
        seeds = [b"staking-pool", staked_token_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, StakingPool>,
    
    #[account(
        mut,
        seeds = [b"user-stake", pool.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(
        mut,
        token::mint = staked_token_mint,
        token::authority = pool,
    )]
    pub pool_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = staked_token_mint,
        token::authority = user,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = reward_token_mint,
        token::authority = pool,
    )]
    pub reward_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = reward_token_mint,
        token::authority = user,
    )]
    pub user_reward_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub staked_token_mint: InterfaceAccount<'info, Mint>,
    pub reward_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(
        mut,
        seeds = [b"staking-pool", staked_token_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, StakingPool>,
    
    #[account(
        mut,
        seeds = [b"user-stake", pool.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(
        mut,
        token::mint = reward_token_mint,
        token::authority = pool,
    )]
    pub reward_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = reward_token_mint,
        token::authority = user,
    )]
    pub user_reward_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub staked_token_mint: InterfaceAccount<'info, Mint>,
    pub reward_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct StakingPool {
    pub authority: Pubkey,
    pub staked_token_mint: Pubkey,
    pub reward_token_mint: Pubkey,
    pub reward_rate: u64,
    pub total_staked: u64,
    pub acc_reward_per_share: u128, // Accumulated reward per share
    pub last_reward_time: i64,      // Last time reward was calculated
}

#[account]
#[derive(InitSpace)]
pub struct UserStake {
    pub amount: u64,       // Amount of tokens staked
    pub reward_debt: u64,  // Reward debt for calculating pending rewards
}

#[error_code]
pub enum StakingError {
    #[msg("Insufficient staked amount")]
    InsufficientStakedAmount,
    
    #[msg("Arithmetic overflow")]
    Overflow,
}
