import { useState } from 'react'

function FinalCTASection() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Final CTA submission:', email)
    alert(`Thanks for your interest! We'll contact you at ${email}`)
    setEmail('')
  }

  return (
    <section className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="heading-section mb-6 glow-text-purple">
          Secure your spot. Build the future of AI.
        </h2>
        
        <p className="body-large text-text-secondary mb-12 max-w-2xl mx-auto">
          Join the waitlist to get early access to Axiom ID and shape the infrastructure of the agent economy.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-16">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-6 py-4 bg-card-background/50 border border-primary/30 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <button
            type="submit"
            className="px-8 py-4 bg-primary text-background font-semibold rounded-lg pulse-glow hover:bg-primary/90 transition-all transform hover:scale-105"
          >
            Join Waitlist
          </button>
        </form>

        <footer className="pt-12 border-t border-text-secondary/10">
          <p className="text-text-secondary/70 text-sm">
            Built on Solana • Axiom ID © {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </section>
  )
}

export default FinalCTASection