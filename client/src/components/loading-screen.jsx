import { motion } from "framer-motion"

export function LoadingScreen() {
  return (
    <motion.div 
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1, delay: 2 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-40 h-40"
      >
        <div className="absolute inset-0 border-4 border-red-500 rounded-full animate-ping" />
        <div className="absolute inset-0 border-2 border-white rounded-full animate-pulse" />
        <motion.div 
          className="absolute inset-0 flex items-center justify-center text-white text-2xl font-chinese"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

