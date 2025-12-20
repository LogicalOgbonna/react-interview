import { NextRequest, NextResponse } from 'next/server';

interface GradeRequest {
  question: string;
  userAnswer: string;
  correctAnswer: string;
}

interface GradeResponse {
  score: number; // 0-1
  feedback: string;
  strengths: string[];
  improvements: string[];
}

// Keyword-based grading system (works without external API)
export async function POST(request: NextRequest) {
  try {
    const body: GradeRequest = await request.json();
    const { question, userAnswer, correctAnswer } = body;
    
    if (!userAnswer.trim()) {
      return NextResponse.json({
        score: 0,
        feedback: 'No answer provided.',
        strengths: [],
        improvements: ['Provide an answer to receive feedback.'],
      });
    }
    
    // Extract key concepts from the correct answer
    const keyConceptsFromAnswer = extractKeyConcepts(correctAnswer);
    const userConcepts = extractKeyConcepts(userAnswer);
    
    // Calculate how many key concepts the user mentioned
    const matchedConcepts = keyConceptsFromAnswer.filter(concept =>
      userConcepts.some(userConcept => 
        isSimilarConcept(userConcept, concept)
      )
    );
    
    // Calculate base score
    const conceptScore = matchedConcepts.length / Math.max(keyConceptsFromAnswer.length, 1);
    
    // Bonus for answer length/detail (up to 20% extra)
    const lengthRatio = Math.min(userAnswer.length / (correctAnswer.length * 0.5), 1);
    const lengthBonus = lengthRatio * 0.2;
    
    // Bonus for code examples if the correct answer has them
    const hasCodeInAnswer = correctAnswer.includes('```') || correctAnswer.includes('const ') || correctAnswer.includes('function ');
    const hasCodeInUser = userAnswer.includes('```') || userAnswer.includes('const ') || userAnswer.includes('function ');
    const codeBonus = (hasCodeInAnswer && hasCodeInUser) ? 0.1 : 0;
    
    // Final score
    const score = Math.min(conceptScore * 0.7 + lengthBonus + codeBonus, 1);
    
    // Generate feedback
    const feedback = generateFeedback(score, matchedConcepts, keyConceptsFromAnswer);
    const strengths = generateStrengths(matchedConcepts, hasCodeInUser);
    const improvements = generateImprovements(keyConceptsFromAnswer, matchedConcepts, hasCodeInAnswer, hasCodeInUser);
    
    return NextResponse.json({
      score: Math.round(score * 100) / 100,
      feedback,
      strengths,
      improvements,
    });
  } catch (error) {
    console.error('Grading error:', error);
    return NextResponse.json(
      { error: 'Failed to grade answer' },
      { status: 500 }
    );
  }
}

function extractKeyConcepts(text: string): string[] {
  // React-specific terms to look for
  const reactTerms = [
    'virtual dom', 'reconciliation', 'fiber', 'hooks', 'usestate', 'useeffect',
    'usememo', 'usecallback', 'useref', 'usecontext', 'usereducer',
    'component', 'props', 'state', 'render', 'lifecycle', 'mounting',
    'updating', 'unmounting', 'jsx', 'fragment', 'portal', 'suspense',
    'lazy', 'memo', 'pure component', 'hoc', 'higher-order', 'error boundary',
    'controlled', 'uncontrolled', 'synthetic event', 'key prop',
    'server component', 'client component', 'hydration', 'ssr', 'ssg', 'isr',
    'middleware', 'server action', 'streaming', 'concurrent',
    'memoization', 'optimization', 'performance', 'bundle', 'code splitting',
    'context', 'redux', 'zustand', 'state management',
    'xss', 'csrf', 'security', 'authentication', 'authorization',
  ];
  
  const normalizedText = text.toLowerCase();
  
  const foundTerms = reactTerms.filter(term => 
    normalizedText.includes(term.toLowerCase())
  );
  
  // Also extract capitalized terms that might be concepts
  const capitalizedTerms = text.match(/\b[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*/g) || [];
  
  return [...new Set([...foundTerms, ...capitalizedTerms.map(t => t.toLowerCase())])];
}

function isSimilarConcept(concept1: string, concept2: string): boolean {
  const c1 = concept1.toLowerCase().trim();
  const c2 = concept2.toLowerCase().trim();
  
  // Exact match
  if (c1 === c2) return true;
  
  // One contains the other
  if (c1.includes(c2) || c2.includes(c1)) return true;
  
  // Handle common variations
  const variations: Record<string, string[]> = {
    'usestate': ['state', 'setstate', 'usestate hook'],
    'useeffect': ['effect', 'side effect', 'useeffect hook'],
    'usememo': ['memo', 'memoization', 'usememo hook'],
    'usecallback': ['callback', 'usecallback hook'],
    'virtual dom': ['vdom', 'virtual dom tree'],
    'reconciliation': ['reconciler', 'diffing', 'diff algorithm'],
    'ssr': ['server side rendering', 'server-side rendering'],
    'ssg': ['static site generation', 'static generation'],
    'hoc': ['higher order component', 'higher-order component'],
  };
  
  for (const [key, values] of Object.entries(variations)) {
    if ((c1.includes(key) || values.some(v => c1.includes(v))) &&
        (c2.includes(key) || values.some(v => c2.includes(v)))) {
      return true;
    }
  }
  
  return false;
}

function generateFeedback(score: number, matched: string[], total: string[]): string {
  if (score >= 0.8) {
    return 'Excellent answer! You demonstrated strong understanding of the key concepts.';
  } else if (score >= 0.6) {
    return 'Good answer with solid understanding. Consider adding more detail on some concepts.';
  } else if (score >= 0.4) {
    return 'Partial understanding shown. Review the complete answer to fill in knowledge gaps.';
  } else if (score >= 0.2) {
    return 'Basic attempt. Focus on understanding the core concepts mentioned in the answer.';
  } else {
    return 'Keep practicing! Review this topic thoroughly before moving on.';
  }
}

function generateStrengths(matched: string[], hasCode: boolean): string[] {
  const strengths: string[] = [];
  
  if (matched.length > 0) {
    strengths.push(`Correctly mentioned: ${matched.slice(0, 3).join(', ')}`);
  }
  
  if (hasCode) {
    strengths.push('Included code examples to illustrate points');
  }
  
  if (matched.length > 3) {
    strengths.push('Covered multiple relevant concepts');
  }
  
  return strengths;
}

function generateImprovements(total: string[], matched: string[], answerHasCode: boolean, userHasCode: boolean): string[] {
  const improvements: string[] = [];
  
  const missed = total.filter(t => !matched.some(m => isSimilarConcept(m, t)));
  
  if (missed.length > 0) {
    improvements.push(`Consider mentioning: ${missed.slice(0, 3).join(', ')}`);
  }
  
  if (answerHasCode && !userHasCode) {
    improvements.push('Include code examples to demonstrate understanding');
  }
  
  if (matched.length < total.length * 0.5) {
    improvements.push('Expand your answer to cover more key concepts');
  }
  
  return improvements;
}



