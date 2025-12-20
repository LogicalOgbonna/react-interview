import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Question } from '@/data/types';
import { getRandomQuestions, getQuestionsByCategory } from '@/data/questions';

export interface SessionResult {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  score: number;
  feedback: string;
  timeTaken: number;
}

export interface PracticeSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  category: string;
  categoryName: string;
  questions: Question[];
  currentIndex: number;
  results: SessionResult[];
  totalScore: number;
  timeLimit: number; // in minutes
  isComplete: boolean;
}

interface PracticeStore {
  // Session state
  currentSession: PracticeSession | null;
  sessionHistory: PracticeSession[];
  
  // Actions
  startSession: (categoryId: string, categoryName: string, questionCount: number, timeLimit: number) => void;
  submitAnswer: (answer: string, timeTaken: number) => void;
  gradeAnswer: (questionId: string, score: number, feedback: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  endSession: () => void;
  resetSession: () => void;
  
  // Stats
  getStats: () => {
    totalSessions: number;
    averageScore: number;
    totalQuestionsPracticed: number;
    categoryBreakdown: Record<string, { sessions: number; avgScore: number }>;
  };
}

export const usePracticeStore = create<PracticeStore>()(
  persist(
    (set, get) => ({
      currentSession: null,
      sessionHistory: [],
      
      startSession: (categoryId, categoryName, questionCount, timeLimit) => {
        const questions = categoryId === 'all' 
          ? getRandomQuestions(questionCount)
          : getRandomQuestions(questionCount, categoryId);
        
        const session: PracticeSession = {
          id: `session-${Date.now()}`,
          startTime: new Date(),
          category: categoryId,
          categoryName,
          questions,
          currentIndex: 0,
          results: [],
          totalScore: 0,
          timeLimit,
          isComplete: false,
        };
        
        set({ currentSession: session });
      },
      
      submitAnswer: (answer, timeTaken) => {
        const { currentSession } = get();
        if (!currentSession) return;
        
        const currentQuestion = currentSession.questions[currentSession.currentIndex];
        
        const result: SessionResult = {
          questionId: currentQuestion.id,
          question: currentQuestion.question,
          userAnswer: answer,
          correctAnswer: currentQuestion.answer,
          score: 0, // Will be set by grading
          feedback: '',
          timeTaken,
        };
        
        set({
          currentSession: {
            ...currentSession,
            results: [...currentSession.results, result],
          },
        });
      },
      
      gradeAnswer: (questionId, score, feedback) => {
        const { currentSession } = get();
        if (!currentSession) return;
        
        const updatedResults = currentSession.results.map(r =>
          r.questionId === questionId
            ? { ...r, score, feedback }
            : r
        );
        
        const totalScore = updatedResults.reduce((sum, r) => sum + r.score, 0) / updatedResults.length * 100;
        
        set({
          currentSession: {
            ...currentSession,
            results: updatedResults,
            totalScore: Math.round(totalScore),
          },
        });
      },
      
      nextQuestion: () => {
        const { currentSession } = get();
        if (!currentSession) return;
        
        const nextIndex = currentSession.currentIndex + 1;
        const isComplete = nextIndex >= currentSession.questions.length;
        
        set({
          currentSession: {
            ...currentSession,
            currentIndex: isComplete ? currentSession.currentIndex : nextIndex,
            isComplete,
            endTime: isComplete ? new Date() : undefined,
          },
        });
      },
      
      previousQuestion: () => {
        const { currentSession } = get();
        if (!currentSession || currentSession.currentIndex === 0) return;
        
        set({
          currentSession: {
            ...currentSession,
            currentIndex: currentSession.currentIndex - 1,
          },
        });
      },
      
      endSession: () => {
        const { currentSession, sessionHistory } = get();
        if (!currentSession) return;
        
        const completedSession: PracticeSession = {
          ...currentSession,
          endTime: new Date(),
          isComplete: true,
        };
        
        set({
          currentSession: null,
          sessionHistory: [completedSession, ...sessionHistory].slice(0, 50), // Keep last 50 sessions
        });
      },
      
      resetSession: () => {
        set({ currentSession: null });
      },
      
      getStats: () => {
        const { sessionHistory } = get();
        
        if (sessionHistory.length === 0) {
          return {
            totalSessions: 0,
            averageScore: 0,
            totalQuestionsPracticed: 0,
            categoryBreakdown: {},
          };
        }
        
        const totalQuestionsPracticed = sessionHistory.reduce(
          (sum, s) => sum + s.results.length,
          0
        );
        
        const averageScore = sessionHistory.reduce(
          (sum, s) => sum + s.totalScore,
          0
        ) / sessionHistory.length;
        
        const categoryBreakdown: Record<string, { sessions: number; avgScore: number }> = {};
        
        sessionHistory.forEach(session => {
          if (!categoryBreakdown[session.category]) {
            categoryBreakdown[session.category] = { sessions: 0, avgScore: 0 };
          }
          categoryBreakdown[session.category].sessions++;
          categoryBreakdown[session.category].avgScore += session.totalScore;
        });
        
        Object.keys(categoryBreakdown).forEach(cat => {
          categoryBreakdown[cat].avgScore = Math.round(
            categoryBreakdown[cat].avgScore / categoryBreakdown[cat].sessions
          );
        });
        
        return {
          totalSessions: sessionHistory.length,
          averageScore: Math.round(averageScore),
          totalQuestionsPracticed,
          categoryBreakdown,
        };
      },
    }),
    {
      name: 'interview-practice-storage',
      partialize: (state) => ({ sessionHistory: state.sessionHistory }),
    }
  )
);



