'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { EditableText } from './EditableText';

interface SectionWrapperProps {
  id: string;
  title: string;
  onTitleChange: (title: string) => void;
  onAdd?: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
  children: React.ReactNode;
}

export function SectionWrapper({ 
  id, 
  title, 
  onTitleChange, 
  onAdd, 
  onDelete,
  showDelete = false,
  children 
}: SectionWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="cv-section">
      <div className="cv-section-header">
        <div className="flex items-center gap-2">
          {showDelete && (
            <button
              onClick={onDelete}
              className="cv-delete-btn text-red-500 hover:text-red-600"
              title="Delete section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <EditableText
            value={title}
            onChange={onTitleChange}
            className="cv-section-title"
          />
          {onAdd && (
            <button 
              onClick={onAdd} 
              className="cv-add-btn"
              title="Add item"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          {...attributes}
          {...listeners}
          className="cv-drag-handle"
          title="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>
      </div>
      <div className="cv-section-content">
        {children}
      </div>
    </div>
  );
}


