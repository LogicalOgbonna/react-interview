'use client';

import { Sandpack } from '@codesandbox/sandpack-react';

interface CodePlaygroundProps {
  code: string;
  title?: string;
}

export function CodePlayground({ code, title }: CodePlaygroundProps) {
  // Parse the code to extract setup if needed
  const files = {
    '/App.tsx': code || defaultCode,
  };
  
  return (
    <div className="rounded-xl overflow-hidden border border-border">
      {title && (
        <div className="px-4 py-2 bg-muted/50 border-b border-border">
          <span className="text-sm font-medium">{title}</span>
        </div>
      )}
      <Sandpack
        template="react-ts"
        theme="dark"
        files={files}
        options={{
          showNavigator: false,
          showTabs: false,
          showLineNumbers: true,
          editorHeight: 400,
          classes: {
            'sp-wrapper': 'custom-sandpack',
          },
        }}
        customSetup={{
          dependencies: {
            'react': '^18.2.0',
            'react-dom': '^18.2.0',
          },
        }}
      />
    </div>
  );
}

const defaultCode = `import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'system-ui' 
    }}>
      <h1>React Playground</h1>
      <p>Count: {count}</p>
      <button 
        onClick={() => setCount(c => c + 1)}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >
        Increment
      </button>
    </div>
  );
}
`;



