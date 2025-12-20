'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Hash, Play } from 'lucide-react';
import { usePracticeStore } from '@/store/practice-store';
import { getQuestionsByCategory, allQuestions } from '@/data/questions';

interface SessionConfigProps {
  categoryId: string;
  categoryName: string;
  onClose: () => void;
}

export function SessionConfig({ categoryId, categoryName, onClose }: SessionConfigProps) {
  const [questionCount, setQuestionCount] = useState(5);
  const [timeLimit, setTimeLimit] = useState(30);
  const { startSession } = usePracticeStore();
  
  const availableQuestions = categoryId === 'all' 
    ? allQuestions.length 
    : getQuestionsByCategory(categoryId).length;
  
  const handleStart = () => {
    startSession(categoryId, categoryName, questionCount, timeLimit);
    onClose();
  };
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          className="relative w-full max-w-md glass rounded-2xl p-6 glow"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
          
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Configure Session</h2>
            <p className="text-sm text-muted-foreground">
              {categoryName} • {availableQuestions} questions available
            </p>
          </div>
          
          {/* Question Count */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium mb-3">
              <Hash className="w-4 h-4 text-primary" />
              Number of Questions
            </label>
            <div className="flex gap-2">
              {[10, 20, 30].map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  disabled={count > availableQuestions}
                  className={`
                    flex-1 py-3 rounded-lg font-medium transition-all
                    ${questionCount === count 
                      ? 'bg-primary text-white' 
                      : 'bg-muted hover:bg-muted/80 text-foreground'}
                    ${count > availableQuestions ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
          
          {/* Time Limit */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-sm font-medium mb-3">
              <Clock className="w-4 h-4 text-primary" />
              Time Limit (minutes)
            </label>
            <div className="flex gap-2">
              {[15, 30, 45, 60].map((time) => (
                <button
                  key={time}
                  onClick={() => setTimeLimit(time)}
                  className={`
                    flex-1 py-3 rounded-lg font-medium transition-all
                    ${timeLimit === time 
                      ? 'bg-primary text-white' 
                      : 'bg-muted hover:bg-muted/80 text-foreground'}
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground">
              You&apos;ll answer <span className="text-foreground font-medium">{questionCount} questions</span> in{' '}
              <span className="text-foreground font-medium">{timeLimit} minutes</span>
              <br />
              <span className="text-xs">({Math.floor(timeLimit / questionCount)} minutes per question on average)</span>
            </p>
          </div>
          
          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <Play className="w-5 h-5" />
            Start Practice Session
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}



