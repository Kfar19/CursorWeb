'use client'
import { motion } from 'framer-motion'

export default function SignalProcessor() {
  return (
    <div className="grid grid-cols-2 gap-8 items-center p-8">
      {/* Left: Human Team */}
      <div className="space-y-4">
        <p className="text-lg font-medium">Market Feeds, Startup Decks, Whitepapers →</p>
        <motion.div
          className="flex space-x-4 items-center"
          animate={{ opacity: [1, 0.8, 1], x: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span>🧑‍💻☕</span>
          <span>🧑‍💻💭</span>
          <span>🧑‍💻😐</span>
        </motion.div>
        <p className="font-semibold text-xl">Human Team</p>
      </div>

      {/* Right: AI Engine */}
      <div className="space-y-4 text-right">
        <p className="text-lg font-medium">→ Structured Insights</p>
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.div
            className="text-green-500 font-semibold"
            animate={{ x: [20, 0], opacity: [0, 1] }}
            transition={{ delay: 0.8 }}
          >
            ✅ Signal 1
          </motion.div>
          <motion.div
            className="text-green-500 font-semibold"
            animate={{ x: [20, 0], opacity: [0, 1] }}
            transition={{ delay: 1.2 }}
          >
            ✅ Signal 2
          </motion.div>
          <motion.div
            className="text-green-500 font-semibold"
            animate={{ x: [20, 0], opacity: [0, 1] }}
            transition={{ delay: 1.6 }}
          >
            ✅ Signal 3
          </motion.div>
        </motion.div>
        <p className="font-semibold text-xl">⚡ AI Engine</p>
      </div>
    </div>
  )
} 