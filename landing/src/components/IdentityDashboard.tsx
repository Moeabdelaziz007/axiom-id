import { useState, useEffect } from 'react';
import { useAxiom } from '../hooks/useAxiom';
import { useWallet } from '@solana/wallet-adapter-react';

const IdentityDashboard = () => {
  const { createIdentity, fetchIdentity } = useAxiom();
  const { publicKey, connected } = useWallet();
  const [identityData, setIdentityData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [persona, setPersona] = useState('');
  const [stakeAmount, setStakeAmount] = useState(0);

  // Fetch identity data when wallet is connected
  useEffect(() => {
    if (connected && publicKey) {
      loadIdentity();
    }
  }, [connected, publicKey]);

  const loadIdentity = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchIdentity();
      setIdentityData(data);
    } catch (err) {
      console.log("No identity found, user needs to create one.");
      setIdentityData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createIdentity(persona, stakeAmount);
      // Re-fetch data after creation
      await loadIdentity();
    } catch (err) {
      setError('Failed to create identity: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="glass-card p-8 max-w-2xl mx-auto">
        <h2 className="heading-section mb-4">Axiom Identity</h2>
        <p className="body-text text-text-secondary">
          Please connect your wallet to view or create your Axiom Identity.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-card p-8 max-w-2xl mx-auto">
        <h2 className="heading-section mb-4">Loading...</h2>
        <p className="body-text text-text-secondary">
          Fetching your identity data...
        </p>
      </div>
    );
  }

  if (identityData) {
    return (
      <div className="glass-card p-8 max-w-2xl mx-auto">
        <h2 className="heading-section mb-6">Your Axiom Identity</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="heading-card mb-2">Persona</h3>
            <p className="body-text">{identityData.persona}</p>
          </div>
          
          <div>
            <h3 className="heading-card mb-2">Authority</h3>
            <p className="body-text font-mono text-sm">{publicKey?.toBase58()}</p>
          </div>
          
          <div>
            <h3 className="heading-card mb-2">Reputation</h3>
            <p className="body-text">{identityData.reputation.toString()}</p>
          </div>
          
          <div>
            <h3 className="heading-card mb-2">Stake Amount</h3>
            <p className="body-text">{identityData.stakeAmount.toString()} AXM</p>
          </div>
          
          <div>
            <h3 className="heading-card mb-2">Created At</h3>
            <p className="body-text">
              {new Date(identityData.createdAt * 1000).toLocaleString()}
            </p>
          </div>
        </div>
        
        <button
          onClick={loadIdentity}
          className="mt-6 px-6 py-3 bg-primary/20 border border-primary/30 rounded-lg text-primary hover:bg-primary/30 transition-all"
        >
          Refresh Data
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 max-w-2xl mx-auto">
      <h2 className="heading-section mb-6">Create Your Axiom Identity</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="body-text text-red-300">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleCreateIdentity} className="space-y-6">
        <div>
          <label className="block heading-card mb-2">Persona</label>
          <input
            type="text"
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            placeholder="e.g., DeFi Analyst v1"
            required
            className="w-full px-4 py-3 bg-card-background/50 border border-primary/30 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <p className="mt-2 body-text text-text-secondary text-sm">
            A short description of your AI identity
          </p>
        </div>
        
        <div>
          <label className="block heading-card mb-2">Stake Amount (AXM)</label>
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(Number(e.target.value))}
            placeholder="0"
            min="0"
            required
            className="w-full px-4 py-3 bg-card-background/50 border border-primary/30 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <p className="mt-2 body-text text-text-secondary text-sm">
            The amount of AXM tokens to stake for this identity
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-4 bg-primary text-background font-semibold rounded-lg pulse-glow hover:bg-primary/90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Identity...' : 'Create Identity'}
        </button>
      </form>
    </div>
  );
};

export default IdentityDashboard;