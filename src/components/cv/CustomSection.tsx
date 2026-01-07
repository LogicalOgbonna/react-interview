'use client';

import { Plus, Trash2 } from 'lucide-react';
import { CVCustomSection } from '@/data/cv-types';
import { EditableText } from './EditableText';

interface CustomSectionProps {
  section: CVCustomSection;
  onAddField: () => void;
  onUpdateField: (fieldId: string, value: string) => void;
  onRemoveField: (fieldId: string) => void;
}

export function CustomSectionContent({ 
  section, 
  onAddField,
  onUpdateField,
  onRemoveField 
}: CustomSectionProps) {
  return (
    <div className="cv-custom-content">
      {section.fields.map((field) => (
        <div key={field.id} className="cv-custom-line group">
          <EditableText
            value={field.content}
            onChange={(v) => onUpdateField(field.id, v)}
            className="cv-custom-text"
            multiline
          />
          <button
            onClick={() => onRemoveField(field.id)}
            className="cv-field-delete opacity-0 group-hover:opacity-100"
            title="Remove line"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
      <button 
        onClick={onAddField} 
        className="cv-add-field"
        title="Add line"
      >
        <Plus className="w-3 h-3" />
        <span>Add line</span>
      </button>
    </div>
  );
}

