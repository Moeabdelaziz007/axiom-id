// This is the main program file: programs/axiom_id/src/lib.rs

use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock; // <-- 1. Import Clock to get time

// This is our new Program ID. Anchor will update this for us later.
declare_id!("11111111111111111111111111111111");

#[program]
pub mod axiom_id {
    use super::*;
    
    // THIS IS OUR NEW FUNCTION!
    // This function creates (initializes) a new AxiomAiIdentity account.
    pub fn create_identity(ctx: Context<CreateIdentity>, persona: String, stake_amount: u64) -> Result<()> {
        
        // Get the account we are creating
        let identity_account = &mut ctx.accounts.identity_account;
        
        // Get the wallet that signed (paid for) this transaction
        let user_authority = &ctx.accounts.user;

        // Get the current time from the blockchain
        let clock = Clock::get()?;

        // --- SET ALL THE FIELDS ---
        identity_account.authority = *user_authority.key;
        identity_account.persona = persona;
        identity_account.reputation = 0; // New accounts start with 0 reputation
        identity_account.created_at = clock.unix_timestamp; // Set "birth" date
        identity_account.stake_amount = stake_amount; // Record the stake amount

        // Log a message to the console
        msg!("Axiom ID Created: {}", identity_account.key());
        msg!("Authority: {}", identity_account.authority);
        msg!("Persona: {}", identity_account.persona);

        Ok(())
    }

    // This is the old placeholder function. We can leave it or remove it.
    // Let's leave it for now.
    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        msg!("Axiom ID Program Initialized!");
        Ok(())
    }

    // Add the get_identity function as specified in the execution blueprint
    // This function allows fetching an existing identity account from the blockchain
    // The client can fetch account data directly using the PDA without needing to call this
    pub fn get_identity(ctx: Context<GetIdentity>) -> Result<()> {
        // The account is already fetched and deserialized by Anchor
        // We just need to log it or return it
        // For on-chain, just returning Ok is enough
        // The client will fetch the account data directly
        msg!("Identity account data fetched for: {}", ctx.accounts.authority.key());
        Ok(())
    }
}

// --- 2. ADDED A HELPER CALCULATION ---
// We define the data structure and calculate its size.
#[account]
pub struct AxiomAiIdentity {
    // The wallet (Pubkey) that "owns" or controls this AI ID
    pub authority: Pubkey,
    
    // A short description of the AI (e.g., "DeFi Analyst v1")
    pub persona: String, 
    
    // Reputation score, starts at 0
    pub reputation: u64,
    
    // When this ID was "born" (Unix Timestamp)
    pub created_at: i64,

    // The amount of $AXIOM tokens staked to keep this ID active
    pub stake_amount: u64,
}

impl AxiomAiIdentity {
    // We need to define the max size for our 'persona' string
    const MAX_PERSONA_LENGTH: usize = 50; // 50 chars max

    // Calculate the total space needed for the account
    pub const LEN: usize = 
        8 + // 8-byte Anchor discriminator (always needed)
        32 + // authority: Pubkey
        (4 + Self::MAX_PERSONA_LENGTH) + // persona: String (4 bytes for length + 50 for data)
        8 + // reputation: u64
        8 + // created_at: i64
        8; // stake_amount: u64
}


// --- 3. ADDED THE ACCOUNTS CONTEXT FOR 'create_identity' ---
#[derive(Accounts)]
pub struct CreateIdentity<'info> {
    
    // 1. The new account we are creating.
    #[account(
        init, // 'init' = create this account
        payer = user, // The 'user' pays for the account's rent
        space = AxiomAiIdentity::LEN, // Use the 'LEN' calculation for space
        seeds = [b"axiom-identity", user.key().as_ref()],
        bump
    )]
    pub identity_account: Account<'info, AxiomAiIdentity>,
    
    // 2. The user who is paying and becoming the authority.
    #[account(mut)]
    pub user: Signer<'info>,
    
    // 3. The System Program (required by Solana to create accounts).
    pub system_program: Program<'info, System>,
}


// Define the context for getting an identity
// This tells Anchor how to find the identity account using PDA derivation
#[derive(Accounts)]
pub struct GetIdentity<'info> {
    #[account(
        seeds = [b"axiom-identity", authority.key().as_ref()],
        bump
    )]
    pub identity_account: Account<'info, AxiomAiIdentity>,
    pub authority: Signer<'info>,
}

// This is just a default struct for our placeholder 'initialize' function.
#[derive(Accounts)]
pub struct Initialize {}