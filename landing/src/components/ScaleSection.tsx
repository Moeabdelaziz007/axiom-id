function ScaleSection() {
  return (
    <section className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="glass-card p-12 text-center">
          <h2 className="heading-section mb-6 glow-text-purple">
            Engineered for Billions of Micro-transactions
          </h2>
          
          <div className="flex justify-center mb-8">
            <img 
              src="https://cryptologos.cc/logos/solana-sol-logo.svg" 
              alt="Solana"
              className="h-20 w-auto opacity-90"
            />
          </div>
          
          <p className="body-large text-text-secondary max-w-3xl mx-auto">
            The agent economy will run on high-speed, zero-cost transactions. 
            Axiom ID is built natively on <span className="text-primary font-semibold">Solana</span> to handle the load.
          </p>
          
          <div className="grid grid-cols-3 gap-8 mt-12">
            <div className="space-y-2">
              <div className="text-4xl font-bold glow-text-blue">65,000+</div>
              <div className="text-text-secondary text-sm">TPS Capacity</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold glow-text-blue">~$0.00025</div>
              <div className="text-text-secondary text-sm">Avg Transaction Cost</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold glow-text-blue">400ms</div>
              <div className="text-text-secondary text-sm">Block Time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ScaleSection