'use client';

import { Plus, Trash2 } from 'lucide-react';
import { CVSkillsSection, CVSkillCategory } from '@/data/cv-types';
import { EditableText } from './EditableText';

interface SkillsSectionProps {
  section: CVSkillsSection;
  onAddCategory: () => void;
  onUpdateCategory: (categoryId: string, field: keyof CVSkillCategory, value: string) => void;
  onRemoveCategory: (categoryId: string) => void;
}

export function SkillsSection({ 
  section, 
  onAddCategory,
  onUpdateCategory,
  onRemoveCategory 
}: SkillsSectionProps) {
  return (
    <div className="cv-items">
      {section.categories.map((category) => (
        <div key={category.id} className="cv-custom-field group">
          <EditableText
            value={category.label}
            onChange={(v) => onUpdateCategory(category.id, 'label', v)}
            className="cv-text-label-bold"
          />
          <span className="cv-text-label">: </span>
          <EditableText
            value={category.value}
            onChange={(v) => onUpdateCategory(category.id, 'value', v)}
            className="cv-text-value"
          />
          <button
            onClick={() => onRemoveCategory(category.id)}
            className="cv-field-delete opacity-0 group-hover:opacity-100"
            title="Remove category"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
      <button 
        onClick={onAddCategory} 
        className="cv-add-field"
        title="Add category"
      >
        <Plus className="w-3 h-3" />
        <span>Add category</span>
      </button>
    </div>
  );
}
