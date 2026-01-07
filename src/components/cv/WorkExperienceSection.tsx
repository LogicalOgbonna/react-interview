'use client';

import { Plus, Trash2 } from 'lucide-react';
import { CVExperience } from '@/data/cv-types';
import { EditableText } from './EditableText';

interface WorkExperienceSectionProps {
  items: CVExperience[];
  onUpdate: (id: string, field: keyof CVExperience, value: string | string[]) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onAddBullet: (experienceId: string) => void;
  onUpdateBullet: (experienceId: string, index: number, value: string) => void;
  onRemoveBullet: (experienceId: string, index: number) => void;
}

export function WorkExperienceSection({ 
  items, 
  onUpdate, 
  onAdd, 
  onRemove,
  onAddBullet,
  onUpdateBullet,
  onRemoveBullet 
}: WorkExperienceSectionProps) {
  return (
    <div className="cv-items">
      {items.map((exp) => (
        <div key={exp.id} className="cv-item cv-experience group">
          <div className="cv-item-row">
            <div className="cv-item-left">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onRemove(exp.id)}
                  className="cv-item-delete opacity-0 group-hover:opacity-100"
                  title="Remove"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <EditableText
                  value={exp.company}
                  onChange={(v) => onUpdate(exp.id, 'company', v)}
                  className="cv-text-primary"
                />
                <button onClick={onAdd} className="cv-add-inline" title="Add experience">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="cv-item-right">
              <EditableText
                value={exp.city}
                onChange={(v) => onUpdate(exp.id, 'city', v)}
                className="cv-text-accent"
              />
              <span className="cv-text-accent">, </span>
              <EditableText
                value={exp.state}
                onChange={(v) => onUpdate(exp.id, 'state', v)}
                className="cv-text-accent"
              />
            </div>
          </div>
          <div className="cv-item-row">
            <EditableText
              value={exp.jobTitle}
              onChange={(v) => onUpdate(exp.id, 'jobTitle', v)}
              className="cv-text-italic"
            />
            <div className="cv-item-right">
              <EditableText
                value={exp.startDate}
                onChange={(v) => onUpdate(exp.id, 'startDate', v)}
                className="cv-text-accent"
              />
              <span className="cv-text-accent"> - </span>
              <EditableText
                value={exp.endDate}
                onChange={(v) => onUpdate(exp.id, 'endDate', v)}
                className="cv-text-accent"
              />
            </div>
          </div>
          <ul className="cv-bullets">
            {exp.bullets.map((bullet, idx) => (
              <li key={idx} className="cv-bullet group/bullet">
                <span className="cv-bullet-marker">•</span>
                <EditableText
                  value={bullet}
                  onChange={(v) => onUpdateBullet(exp.id, idx, v)}
                  className="cv-bullet-text"
                  multiline={true}
                />
                <button
                  onClick={() => onRemoveBullet(exp.id, idx)}
                  className="cv-bullet-delete opacity-0 group-hover/bullet:opacity-100"
                  title="Remove bullet"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </li>
            ))}
            <li>
              <button 
                onClick={() => onAddBullet(exp.id)} 
                className="cv-add-bullet"
                title="Add bullet point"
              >
                <Plus className="w-3 h-3" />
                <span>Add bullet</span>
              </button>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
}

