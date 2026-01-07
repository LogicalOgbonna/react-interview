'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type,
  ChevronDown,
  Minus,
  Plus,
  Palette,
  RotateCcw,
  AlignLeft,
} from 'lucide-react';
import { useCVStore } from '@/store/cv-store';
import { fontOptions } from '@/data/cv-types';

export function FormattingToolbar() {
  const { cvData, updateStyles, resetStyles } = useCVStore();
  const styles = cvData.styles;
  
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState<'primary' | 'text' | null>(null);
  const fontDropdownRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(event.target as Node)) {
        setShowFontDropdown(false);
      }
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(8, Math.min(16, styles.fontSize + delta));
    updateStyles('fontSize', newSize);
  };

  const handleNameFontSizeChange = (delta: number) => {
    const newSize = Math.max(16, Math.min(36, styles.nameFontSize + delta));
    updateStyles('nameFontSize', newSize);
  };

  const handleLineHeightChange = (delta: number) => {
    const newHeight = Math.max(1, Math.min(2, +(styles.lineHeight + delta).toFixed(1)));
    updateStyles('lineHeight', newHeight);
  };

  const colorPresets = [
    '#2a5c8a', // Blue
    '#1a4731', // Dark Green
    '#7c2d12', // Brown
    '#4c1d95', // Purple
    '#1e3a5f', // Navy
    '#333333', // Dark Gray
    '#000000', // Black
    '#0f766e', // Teal
  ];

  return (
    <div className="cv-format-toolbar">
      {/* Font Family Selector */}
      <div className="cv-format-group" ref={fontDropdownRef}>
        <button
          className="cv-format-dropdown"
          onClick={() => setShowFontDropdown(!showFontDropdown)}
        >
          <Type className="w-4 h-4" />
          <span className="cv-format-dropdown-label">{styles.fontFamily}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${showFontDropdown ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {showFontDropdown && (
            <motion.div
              className="cv-format-dropdown-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {fontOptions.map((font) => (
                <button
                  key={font.value}
                  className={`cv-format-dropdown-item ${styles.fontFamily === font.value ? 'active' : ''}`}
                  style={{ fontFamily: font.value }}
                  onClick={() => {
                    updateStyles('fontFamily', font.value);
                    setShowFontDropdown(false);
                  }}
                >
                  {font.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="cv-format-divider" />

      {/* Body Font Size */}
      <div className="cv-format-group">
        <span className="cv-format-label">Body</span>
        <div className="cv-format-stepper">
          <button
            className="cv-format-stepper-btn"
            onClick={() => handleFontSizeChange(-1)}
            disabled={styles.fontSize <= 8}
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="cv-format-stepper-value">{styles.fontSize}pt</span>
          <button
            className="cv-format-stepper-btn"
            onClick={() => handleFontSizeChange(1)}
            disabled={styles.fontSize >= 16}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="cv-format-divider" />

      {/* Name Font Size */}
      <div className="cv-format-group">
        <span className="cv-format-label">Name</span>
        <div className="cv-format-stepper">
          <button
            className="cv-format-stepper-btn"
            onClick={() => handleNameFontSizeChange(-2)}
            disabled={styles.nameFontSize <= 16}
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="cv-format-stepper-value">{styles.nameFontSize}pt</span>
          <button
            className="cv-format-stepper-btn"
            onClick={() => handleNameFontSizeChange(2)}
            disabled={styles.nameFontSize >= 36}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="cv-format-divider" />

      {/* Line Height */}
      <div className="cv-format-group">
        <AlignLeft className="w-4 h-4" />
        <span className="cv-format-label">Spacing</span>
        <div className="cv-format-stepper">
          <button
            className="cv-format-stepper-btn"
            onClick={() => handleLineHeightChange(-0.1)}
            disabled={styles.lineHeight <= 1}
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="cv-format-stepper-value">{styles.lineHeight.toFixed(1)}</span>
          <button
            className="cv-format-stepper-btn"
            onClick={() => handleLineHeightChange(0.1)}
            disabled={styles.lineHeight >= 2}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="cv-format-divider" />

      {/* Primary Color */}
      <div className="cv-format-group" ref={colorPickerRef}>
        <button
          className="cv-format-color-btn"
          onClick={() => setShowColorPicker(showColorPicker === 'primary' ? null : 'primary')}
        >
          <Palette className="w-4 h-4" />
          <span className="cv-format-label">Accent</span>
          <div
            className="cv-format-color-swatch"
            style={{ backgroundColor: styles.primaryColor }}
          />
        </button>
        
        <AnimatePresence>
          {showColorPicker === 'primary' && (
            <motion.div
              className="cv-format-color-picker"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <div className="cv-format-color-presets">
                {colorPresets.map((color) => (
                  <button
                    key={color}
                    className={`cv-format-color-preset ${styles.primaryColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      updateStyles('primaryColor', color);
                      setShowColorPicker(null);
                    }}
                  />
                ))}
              </div>
              <div className="cv-format-color-custom">
                <input
                  type="color"
                  value={styles.primaryColor}
                  onChange={(e) => updateStyles('primaryColor', e.target.value)}
                  className="cv-format-color-input"
                />
                <span className="cv-format-color-hex">{styles.primaryColor}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Text Color */}
      <div className="cv-format-group">
        <button
          className="cv-format-color-btn"
          onClick={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')}
        >
          <Type className="w-4 h-4" />
          <span className="cv-format-label">Text</span>
          <div
            className="cv-format-color-swatch"
            style={{ backgroundColor: styles.textColor }}
          />
        </button>
        
        <AnimatePresence>
          {showColorPicker === 'text' && (
            <motion.div
              className="cv-format-color-picker"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <div className="cv-format-color-presets">
                {['#000000', '#1a1a1a', '#333333', '#4a4a4a', '#666666', '#1e3a5f', '#2d3748', '#1a202c'].map((color) => (
                  <button
                    key={color}
                    className={`cv-format-color-preset ${styles.textColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      updateStyles('textColor', color);
                      setShowColorPicker(null);
                    }}
                  />
                ))}
              </div>
              <div className="cv-format-color-custom">
                <input
                  type="color"
                  value={styles.textColor}
                  onChange={(e) => updateStyles('textColor', e.target.value)}
                  className="cv-format-color-input"
                />
                <span className="cv-format-color-hex">{styles.textColor}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="cv-format-divider" />

      {/* Reset Styles */}
      <button
        className="cv-format-reset-btn"
        onClick={resetStyles}
        title="Reset to default styles"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
}

