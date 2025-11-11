import { useState } from 'react';
import NeuralNetworkAnimation from './NeuralNetworkAnimation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { joinWaitlist } from '../api/waitlist';

function HeroSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const result = await joinWaitlist(email);
      
      if (result?.success) {
        setMessage({type: 'success', text: result.message});
        setEmail('');
      } else if (result?.errors) {
        setMessage({type: 'error', text: result.errors.email?.[0] || result.message});
      } else if (result?.message) {
        setMessage({type: 'error', text: result.message});
      }
    } catch (error) {
      setMessage({type: 'error', text: 'An unexpected error occurred. Please try again later.'});
    } finally {
      setLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-7xl mx-auto w-full">
        {/* Wallet Connection Button */}
        <div className="absolute top-6 right-6 z-20">
          <WalletMultiButton />
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <h1 className="heading-hero glow-text-blue">
              Google is building the Factory. We are building the Soul.
            </h1>
            
            <p className="body-large text-text-secondary max-w-2xl">
              <span className="glow-text-purple font-semibold">Axiom ID:</span> The Verifiable Trust Layer for the new Agent Economy.
            </p>
            
            <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row gap-4 max-w-md">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-6 py-4 bg-card-background/50 border border-primary/30 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  disabled={loading}
                />
                {message && (
                  <div className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {message.text}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-primary text-background font-semibold rounded-lg pulse-glow hover:bg-primary/90 transition-all transform hover:scale-105 disabled:opacity-50 whitespace-nowrap"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2"></div>
                    Joining...
                  </div>
                ) : 'Join the Waitlist'}
              </button>
            </form>
          </div>

          {/* Right visual */}
          <div className="relative h-[500px] flex items-center justify-center">
            <NeuralNetworkAnimation />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection