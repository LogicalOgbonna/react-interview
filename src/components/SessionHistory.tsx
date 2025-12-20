'use client';

import { PracticeSession } from '@/store/practice-store';
import { Clock, Target, Trophy } from 'lucide-react';

interface SessionHistoryProps {
  sessions: PracticeSession[];
}

export function SessionHistory({ sessions }: SessionHistoryProps) {
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(d);
  };
  
  const getDuration = (session: PracticeSession) => {
    if (!session.endTime) return '—';
    const start = new Date(session.startTime).getTime();
    const end = new Date(session.endTime).getTime();
    const mins = Math.round((end - start) / 60000);
    return `${mins} min`;
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };
  
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="divide-y divide-border">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">{session.categoryName}</h4>
                <p className="text-sm text-muted-foreground">
                  {formatDate(session.startTime)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {getDuration(session)}
                </div>
              </div>
              
              <div className="text-right min-w-[60px]">
                <div className={`text-lg font-semibold ${getScoreColor(session.totalScore)}`}>
                  {session.totalScore}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {session.results.length}/{session.questions.length} answered
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



