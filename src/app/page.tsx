'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Play, 
  BarChart3,
  Zap,
  Target,
  CheckCircle
} from 'lucide-react';
import { categories, stats } from '@/data/questions';
import { usePracticeStore } from '@/store/practice-store';
import { CategoryCard } from '@/components/CategoryCard';
import { StatsCard } from '@/components/StatsCard';
import { SessionConfig } from '@/components/SessionConfig';
import { PracticeSession } from '@/components/PracticeSession';
import { SessionHistory } from '@/components/SessionHistory';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const { currentSession, sessionHistory, getStats } = usePracticeStore();
  
  const userStats = getStats();
  
  // If there's an active session, show the practice view
  if (currentSession && !currentSession.isComplete) {
    return <PracticeSession />;
  }
  
  // If session just completed, show results
  if (currentSession?.isComplete) {
    return <PracticeSession />;
  }
  
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Senior React Interview Prep</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Master Your</span>
            <br />
            <span className="text-foreground">React Interview</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Practice {stats.totalQuestions}+ senior-level questions across {stats.totalCategories} categories.
            Timed sessions, AI grading, and detailed feedback.
          </p>
        </motion.header>
        
        {/* Quick Stats */}
        <motion.section 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <StatsCard 
            icon={<BookOpen className="w-5 h-5" />}
            label="Total Questions"
            value={stats.totalQuestions}
            color="indigo"
          />
          <StatsCard 
            icon={<Target className="w-5 h-5" />}
            label="Sessions Completed"
            value={userStats.totalSessions}
            color="purple"
          />
          <StatsCard 
            icon={<Trophy className="w-5 h-5" />}
            label="Average Score"
            value={`${userStats.averageScore}%`}
            color="amber"
          />
          <StatsCard 
            icon={<CheckCircle className="w-5 h-5" />}
            label="Questions Practiced"
            value={userStats.totalQuestionsPracticed}
            color="emerald"
          />
        </motion.section>
        
        {/* Category Selection */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Choose a Category</h2>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setShowConfig(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity"
            >
              <Play className="w-4 h-4" />
              Quick Start (All Categories)
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                isSelected={selectedCategory === category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setShowConfig(true);
                }}
              />
            ))}
          </div>
        </motion.section>
        
        {/* Difficulty Breakdown */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">Question Difficulty</h2>
          <div className="glass rounded-xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <DifficultyBar label="Beginner" count={stats.byDifficulty.beginner} total={stats.totalQuestions} color="emerald" />
              <DifficultyBar label="Intermediate" count={stats.byDifficulty.intermediate} total={stats.totalQuestions} color="blue" />
              <DifficultyBar label="Senior" count={stats.byDifficulty.senior} total={stats.totalQuestions} color="purple" />
              <DifficultyBar label="Expert" count={stats.byDifficulty.expert} total={stats.totalQuestions} color="rose" />
            </div>
          </div>
        </motion.section>
        
        {/* Session History */}
        {sessionHistory.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6">Recent Sessions</h2>
            <SessionHistory sessions={sessionHistory.slice(0, 5)} />
          </motion.section>
        )}
        
        {/* Session Config Modal */}
        {showConfig && selectedCategory && (
          <SessionConfig
            categoryId={selectedCategory}
            categoryName={selectedCategory === 'all' ? 'All Categories' : categories.find(c => c.id === selectedCategory)?.name || ''}
            onClose={() => {
              setShowConfig(false);
              setSelectedCategory(null);
            }}
          />
        )}
      </div>
    </main>
  );
}

function DifficultyBar({ 
  label, 
  count, 
  total, 
  color 
}: { 
  label: string; 
  count: number; 
  total: number; 
  color: string;
}) {
  const percentage = Math.round((count / total) * 100);
  
  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    rose: 'bg-rose-500',
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">{count}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${colorClasses[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
      </div>
    </div>
  );
}
