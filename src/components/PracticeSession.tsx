'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Send,
  Home,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trophy,
  RotateCcw,
  Circle,
  CheckCircle2
} from 'lucide-react';
import { usePracticeStore } from '@/store/practice-store';
import { CodeBlock } from './CodeBlock';
import { MultipleChoiceOption } from '@/data/types';

export function PracticeSession() {
  const { 
    currentSession, 
    submitAnswer, 
    gradeAnswer,
    nextQuestion, 
    previousQuestion, 
    endSession,
    resetSession 
  } = usePracticeStore();
  
  const [answer, setAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [selfGrade, setSelfGrade] = useState<number | null>(null);
  
  useEffect(() => {
    if (currentSession) {
      setTimeRemaining(currentSession.timeLimit * 60);
    }
  }, [currentSession?.id]);
  
  useEffect(() => {
    if (!currentSession || currentSession.isComplete) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          endSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentSession, endSession]);
  
  useEffect(() => {
    if (currentSession && !currentSession.isComplete) {
      // Check if this question was already answered
      const currentQuestion = currentSession.questions[currentSession.currentIndex];
      const existingResult = currentSession.results.find(r => r.questionId === currentQuestion.id);
      
      if (existingResult) {
        setAnswer(existingResult.userAnswer);
        setSelectedOption(existingResult.userAnswer);
        setShowAnswer(true);
        setHasSubmitted(true);
        setSelfGrade(existingResult.score);
      } else {
        setAnswer('');
        setSelectedOption(null);
        setShowAnswer(false);
        setHasSubmitted(false);
        setSelfGrade(null);
      }
      setQuestionStartTime(Date.now());
    }
  }, [currentSession?.currentIndex, currentSession?.results, currentSession?.questions, currentSession?.isComplete]);
  
  if (!currentSession) return null;
  
  const currentQuestion = currentSession.questions[currentSession.currentIndex];
  const progress = ((currentSession.currentIndex + 1) / currentSession.questions.length) * 100;
  const isLastQuestion = currentSession.currentIndex === currentSession.questions.length - 1;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleSubmit = () => {
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    const isMultipleChoice = currentQuestion.answerFormat === 'multiple-choice';
    const submittedAnswer = isMultipleChoice ? (selectedOption || '') : answer;
    
    submitAnswer(submittedAnswer, timeTaken);
    setHasSubmitted(true);
    setShowAnswer(true);
    
    // Auto-grade multiple choice questions
    if (isMultipleChoice && currentQuestion.options) {
      const selectedOptionObj = currentQuestion.options.find(o => o.id === selectedOption);
      const score = selectedOptionObj?.isCorrect ? 1 : 0;
      const feedback = selectedOptionObj?.isCorrect 
        ? 'Correct! Well done.'
        : 'Incorrect. Review the correct answer above.';
      setSelfGrade(score);
      gradeAnswer(currentQuestion.id, score, feedback);
    }
  };
  
  const handleGrade = (score: number) => {
    setSelfGrade(score);
    const feedback = score >= 0.8 
      ? 'Excellent! You demonstrated strong understanding.'
      : score >= 0.5 
        ? 'Good effort! Review the answer for complete understanding.'
        : 'Keep practicing! Focus on the key concepts.';
    gradeAnswer(currentQuestion.id, score, feedback);
  };
  
  const handleNext = () => {
    if (isLastQuestion) {
      endSession();
    } else {
      nextQuestion();
    }
  };
  
  // Show results when session is complete
  if (currentSession.isComplete) {
    return <SessionResults />;
  }
  
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={resetSession}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline">Exit</span>
          </button>
          
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg
              ${timeRemaining <= 60 ? 'bg-red-500/20 text-red-400 timer-pulse' : 'bg-muted'}
            `}>
              <Clock className="w-5 h-5" />
              {formatTime(timeRemaining)}
            </div>
          </div>
          
          {/* Progress */}
          <div className="text-sm text-muted-foreground">
            {currentSession.currentIndex + 1} / {currentSession.questions.length}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-muted rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* Question Card */}
        <motion.div
          key={currentSession.currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass rounded-2xl p-6 md:p-8 mb-6"
        >
          {/* Question Meta */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
              {currentQuestion.category}
            </span>
            <span className={`
              px-3 py-1 rounded-full text-xs font-medium
              ${currentQuestion.difficulty === 'beginner' ? 'bg-emerald-500/20 text-emerald-400' : ''}
              ${currentQuestion.difficulty === 'intermediate' ? 'bg-blue-500/20 text-blue-400' : ''}
              ${currentQuestion.difficulty === 'senior' ? 'bg-purple-500/20 text-purple-400' : ''}
              ${currentQuestion.difficulty === 'expert' ? 'bg-rose-500/20 text-rose-400' : ''}
            `}>
              {currentQuestion.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              ~{currentQuestion.timeEstimate} min
            </span>
          </div>
          
          {/* Question */}
          <h2 className="text-xl md:text-2xl font-semibold mb-6">
            {currentQuestion.question}
          </h2>
          
          {/* Answer Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Your Answer</label>
            
            {currentQuestion.answerFormat === 'multiple-choice' && currentQuestion.options ? (
              // Multiple Choice Options
              <div className="space-y-3">
                {currentQuestion.options.map((option: MultipleChoiceOption) => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = hasSubmitted && option.isCorrect;
                  const showIncorrect = hasSubmitted && isSelected && !option.isCorrect;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => !hasSubmitted && setSelectedOption(option.id)}
                      disabled={hasSubmitted}
                      className={`
                        w-full p-4 rounded-lg text-left transition-all flex items-start gap-3
                        ${isSelected && !hasSubmitted ? 'bg-primary/20 border-2 border-primary' : 'bg-muted/50 border-2 border-transparent'}
                        ${showCorrect ? 'bg-emerald-500/20 border-2 border-emerald-500' : ''}
                        ${showIncorrect ? 'bg-rose-500/20 border-2 border-rose-500' : ''}
                        ${!hasSubmitted ? 'hover:bg-muted cursor-pointer' : 'cursor-default'}
                        disabled:opacity-70
                      `}
                    >
                      <div className="mt-0.5">
                        {showCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : showIncorrect ? (
                          <XCircle className="w-5 h-5 text-rose-400" />
                        ) : isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-muted-foreground mr-2">{option.id.toUpperCase()}.</span>
                        <span className={`${showCorrect ? 'text-emerald-400' : showIncorrect ? 'text-rose-400' : ''}`}>
                          {option.text}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              // Essay Text Area
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                disabled={hasSubmitted}
                className="w-full h-48 p-4 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-colors disabled:opacity-50"
              />
            )}
          </div>
          
          {/* Submit / Next Buttons */}
          {!hasSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={currentQuestion.answerFormat === 'multiple-choice' ? !selectedOption : !answer.trim()}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              Submit Answer
            </button>
          ) : (
            <div className="space-y-4">
              {/* Show/Hide Answer Toggle - Only for essay questions */}
              {currentQuestion.answerFormat === 'essay' && (
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showAnswer ? 'Hide' : 'Show'} Correct Answer
                </button>
              )}
              
              {/* Correct Answer - Always shown for MCQ, toggleable for essay */}
              <AnimatePresence>
                {(showAnswer || currentQuestion.answerFormat === 'multiple-choice') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <h3 className="font-semibold text-emerald-400 mb-2">
                        {currentQuestion.answerFormat === 'multiple-choice' ? 'Explanation:' : 'Expected Answer:'}
                      </h3>
                      <div className="text-sm text-foreground whitespace-pre-wrap">
                        {currentQuestion.answer}
                      </div>
                      
                      {currentQuestion.codeExample && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-emerald-400 mb-2">Code Example:</h4>
                          <CodeBlock code={currentQuestion.codeExample} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Self Grading - Only for essay questions */}
              {currentQuestion.answerFormat === 'essay' && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <h3 className="font-medium mb-3">How well did you answer?</h3>
                  <div className="flex gap-2">
                    {[
                      { score: 0.25, label: 'Needs Work', icon: XCircle, color: 'rose' },
                      { score: 0.5, label: 'Partial', icon: AlertCircle, color: 'amber' },
                      { score: 0.75, label: 'Good', icon: CheckCircle, color: 'blue' },
                      { score: 1, label: 'Excellent', icon: Trophy, color: 'emerald' },
                    ].map(({ score, label, icon: Icon, color }) => (
                      <button
                        key={score}
                        onClick={() => handleGrade(score)}
                        className={`
                          flex-1 flex flex-col items-center gap-1 py-3 rounded-lg transition-all
                          ${selfGrade === score 
                            ? `bg-${color}-500/20 ring-2 ring-${color}-500` 
                            : 'bg-muted hover:bg-muted/80'}
                        `}
                      >
                        <Icon className={`w-5 h-5 ${selfGrade === score ? `text-${color}-400` : ''}`} />
                        <span className="text-xs">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* MCQ Result Feedback */}
              {currentQuestion.answerFormat === 'multiple-choice' && selfGrade !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${selfGrade === 1 ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}
                >
                  <div className="flex items-center gap-2">
                    {selfGrade === 1 ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="font-medium text-emerald-400">Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-400" />
                        <span className="font-medium text-rose-400">Incorrect</span>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
              
              {/* Next Button */}
              {selfGrade !== null && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleNext}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  {isLastQuestion ? 'Finish Session' : 'Next Question'}
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          )}
        </motion.div>
        
        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={previousQuestion}
            disabled={currentSession.currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
          
          <button
            onClick={endSession}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-amber-400 hover:bg-amber-400/10 transition-colors"
          >
            End Session Early
          </button>
        </div>
      </div>
    </div>
  );
}

function SessionResults() {
  const { currentSession, resetSession } = usePracticeStore();
  
  if (!currentSession) return null;
  
  const totalQuestions = currentSession.questions.length;
  const answeredQuestions = currentSession.results.length;
  const averageScore = currentSession.totalScore;
  
  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl glass rounded-2xl p-8 text-center"
      >
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-2">Session Complete!</h1>
        <p className="text-muted-foreground mb-8">{currentSession.categoryName}</p>
        
        {/* Score */}
        <div className="mb-8">
          <div className="text-6xl font-bold gradient-text mb-2">
            {averageScore}%
          </div>
          <p className="text-muted-foreground">
            {answeredQuestions} of {totalQuestions} questions answered
          </p>
        </div>
        
        {/* Results Summary */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {currentSession.results.map((result, index) => (
            <div
              key={result.questionId}
              className={`
                p-4 rounded-lg text-left
                ${result.score >= 0.75 ? 'bg-emerald-500/10' : result.score >= 0.5 ? 'bg-amber-500/10' : 'bg-rose-500/10'}
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                {result.score >= 0.75 ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : result.score >= 0.5 ? (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
                <span className="text-sm font-medium">Q{index + 1}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {result.question}
              </p>
            </div>
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={resetSession}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </button>
          <button
            onClick={() => {
              // Could add logic to restart with same config
              resetSession();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <RotateCcw className="w-5 h-5" />
            Practice Again
          </button>
        </div>
      </motion.div>
    </div>
  );
}

