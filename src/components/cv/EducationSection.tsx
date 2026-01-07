'use client';

import { Plus, Trash2 } from 'lucide-react';
import { CVEducation } from '@/data/cv-types';
import { EditableText } from './EditableText';

interface EducationSectionProps {
  items: CVEducation[];
  onUpdate: (id: string, field: keyof CVEducation, value: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export function EducationSection({ items, onUpdate, onAdd, onRemove }: EducationSectionProps) {
  return (
    <div className="cv-items">
      {items.map((edu) => (
        <div key={edu.id} className="cv-item group">
          <div className="cv-item-row">
            <div className="cv-item-left">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onRemove(edu.id)}
                  className="cv-item-delete opacity-0 group-hover:opacity-100"
                  title="Remove"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <EditableText
                  value={edu.university}
                  onChange={(v) => onUpdate(edu.id, 'university', v)}
                  className="cv-text-primary"
                />
                <button onClick={onAdd} className="cv-add-inline" title="Add education">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="cv-item-right">
              <EditableText
                value={edu.city}
                onChange={(v) => onUpdate(edu.id, 'city', v)}
                className="cv-text-accent"
              />
              <span className="cv-text-accent">, </span>
              <EditableText
                value={edu.state}
                onChange={(v) => onUpdate(edu.id, 'state', v)}
                className="cv-text-accent"
              />
            </div>
          </div>
          <div className="cv-item-row">
            <EditableText
              value={edu.degree}
              onChange={(v) => onUpdate(edu.id, 'degree', v)}
              className="cv-text-italic"
            />
            <div className="cv-item-right">
              <span className="cv-text-label">Graduation Date: </span>
              <EditableText
                value={edu.graduationDate}
                onChange={(v) => onUpdate(edu.id, 'graduationDate', v)}
                className="cv-text-accent"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


