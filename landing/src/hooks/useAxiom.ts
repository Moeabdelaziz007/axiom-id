import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useMemo } from 'react';
import * as anchor from '@project-serum/anchor';

// TODO: We'll need to import the actual IDL file after building the program
// For now, we'll use a placeholder type
type AxiomIdl = any;

// TODO: This will be updated with the actual program ID after deployment
const PROGRAM_ID = new PublicKey("11111111111111111111111111111111");

export const useAxiom = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const provider = useMemo(() => {
    if (!wallet) return null;
    return new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    // TODO: Replace with actual IDL import
    return new Program(null as any, PROGRAM_ID, provider);
  }, [provider]);

  // Function to create a new identity
  const createIdentity = async (persona: string, stakeAmount: number) => {
    if (!program || !wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      // Derive the PDA for the identity account
      const [identityPda, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from("axiom-identity"), wallet.publicKey.toBuffer()],
        program.programId
      );

      // Call the create_identity function on the program
      const tx = await program.methods
        .createIdentity(persona, new anchor.BN(stakeAmount))
        .accounts({
          identityAccount: identityPda,
          user: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Transaction success:", tx);
      return tx;
    } catch (error) {
      console.error("Failed to create identity:", error);
      throw error;
    }
  };

  // Function to fetch an existing identity
  const fetchIdentity = async () => {
    if (!program || !wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      // Derive the PDA for the identity account
      const [identityPda, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from("axiom-identity"), wallet.publicKey.toBuffer()],
        program.programId
      );

      // Fetch the account data directly
      const identityAccount = await program.account.axiomAiIdentity.fetch(identityPda);
      return identityAccount;
    } catch (error) {
      console.error("Failed to fetch identity:", error);
      throw error;
    }
  };

  return { program, provider, connection, wallet, createIdentity, fetchIdentity };
};