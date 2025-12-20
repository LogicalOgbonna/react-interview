'use client';

import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

// Token types for syntax highlighting
type TokenType = 'keyword' | 'string' | 'comment' | 'number' | 'function' | 'jsx' | 'plain';

interface Token {
  type: TokenType;
  value: string;
}

export function CodeBlock({ code, language = 'typescript' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Tokenize and highlight code properly
  const highlightedCode = useMemo(() => {
    const keywords = new Set([
      'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
      'class', 'import', 'export', 'from', 'async', 'await', 'try', 'catch',
      'throw', 'new', 'this', 'extends', 'implements', 'interface', 'type',
      'enum', 'public', 'private', 'protected', 'static', 'readonly', 'abstract',
      'default', 'switch', 'case', 'break', 'continue', 'typeof', 'instanceof',
      'in', 'of', 'null', 'undefined', 'true', 'false', 'void', 'never', 'any',
      'string', 'number', 'boolean', 'object', 'symbol', 'bigint'
    ]);
    
    const lines = code.split('\n');
    
    return lines.map((line, lineIndex) => {
      const tokens: Token[] = [];
      let i = 0;
      
      while (i < line.length) {
        // Check for single-line comment
        if (line.slice(i, i + 2) === '//') {
          tokens.push({ type: 'comment', value: line.slice(i) });
          break;
        }
        
        // Check for multi-line comment start
        if (line.slice(i, i + 2) === '/*') {
          const endIndex = line.indexOf('*/', i + 2);
          if (endIndex !== -1) {
            tokens.push({ type: 'comment', value: line.slice(i, endIndex + 2) });
            i = endIndex + 2;
            continue;
          }
        }
        
        // Check for strings
        const quote = line[i];
        if (quote === '"' || quote === "'" || quote === '`') {
          let j = i + 1;
          while (j < line.length) {
            if (line[j] === quote && line[j - 1] !== '\\') {
              break;
            }
            j++;
          }
          tokens.push({ type: 'string', value: line.slice(i, j + 1) });
          i = j + 1;
          continue;
        }
        
        // Check for numbers
        if (/\d/.test(line[i])) {
          let j = i;
          while (j < line.length && /[\d.]/.test(line[j])) {
            j++;
          }
          tokens.push({ type: 'number', value: line.slice(i, j) });
          i = j;
          continue;
        }
        
        // Check for identifiers (words)
        if (/[a-zA-Z_$]/.test(line[i])) {
          let j = i;
          while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) {
            j++;
          }
          const word = line.slice(i, j);
          
          // Check if it's followed by ( making it a function call
          const nextNonSpace = line.slice(j).match(/^\s*\(/);
          
          // Check if it's a JSX component (starts with capital letter)
          if (/^[A-Z]/.test(word)) {
            tokens.push({ type: 'jsx', value: word });
          } else if (keywords.has(word)) {
            tokens.push({ type: 'keyword', value: word });
          } else if (nextNonSpace) {
            tokens.push({ type: 'function', value: word });
          } else {
            tokens.push({ type: 'plain', value: word });
          }
          i = j;
          continue;
        }
        
        // Check for JSX tags
        if (line[i] === '<') {
          // Could be JSX tag or comparison operator
          const match = line.slice(i).match(/^<\/?([A-Z][a-zA-Z0-9]*)/);
          if (match) {
            tokens.push({ type: 'jsx', value: match[0] });
            i += match[0].length;
            continue;
          }
        }
        
        // Plain character
        tokens.push({ type: 'plain', value: line[i] });
        i++;
      }
      
      return tokens;
    });
  }, [code]);
  
  const getTokenClass = (type: TokenType): string => {
    switch (type) {
      case 'keyword': return 'text-purple-400';
      case 'string': return 'text-emerald-400';
      case 'comment': return 'text-gray-500 italic';
      case 'number': return 'text-amber-400';
      case 'function': return 'text-blue-400';
      case 'jsx': return 'text-cyan-400';
      default: return '';
    }
  };
  
  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
        title="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-emerald-400" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      
      <pre className="code-block overflow-x-auto scrollbar-thin">
        <code className="text-sm leading-relaxed">
          {highlightedCode.map((lineTokens, lineIndex) => (
            <div key={lineIndex}>
              {lineTokens.map((token, tokenIndex) => {
                const className = getTokenClass(token.type);
                // React automatically escapes text content - no need for manual escaping
                return className ? (
                  <span key={tokenIndex} className={className}>
                    {token.value}
                  </span>
                ) : (
                  <span key={tokenIndex}>{token.value}</span>
                );
              })}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
