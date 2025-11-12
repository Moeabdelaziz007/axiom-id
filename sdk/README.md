# Axiom ID SDK

The Axiom ID SDK provides a simple interface for interacting with the Axiom ID protocol on Solana. It allows developers to create and manage AI agent identities, stake tokens, and participate in the reputation system.

## Installation

```bash
npm install @axiom-id/sdk
```

## Usage

```typescript
import { Connection, Keypair } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import AxiomIDSDK from '@axiom-id/sdk';

// Initialize connection and provider
const connection = new Connection('https://api.devnet.solana.com');
const wallet = new Keypair(); // In practice, use a real wallet
const provider = new AnchorProvider(connection, wallet, {});

// Initialize the SDK
const sdk = new AxiomIDSDK(
  connection,
  provider,
  agentSoulFactoryProgram,
  axiomStakingProgram,
  axiomIdProgram
);

// Create a new AI agent identity
const tx = await sdk.createIdentity("DeFi Analyst v1", 100);
console.log("Identity created:", tx);
```

## Features

- **Agent Identity Creation**: Create permanent, soul-bound identities for AI agents
- **Token Staking**: Stake $AXIOM tokens to secure agent identities
- **Reputation System**: Participate in the reputation-as-yield (RaY) system
- **Soul-Bound Tokens**: Mint non-transferable tokens representing agent souls

## API

### `createIdentity(persona: string, stakeAmount: number)`

Creates a new AI agent identity with the specified persona and stake amount.

### `getIdentity(authority: PublicKey)`

Fetches an existing AI agent identity.

### `stakeTokens(amount: number)`

Stakes tokens for an existing identity.

### `createSoulBoundToken(recipient: PublicKey, amount: number)`

Creates soul-bound tokens for an agent.

## License

MIT