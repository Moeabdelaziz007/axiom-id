use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

declare_id!("4sKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD");

#[program]
pub mod axiom_attestations {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, authority: Pubkey) -> Result<()> {
        let attestation_config = &mut ctx.accounts.attestation_config;
        attestation_config.authority = authority;
        attestation_config.total_attestations = 0;
        attestation_config.bump = *ctx.bumps.get("attestation_config").unwrap();
        
        Ok(())
    }

    pub fn create_attestation_schema(
        ctx: Context<CreateAttestationSchema>,
        name: String,
        description: String,
    ) -> Result<()> {
        let schema = &mut ctx.accounts.schema;
        schema.authority = ctx.accounts.authority.key();
        schema.name = name;
        schema.description = description;
        schema.bump = *ctx.bumps.get("schema").unwrap();
        
        Ok(())
    }

    pub fn issue_attestation(
        ctx: Context<IssueAttestation>,
        claim: String,
        expiration: Option<i64>,
    ) -> Result<()> {
        let attestation = &mut ctx.accounts.attestation;
        attestation.schema = ctx.accounts.schema.key();
        attestation.subject = ctx.accounts.subject.key();
        attestation.attester = ctx.accounts.attester.key();
        attestation.claim = claim;
        attestation.expiration = expiration;
        attestation.revoked = false;
        attestation.timestamp = Clock::get()?.unix_timestamp;
        attestation.bump = *ctx.bumps.get("attestation").unwrap();
        
        // Update the total attestations count
        let attestation_config = &mut ctx.accounts.attestation_config;
        attestation_config.total_attestations = attestation_config.total_attestations.checked_add(1)
            .ok_or(error!(AttestationError::Overflow))?;
        
        Ok(())
    }

    pub fn revoke_attestation(ctx: Context<RevokeAttestation>, reason: String) -> Result<()> {
        let attestation = &mut ctx.accounts.attestation;
        attestation.revoked = true;
        
        // Log the revocation reason
        msg!("Attestation revoked for reason: {}", reason);
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + AttestationConfig::INIT_SPACE,
        seeds = [b"attestation-config"],
        bump
    )]
    pub attestation_config: Account<'info, AttestationConfig>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateAttestationSchema<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + AttestationSchema::INIT_SPACE,
        seeds = [b"schema", authority.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub schema: Account<'info, AttestationSchema>,
    
    #[account(
        mut,
        constraint = authority.key() == attestation_config.authority
    )]
    pub authority: Signer<'info>,
    
    #[account(
        seeds = [b"attestation-config"],
        bump = attestation_config.bump
    )]
    pub attestation_config: Account<'info, AttestationConfig>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(claim: String)]
pub struct IssueAttestation<'info> {
    #[account(
        init,
        payer = attester,
        space = 8 + Attestation::INIT_SPACE,
        seeds = [
            b"attestation", 
            schema.key().as_ref(), 
            subject.key().as_ref(), 
            attester.key().as_ref(),
            claim.as_bytes()
        ],
        bump
    )]
    pub attestation: Account<'info, Attestation>,
    
    pub schema: Account<'info, AttestationSchema>,
    
    /// CHECK: This is the subject of the attestation
    pub subject: AccountInfo<'info>,
    
    #[account(mut)]
    pub attester: Signer<'info>,
    
    #[account(
        seeds = [b"attestation-config"],
        bump = attestation_config.bump
    )]
    pub attestation_config: Account<'info, AttestationConfig>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RevokeAttestation<'info> {
    #[account(
        mut,
        constraint = attestation.attester == attester.key()
    )]
    pub attestation: Account<'info, Attestation>,
    
    #[account(mut)]
    pub attester: Signer<'info>,
}

// Configuration account for the attestation program
#[account]
#[derive(InitSpace)]
pub struct AttestationConfig {
    pub authority: Pubkey,
    pub total_attestations: u64,
    pub bump: u8,
}

// Schema for attestations
#[account]
#[derive(InitSpace)]
pub struct AttestationSchema {
    pub authority: Pubkey,
    #[max_len(50)]
    pub name: String,
    #[max_len(200)]
    pub description: String,
    pub bump: u8,
}

// Individual attestation
#[account]
#[derive(InitSpace)]
pub struct Attestation {
    pub schema: Pubkey,
    pub subject: Pubkey,
    pub attester: Pubkey,
    #[max_len(500)]
    pub claim: String,
    pub expiration: Option<i64>,
    pub revoked: bool,
    pub timestamp: i64,
    pub bump: u8,
}

#[error_code]
pub enum AttestationError {
    #[msg("Arithmetic overflow")]
    Overflow,
}