import { useState } from 'react'
import NeuralNetworkAnimation from './NeuralNetworkAnimation'

function HeroSection() {
  const [email, setEmail] = useState('')

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Joining waitlist with email:', email)
    alert(`Thanks for joining! We'll reach out to ${email} soon.`)
    setEmail('')
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-7xl mx-auto w-full">
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
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 bg-card-background/50 border border-primary/30 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-primary text-background font-semibold rounded-lg pulse-glow hover:bg-primary/90 transition-all transform hover:scale-105"
              >
                Join the Waitlist
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