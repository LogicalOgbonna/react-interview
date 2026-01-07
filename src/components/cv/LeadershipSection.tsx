'use client';

import { Plus, Trash2 } from 'lucide-react';
import { CVLeadership } from '@/data/cv-types';
import { EditableText } from './EditableText';

interface LeadershipSectionProps {
  items: CVLeadership[];
  onUpdate: (id: string, field: keyof CVLeadership, value: string | string[]) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onAddExperience: (leadershipId: string) => void;
  onUpdateExperience: (leadershipId: string, index: number, value: string) => void;
  onRemoveExperience: (leadershipId: string, index: number) => void;
}

export function LeadershipSection({ 
  items, 
  onUpdate, 
  onAdd, 
  onRemove,
  onAddExperience,
  onUpdateExperience,
  onRemoveExperience 
}: LeadershipSectionProps) {
  return (
    <div className="cv-items">
      {items.map((lead) => (
        <div key={lead.id} className="cv-item cv-experience group">
          <div className="cv-item-row">
            <div className="cv-item-left">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onRemove(lead.id)}
                  className="cv-item-delete opacity-0 group-hover:opacity-100"
                  title="Remove"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <EditableText
                  value={lead.organization}
                  onChange={(v) => onUpdate(lead.id, 'organization', v)}
                  className="cv-text-primary"
                />
                <button onClick={onAdd} className="cv-add-inline" title="Add leadership">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="cv-item-right">
              <EditableText
                value={lead.city}
                onChange={(v) => onUpdate(lead.id, 'city', v)}
                className="cv-text-accent"
              />
              <span className="cv-text-accent">, </span>
              <EditableText
                value={lead.state}
                onChange={(v) => onUpdate(lead.id, 'state', v)}
                className="cv-text-accent"
              />
            </div>
          </div>
          <div className="cv-item-row">
            <EditableText
              value={lead.title}
              onChange={(v) => onUpdate(lead.id, 'title', v)}
              className="cv-text-italic"
            />
            <div className="cv-item-right">
              <EditableText
                value={lead.startDate}
                onChange={(v) => onUpdate(lead.id, 'startDate', v)}
                className="cv-text-accent"
              />
              <span className="cv-text-accent"> - </span>
              <EditableText
                value={lead.endDate}
                onChange={(v) => onUpdate(lead.id, 'endDate', v)}
                className="cv-text-accent"
              />
            </div>
          </div>
          <ul className="cv-bullets">
            {lead.experiences.map((exp, idx) => (
              <li key={idx} className="cv-bullet group/bullet">
                <span className="cv-bullet-marker">•</span>
                <EditableText
                  value={exp}
                  onChange={(v) => onUpdateExperience(lead.id, idx, v)}
                  className="cv-bullet-text"
                  multiline={true}
                />
                <button
                  onClick={() => onRemoveExperience(lead.id, idx)}
                  className="cv-bullet-delete opacity-0 group-hover/bullet:opacity-100"
                  title="Remove experience"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </li>
            ))}
            <li>
              <button 
                onClick={() => onAddExperience(lead.id)} 
                className="cv-add-bullet"
                title="Add experience"
              >
                <Plus className="w-3 h-3" />
                <span>Add experience</span>
              </button>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
}

