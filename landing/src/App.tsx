import HeroSection from './components/HeroSection'
import MissingLayerSection from './components/MissingLayerSection'
import ScaleSection from './components/ScaleSection'
import CodeSection from './components/CodeSection'
import FinalCTASection from './components/FinalCTASection'
import AnimatedBackground from './components/AnimatedBackground'
import IdentityDashboard from './components/IdentityDashboard'

function App() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <div className="relative z-10">
        <HeroSection />
        <MissingLayerSection />
        <ScaleSection />
        <CodeSection />
        <div className="py-20 px-6">
          <IdentityDashboard />
        </div>
        <FinalCTASection />
      </div>
    </div>
  )
}

export default App