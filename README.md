# Axiom ID

A decentralized identity verification system built on the Solana blockchain using the Anchor framework.

## Overview

Axiom ID is a secure, configurable, and dedicated development environment for creating and managing decentralized identities on the Solana blockchain. This project provides a robust foundation for identity verification services in Web3 applications.

## Features

- Decentralized identity creation and management
- Secure verification processes
- Integration with Solana blockchain
- Built with Rust and Anchor framework
- TypeScript frontend for user interactions

## Project Structure

```
axiom_id/
├── programs/          # Solana programs (Rust)
├── app/               # Frontend application
├── tests/             # Integration tests
├── migrations/        # Deployment scripts
├── scripts/           # Utility scripts
└── target/            # Build artifacts
```

## Prerequisites

- Rust and Cargo
- Solana CLI tools
- Node.js and npm
- Anchor framework

## Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Build the program with `anchor build`
4. Run tests with `anchor test`

## Deployment

The project can be deployed to Solana devnet or mainnet using the provided scripts.

## License

MIT