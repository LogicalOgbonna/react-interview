import { Question, Category } from '../types';
import { reactCoreQuestions } from './react-core';
import { hooksQuestions } from './hooks';
import { nextjsQuestions } from './nextjs';
import { optimizationQuestions } from './optimization';
import { securityQuestions } from './security';
import { debuggingQuestions } from './debugging';
import { stateManagementQuestions } from './state-management';
import { codeOrganizationQuestions } from './code-organization';

// Combine all questions
export const allQuestions: Question[] = [
  ...reactCoreQuestions,
  ...hooksQuestions,
  ...nextjsQuestions,
  ...optimizationQuestions,
  ...securityQuestions,
  ...debuggingQuestions,
  ...stateManagementQuestions,
  ...codeOrganizationQuestions,
];

// Category definitions with metadata
export const categories: Category[] = [
  {
    id: 'react-core',
    name: 'React Core',
    description: 'Fundamental React concepts, JSX, components, virtual DOM, and reconciliation',
    icon: '⚛️',
    color: '#61DAFB',
    questionCount: reactCoreQuestions.length,
  },
  {
    id: 'hooks',
    name: 'React Hooks',
    description: 'useState, useEffect, useRef, useMemo, useCallback, custom hooks, and rules',
    icon: '🪝',
    color: '#764ABC',
    questionCount: hooksQuestions.length,
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    description: 'App Router, Server Components, SSR, SSG, ISR, routing, and middleware',
    icon: '▲',
    color: '#000000',
    questionCount: nextjsQuestions.length,
  },
  {
    id: 'optimization',
    name: 'Performance & Optimization',
    description: 'Re-renders, memoization, code splitting, virtualization, and Web Vitals',
    icon: '⚡',
    color: '#F59E0B',
    questionCount: optimizationQuestions.length,
  },
  {
    id: 'security',
    name: 'Security',
    description: 'XSS prevention, CSRF, authentication, authorization, and secure storage',
    icon: '🔒',
    color: '#EF4444',
    questionCount: securityQuestions.length,
  },
  {
    id: 'debugging',
    name: 'Debugging',
    description: 'DevTools, memory leaks, hydration errors, performance profiling',
    icon: '🐛',
    color: '#10B981',
    questionCount: debuggingQuestions.length,
  },
  {
    id: 'state-management',
    name: 'State Management',
    description: 'Redux, Zustand, Context API, TanStack Query, and async state',
    icon: '🗃️',
    color: '#8B5CF6',
    questionCount: stateManagementQuestions.length,
  },
  {
    id: 'code-organization',
    name: 'Code Organization',
    description: 'Folder structure, component patterns, TypeScript, error handling',
    icon: '📁',
    color: '#3B82F6',
    questionCount: codeOrganizationQuestions.length,
  },
];

// Helper functions
export function getQuestionsByCategory(categoryId: string): Question[] {
  const categoryMap: Record<string, Question[]> = {
    'react-core': reactCoreQuestions,
    'hooks': hooksQuestions,
    'nextjs': nextjsQuestions,
    'optimization': optimizationQuestions,
    'security': securityQuestions,
    'debugging': debuggingQuestions,
    'state-management': stateManagementQuestions,
    'code-organization': codeOrganizationQuestions,
  };
  
  return categoryMap[categoryId] || [];
}

export function getQuestionsByDifficulty(difficulty: Question['difficulty']): Question[] {
  return allQuestions.filter(q => q.difficulty === difficulty);
}

export function getRandomQuestions(count: number, categoryId?: string): Question[] {
  const source = categoryId ? getQuestionsByCategory(categoryId) : allQuestions;
  const shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getQuestionById(id: string): Question | undefined {
  return allQuestions.find(q => q.id === id);
}

export function searchQuestions(query: string): Question[] {
  const lowerQuery = query.toLowerCase();
  return allQuestions.filter(q => 
    q.question.toLowerCase().includes(lowerQuery) ||
    q.answer.toLowerCase().includes(lowerQuery) ||
    q.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// Statistics
export const stats = {
  totalQuestions: allQuestions.length,
  byDifficulty: {
    beginner: allQuestions.filter(q => q.difficulty === 'beginner').length,
    intermediate: allQuestions.filter(q => q.difficulty === 'intermediate').length,
    senior: allQuestions.filter(q => q.difficulty === 'senior').length,
    expert: allQuestions.filter(q => q.difficulty === 'expert').length,
  },
  byType: {
    conceptual: allQuestions.filter(q => q.type === 'conceptual').length,
    coding: allQuestions.filter(q => q.type === 'coding').length,
    debugging: allQuestions.filter(q => q.type === 'debugging').length,
    'system-design': allQuestions.filter(q => q.type === 'system-design').length,
  },
  totalCategories: categories.length,
};



