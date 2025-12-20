export type Difficulty = 'beginner' | 'intermediate' | 'senior' | 'expert';
export type QuestionType = 'conceptual' | 'coding' | 'debugging' | 'system-design';

export interface Question {
  id: string;
  category: string;
  subcategory?: string;
  question: string;
  answer: string;
  difficulty: Difficulty;
  type: QuestionType;
  codeExample?: string;
  followUp?: string[];
  tags: string[];
  timeEstimate: number; // in minutes
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  questionCount: number;
}

export interface SessionResult {
  questionId: string;
  userAnswer: string;
  score: number;
  feedback: string;
  timeTaken: number;
}

export interface PracticeSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  category: string;
  questions: string[];
  results: SessionResult[];
  totalScore: number;
}



