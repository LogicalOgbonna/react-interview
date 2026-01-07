'use client';

import { Plus, Trash2 } from 'lucide-react';
import { CVProject } from '@/data/cv-types';
import { EditableText } from './EditableText';

interface ProjectSectionProps {
  items: CVProject[];
  onUpdate: (id: string, field: keyof CVProject, value: string | string[]) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onAddExperience: (projectId: string) => void;
  onUpdateExperience: (projectId: string, index: number, value: string) => void;
  onRemoveExperience: (projectId: string, index: number) => void;
}

export function ProjectSection({ 
  items, 
  onUpdate, 
  onAdd, 
  onRemove,
  onAddExperience,
  onUpdateExperience,
  onRemoveExperience 
}: ProjectSectionProps) {
  return (
    <div className="cv-items">
      {items.map((proj) => (
        <div key={proj.id} className="cv-item cv-experience group">
          <div className="cv-item-row">
            <div className="cv-item-left">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onRemove(proj.id)}
                  className="cv-item-delete opacity-0 group-hover:opacity-100"
                  title="Remove"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <EditableText
                  value={proj.organization}
                  onChange={(v) => onUpdate(proj.id, 'organization', v)}
                  className="cv-text-primary"
                />
                <button onClick={onAdd} className="cv-add-inline" title="Add project">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="cv-item-right">
              <EditableText
                value={proj.city}
                onChange={(v) => onUpdate(proj.id, 'city', v)}
                className="cv-text-accent"
              />
              <span className="cv-text-accent">, </span>
              <EditableText
                value={proj.state}
                onChange={(v) => onUpdate(proj.id, 'state', v)}
                className="cv-text-accent"
              />
            </div>
          </div>
          <div className="cv-item-row">
            <EditableText
              value={proj.title}
              onChange={(v) => onUpdate(proj.id, 'title', v)}
              className="cv-text-italic"
            />
            <div className="cv-item-right">
              <EditableText
                value={proj.startDate}
                onChange={(v) => onUpdate(proj.id, 'startDate', v)}
                className="cv-text-accent"
              />
              <span className="cv-text-accent"> - </span>
              <EditableText
                value={proj.endDate}
                onChange={(v) => onUpdate(proj.id, 'endDate', v)}
                className="cv-text-accent"
              />
            </div>
          </div>
          <ul className="cv-bullets">
            {proj.experiences.map((exp, idx) => (
              <li key={idx} className="cv-bullet group/bullet">
                <span className="cv-bullet-marker">•</span>
                <EditableText
                  value={exp}
                  onChange={(v) => onUpdateExperience(proj.id, idx, v)}
                  className="cv-bullet-text"
                  multiline={true}
                />
                <button
                  onClick={() => onRemoveExperience(proj.id, idx)}
                  className="cv-bullet-delete opacity-0 group-hover/bullet:opacity-100"
                  title="Remove experience"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </li>
            ))}
            <li>
              <button 
                onClick={() => onAddExperience(proj.id)} 
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

