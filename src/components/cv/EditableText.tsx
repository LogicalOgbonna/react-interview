'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}

interface CapturedDimensions {
  width: number;
  height: number;
}

export function EditableText({ 
  value, 
  onChange, 
  className = '', 
  placeholder = 'Click to edit',
  multiline = false 
}: EditableTextProps) {
  // Ensure value is always a string
  const safeValue = value ?? '';
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(safeValue);
  const [dimensions, setDimensions] = useState<CapturedDimensions | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setEditValue(safeValue);
  }, [safeValue]);

  // Capture the exact dimensions of the span before switching to edit mode
  const handleStartEdit = () => {
    if (spanRef.current) {
      const rect = spanRef.current.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: rect.height,
      });
    }
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      } else {
        // For textarea, move cursor to end
        inputRef.current.setSelectionRange(
          inputRef.current.value.length,
          inputRef.current.value.length
        );
      }
    }
  }, [isEditing]);

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback((element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  }, []);

  useEffect(() => {
    if (isEditing && multiline && inputRef.current instanceof HTMLTextAreaElement) {
      adjustTextareaHeight(inputRef.current);
    }
  }, [isEditing, multiline, editValue, adjustTextareaHeight]);

  const handleBlur = () => {
    setIsEditing(false);
    setDimensions(null);
    if (editValue.trim() !== value) {
      onChange(editValue.trim() || placeholder);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
      setDimensions(null);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
    adjustTextareaHeight(e.target);
  };

  if (isEditing) {
    // Use the captured dimensions to prevent layout shift
    const inputStyle = dimensions ? {
      width: `${dimensions.width}px`,
      minWidth: `${dimensions.width}px`,
      height: `${dimensions.height}px`,
    } : undefined;

    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={editValue}
          onChange={handleTextareaChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`cv-editable-input cv-editable-textarea ${className}`}
          style={inputStyle}
          rows={1}
        />
      );
    }
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`cv-editable-input ${className}`}
        style={inputStyle}
      />
    );
  }

  // For multiline display, preserve line breaks
  if (multiline && safeValue.includes('\n')) {
    return (
      <span
        ref={spanRef}
        onClick={handleStartEdit}
        className={`cv-editable-text cv-editable-multiline ${className}`}
        title="Click to edit"
      >
        {safeValue.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < safeValue.split('\n').length - 1 && <br />}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span
      ref={spanRef}
      onClick={handleStartEdit}
      className={`cv-editable-text ${className}`}
      title="Click to edit"
    >
      {safeValue || placeholder}
    </span>
  );
}
