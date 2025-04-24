import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export function RegistrationPage({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    biometricId: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  }

  const slideIn = {
    hidden: { x: '-100%' },
    visible: { x: 0, transition: { type: 'spring', stiffness: 100 } }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Convert date from DD/MM/YYYY to YYYY-MM-DD
    const [day, month, year] = formData.dateOfBirth.split('/');
    const formattedDate = `${year}-${month}-${day}`;

    try {
      const response = await fetch('http://localhost:5001/petitioner/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          fullname: formData.fullName,
          password: formData.password,
          dob: formattedDate,
          bioid: formData.biometricId
        }),
      });

      const responseText = await response.text();
      let errorMessage;
      
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message;
      } catch (e) {
        errorMessage = responseText;
      }

      if (!response.ok) {
        throw new Error(errorMessage || 'Registration failed');
      }

      setSuccess(true);
      setError('');
      setStep(2);
      
      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      const errorMap = {
        'Invalid or already-used BioID!': 'This Biometric ID is invalid or has already been used.',
        'Email already registered! Please login.': 'This email address is already registered. Please login instead.',
      };

      setError(errorMap[err.message] || err.message);
      console.error('Registration error:', err);
    }
  };

  return (
    <motion.div 
      className={`fixed inset-0 bg-black/90 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center`}
      initial="hidden"
      animate={isOpen ? "visible" : "hidden"}
      variants={fadeIn}
    >
      <motion.div 
        className="bg-white rounded-lg p-8 w-full max-w-md relative"
        variants={slideIn}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        {success ? (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
          >
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
            <p className="text-gray-600 mb-4">Your account has been created.</p>
            <p className="text-gray-600">Please proceed to login to access your account.</p>
          </motion.div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-red-500">Register as a Citizen</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {step === 1 && (
                <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Full Name" 
                    required
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900" 
                  />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email" 
                    required
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900" 
                  />
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password" 
                    required
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900" 
                  />
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm Password" 
                    required
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900" 
                  />
                  <input 
                    type="text" 
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    placeholder="DOB as DD/MM/YYYY" 
                    pattern="\d{2}/\d{2}/\d{4}"
                    title="DD/MM/YYYY "
                    required
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900" 
                  />
                  <div className="flex items-center mb-4">
                    <input 
                      type="text" 
                      name="biometricId"
                      value={formData.biometricId}
                      onChange={handleInputChange}
                      placeholder="Biometric ID (10 characters)" 
                      pattern=".{10,10}"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900" 
                    />
                    <button 
                      type="button"
                      className="ml-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect width="7" height="7" x="7" y="7" rx="1"/><rect width="7" height="7" x="10" y="10" rx="1"/></svg>
                    </button>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Register
                  </button>
                </motion.div>
              )}
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}