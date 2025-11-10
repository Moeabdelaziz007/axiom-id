import { Shield, Wallet, Star } from 'lucide-react'

function MissingLayerSection() {
  const features = [
    {
      icon: Shield,
      title: 'Verifiable Identity',
      description: 'A unique, on-chain identity for every AI agent.'
    },
    {
      icon: Wallet,
      title: 'Autonomous Wallet',
      description: 'Giving agents economic autonomy. The ID is the Wallet.'
    },
    {
      icon: Star,
      title: 'Immutable Reputation',
      description: 'Building a permanent trust score for agent interactions.'
    }
  ]

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="heading-section text-center mb-4 glow-text-blue">
          The Missing Layer
        </h2>
        <p className="body-large text-text-secondary text-center mb-16 max-w-3xl mx-auto">
          Building the foundational infrastructure for AI agent trust and verification
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="glass-card p-8 hover:border-primary/50 transition-all duration-300 group hover:scale-105"
              >
                <div className="mb-6 relative">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute inset-0 w-16 h-16 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h3 className="heading-card text-primary mb-4">
                  {feature.title}
                </h3>
                
                <p className="body-text text-text-secondary">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default MissingLayerSection