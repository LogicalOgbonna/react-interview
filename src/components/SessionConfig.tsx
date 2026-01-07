'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Hash, Play, FileText, ListChecks, Layers } from 'lucide-react';
import { usePracticeStore } from '@/store/practice-store';
import { getQuestionsByCategory, allQuestions, getQuestionsByFormat } from '@/data/questions';
import { AnswerFormat } from '@/data/types';

interface SessionConfigProps {
  categoryId: string;
  categoryName: string;
  onClose: () => void;
}

type QuestionFormatFilter = 'all' | AnswerFormat;

export function SessionConfig({ categoryId, categoryName, onClose }: SessionConfigProps) {
  const [questionCount, setQuestionCount] = useState(5);
  const [customCount, setCustomCount] = useState('');
  const [useCustomCount, setUseCustomCount] = useState(false);
  const [timeLimit, setTimeLimit] = useState(30);
  const [formatFilter, setFormatFilter] = useState<QuestionFormatFilter>('all');
  const { startSession } = usePracticeStore();
  
  // Get questions based on category and format filter
  const getFilteredQuestions = () => {
    let questions = categoryId === 'all' 
      ? allQuestions 
      : getQuestionsByCategory(categoryId);
    
    if (formatFilter !== 'all') {
      questions = questions.filter(q => q.answerFormat === formatFilter);
    }
    
    return questions;
  };
  
  const filteredQuestions = getFilteredQuestions();
  const availableQuestions = filteredQuestions.length;
  
  // Get counts by format
  const baseQuestions = categoryId === 'all' ? allQuestions : getQuestionsByCategory(categoryId);
  const essayCount = baseQuestions.filter(q => q.answerFormat === 'essay').length;
  const mcqCount = baseQuestions.filter(q => q.answerFormat === 'multiple-choice').length;
  
  const effectiveQuestionCount = useCustomCount && customCount 
    ? Math.min(parseInt(customCount) || 0, availableQuestions) 
    : questionCount;
  
  const handleCustomCountChange = (value: string) => {
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setCustomCount(value);
      setUseCustomCount(true);
    }
  };
  
  const handlePresetClick = (count: number) => {
    setQuestionCount(count);
    setUseCustomCount(false);
    setCustomCount('');
  };
  
  const handleStart = () => {
    startSession(categoryId, categoryName, effectiveQuestionCount, timeLimit, formatFilter);
    onClose();
  };
  
  const isValidCount = effectiveQuestionCount > 0 && effectiveQuestionCount <= availableQuestions;
  
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
          className="relative w-full max-w-md glass rounded-2xl p-6 glow max-h-[90vh] overflow-y-auto"
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
          
          {/* Question Format Filter */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium mb-3">
              <Layers className="w-4 h-4 text-primary" />
              Question Format
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setFormatFilter('all')}
                className={`
                  flex-1 py-3 rounded-lg font-medium transition-all text-sm flex flex-col items-center gap-1
                  ${formatFilter === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-muted hover:bg-muted/80 text-foreground'}
                `}
              >
                <span>All</span>
                <span className="text-xs opacity-70">{baseQuestions.length}</span>
              </button>
              <button
                onClick={() => setFormatFilter('essay')}
                disabled={essayCount === 0}
                className={`
                  flex-1 py-3 rounded-lg font-medium transition-all text-sm flex flex-col items-center gap-1
                  ${formatFilter === 'essay' 
                    ? 'bg-primary text-white' 
                    : 'bg-muted hover:bg-muted/80 text-foreground'}
                  ${essayCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <FileText className="w-4 h-4" />
                <span>Essay</span>
                <span className="text-xs opacity-70">{essayCount}</span>
              </button>
              <button
                onClick={() => setFormatFilter('multiple-choice')}
                disabled={mcqCount === 0}
                className={`
                  flex-1 py-3 rounded-lg font-medium transition-all text-sm flex flex-col items-center gap-1
                  ${formatFilter === 'multiple-choice' 
                    ? 'bg-primary text-white' 
                    : 'bg-muted hover:bg-muted/80 text-foreground'}
                  ${mcqCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <ListChecks className="w-4 h-4" />
                <span>MCQ</span>
                <span className="text-xs opacity-70">{mcqCount}</span>
              </button>
            </div>
          </div>
          
          {/* Question Count */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium mb-3">
              <Hash className="w-4 h-4 text-primary" />
              Number of Questions
            </label>
            <div className="flex gap-2 mb-3">
              {[5, 10, 20].map((count) => (
                <button
                  key={count}
                  onClick={() => handlePresetClick(count)}
                  disabled={count > availableQuestions}
                  className={`
                    flex-1 py-3 rounded-lg font-medium transition-all
                    ${!useCustomCount && questionCount === count 
                      ? 'bg-primary text-white' 
                      : 'bg-muted hover:bg-muted/80 text-foreground'}
                    ${count > availableQuestions ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {count}
                </button>
              ))}
            </div>
            
            {/* Custom Input */}
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={`Custom (1-${availableQuestions})`}
                value={customCount}
                onChange={(e) => handleCustomCountChange(e.target.value)}
                onFocus={() => setUseCustomCount(true)}
                className={`
                  w-full py-3 px-4 rounded-lg font-medium transition-all outline-none
                  ${useCustomCount && customCount
                    ? 'bg-primary/20 border-2 border-primary text-foreground' 
                    : 'bg-muted border-2 border-transparent text-foreground'}
                  placeholder:text-muted-foreground
                `}
              />
              {useCustomCount && customCount && parseInt(customCount) > availableQuestions && (
                <p className="text-xs text-amber-400 mt-1">
                  Max available: {availableQuestions}
                </p>
              )}
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
              You&apos;ll answer <span className="text-foreground font-medium">{effectiveQuestionCount} questions</span> in{' '}
              <span className="text-foreground font-medium">{timeLimit} minutes</span>
              {formatFilter !== 'all' && (
                <span className="text-foreground font-medium"> ({formatFilter === 'essay' ? 'Essay' : 'Multiple Choice'})</span>
              )}
              <br />
              <span className="text-xs">
                ({effectiveQuestionCount > 0 ? Math.floor(timeLimit / effectiveQuestionCount) : 0} minutes per question on average)
              </span>
            </p>
          </div>
          
          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={!isValidCount}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5" />
            Start Practice Session
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}



