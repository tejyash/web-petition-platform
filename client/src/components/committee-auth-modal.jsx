import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function CommitteeAuthModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await fetch('http://localhost:5001/committee/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Show success message first
      setSuccess('Login successful! Redirecting to committee dashboard...')
      
      // Clear form
      setFormData({ email: '', password: '' })
      
      // Wait 1 second to show success message before loading screen
      setTimeout(() => {
        setIsLoading(true)
        // Wait another second before closing modal and navigating
        setTimeout(() => {
          onClose()
          document.body.style.overflow = 'hidden'
          navigate('/committee/dashboard', { 
            state: { showLoading: true } 
          })
        }, 1000)
      }, 1000)
      
    } catch (err) {
      setError(err.message)
      console.error('Login error:', err)
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
        >
          {isLoading ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-40 h-40"
            >
              <div className="absolute inset-0 border-4 border-red-500 rounded-full animate-ping" />
              <div className="absolute inset-0 border-2 border-white rounded-full animate-pulse" />
              <motion.div 
                className="absolute inset-0 flex items-center justify-center text-white text-2xl font-chinese"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Loading
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-8 w-full max-w-md relative"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-bold mb-6 text-white">Login as a Committee Officer</h2>
              
              {error && (
                <div className="mb-4 p-2 bg-red-500/10 border border-red-500/50 rounded text-red-500">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-2 bg-green-500/10 border border-green-500/50 rounded text-green-500">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Committee Email"
                    className="w-full px-4 py-2 bg-gray-700 rounded-md border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Password"
                    className="w-full px-4 py-2 bg-gray-700 rounded-md border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Login
                </button>
              </form>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}