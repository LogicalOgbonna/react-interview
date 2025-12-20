'use client';

import { motion } from 'framer-motion';
import { Category } from '@/data/types';

interface CategoryCardProps {
  category: Category;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

export function CategoryCard({ category, index, isSelected, onClick }: CategoryCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        relative text-left p-6 rounded-xl glass card-hover
        ${isSelected ? 'ring-2 ring-primary glow' : ''}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Icon */}
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4"
        style={{ backgroundColor: `${category.color}20` }}
      >
        {category.icon}
      </div>
      
      {/* Content */}
      <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {category.description}
      </p>
      
      {/* Question count */}
      <div className="flex items-center gap-2">
        <span 
          className="px-2 py-1 text-xs font-medium rounded-md"
          style={{ 
            backgroundColor: `${category.color}20`,
            color: category.color,
          }}
        >
          {category.questionCount} questions
        </span>
      </div>
      
      {/* Hover gradient */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${category.color}10, transparent)`,
        }}
      />
    </motion.button>
  );
}



