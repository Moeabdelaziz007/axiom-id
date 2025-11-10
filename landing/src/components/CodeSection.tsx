function CodeSection() {
  const codeSnippet = `// Using @coral-xyz/anchor & @solana/web3.js
const provider = anchor.AnchorProvider.local();
anchor.setProvider(provider);

const idl = await anchor.Program.fetchIdl(
  "AXIOM_ID_PROGRAM", 
  provider.connection
);

const program = new anchor.Program(idl, provider);

// Create a new AI agent identity
await program.methods
  .createIdentity("AI Agent v1", 100)
  .accounts({
    identity: identityPDA,
    authority: wallet.publicKey,
  })
  .rpc();`

  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="heading-section text-center mb-4 glow-text-blue">
          Developer-First Integration
        </h2>
        <p className="body-large text-text-secondary text-center mb-12">
          Get started with just a few lines of code
        </p>

        <div className="glass-card p-8 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-text-secondary text-sm font-mono">axiom-integration.ts</span>
          </div>
          
          <pre className="overflow-x-auto">
            <code className="text-sm font-mono leading-relaxed">
              {codeSnippet.split('\n').map((line, i) => (
                <div key={i} className="hover:bg-primary/5 px-4 py-1 rounded transition-colors">
                  <span className="text-text-secondary/50 select-none mr-4 inline-block w-6 text-right">
                    {i + 1}
                  </span>
                  <span className="text-text-primary">
                    {line.split('//').map((part, j) => (
                      j === 0 ? (
                        <span key={j}>
                          {part.split('"').map((str, k) => 
                            k % 2 === 0 ? (
                              <span key={k}>
                                {str.split(/\b(const|await|new|anchor|provider|program|methods|accounts|rpc)\b/).map((word, l) => 
                                  ['const', 'await', 'new'].includes(word) ? (
                                    <span key={l} className="text-secondary">{word}</span>
                                  ) : ['anchor', 'provider', 'program', 'methods', 'accounts', 'rpc'].includes(word) ? (
                                    <span key={l} className="text-primary">{word}</span>
                                  ) : (
                                    <span key={l}>{word}</span>
                                  )
                                )}
                              </span>
                            ) : (
                              <span key={k} className="text-glow-blue">"{str}"</span>
                            )
                          )}
                        </span>
                      ) : (
                        <span key={j} className="text-text-secondary/70">// {part}</span>
                      )
                    ))}
                  </span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </section>
  )
}

export default CodeSection