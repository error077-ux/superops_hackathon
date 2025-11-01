import { Card } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, Download, Eye, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface CompletionBannerProps {
  onDownload: () => void;
  onViewResults: () => void;
}

export function CompletionBanner({ onDownload, onViewResults }: CompletionBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-8">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />
        </div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="p-4 rounded-full bg-white/20 backdrop-blur-sm"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 mb-2"
              >
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <h2 className="text-white">Compliance Report Ready!</h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/90"
              >
                Your compliance analysis has been completed successfully
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3"
          >
            <Button
              onClick={onViewResults}
              className="bg-white text-green-700 hover:bg-gray-100"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Results
            </Button>
            <Button
              onClick={onDownload}
              className="bg-white/20 text-white hover:bg-white/30 border-2 border-white/50 backdrop-blur-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
