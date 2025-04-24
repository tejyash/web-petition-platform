import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { LoadingScreen } from './components/loading-screen'
import { AuthModal } from './components/auth-model'
import { RegistrationPage } from './components/registration-page'
import { CommitteeAuthModal } from "./components/committee-auth-modal";
import { BrowserRouter, HashRouter } from 'react-router-dom'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [authMode, setAuthMode] = useState(null)
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [isCommitteeAuthOpen, setIsCommitteeAuthOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = 'unset';
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleRegisterClick = () => {
    setAuthMode(null);
    setIsRegistrationOpen(true);
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {isLoading && <LoadingScreen />}
      
      <nav className="fixed top-0 w-full z-40 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="flex items-center gap-2"
          >
            <div className="text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <path d="M3 21h18" />
                <path d="M3 7v14" />
                <path d="M21 7v14" />
                <path d="M12 7v14" />
                <path d="M3 7h18" />
                <path d="M12 3L3 7" />
                <path d="M12 3l9 4" />
                <path d="M3 16h18" />
              </svg>
            </div>
            <span className="text-xl font-chinese">Shangri-La City Petitions</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2 }}
            className="space-x-6"
          >
            <button 
              onClick={() => setIsCommitteeAuthOpen(true)}
              className="hover:text-red-500 transition-colors"
            >
              Petitions Committee
            </button>
            <button
              onClick={handleRegisterClick}
              className="group relative px-6 py-2 bg-red-500 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 border border-transparent hover:border-white/30"
            >
              <div className="absolute inset-0 bg-white mix-blend-overlay opacity-0 group-hover:opacity-20 transition-opacity" />
              <span className="relative text-white">
                Register as a Citizen
              </span>
            </button>
          </motion.div>
        </div>
      </nav>

      <main className="relative z-10">
        <div className="relative h-screen">
          <div className="absolute inset-0 top-16 bg-cover bg-center bg-no-repeat z-0"
            style={{ 
              backgroundImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Shangri-La%20Yunnan.jpg-VsFr7QzSOybpmCJNnto91cZ2ixi4Ga.jpeg')",
            }}
          />
          <div className="absolute inset-0 top-16 bg-gradient-to-t from-black via-black/50 to-transparent z-0" />
          
          <div className="relative h-full container mx-auto px-4 flex flex-col items-center justify-center">
            <motion.h1 
              className="text-6xl md:text-8xl font-chinese text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.4 }}
            >
              Voice of Shangri-La
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-center mb-12 max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.6 }}
            >
              Join our community in shaping the future of our mystical city
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3.8 }}
            >
              <button
                onClick={() => setAuthMode('register')}
                className="group relative px-8 py-4 bg-red-500 rounded-full overflow-hidden transition-transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-white mix-blend-overlay opacity-0 group-hover:opacity-20 transition-opacity" />
                <span className="relative text-lg font-semibold">
                  Login 
                </span>
              </button>
            </motion.div>
          </div>
        </div>
      </main>

      <AuthModal 
        isOpen={authMode !== null}
        onClose={() => setAuthMode(null)}
        mode={authMode || 'login'}
        onRegisterClick={handleRegisterClick}
      />

      <RegistrationPage
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
      />

      <CommitteeAuthModal 
        isOpen={isCommitteeAuthOpen}
        onClose={() => setIsCommitteeAuthOpen(false)}
      />
    </div>
  )
}

