import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function PetitionCommittee() {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(location.state?.showLoading ?? true)
  const [selectedPetition, setSelectedPetition] = useState(null)
  const [petitions, setPetitions] = useState([])
  const [userInfo, setUserInfo] = useState(null)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false)
  const [selectedPetitionId, setSelectedPetitionId] = useState(null)
  const [thresholdValue, setThresholdValue] = useState('')
  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        await Promise.all([
          fetchUserInfo(),
          fetchPetitions()
        ])
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error initializing dashboard:', error)
        setIsLoading(false)
      }
    }

    initializeDashboard()
  }, [])

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false)
        document.body.style.overflow = 'unset'
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Click outside handler for profile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:5001/committee/profile', {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed to fetch user info')
      }
      const data = await response.json()
      setUserInfo(data)
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  const fetchPetitions = async () => {
    try {
      const response = await fetch('http://localhost:5001/petition/all', {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed to fetch petitions')
      }
      const data = await response.json()
      setPetitions(data)
    } catch (error) {
      console.error('Error fetching petitions:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5001/committee/logout', {
        credentials: 'include'
      })
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleSetThreshold = async (petitionId, threshold) => {
    try {
      const response = await fetch('http://localhost:5001/petition/set-threshold', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          petition_id: petitionId,
          threshold: parseInt(threshold)
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to set threshold')
      }

      await fetchPetitions()
      setIsThresholdModalOpen(false)
      setThresholdValue('')
    } catch (error) {
      console.error('Error setting threshold:', error)
    }
  }

  const handleRespond = async (petitionId, responseText) => {
    try {
      const response = await fetch('http://localhost:5001/petition/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          petition_id: petitionId,
          response: responseText
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to respond to petition')
      }

      await fetchPetitions()
      setIsRespondModalOpen(false)
    } catch (error) {
      console.error('Error responding to petition:', error)
    }
  }

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`min-h-screen bg-black text-white ${isLoading ? 'hidden' : ''}`}>
        <nav className="fixed top-0 w-full z-40 bg-black/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
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
              <span className="text-xl font-chinese">Shangri-La Petitions Committee</span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-red-500">
                Petition Review Dashboard
              </span>
              {userInfo && (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-full hover:bg-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 border border-transparent hover:border-white/30"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center border-2 border-red-500">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 text-gray-300" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                        />
                      </svg>
                    </div>
                    <span className="text-gray-300">
                      {userInfo.fullname}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5"
                      >
                        <div className="py-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 pt-24">
          {userInfo && (
            <h1 className="text-4xl font-chinese mb-8">
              Petition Review Dashboard
            </h1>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Petition cards - referencing petitioner-dashboard.jsx */}
            {petitions.map((petition) => (
              <motion.div
                key={petition.petition_id}
                className={`bg-gray-800 rounded-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 border border-transparent hover:border-white/30 ${
                  petition.threshold && petition.signature_count >= petition.threshold ? 'border-green-500' : ''
                }`}
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => setSelectedPetition(petition)}
                >
                  <h2 className="text-2xl font-bold mb-4 hover:text-red-500 transition-colors">
                    {petition.title}
                  </h2>
                  <div className="mb-4">
                    <span className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${petition.status === "open" 
                        ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                        : "bg-red-500/20 text-red-400 border border-red-500/30"}
                    `}>
                      {petition.status.charAt(0).toUpperCase() + petition.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {petition.content}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                      />
                    </svg>
                    <span>Signatures: {petition.signature_count}</span>
                    {petition.threshold && (
                      <span className={`ml-2 ${
                        petition.signature_count >= petition.threshold 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {petition.signature_count >= petition.threshold 
                          ? '(Threshold Met!)' 
                          : `(Threshold: ${petition.threshold})`
                        }
                      </span>
                    )}
                  </div>
                  {petition.threshold ? (
                    petition.committee_response ? (
                      <div className="w-full bg-blue-500/20 text-blue-400 py-2 px-4 rounded-md mt-2 flex items-center justify-center border border-blue-500/30">
                        Responded
                      </div>
                    ) : (
                      petition.signature_count >= petition.threshold ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedPetitionId(petition.petition_id)
                            setIsRespondModalOpen(true)
                          }}
                          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors mt-2"
                        >
                          Respond to Petition
                        </button>
                      ) : (
                        <div className="w-full bg-gray-700 text-white py-2 px-4 rounded-md mt-2 flex items-center justify-center">
                          <span className="text-red-400">Threshold: {petition.threshold}</span>
                        </div>
                      )
                    )
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPetitionId(petition.petition_id)
                        setIsThresholdModalOpen(true)
                      }}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors mt-2"
                    >
                      Set Threshold
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Petition details modal - referencing petitioner-dashboard.jsx */}
          {selectedPetition && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedPetition(null)}
            >
              <motion.div 
                className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full" 
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-3xl font-bold mb-4">{selectedPetition.title}</h2>
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                    />
                  </svg>
                  <span>Created by: {selectedPetition.petitioner_fullname}</span>
                </div>
                <div className="mb-6">
                  <span className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${selectedPetition.status === "open" 
                      ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                      : "bg-red-500/20 text-red-400 border border-red-500/30"}
                  `}>
                    {selectedPetition.status.charAt(0).toUpperCase() + selectedPetition.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-300 mb-6">{selectedPetition.content}</p>

                {/* Committee Response Section - always visible */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2 text-blue-400">Committee Response:</h3>
                  {selectedPetition.committee_response ? (
                    <p className="text-gray-300 bg-gray-700/50 p-4 rounded-md border border-blue-500/30">
                      {selectedPetition.committee_response}
                    </p>
                  ) : selectedPetition.threshold ? (
                    selectedPetition.signature_count >= selectedPetition.threshold ? (
                      <p className="text-yellow-400 bg-gray-700/50 p-4 rounded-md border border-yellow-500/30">
                        Not responded yet
                      </p>
                    ) : (
                      <p className="text-gray-400 bg-gray-700/50 p-4 rounded-md border border-gray-600">
                        Not met threshold
                      </p>
                    )
                  ) : (
                    <p className="text-gray-400 bg-gray-700/50 p-4 rounded-md border border-gray-600">
                      Threshold not set
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                    />
                  </svg>
                  <span className="font-semibold">
                    Signatures: {selectedPetition.signature_count}
                  </span>
                  {selectedPetition.threshold && (
                    <span className={`ml-2 ${
                      selectedPetition.signature_count >= selectedPetition.threshold 
                        ? "text-green-400" 
                        : "text-red-400"
                    }`}>
                      {selectedPetition.signature_count >= selectedPetition.threshold 
                        ? `Threshold met! (${selectedPetition.threshold})` 
                        : `Threshold: ${selectedPetition.threshold}`
                      }
                    </span>
                  )}
                </div>
                {selectedPetition.threshold ? (
                  selectedPetition.committee_response ? (
                    <div className="mt-4 bg-blue-500/20 text-blue-400 py-2 px-4 rounded-md flex items-center justify-center border border-blue-500/30">
                      Responded
                    </div>
                  ) : (
                    selectedPetition.signature_count >= selectedPetition.threshold ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedPetitionId(selectedPetition.petition_id)
                          setIsRespondModalOpen(true)
                        }}
                        className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
                      >
                        Respond to Petition
                      </button>
                    ) : (
                      <div className="mt-4 bg-gray-700 text-white py-2 px-4 rounded-md flex items-center justify-center">
                        <span className="text-red-400">Threshold: {selectedPetition.threshold}</span>
                      </div>
                    )
                  )
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedPetitionId(selectedPetition.petition_id)
                      setIsThresholdModalOpen(true)
                    }}
                    className="mt-4 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Set Threshold
                  </button>
                )}
                <div className="flex justify-end mt-6">
                  <button 
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                    onClick={() => setSelectedPetition(null)}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {isThresholdModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
              onClick={() => setIsThresholdModalOpen(false)}
            >
              <motion.div 
                className="bg-gray-800 rounded-lg p-8 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-4">Set Signature Threshold</h2>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleSetThreshold(selectedPetitionId, thresholdValue)
                }}>
                  <input
                    type="number"
                    min="1"
                    value={thresholdValue}
                    onChange={(e) => setThresholdValue(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 rounded-md border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
                    placeholder="Enter threshold number"
                    required
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsThresholdModalOpen(false)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                    >
                      Set Threshold
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}

          {isRespondModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
              onClick={() => setIsRespondModalOpen(false)}
            >
              <motion.div 
                className="bg-gray-800 rounded-lg p-8 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-4">Respond to Petition</h2>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleRespond(selectedPetitionId, e.target.response.value)
                }}>
                  <textarea
                    name="response"
                    className="w-full px-4 py-2 bg-gray-700 rounded-md border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
                    placeholder="Enter your response..."
                    required
                    rows={4}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsRespondModalOpen(false)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                    >
                      Submit Response
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </main>
      </div>
    </>
  )
}
