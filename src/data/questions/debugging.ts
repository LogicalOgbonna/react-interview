import { Question } from '../types';

export const debuggingQuestions: Question[] = [
  {
    id: 'dbg-1',
    category: 'Debugging',
    question: 'How do you debug React applications effectively?',
    answer: `Essential debugging tools and techniques:

1. React DevTools
   - Component tree inspection
   - Props and state viewing
   - Profiler for performance
   - Component highlighting

2. Browser DevTools
   - Console for errors/logs
   - Network tab for API calls
   - Sources for breakpoints
   - Performance for bottlenecks

3. VS Code/Cursor debugging
   - Breakpoints in source code
   - Watch expressions
   - Call stack inspection

4. Debugging techniques
   - console.log (strategic placement)
   - React Error Boundaries
   - Strict Mode for detecting issues`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// Strategic console.log
function MyComponent({ data }) {
  console.log('[MyComponent] render', { data });
  
  useEffect(() => {
    console.log('[MyComponent] effect', { data });
    return () => console.log('[MyComponent] cleanup');
  }, [data]);
}

// Conditional breakpoints
// In browser: Right-click line → "Add conditional breakpoint"
// Condition: data.id === 5

// Custom debugging hook
function useDebugValue(value, label) {
  React.useDebugValue(\`\${label}: \${JSON.stringify(value)}\`);
}

function useAuth() {
  const [user, setUser] = useState(null);
  
  // Shows in React DevTools
  useDebugValue(user, 'Current User');
  
  return { user, setUser };
}

// Error boundary for catching render errors
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Component Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    
    // Send to error tracking
    Sentry.captureException(error, { extra: errorInfo });
  }
}`,
    tags: ['debugging', 'devtools', 'console', 'error-handling'],
    timeEstimate: 5
  },
  {
    id: 'dbg-2',
    category: 'Debugging',
    question: 'How do you identify and fix memory leaks in React?',
    answer: `Common memory leak causes in React:

1. Missing cleanup in useEffect
   - Event listeners not removed
   - Subscriptions not unsubscribed
   - Intervals/timeouts not cleared

2. Setting state on unmounted components
   - Async operations completing after unmount
   - Use AbortController for fetch

3. Closures holding references
   - Large objects in event handlers
   - Accumulated callbacks

Detection:
- Chrome DevTools Memory tab
- Performance monitor
- React DevTools Profiler`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// ❌ Memory leak - no cleanup
useEffect(() => {
  const handler = () => console.log('resize');
  window.addEventListener('resize', handler);
  // Missing cleanup!
}, []);

// ✅ Fixed - cleanup function
useEffect(() => {
  const handler = () => console.log('resize');
  window.addEventListener('resize', handler);
  
  return () => window.removeEventListener('resize', handler);
}, []);

// ❌ Memory leak - setting state after unmount
useEffect(() => {
  fetchData().then(data => {
    setData(data); // Component might be unmounted!
  });
}, []);

// ✅ Fixed - abort controller
useEffect(() => {
  const controller = new AbortController();
  
  fetchData({ signal: controller.signal })
    .then(data => setData(data))
    .catch(err => {
      if (err.name !== 'AbortError') {
        setError(err);
      }
    });
  
  return () => controller.abort();
}, []);

// ✅ Alternative - mounted flag (less preferred)
useEffect(() => {
  let isMounted = true;
  
  fetchData().then(data => {
    if (isMounted) setData(data);
  });
  
  return () => { isMounted = false; };
}, []);

// Detecting in Chrome DevTools:
// 1. Go to Memory tab
// 2. Take heap snapshot
// 3. Perform actions that might leak
// 4. Take another snapshot
// 5. Compare snapshots`,
    tags: ['debugging', 'memory-leaks', 'useEffect', 'performance'],
    timeEstimate: 6
  },
  {
    id: 'dbg-3',
    category: 'Debugging',
    question: 'What is the "Maximum update depth exceeded" error and how do you fix it?',
    answer: `This error occurs when a component triggers infinite re-renders, usually due to:

1. setState in render phase
   - Moving state updates to useEffect
   
2. useEffect with missing/wrong dependencies
   - Object/function recreated each render
   - Adding correct dependencies

3. useState with objects that trigger updates
   - Functional updates to prevent loops

4. Event handlers calling setState unconditionally
   - Adding conditions or using refs

The error protects against stack overflow.`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// ❌ Infinite loop - setState during render
function Bad() {
  const [count, setCount] = useState(0);
  setCount(count + 1);  // Triggers re-render → loop!
  return <div>{count}</div>;
}

// ✅ Fixed - useEffect
function Good() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(c => c + 1);
  }, []); // Only once
  
  return <div>{count}</div>;
}

// ❌ Infinite loop - object in deps
function Bad({ filters }) {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchData(filters).then(setData);
  }, [{ page: 1 }]); // New object every render!
}

// ✅ Fixed - stable reference or primitives
function Good({ page }) {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchData({ page }).then(setData);
  }, [page]); // Primitive value
}

// ❌ Infinite loop - function in deps
function Bad() {
  const [items, setItems] = useState([]);
  
  const fetchItems = () => api.getItems();
  
  useEffect(() => {
    fetchItems().then(setItems);
  }, [fetchItems]); // New function every render!
}

// ✅ Fixed - useCallback
function Good() {
  const [items, setItems] = useState([]);
  
  const fetchItems = useCallback(() => api.getItems(), []);
  
  useEffect(() => {
    fetchItems().then(setItems);
  }, [fetchItems]);
}`,
    tags: ['debugging', 'infinite-loop', 'useEffect', 'useState'],
    timeEstimate: 5
  },
  {
    id: 'dbg-4',
    category: 'Debugging',
    question: 'How do you debug hydration errors in Next.js?',
    answer: `Hydration errors occur when server-rendered HTML doesn't match client render.

Common causes:
1. Using browser-only APIs during render
2. Date/time differences (server vs client)
3. Random values (Math.random, uuid)
4. Browser extensions modifying DOM
5. Invalid HTML nesting

Debugging approach:
1. Check console for specific mismatch
2. Look for non-deterministic values
3. Use useEffect for client-only code
4. Wrap client-only components in Suspense`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// ❌ Hydration error - different values
function Bad() {
  return <p>Time: {new Date().toISOString()}</p>;
  // Server time !== Client time!
}

// ✅ Fixed - client-only with useEffect
function Good() {
  const [time, setTime] = useState<string>();
  
  useEffect(() => {
    setTime(new Date().toISOString());
  }, []);
  
  if (!time) return <p>Loading...</p>;
  return <p>Time: {time}</p>;
}

// ❌ Hydration error - browser API during render
function Bad() {
  const width = window.innerWidth; // Error on server!
  return <p>Width: {width}</p>;
}

// ✅ Fixed - check for window
function Good() {
  const [width, setWidth] = useState<number>();
  
  useEffect(() => {
    setWidth(window.innerWidth);
    
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (width === undefined) return null;
  return <p>Width: {width}</p>;
}

// ✅ Using suppressHydrationWarning for intentional mismatches
<time dateTime={date.toISOString()} suppressHydrationWarning>
  {date.toLocaleDateString()}
</time>

// ✅ Dynamic import with no SSR
import dynamic from 'next/dynamic';

const ClientOnlyChart = dynamic(() => import('./Chart'), {
  ssr: false,
  loading: () => <p>Loading chart...</p>,
});

// ❌ Invalid HTML causing hydration error
<p><div>Nested block in inline</div></p>

// ✅ Valid HTML
<div><div>Properly nested</div></div>`,
    tags: ['debugging', 'hydration', 'next.js', 'ssr'],
    timeEstimate: 6
  },
  {
    id: 'dbg-5',
    category: 'Debugging',
    question: 'How do you track down and fix stale closure bugs in React hooks?',
    answer: `Stale closures occur when a function captures an old value of a variable.

Common scenarios:
1. Event handlers in useEffect
2. Callbacks with old state
3. SetInterval/setTimeout with state
4. Missing dependencies in useEffect/useCallback

Solutions:
1. Add correct dependencies
2. Use functional state updates
3. Use refs for mutable values
4. Use latest ref pattern`,
    difficulty: 'expert',
    type: 'debugging',
    codeExample: `// ❌ Stale closure - count is always 0
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      console.log(count); // Always 0!
      setCount(count + 1); // Always sets to 1
    }, 1000);
    
    return () => clearInterval(interval);
  }, []); // count not in deps
}

// ✅ Fix 1: Functional update
useEffect(() => {
  const interval = setInterval(() => {
    setCount(c => c + 1); // Uses latest value
  }, 1000);
  
  return () => clearInterval(interval);
}, []);

// ✅ Fix 2: Include dependency (interval restarts)
useEffect(() => {
  const interval = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  
  return () => clearInterval(interval);
}, [count]); // But this creates new interval each time!

// ✅ Fix 3: Ref for latest value (best for complex cases)
function useInterval(callback, delay) {
  const savedCallback = useRef(callback);
  
  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  // Set up the interval
  useEffect(() => {
    if (delay === null) return;
    
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// Usage
function Counter() {
  const [count, setCount] = useState(0);
  
  useInterval(() => {
    setCount(count + 1); // Always has latest count!
  }, 1000);
}

// Latest ref pattern for callbacks
function useLatestCallback(callback) {
  const ref = useRef(callback);
  ref.current = callback;
  
  return useCallback((...args) => ref.current(...args), []);
}`,
    tags: ['debugging', 'stale-closure', 'hooks', 'useEffect'],
    timeEstimate: 6
  },
  {
    id: 'dbg-6',
    category: 'Debugging',
    question: 'How do you debug performance issues in React applications?',
    answer: `Performance debugging workflow:

1. Identify the problem
   - Is it slow initial load or runtime?
   - Which interactions are slow?

2. Profile the application
   - React DevTools Profiler
   - Chrome Performance tab
   - Lighthouse audit

3. Look for common issues
   - Unnecessary re-renders
   - Large bundle size
   - Expensive computations
   - Layout thrashing

4. Measure, don't guess
   - Use Performance API
   - Add custom metrics
   - A/B test optimizations`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// Using React Profiler programmatically
function onRenderCallback(
  id, phase, actualDuration, baseDuration,
  startTime, commitTime
) {
  if (actualDuration > 16) { // Longer than 1 frame
    console.warn(\`Slow render: \${id} took \${actualDuration}ms\`);
  }
}

<Profiler id="ExpensiveComponent" onRender={onRenderCallback}>
  <ExpensiveComponent />
</Profiler>

// Measuring specific operations
function measureOperation(name, fn) {
  performance.mark(\`\${name}-start\`);
  const result = fn();
  performance.mark(\`\${name}-end\`);
  performance.measure(name, \`\${name}-start\`, \`\${name}-end\`);
  
  const entries = performance.getEntriesByName(name);
  console.log(\`\${name}: \${entries[0].duration}ms\`);
  
  return result;
}

// Custom performance hook
function usePerformanceObserver() {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 100) {
          console.warn('Long task detected:', entry);
        }
      }
    });
    
    observer.observe({ entryTypes: ['longtask', 'measure'] });
    return () => observer.disconnect();
  }, []);
}

// Finding unnecessary re-renders
// Install: npm i @welldone-software/why-did-you-render
import React from 'react';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
    logOnDifferentValues: true,
  });
}

// Mark components to track
MyComponent.whyDidYouRender = true;`,
    tags: ['debugging', 'performance', 'profiler', 'optimization'],
    timeEstimate: 6
  },
  {
    id: 'dbg-7',
    category: 'Debugging',
    question: 'How do you debug async issues in React (race conditions, stale data)?',
    answer: `Async debugging challenges:
- Race conditions when requests complete out of order
- Stale data when component unmounts
- Multiple overlapping requests

Solutions:
1. AbortController for cancellation
2. Request IDs for ordering
3. Cleanup functions in useEffect
4. State machines for complex flows
5. Libraries like TanStack Query`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// ❌ Race condition - search results
function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    // If user types "abc" quickly:
    // Request for "a" might finish after "abc"
    searchAPI(query).then(setResults);
  }, [query]);
}

// ✅ Fix 1: AbortController
function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    const controller = new AbortController();
    
    searchAPI(query, { signal: controller.signal })
      .then(setResults)
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      });
    
    return () => controller.abort();
  }, [query]);
}

// ✅ Fix 2: Request ID tracking
function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const requestIdRef = useRef(0);
  
  useEffect(() => {
    const currentRequestId = ++requestIdRef.current;
    
    searchAPI(query).then(data => {
      // Only update if this is still the latest request
      if (currentRequestId === requestIdRef.current) {
        setResults(data);
      }
    });
  }, [query]);
}

// ✅ Fix 3: Ignore stale flag
function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    let ignore = false;
    
    searchAPI(query).then(data => {
      if (!ignore) {
        setResults(data);
      }
    });
    
    return () => { ignore = true; };
  }, [query]);
}

// ✅ Best: Use TanStack Query
import { useQuery } from '@tanstack/react-query';

function Search() {
  const [query, setQuery] = useState('');
  
  const { data: results } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchAPI(query),
    enabled: query.length > 0,
  });
  // Handles race conditions, caching, stale data automatically
}`,
    tags: ['debugging', 'async', 'race-conditions', 'data-fetching'],
    timeEstimate: 6
  },
  {
    id: 'dbg-8',
    category: 'Debugging',
    question: 'How do you debug CSS issues in React components?',
    answer: `Common CSS debugging scenarios:

1. Styles not applying
   - Check class name spelling
   - CSS Modules import
   - Specificity conflicts
   - Order of stylesheets

2. Layout issues
   - Use browser DevTools
   - Outline/background tricks
   - Flexbox/Grid inspectors

3. Unexpected styling
   - Inherited styles
   - Global styles leaking
   - CSS-in-JS specificity

4. Dynamic style issues
   - Check conditional logic
   - Inspect computed styles`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// Debugging trick: Outline all elements
// Add to global CSS temporarily
* { outline: 1px solid red !important; }

// CSS Modules debugging
// styles.module.css
.button { background: blue; }

// Component
import styles from './styles.module.css';
console.log('styles:', styles); // { button: 'styles_button_x7hd' }

// Check actual class name in browser DevTools

// Debugging dynamic styles
function Button({ variant }) {
  const className = \`btn btn-\${variant}\`;
  console.log('className:', className); // Debug output
  
  return <button className={className}>Click</button>;
}

// Tailwind debugging
// Check if classes are being purged
<div className="bg-red-500 p-4">
  {/* If bg-red-500 doesn't work, check: */}
  {/* 1. tailwind.config.js content paths */}
  {/* 2. Dynamic class names (can't be purged) */}
</div>

// ❌ Won't work with Tailwind purge
const color = 'red';
<div className={\`bg-\${color}-500\`}>

// ✅ Will work - complete class names
const colorClass = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
}[color];
<div className={colorClass}>

// Inspecting computed styles
const element = document.querySelector('.my-element');
const computed = window.getComputedStyle(element);
console.log('Computed styles:', {
  display: computed.display,
  margin: computed.margin,
  padding: computed.padding,
});`,
    tags: ['debugging', 'css', 'styles', 'tailwind'],
    timeEstimate: 4
  },
  {
    id: 'dbg-9',
    category: 'Debugging',
    question: 'How do you debug race conditions in React?',
    answer: `Race conditions occur when async operations complete in unexpected order. Debugging strategies:

Identification:
- Inconsistent state after async operations
- Data from wrong request showing
- Stale data persisting

Debugging:
- Add timestamps/IDs to requests
- Log request start/end with IDs
- Use React DevTools timeline
- Add artificial delays to reproduce`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// Add request tracking for debugging
let requestId = 0;

function useSearchDebug(query) {
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    const currentRequest = ++requestId;
    console.log(\`[Request \${currentRequest}] Started for: "\${query}"\`);
    
    const startTime = performance.now();
    
    searchAPI(query).then(data => {
      const duration = performance.now() - startTime;
      console.log(\`[Request \${currentRequest}] Completed in \${duration}ms\`);
      
      if (currentRequest === requestId) {
        console.log(\`[Request \${currentRequest}] ✅ Applied (latest)\`);
        setResults(data);
      } else {
        console.log(\`[Request \${currentRequest}] ❌ Discarded (stale)\`);
      }
    });
  }, [query]);
  
  return results;
}

// Fix with abort controller
function useSearchFixed(query) {
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    const controller = new AbortController();
    
    searchAPI(query, { signal: controller.signal })
      .then(setResults)
      .catch(err => {
        if (err.name !== 'AbortError') throw err;
      });
    
    return () => controller.abort();
  }, [query]);
  
  return results;
}

// Debug with artificial delay
async function debugWithDelay(query) {
  // Add random delay to expose race conditions
  const delay = Math.random() * 2000;
  console.log(\`Delaying \${delay}ms for: \${query}\`);
  await new Promise(r => setTimeout(r, delay));
  return searchAPI(query);
}`,
    tags: ['debugging', 'race-conditions', 'async', 'hooks'],
    timeEstimate: 5
  },
  {
    id: 'dbg-10',
    category: 'Debugging',
    question: 'How do you debug SSR vs client rendering issues?',
    answer: `SSR issues often manifest as hydration mismatches or different behavior between server and client.

Common causes:
- Using window/document on server
- Different data on server vs client
- Time-sensitive content
- Browser-only libraries

Debugging:
- Check for typeof window === 'undefined'
- Compare server HTML with client
- Use useEffect for client-only code
- Check Next.js build output`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// Debug hydration mismatch
function HydrationDebug({ children }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div data-ssr-placeholder>Loading...</div>;
  }
  
  return children;
}

// Log server vs client differences
function DebugComponent() {
  const isServer = typeof window === 'undefined';
  const timestamp = Date.now();
  
  console.log(\`Rendering on \${isServer ? 'server' : 'client'} at \${timestamp}\`);
  
  // This causes hydration mismatch!
  return <div>{timestamp}</div>;
}

// Fix: Make time-sensitive content client-only
function FixedComponent() {
  const [timestamp, setTimestamp] = useState<number | null>(null);
  
  useEffect(() => {
    setTimestamp(Date.now());
  }, []);
  
  return <div>{timestamp ?? 'Loading...'}</div>;
}

// Debug with suppressHydrationWarning (temporarily)
function DateDisplay() {
  return (
    <time suppressHydrationWarning>
      {new Date().toLocaleString()}
    </time>
  );
}

// Check for SSR-incompatible code
// Create a wrapper hook
function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
}

function BrowserOnlyFeature() {
  const isClient = useIsClient();
  
  if (!isClient) {
    return null; // Don't render on server
  }
  
  // Safe to use window here
  return <div>Window width: {window.innerWidth}</div>;
}

// Next.js dynamic import with ssr: false
import dynamic from 'next/dynamic';

const ClientOnlyChart = dynamic(() => import('./Chart'), {
  ssr: false,
  loading: () => <div>Loading chart...</div>
});`,
    tags: ['debugging', 'ssr', 'hydration', 'next.js'],
    timeEstimate: 5
  },
  {
    id: 'dbg-11',
    category: 'Debugging',
    question: 'How do you use breakpoints effectively in React?',
    answer: `Breakpoints are essential for understanding execution flow and state changes.

Types:
- Line breakpoints - Pause at specific line
- Conditional breakpoints - Pause when condition is true
- Logpoints - Log without pausing
- Exception breakpoints - Pause on errors

Best practices:
- Set breakpoints in useEffect callbacks
- Watch state and props values
- Use call stack to trace issues
- Disable "Pause on Caught Exceptions"`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// Place breakpoints at key points
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Breakpoint here to debug fetch
    async function fetchUser() {
      setLoading(true); // Breakpoint: check when loading starts
      
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const data = await response.json();
        setUser(data); // Breakpoint: inspect fetched data
      } catch (error) {
        console.error(error); // Breakpoint: catch errors
      } finally {
        setLoading(false);
      }
    }
    
    fetchUser();
  }, [userId]);
  
  // Breakpoint with condition: user?.role === 'admin'
  if (!user) return null;
  
  return <div>{user.name}</div>;
}

// Chrome DevTools tips:
// 1. Right-click line number -> "Add conditional breakpoint"
// 2. Condition: userId === "123"

// 3. Right-click -> "Add logpoint"
// Log message: "User state:", user

// 4. In Sources panel, use:
// - Watch: Add expressions to monitor
// - Scope: See current variable values
// - Call Stack: Trace how you got here

// Debug with debugger statement
function handleClick() {
  debugger; // Browser pauses here
  // Inspect variables in DevTools
}

// Source maps in next.config.js
module.exports = {
  productionBrowserSourceMaps: true, // Enable in prod for debugging
};

// VSCode launch.json for debugging
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug React",
      "url": "http://localhost:3000",
      "webRoot": "\${workspaceFolder}"
    }
  ]
}`,
    tags: ['debugging', 'breakpoints', 'devtools', 'chrome'],
    timeEstimate: 4
  },
  {
    id: 'dbg-12',
    category: 'Debugging',
    question: 'How do you debug Context-related issues?',
    answer: `Context bugs often involve missing providers, stale values, or unnecessary re-renders.

Common issues:
- "Cannot read property of undefined" - Missing provider
- Stale context values - Provider not updating
- All consumers re-rendering - Object value recreation

Debugging:
- React DevTools Components tab
- Add context display component
- Check provider hierarchy
- Verify value memoization`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// Debug context with display component
const ThemeContext = createContext(undefined);

function ThemeDebugger() {
  const theme = useContext(ThemeContext);
  
  useEffect(() => {
    console.log('Theme context value:', theme);
    console.log('Theme context defined:', theme !== undefined);
  }, [theme]);
  
  return process.env.NODE_ENV === 'development' ? (
    <pre style={{ position: 'fixed', bottom: 0, right: 0, background: '#000', color: '#0f0', padding: 8 }}>
      Context: {JSON.stringify(theme, null, 2)}
    </pre>
  ) : null;
}

// Check for missing provider
function useThemeSafe() {
  const theme = useContext(ThemeContext);
  
  if (theme === undefined) {
    throw new Error(
      'useTheme must be used within a ThemeProvider. ' +
      'Wrap your component tree with <ThemeProvider>.'
    );
  }
  
  return theme;
}

// Debug re-renders from context
function ContextConsumer() {
  const value = useContext(MyContext);
  
  useEffect(() => {
    console.log('ContextConsumer re-rendered');
    console.log('Context value:', value);
  });
  
  return <div>{value.data}</div>;
}

// ❌ BAD - New object every render
function BrokenProvider({ children }) {
  const [count, setCount] = useState(0);
  
  return (
    <MyContext.Provider value={{ count, setCount }}>
      {children}
    </MyContext.Provider>
  );
}

// ✅ GOOD - Memoized value
function FixedProvider({ children }) {
  const [count, setCount] = useState(0);
  
  const value = useMemo(
    () => ({ count, setCount }),
    [count]
  );
  
  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
}

// Trace provider hierarchy
function ProviderDebugger({ name, children }) {
  console.log(\`Rendering provider: \${name}\`);
  return children;
}

// Usage
<ProviderDebugger name="Theme">
  <ThemeProvider>
    <ProviderDebugger name="Auth">
      <AuthProvider>
        <App />
      </AuthProvider>
    </ProviderDebugger>
  </ThemeProvider>
</ProviderDebugger>`,
    tags: ['debugging', 'context', 're-renders', 'providers'],
    timeEstimate: 5
  },
  {
    id: 'dbg-13',
    category: 'Debugging',
    question: 'How do you debug form validation issues?',
    answer: `Form validation bugs can be tricky due to async validation, multiple inputs, and complex state.

Common issues:
- Validation not triggering
- Wrong error messages
- Validation on wrong field
- Race conditions in async validation

Debugging:
- Log validation state changes
- Check input names and values
- Verify validation schema
- Test edge cases (empty, long strings)`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// Debug form state with React Hook Form
import { useForm } from 'react-hook-form';

function DebugForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty, touchedFields }
  } = useForm({ mode: 'onChange' });
  
  // Watch all form values
  const watchAll = watch();
  
  // Log state changes
  useEffect(() => {
    console.log('Form Values:', watchAll);
    console.log('Errors:', errors);
    console.log('Is Valid:', isValid);
    console.log('Touched:', touchedFields);
  }, [watchAll, errors, isValid, touchedFields]);
  
  return (
    <form onSubmit={handleSubmit(data => console.log('Submit:', data))}>
      <input
        {...register('email', {
          required: 'Email required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
            message: 'Invalid email'
          }
        })}
      />
      {errors.email && <span>{errors.email.message}</span>}
      
      {/* Debug display */}
      <pre>
        {JSON.stringify({ watchAll, errors, isValid }, null, 2)}
      </pre>
    </form>
  );
}

// Debug Zod schema validation
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

function debugValidation(data: unknown) {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    console.log('Validation failed:');
    result.error.errors.forEach(err => {
      console.log(\`  \${err.path.join('.')}: \${err.message}\`);
    });
    return { success: false, errors: result.error.format() };
  }
  
  console.log('Validation passed:', result.data);
  return { success: true, data: result.data };
}

// Test validation
debugValidation({ email: 'invalid', password: '123' });
// Validation failed:
//   email: Invalid email
//   password: String must contain at least 8 character(s)

// Debug async validation
const asyncValidation = async (value: string) => {
  console.log(\`Async validating: \${value}\`);
  const start = Date.now();
  
  const isAvailable = await checkUsername(value);
  
  console.log(\`Validation took: \${Date.now() - start}ms, result: \${isAvailable}\`);
  return isAvailable || 'Username taken';
};`,
    tags: ['debugging', 'forms', 'validation', 'react-hook-form'],
    timeEstimate: 4
  },
  {
    id: 'dbg-14',
    category: 'Debugging',
    question: 'How do you debug Next.js Server Actions?',
    answer: `Server Actions run on the server, making debugging different from client code.

Challenges:
- Can't use browser DevTools
- Errors may not show clearly
- State between requests

Techniques:
- console.log (shows in terminal)
- Error boundaries for client errors
- try/catch with detailed logging
- Return error objects for client handling`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// Server Action with detailed logging
'use server';

import { headers } from 'next/headers';

export async function createPost(formData: FormData) {
  const requestId = crypto.randomUUID();
  const start = performance.now();
  
  console.log(\`[Action \${requestId}] Starting createPost\`);
  console.log(\`[Action \${requestId}] Headers:\`, Object.fromEntries(headers()));
  console.log(\`[Action \${requestId}] FormData:\`, Object.fromEntries(formData));
  
  try {
    const title = formData.get('title');
    const content = formData.get('content');
    
    if (!title || !content) {
      console.log(\`[Action \${requestId}] Validation failed\`);
      return { error: 'Missing required fields' };
    }
    
    console.log(\`[Action \${requestId}] Creating post...\`);
    
    const post = await db.post.create({
      data: { title: String(title), content: String(content) }
    });
    
    console.log(\`[Action \${requestId}] Created post:\`, post.id);
    console.log(\`[Action \${requestId}] Duration: \${performance.now() - start}ms\`);
    
    revalidatePath('/posts');
    return { success: true, postId: post.id };
    
  } catch (error) {
    console.error(\`[Action \${requestId}] Error:\`, error);
    
    // Return serializable error
    return {
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Client-side handling with error display
'use client';

function CreatePostForm() {
  const [state, setState] = useState({ error: null, success: false });
  const [pending, startTransition] = useTransition();
  
  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      console.log('Submitting form...');
      const result = await createPost(formData);
      console.log('Server response:', result);
      
      if (result.error) {
        setState({ error: result.error, success: false });
      } else {
        setState({ error: null, success: true });
      }
    });
  }
  
  return (
    <form action={handleSubmit}>
      {state.error && <div className="error">{state.error}</div>}
      <input name="title" />
      <textarea name="content" />
      <button disabled={pending}>
        {pending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}

// Debug redirect issues
export async function submitAndRedirect() {
  'use server';
  
  console.log('About to redirect...');
  
  // This won't log - redirect throws
  redirect('/success');
  
  // Use try-finally if you need cleanup
  try {
    // Cleanup logic
  } finally {
    redirect('/success');
  }
}`,
    tags: ['debugging', 'server-actions', 'next.js', 'server'],
    timeEstimate: 5
  },
  {
    id: 'dbg-15',
    category: 'Debugging',
    question: 'How do you debug slow component mounts?',
    answer: `Slow mounts affect user experience. Common causes:

Causes:
- Expensive initial calculations
- Synchronous data fetching
- Large component trees
- Blocking effects

Debugging:
- React DevTools Profiler
- Performance.mark/measure
- console.time for timing
- Chrome Performance tab`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// Measure component mount time
function SlowComponent() {
  const startTime = useRef(performance.now());
  
  useEffect(() => {
    const mountTime = performance.now() - startTime.current;
    console.log(\`Component mounted in \${mountTime.toFixed(2)}ms\`);
    
    if (mountTime > 100) {
      console.warn('Slow mount detected!');
    }
  }, []);
  
  return <div>Content</div>;
}

// Profile specific sections
function DataGrid({ items }) {
  console.time('DataGrid render');
  
  const processedItems = useMemo(() => {
    console.time('Processing items');
    const result = items.map(processItem);
    console.timeEnd('Processing items');
    return result;
  }, [items]);
  
  useEffect(() => {
    console.timeEnd('DataGrid render');
  });
  
  return (
    <div>
      {processedItems.map(item => <Row key={item.id} item={item} />)}
    </div>
  );
}

// Use Performance API for detailed timing
function TrackedComponent() {
  useLayoutEffect(() => {
    performance.mark('component-render-start');
  }, []);
  
  useEffect(() => {
    performance.mark('component-mount-complete');
    performance.measure(
      'component-mount',
      'component-render-start',
      'component-mount-complete'
    );
    
    const measures = performance.getEntriesByName('component-mount');
    console.log('Mount timing:', measures[0].duration);
    
    // Cleanup
    performance.clearMarks();
    performance.clearMeasures();
  }, []);
  
  return <div>Tracked</div>;
}

// Fix: Lazy load expensive components
const ExpensiveChart = lazy(() => import('./ExpensiveChart'));

function Dashboard() {
  return (
    <div>
      <Header /> {/* Mounts fast */}
      <Suspense fallback={<ChartSkeleton />}>
        <ExpensiveChart /> {/* Lazy loaded */}
      </Suspense>
    </div>
  );
}

// Fix: Defer expensive calculations
function OptimizedComponent({ data }) {
  const [isReady, setIsReady] = useState(false);
  const [processed, setProcessed] = useState(null);
  
  useEffect(() => {
    // Defer expensive work
    requestIdleCallback(() => {
      setProcessed(expensiveProcess(data));
      setIsReady(true);
    });
  }, [data]);
  
  if (!isReady) {
    return <Skeleton />;
  }
  
  return <Display data={processed} />;
}`,
    tags: ['debugging', 'performance', 'profiling', 'mounting'],
    timeEstimate: 5
  },
  {
    id: 'dbg-16',
    category: 'Debugging',
    question: 'How do you debug routing issues in Next.js?',
    answer: `Routing issues in Next.js can involve file structure, middleware, or navigation logic.

Common issues:
- 404 on valid routes
- Wrong page rendering
- Middleware not triggering
- Dynamic routes not matching

Debugging:
- Check file structure matches routes
- Log middleware execution
- Verify dynamic segment naming
- Check for conflicting routes`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// Debug middleware execution
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('====== MIDDLEWARE ======');
  console.log('Path:', request.nextUrl.pathname);
  console.log('Method:', request.method);
  console.log('Cookies:', request.cookies.getAll());
  console.log('Headers:', Object.fromEntries(request.headers));
  
  // Check if middleware should run
  const shouldIntercept = request.nextUrl.pathname.startsWith('/api');
  console.log('Should intercept:', shouldIntercept);
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

// Debug dynamic route params
// app/posts/[slug]/page.tsx
export default function Post({ params, searchParams }) {
  console.log('Route params:', params);
  console.log('Search params:', searchParams);
  
  if (!params.slug) {
    console.error('Missing slug parameter!');
  }
  
  return <div>Post: {params.slug}</div>;
}

// Debug catch-all routes
// app/docs/[...slug]/page.tsx
export default function Docs({ params }) {
  console.log('Catch-all params:', params);
  // params.slug is an array: ['getting-started', 'installation']
  
  const path = params.slug?.join('/');
  console.log('Resolved path:', path);
  
  return <div>Docs: {path}</div>;
}

// Check route file structure
// Run in terminal to see route tree
// npx next info

// Common issues:
// 1. page.tsx vs page.ts - must be .tsx for JSX
// 2. layout.tsx at wrong level
// 3. (group) vs [param] confusion
// 4. Missing page.tsx in route folder

// Debug navigation
'use client';
import { usePathname, useSearchParams, useParams } from 'next/navigation';

function RouteDebugger() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  
  useEffect(() => {
    console.log('Navigation:', {
      pathname,
      searchParams: Object.fromEntries(searchParams),
      params
    });
  }, [pathname, searchParams, params]);
  
  return null; // Or render debug info
}

// Check for conflicting routes
// ❌ These conflict:
// app/blog/[slug]/page.tsx
// app/blog/new/page.tsx (might match [slug])

// ✅ Reorder to fix (specific before dynamic)
// Next.js handles this, but verify in logs`,
    tags: ['debugging', 'routing', 'next.js', 'navigation'],
    timeEstimate: 4
  },
  {
    id: 'dbg-17',
    category: 'Debugging',
    question: 'How do you debug event handler issues?',
    answer: `Event handler bugs are common and can be subtle.

Common issues:
- Handler not firing
- Wrong event data
- Stale closure values
- Event propagation issues
- Synthetic event pooling (React < 17)

Debugging:
- Add console.log in handler
- Check event binding
- Verify correct element
- Check for preventDefault/stopPropagation`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// Debug event not firing
function DebugButton() {
  const handleClick = (e) => {
    console.log('Button clicked!');
    console.log('Event type:', e.type);
    console.log('Target:', e.target);
    console.log('Current target:', e.currentTarget);
  };
  
  // ❌ Wrong - calling function immediately
  // <button onClick={handleClick()}>Click</button>
  
  // ✅ Correct - passing function reference
  return <button onClick={handleClick}>Click</button>;
}

// Debug stale closure
function Counter() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    // This captures initial count value!
    console.log('Count in handler:', count);
    setCount(count + 1);
  };
  
  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []); // Empty deps = stale handler
  
  // Fix: use ref or include count in deps
  const countRef = useRef(count);
  countRef.current = count;
  
  const handleClickFixed = () => {
    console.log('Count:', countRef.current);
    setCount(countRef.current + 1);
  };
  
  return <div>{count}</div>;
}

// Debug event propagation
function NestedClicks() {
  return (
    <div onClick={() => console.log('Parent clicked')}>
      <button onClick={(e) => {
        console.log('Button clicked');
        e.stopPropagation(); // Prevents parent handler
      }}>
        Click me
      </button>
    </div>
  );
}

// Debug form submission
function DebugForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Form data:', new FormData(e.target));
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" />
      {/* ❌ type="button" won't submit */}
      {/* ✅ type="submit" triggers form submission */}
      <button type="submit">Submit</button>
    </form>
  );
}

// Debug keyboard events
function DebugKeyboard() {
  const handleKeyDown = (e) => {
    console.log('Key:', e.key);
    console.log('Code:', e.code);
    console.log('Modifiers:', {
      ctrl: e.ctrlKey,
      shift: e.shiftKey,
      alt: e.altKey,
      meta: e.metaKey
    });
  };
  
  return <input onKeyDown={handleKeyDown} />;
}`,
    tags: ['debugging', 'events', 'handlers', 'closures'],
    timeEstimate: 4
  },
  {
    id: 'dbg-18',
    category: 'Debugging',
    question: 'How do you debug API request/response issues?',
    answer: `API debugging involves network, data, and error handling issues.

Tools:
- Browser DevTools Network tab
- console.log request/response
- Postman/Insomnia for isolated testing
- Response interceptors

Checks:
- URL and method correct
- Headers (auth, content-type)
- Request body format
- Response status and body`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// Comprehensive fetch debugging
async function debugFetch(url, options = {}) {
  const requestId = Math.random().toString(36).substr(2, 9);
  
  console.group(\`[Fetch \${requestId}] \${options.method || 'GET'} \${url}\`);
  console.log('Request options:', options);
  
  if (options.body) {
    try {
      console.log('Request body:', JSON.parse(options.body));
    } catch {
      console.log('Request body (raw):', options.body);
    }
  }
  
  const startTime = performance.now();
  
  try {
    const response = await fetch(url, options);
    const duration = performance.now() - startTime;
    
    console.log(\`Response in \${duration.toFixed(0)}ms\`);
    console.log('Status:', response.status, response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers));
    
    const text = await response.text();
    let data;
    
    try {
      data = JSON.parse(text);
      console.log('Response body:', data);
    } catch {
      console.log('Response body (raw):', text);
    }
    
    console.groupEnd();
    
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${text}\`);
    }
    
    return data;
    
  } catch (error) {
    console.error('Fetch error:', error);
    console.groupEnd();
    throw error;
  }
}

// Usage
const user = await debugFetch('/api/user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Test' })
});

// Debug with fetch interceptor
const originalFetch = window.fetch;

window.fetch = async (...args) => {
  console.log('Fetch intercepted:', args);
  
  const response = await originalFetch(...args);
  
  // Clone to read body without consuming
  const clone = response.clone();
  const body = await clone.text();
  
  console.log('Response intercepted:', {
    status: response.status,
    body: body.substring(0, 500) // First 500 chars
  });
  
  return response;
};

// React Query debugging
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => console.error('Query error:', error),
      onSuccess: (data) => console.log('Query success:', data),
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MyApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}`,
    tags: ['debugging', 'api', 'fetch', 'network'],
    timeEstimate: 4
  },
  {
    id: 'dbg-19',
    category: 'Debugging',
    question: 'How do you debug issues with third-party libraries?',
    answer: `Third-party library issues can be challenging due to limited control.

Common issues:
- Version incompatibilities
- Missing peer dependencies
- SSR compatibility
- Incorrect configuration

Debugging:
- Check library documentation
- Search GitHub issues
- Verify version compatibility
- Isolate in minimal reproduction`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// Check for version issues
// package.json
{
  "dependencies": {
    "react": "^18.2.0",
    "some-library": "^2.0.0" // Requires React 17?
  }
}

// Check peer dependency warnings
// npm ls react
// npm ls some-library

// Isolate library issue
function LibraryTest() {
  try {
    // Test library in isolation
    const result = libraryFunction();
    console.log('Library works:', result);
    return <div>Success</div>;
  } catch (error) {
    console.error('Library error:', error);
    return <div>Error: {error.message}</div>;
  }
}

// Debug SSR issues with dynamic import
import dynamic from 'next/dynamic';

const ClientOnlyLibrary = dynamic(
  () => import('some-client-library').then(mod => {
    console.log('Library loaded:', mod);
    return mod.Component;
  }),
  { 
    ssr: false,
    loading: () => {
      console.log('Loading library...');
      return <div>Loading...</div>;
    }
  }
);

// Debug initialization issues
useEffect(() => {
  console.log('Initializing library...');
  
  try {
    const instance = initLibrary({
      debug: true, // Enable library debug mode
      onError: (err) => console.error('Library error:', err)
    });
    
    console.log('Library initialized:', instance);
    
    return () => {
      console.log('Cleaning up library...');
      instance.destroy();
    };
  } catch (error) {
    console.error('Init failed:', error);
  }
}, []);

// Check for window/document access
function SafeLibraryWrapper({ children }) {
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Library needs window
      import('window-dependent-library').then(lib => {
        lib.init();
        setReady(true);
      });
    }
  }, []);
  
  if (!ready) return null;
  return children;
}

// Create minimal reproduction
// 1. Create new Next.js project
// 2. Install only the problematic library
// 3. Try to reproduce issue
// 4. Share reproduction on GitHub issue`,
    tags: ['debugging', 'libraries', 'dependencies', 'compatibility'],
    timeEstimate: 5
  },
  {
    id: 'dbg-20',
    category: 'Debugging',
    question: 'How do you debug TypeScript type errors in React?',
    answer: `TypeScript errors can be confusing but help catch bugs early.

Common errors:
- Property does not exist
- Type X is not assignable to Y
- Object is possibly undefined
- Argument type mismatch

Debugging:
- Hover for type information
- Use type assertions carefully
- Check generic constraints
- Add explicit type annotations`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// Error: Property 'value' does not exist on type 'never'
// Usually means type narrowing failed
function debug1() {
  const items = []; // Inferred as never[]
  items.push('hello'); // Error!
  
  // Fix: explicit type
  const items: string[] = [];
  items.push('hello'); // OK
}

// Error: Object is possibly 'undefined'
function debug2(user?: { name: string }) {
  console.log(user.name); // Error!
  
  // Fix: optional chaining or guard
  console.log(user?.name);
  
  if (user) {
    console.log(user.name); // OK after guard
  }
}

// Error: Type X is not assignable to type Y
interface Props {
  status: 'loading' | 'success' | 'error';
}

function debug3() {
  const status = 'loading'; // Inferred as string, not literal
  return <Component status={status} />; // Error!
  
  // Fix: const assertion
  const status = 'loading' as const;
  return <Component status={status} />; // OK
}

// Debug with satisfies operator
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
} satisfies Record<string, string | number>;
// Catches if value doesn't match expected type

// Debug complex generic errors
function debug4<T extends { id: string }>(items: T[]) {
  return items.map(item => item.id);
}

// Error: Type 'number' is not assignable to 'string'
debug4([{ id: 1 }]); // Error!
debug4([{ id: '1' }]); // OK

// Use type helper to see full type
type Debug<T> = { [K in keyof T]: T[K] };

type UserType = Debug<ReturnType<typeof getUser>>;
// Hover to see expanded type

// Check event handler types
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  console.log(e.target.value); // string
}

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
}

// Debug children type issues
interface CardProps {
  children: React.ReactNode; // Most permissive
  // children: React.ReactElement; // Single element only
  // children: string; // Text only
}`,
    tags: ['debugging', 'typescript', 'types', 'errors'],
    timeEstimate: 4
  },
  {
    id: 'dbg-21',
    category: 'Debugging',
    question: 'How do you debug bundle size issues?',
    answer: `Large bundles hurt performance. Debugging involves analyzing what's included.

Tools:
- webpack-bundle-analyzer
- source-map-explorer
- Next.js build output
- import cost VS Code extension

Common culprits:
- Large libraries (moment, lodash)
- Unintended imports
- Missing tree shaking
- Duplicate dependencies`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// Install and use bundle analyzer
// npm install @next/bundle-analyzer

// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Your config
});

// Run: ANALYZE=true npm run build

// Use source-map-explorer
// npm install source-map-explorer
// Add to package.json:
{
  "scripts": {
    "analyze": "source-map-explorer '.next/static/chunks/*.js'"
  }
}

// Check Next.js build output
// Look for:
// - First Load JS shared by all
// - Page sizes
// - λ (lambda) = server-side
// - ○ (circle) = static

// Find large imports
// ❌ Imports entire lodash (~70KB)
import _ from 'lodash';
_.debounce(fn, 300);

// ✅ Imports only debounce (~1KB)
import debounce from 'lodash/debounce';
debounce(fn, 300);

// Check for duplicate packages
// npm ls package-name
// Shows all versions installed

// Dynamic imports for large libraries
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />
});

// Analyze specific routes
// In dev: Look at Network tab, filter JS
// Each route's JS should be separate chunk

// Debug with import statement analysis
console.log('Modules loaded:', Object.keys(require.cache).length);

// Webpack magic comments for naming
const Editor = dynamic(
  () => import(/* webpackChunkName: "editor" */ './Editor'),
  { ssr: false }
);

// Check if tree shaking works
// Ensure package.json has:
{
  "sideEffects": false,
  // or
  "sideEffects": ["*.css"]
}`,
    tags: ['debugging', 'bundle', 'webpack', 'optimization'],
    timeEstimate: 5
  },
  {
    id: 'dbg-22',
    category: 'Debugging',
    question: 'How do you debug state synchronization issues?',
    answer: `State sync issues occur when multiple state sources get out of sync.

Symptoms:
- UI shows stale data
- Form values reset unexpectedly
- Conflicting updates
- Race conditions between updates

Debugging:
- Track state changes with logging
- Use React DevTools component state
- Check for derived state issues
- Verify single source of truth`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// Debug state with middleware-style logging
function useLoggedState(initialValue, name) {
  const [state, setState] = useState(initialValue);
  
  const setStateLogged = useCallback((newValue) => {
    setState(prev => {
      const next = typeof newValue === 'function' 
        ? newValue(prev) 
        : newValue;
      
      console.log(\`[\${name}] State change:\`, {
        prev,
        next,
        timestamp: new Date().toISOString()
      });
      
      return next;
    });
  }, [name]);
  
  return [state, setStateLogged];
}

// Usage
const [user, setUser] = useLoggedState(null, 'user');
const [posts, setPosts] = useLoggedState([], 'posts');

// Debug derived state problems
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  // ❌ Derived state in useState - goes stale
  const [fullName, setFullName] = useState('');
  
  useEffect(() => {
    fetchUser(userId).then(u => {
      setUser(u);
      setFullName(\`\${u.firstName} \${u.lastName}\`);
    });
  }, [userId]);
  
  // ✅ Compute derived values inline
  const fullName = user ? \`\${user.firstName} \${user.lastName}\` : '';
  
  // Or with useMemo for expensive computations
  const stats = useMemo(() => 
    user ? computeStats(user) : null,
    [user]
  );
}

// Debug conflicting updates
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    // ❌ These don't stack as expected
    setCount(count + 1);
    setCount(count + 1);
    // Result: count + 1, not count + 2
    
    // ✅ Functional updates always use latest
    setCount(c => c + 1);
    setCount(c => c + 1);
    // Result: count + 2
  };
}

// Track sync issues with refs
function useStateWithHistory(initial) {
  const [state, setState] = useState(initial);
  const history = useRef([{ value: initial, time: Date.now() }]);
  
  const setStateTracked = useCallback((newValue) => {
    setState(prev => {
      const next = typeof newValue === 'function' 
        ? newValue(prev) 
        : newValue;
      
      history.current.push({
        value: next,
        prev,
        time: Date.now()
      });
      
      // Keep last 50 changes
      if (history.current.length > 50) {
        history.current.shift();
      }
      
      return next;
    });
  }, []);
  
  const getHistory = useCallback(() => history.current, []);
  
  return [state, setStateTracked, getHistory];
}`,
    tags: ['debugging', 'state', 'synchronization', 'derived-state'],
    timeEstimate: 5
  },
  {
    id: 'dbg-23',
    category: 'Debugging',
    question: 'How do you debug animations and transitions?',
    answer: `Animation bugs involve timing, performance, and visual glitches.

Issues:
- Janky animations (frame drops)
- Animations not triggering
- Wrong timing/easing
- Layout shifts during animation

Debugging:
- Chrome DevTools Performance tab
- Layers panel for compositing
- Slow-motion mode (Chrome)
- Animation inspector`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// Debug animation performance
function AnimatedComponent() {
  useEffect(() => {
    // Log frame timing
    let lastTime = performance.now();
    let frameCount = 0;
    
    function checkFrameRate(time) {
      frameCount++;
      
      if (time - lastTime >= 1000) {
        console.log(\`FPS: \${frameCount}\`);
        frameCount = 0;
        lastTime = time;
      }
      
      requestAnimationFrame(checkFrameRate);
    }
    
    const rafId = requestAnimationFrame(checkFrameRate);
    return () => cancelAnimationFrame(rafId);
  }, []);
}

// Check for layout-triggering properties
// ❌ Bad - triggers layout recalculation
.animated {
  left: 0;
  transition: left 0.3s;
}
.animated:hover {
  left: 100px;
}

// ✅ Good - uses GPU compositing
.animated {
  transform: translateX(0);
  transition: transform 0.3s;
}
.animated:hover {
  transform: translateX(100px);
}

// Debug with will-change hint
.animated {
  will-change: transform; // Promotes to own layer
}

// Debug Framer Motion animations
import { motion, useAnimation } from 'framer-motion';

function DebugAnimation() {
  const controls = useAnimation();
  
  const handleAnimate = async () => {
    console.log('Animation starting');
    
    await controls.start({
      x: 100,
      transition: { 
        duration: 0.5,
        onUpdate: (latest) => console.log('Progress:', latest)
      }
    });
    
    console.log('Animation complete');
  };
  
  return (
    <motion.div
      animate={controls}
      onAnimationStart={() => console.log('Started')}
      onAnimationComplete={() => console.log('Completed')}
    >
      Animated
    </motion.div>
  );
}

// Debug CSS transitions not firing
function TransitionDebug() {
  const [isOpen, setIsOpen] = useState(false);
  
  // ❌ Won't animate - display:none removes from flow
  const badStyle = {
    display: isOpen ? 'block' : 'none',
    opacity: isOpen ? 1 : 0,
    transition: 'opacity 0.3s'
  };
  
  // ✅ Will animate - visibility allows transitions
  const goodStyle = {
    visibility: isOpen ? 'visible' : 'hidden',
    opacity: isOpen ? 1 : 0,
    transition: 'opacity 0.3s, visibility 0.3s'
  };
  
  return <div style={goodStyle}>Content</div>;
}

// Chrome DevTools tips:
// 1. Performance tab > Enable "Screenshots"
// 2. Rendering drawer > Show paint flashing
// 3. Rendering > Slow down animations
// 4. Layers panel > See composited layers`,
    tags: ['debugging', 'animations', 'performance', 'css'],
    timeEstimate: 4
  },
  {
    id: 'dbg-24',
    category: 'Debugging',
    question: 'How do you debug production-only issues?',
    answer: `Some bugs only appear in production due to optimization differences.

Causes:
- Minification issues
- Environment differences
- Missing environment variables
- Build-time vs runtime differences
- SSR/hydration in production only

Strategies:
- Enable source maps
- Reproduce locally with production build
- Add logging/monitoring
- Use error tracking services`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// Enable source maps for production debugging
// next.config.js
module.exports = {
  productionBrowserSourceMaps: true,
};

// Add error boundary with reporting
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Send to error tracking
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    });
  }
}

// Add production logging
const logger = {
  log: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
    // Always send to logging service
    sendToLogService('log', args);
  },
  error: (...args) => {
    console.error(...args);
    sendToLogService('error', args);
  }
};

// Test production build locally
// npm run build
// npm run start
// Now running production build locally

// Check for dev-only code
function Component() {
  // ❌ This only works in development
  if (process.env.NODE_ENV === 'development') {
    window.debugData = data;
  }
  
  // Production won't have window.debugData
}

// Debug missing environment variables
// Required vars should fail fast
function validateEnv() {
  const required = ['DATABASE_URL', 'API_KEY', 'NEXTAUTH_SECRET'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(\`Missing environment variables: \${missing.join(', ')}\`);
  }
}

// Call during app initialization
validateEnv();

// Add timing markers for production debugging
export async function getServerSideProps() {
  const marks = [];
  const mark = (name) => marks.push({ name, time: Date.now() });
  
  mark('start');
  const user = await getUser();
  mark('after-getUser');
  const posts = await getPosts(user.id);
  mark('after-getPosts');
  
  // Log timing in production
  console.log('SSR timing:', marks);
  
  return { props: { user, posts } };
}

// Use feature flags for safe debugging
const flags = {
  enableVerboseLogging: process.env.VERBOSE_LOGS === 'true',
  enableDebugMode: process.env.DEBUG_MODE === 'true'
};

if (flags.enableVerboseLogging) {
  console.log('Detailed debug info:', debugInfo);
}`,
    tags: ['debugging', 'production', 'error-tracking', 'logging'],
    timeEstimate: 5
  },
  {
    id: 'dbg-25',
    category: 'Debugging',
    question: 'How do you debug focus and accessibility issues?',
    answer: `Accessibility bugs affect keyboard and screen reader users.

Issues:
- Focus not visible
- Wrong focus order
- Focus trapped or lost
- Missing announcements
- Incorrect roles/labels

Debugging:
- Tab through page manually
- Use screen reader
- Chrome Accessibility tab
- axe DevTools extension`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// Debug focus visibility
function DebugFocus() {
  return (
    <style jsx global>{\`
      /* Show focus clearly during debugging */
      :focus {
        outline: 3px solid red !important;
        outline-offset: 2px !important;
      }
      
      /* Log focus changes */
      document.addEventListener('focusin', (e) => {
        console.log('Focus moved to:', e.target);
        console.log('Element:', e.target.tagName, e.target.className);
      });
    \`}</style>
  );
}

// Debug focus management in modals
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);
  const previousFocus = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement;
      console.log('Saved focus:', previousFocus.current);
      
      // Focus first focusable element
      const focusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      console.log('First focusable:', focusable);
      focusable?.focus();
    } else {
      console.log('Restoring focus to:', previousFocus.current);
      previousFocus.current?.focus();
    }
  }, [isOpen]);
  
  // Trap focus
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      const focusable = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
  
  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}

// Debug screen reader announcements
function useLiveAnnounce() {
  const announce = useCallback((message, priority = 'polite') => {
    console.log(\`[Announce] \${priority}: \${message}\`);
    
    const el = document.createElement('div');
    el.setAttribute('aria-live', priority);
    el.setAttribute('aria-atomic', 'true');
    el.className = 'sr-only';
    document.body.appendChild(el);
    
    setTimeout(() => {
      el.textContent = message;
    }, 100);
    
    setTimeout(() => {
      document.body.removeChild(el);
    }, 1000);
  }, []);
  
  return announce;
}

// Check ARIA roles and labels
function AccessibilityAudit() {
  useEffect(() => {
    const elements = document.querySelectorAll('[role]');
    console.log('Elements with roles:', elements);
    
    elements.forEach(el => {
      console.log({
        element: el,
        role: el.getAttribute('role'),
        ariaLabel: el.getAttribute('aria-label'),
        ariaLabelledBy: el.getAttribute('aria-labelledby')
      });
    });
  }, []);
}`,
    tags: ['debugging', 'accessibility', 'focus', 'a11y'],
    timeEstimate: 4
  },
  {
    id: 'dbg-26',
    category: 'Debugging',
    question: 'How do you debug environment-specific issues?',
    answer: `Code behaving differently across environments (dev/staging/prod).

Causes:
- Different environment variables
- API endpoint differences
- Feature flags
- Third-party service configs
- Database state differences

Debugging:
- Log environment info
- Compare configs
- Test in all environments
- Use environment indicators`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// Log environment info at startup
console.log('=== Environment Info ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('Build time:', new Date().toISOString());
console.log('========================');

// Show environment indicator in UI
function EnvironmentBadge() {
  const env = process.env.NODE_ENV;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (env === 'production') return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 8,
      right: 8,
      padding: '4px 8px',
      background: env === 'development' ? 'green' : 'orange',
      color: 'white',
      fontSize: 12,
      borderRadius: 4,
      zIndex: 9999
    }}>
      {env} | {apiUrl}
    </div>
  );
}

// Validate environment configuration
function validateEnvironment() {
  const config = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    environment: process.env.NODE_ENV,
    features: {
      analytics: process.env.NEXT_PUBLIC_ANALYTICS === 'true',
      debug: process.env.DEBUG === 'true'
    }
  };
  
  console.log('Loaded configuration:', config);
  
  // Validate required configs
  if (!config.apiUrl) {
    console.error('Missing NEXT_PUBLIC_API_URL!');
  }
  
  // Check for production misconfigurations
  if (config.environment === 'production') {
    if (config.features.debug) {
      console.warn('Debug mode enabled in production!');
    }
    if (config.apiUrl.includes('localhost')) {
      console.error('Localhost API URL in production!');
    }
  }
  
  return config;
}

// API client with environment awareness
function createApiClient() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  return {
    fetch: async (endpoint, options) => {
      const url = \`\${baseUrl}\${endpoint}\`;
      
      console.log(\`[\${process.env.NODE_ENV}] Fetching: \${url}\`);
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        console.error(\`API Error in \${process.env.NODE_ENV}:\`, {
          url,
          status: response.status,
          body: await response.text()
        });
      }
      
      return response;
    }
  };
}

// Test environment variable loading
// Create .env.test for testing
// Run: NODE_ENV=test npm test

// Debug Vercel environment
// Vercel sets these automatically:
console.log('Vercel Environment:', {
  VERCEL_ENV: process.env.VERCEL_ENV, // production, preview, development
  VERCEL_URL: process.env.VERCEL_URL,
  VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA
});`,
    tags: ['debugging', 'environment', 'configuration', 'deployment'],
    timeEstimate: 4
  },
  {
    id: 'dbg-27',
    category: 'Debugging',
    question: 'How do you debug slow data fetching?',
    answer: `Slow fetching affects user experience. Debug at multiple levels.

Check:
- Network latency (DevTools)
- Database query performance
- API response time
- Data transformation overhead
- Caching effectiveness

Tools:
- Network tab timing
- Server-side timing headers
- Database query logging
- Performance profiling`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// Add timing to fetch calls
async function timedFetch(url, options) {
  const start = performance.now();
  
  console.log(\`[Fetch] Starting: \${url}\`);
  
  const response = await fetch(url, options);
  const data = await response.json();
  
  const duration = performance.now() - start;
  console.log(\`[Fetch] \${url} took \${duration.toFixed(0)}ms\`);
  
  // Warn on slow requests
  if (duration > 1000) {
    console.warn(\`[Slow Fetch] \${url} took \${duration}ms\`);
  }
  
  return data;
}

// Add Server-Timing header for debugging
// app/api/data/route.ts
export async function GET() {
  const timings = [];
  const time = (name) => {
    const start = performance.now();
    return () => {
      timings.push(\`\${name};dur=\${(performance.now() - start).toFixed(1)}\`);
    };
  };
  
  let endDb = time('db');
  const users = await db.user.findMany();
  endDb();
  
  let endTransform = time('transform');
  const result = transformData(users);
  endTransform();
  
  return NextResponse.json(result, {
    headers: {
      'Server-Timing': timings.join(', ')
    }
  });
}

// Check timing in browser
// DevTools > Network > Select request > Timing tab
// Look for: DNS, Connect, SSL, TTFB, Download

// Debug React Query/SWR fetching
import { useQuery } from '@tanstack/react-query';

function DataWithTiming() {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      console.time('Query: data');
      const result = await fetchData();
      console.timeEnd('Query: data');
      return result;
    }
  });
  
  useEffect(() => {
    console.log('Query state:', { isLoading, isFetching });
  }, [isLoading, isFetching]);
}

// Debug database queries (Prisma)
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

// In code
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'warn' }
  ]
});

prisma.$on('query', (e) => {
  console.log('Query:', e.query);
  console.log('Params:', e.params);
  console.log('Duration:', e.duration, 'ms');
});

// Identify N+1 queries
// If you see many similar queries, you have N+1 problem
// Fix with include/select:
const posts = await prisma.post.findMany({
  include: { author: true } // Join instead of N+1
});`,
    tags: ['debugging', 'performance', 'fetching', 'database'],
    timeEstimate: 5
  },
  {
    id: 'dbg-28',
    category: 'Debugging',
    question: 'How do you debug component composition issues?',
    answer: `Composition issues involve incorrect prop passing, children manipulation, or component interaction.

Issues:
- Props not reaching children
- Children not rendering correctly
- Context not propagating
- Event handlers not working

Debugging:
- Log prop values at each level
- Check component tree in DevTools
- Verify children type/shape
- Test components in isolation`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// Debug props passing
function Parent({ children, ...props }) {
  console.log('Parent props:', props);
  console.log('Children type:', typeof children);
  console.log('Children:', children);
  
  return (
    <div>
      {React.Children.map(children, (child, index) => {
        console.log(\`Child \${index}:\`, child?.type?.name, child?.props);
        
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...props,
            parentDebug: true
          });
        }
        return child;
      })}
    </div>
  );
}

// Debug prop drilling
function PropTracer({ name, value, children }) {
  useEffect(() => {
    console.log(\`[PropTracer] \${name} = \`, value);
  }, [name, value]);
  
  return children;
}

// Usage
<PropTracer name="user" value={user}>
  <UserProfile user={user} />
</PropTracer>

// Debug render props
function DataProvider({ render, children }) {
  const data = useData();
  
  console.log('DataProvider render prop:', typeof render);
  console.log('DataProvider children:', typeof children);
  
  // Support both patterns
  if (render) {
    return render(data);
  }
  
  if (typeof children === 'function') {
    return children(data);
  }
  
  // Children as elements
  return React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { data });
    }
    return child;
  });
}

// Debug compound components
const TabsContext = createContext(null);

function Tabs({ children, defaultValue }) {
  const [value, setValue] = useState(defaultValue);
  
  const contextValue = useMemo(() => ({ value, setValue }), [value]);
  
  console.log('Tabs context value:', contextValue);
  console.log('Tabs children count:', React.Children.count(children));
  
  return (
    <TabsContext.Provider value={contextValue}>
      {children}
    </TabsContext.Provider>
  );
}

function Tab({ value, children }) {
  const context = useContext(TabsContext);
  
  if (!context) {
    console.error('Tab must be used within Tabs');
    return null;
  }
  
  console.log('Tab render:', { value, isActive: context.value === value });
  
  return (
    <button onClick={() => context.setValue(value)}>
      {children}
    </button>
  );
}

// Debug portal rendering
function Portal({ children }) {
  const [container, setContainer] = useState(null);
  
  useEffect(() => {
    const el = document.getElementById('portal-root');
    console.log('Portal container:', el);
    setContainer(el);
  }, []);
  
  if (!container) {
    console.log('Portal: waiting for container');
    return null;
  }
  
  return createPortal(children, container);
}`,
    tags: ['debugging', 'composition', 'props', 'children'],
    timeEstimate: 4
  },
  {
    id: 'dbg-29',
    category: 'Debugging',
    question: 'How do you debug memory leaks in React applications?',
    answer: `Memory leak detection and prevention:

Common causes:
1. Uncleared intervals/timeouts
2. Event listeners not removed
3. Subscriptions not unsubscribed
4. Stale closures in effects
5. Large objects in state

Detection tools:
- Chrome DevTools Memory tab
- React DevTools Profiler
- heap snapshots
- Performance monitor

Prevention:
- Always cleanup in useEffect
- Use AbortController for fetch
- Weak references when appropriate`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// Common memory leak patterns and fixes

// ❌ Memory leak: No cleanup
function BadComponent() {
  useEffect(() => {
    const interval = setInterval(() => {
      // This runs forever even after unmount
    }, 1000);
    // Missing cleanup!
  }, []);
}

// ✅ Fixed: Proper cleanup
function GoodComponent() {
  useEffect(() => {
    const interval = setInterval(() => {
      // Runs while mounted
    }, 1000);
    
    return () => clearInterval(interval); // Cleanup!
  }, []);
}

// ❌ Memory leak: Event listener not removed
function BadEventComponent() {
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    // No cleanup!
  }, []);
}

// ✅ Fixed: Event listener cleanup
function GoodEventComponent() {
  useEffect(() => {
    const handleResize = () => { /* ... */ };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
}

// ❌ Memory leak: Fetch without abort
function BadFetchComponent({ userId }) {
  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(setUser); // Might set state on unmounted component
  }, [userId]);
}

// ✅ Fixed: AbortController for fetch
function GoodFetchComponent({ userId }) {
  useEffect(() => {
    const controller = new AbortController();
    
    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then(res => res.json())
      .then(setUser)
      .catch(err => {
        if (err.name !== 'AbortError') throw err;
      });
    
    return () => controller.abort();
  }, [userId]);
}

// Debugging memory leaks with Chrome DevTools
// 1. Open DevTools → Memory tab
// 2. Take heap snapshot before interaction
// 3. Perform the leaky action
// 4. Take another snapshot
// 5. Compare snapshots to find retained objects

// Custom hook to detect memory leaks
function useIsMounted() {
  const isMounted = useRef(true);
  
  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);
  
  return isMounted;
}

function SafeAsyncComponent() {
  const isMounted = useIsMounted();
  
  const fetchData = async () => {
    const data = await api.getData();
    if (isMounted.current) {
      setData(data);
    }
  };
}`,
    tags: ['debugging', 'memory-leaks', 'performance', 'useEffect'],
    timeEstimate: 6
  },
  {
    id: 'dbg-30',
    category: 'Debugging',
    question: 'How do you debug Redux state and actions?',
    answer: `Redux debugging techniques:

Tools:
1. Redux DevTools Extension
   - Action history
   - State diff
   - Time-travel debugging
   - Action replay

2. Middleware logging
   - Custom logger
   - redux-logger

3. Error tracking
   - Middleware for error capture
   - Sentry integration

4. Testing
   - Reducer unit tests
   - Action creator tests`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// Redux DevTools setup
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

// Custom logger middleware
const loggerMiddleware = (store) => (next) => (action) => {
  console.group(action.type);
  console.log('dispatching:', action);
  console.log('prev state:', store.getState());
  
  const result = next(action);
  
  console.log('next state:', store.getState());
  console.groupEnd();
  
  return result;
};

// Error tracking middleware
const errorMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    console.error('Redux error:', error);
    Sentry.captureException(error, {
      extra: {
        action,
        state: store.getState(),
      },
    });
    throw error;
  }
};

// Debug specific actions
const actionDebugger = (store) => (next) => (action) => {
  if (action.type.includes('FETCH')) {
    console.log('API Action:', action);
    console.time(action.type);
  }
  
  const result = next(action);
  
  if (action.type.includes('FETCH')) {
    console.timeEnd(action.type);
  }
  
  return result;
};

// Configure store with debugging
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault().concat(
      loggerMiddleware,
      errorMiddleware,
      actionDebugger
    ),
});

// Debug selector performance
import { createSelectorCreator, lruMemoize } from '@reduxjs/toolkit';

const createDebugSelector = createSelectorCreator(lruMemoize, {
  resultEqualityCheck: (a, b) => {
    const isEqual = a === b;
    if (!isEqual) {
      console.log('Selector recomputed:', { prev: a, next: b });
    }
    return isEqual;
  },
});

// Debug component re-renders from Redux
function useWhyDidYouUpdate(name, props) {
  const previousProps = useRef();
  
  useEffect(() => {
    if (previousProps.current) {
      const changes = {};
      Object.keys({ ...previousProps.current, ...props }).forEach(key => {
        if (previousProps.current[key] !== props[key]) {
          changes[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });
      
      if (Object.keys(changes).length > 0) {
        console.log(\`[why-did-update] \${name}\`, changes);
      }
    }
    
    previousProps.current = props;
  });
}`,
    tags: ['debugging', 'redux', 'devtools', 'middleware'],
    timeEstimate: 5
  },
  {
    id: 'dbg-31',
    category: 'Debugging',
    question: 'How do you debug network requests in React applications?',
    answer: `Network debugging techniques:

Browser DevTools:
1. Network tab
   - Request/response inspection
   - Headers, payload, timing
   - Filter by type (XHR, Fetch)

2. Request interception
   - Modify requests/responses
   - Simulate errors

Tools:
- Chrome Network tab
- Postman/Insomnia
- Mock Service Worker (MSW)
- axios interceptors`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// Axios interceptor for debugging
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(\`🌐 Request: \${config.method?.toUpperCase()} \${config.url}\`);
    console.log('Headers:', config.headers);
    console.log('Data:', config.data);
    
    // Add timestamp for timing
    config.metadata = { startTime: Date.now() };
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.metadata.startTime;
    console.log(
      \`✅ Response: \${response.config.url} - \${response.status} (\${duration}ms)\`
    );
    console.log('Data:', response.data);
    return response;
  },
  (error) => {
    const duration = Date.now() - error.config?.metadata?.startTime;
    console.error(
      \`❌ Response error: \${error.config?.url} - \${error.response?.status} (\${duration}ms)\`
    );
    console.error('Error data:', error.response?.data);
    return Promise.reject(error);
  }
);

// Mock Service Worker for debugging
// src/mocks/handlers.js
import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  http.get('/api/users', async () => {
    // Simulate slow network
    await delay(2000);
    
    return HttpResponse.json([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ]);
  }),
  
  // Simulate error
  http.post('/api/users', () => {
    return HttpResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }),
];

// Debug hook for network requests
function useNetworkDebug() {
  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const [url, options] = args;
      console.log('Fetch:', { url, options });
      
      const start = performance.now();
      
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - start;
        console.log(\`Fetch complete: \${url} (\${duration.toFixed(2)}ms)\`);
        return response;
      } catch (error) {
        console.error(\`Fetch failed: \${url}\`, error);
        throw error;
      }
    };
    
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
}

// TanStack Query debugging
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        console.error('Query error:', error);
      },
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

// Enable devtools in development
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MyApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}`,
    tags: ['debugging', 'network', 'api', 'interceptors'],
    timeEstimate: 5
  },
  {
    id: 'dbg-32',
    category: 'Debugging',
    question: 'How do you debug TypeScript errors in React projects?',
    answer: `TypeScript debugging strategies:

Common errors:
1. Type mismatch
2. Missing properties
3. Null/undefined access
4. Generic constraints
5. Module not found

Debugging approach:
- Read error message carefully
- Check type definitions
- Use type assertions sparingly
- Hover for type info in IDE
- Use TypeScript playground`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// Common TypeScript errors and fixes

// Error: Property 'x' does not exist on type 'Y'
interface User {
  name: string;
  email: string;
}

function Component({ user }: { user: User }) {
  // ❌ Error: Property 'age' does not exist on type 'User'
  console.log(user.age);
  
  // ✅ Fix 1: Add property to interface
  // interface User { name: string; email: string; age?: number; }
  
  // ✅ Fix 2: Type guard
  if ('age' in user) {
    console.log(user.age);
  }
}

// Error: Object is possibly 'undefined'
function BadComponent({ user }: { user?: User }) {
  // ❌ Error: Object is possibly 'undefined'
  return <div>{user.name}</div>;
}

function GoodComponent({ user }: { user?: User }) {
  // ✅ Fix 1: Optional chaining
  return <div>{user?.name}</div>;
  
  // ✅ Fix 2: Early return
  if (!user) return null;
  return <div>{user.name}</div>;
  
  // ✅ Fix 3: Default value
  const { name = 'Anonymous' } = user ?? {};
  return <div>{name}</div>;
}

// Error: Type 'X' is not assignable to type 'Y'
type Status = 'pending' | 'success' | 'error';

function setStatus(status: Status) { /* ... */ }

// ❌ Error: Argument of type 'string' is not assignable
const status = 'pending'; // inferred as string
setStatus(status);

// ✅ Fix 1: const assertion
const status1 = 'pending' as const;
setStatus(status1);

// ✅ Fix 2: Explicit type
const status2: Status = 'pending';
setStatus(status2);

// Debug complex generics
// Use intermediate variables with explicit types
function debugGenerics<T extends { id: string }>(items: T[]) {
  // Hover over 'mapped' to see inferred type
  const mapped = items.map(item => item.id);
  
  // Force TypeScript to show type
  type ItemType = T;
  type IdType = T['id'];
  
  return mapped;
}

// Debug discriminated unions
type Action =
  | { type: 'ADD'; payload: string }
  | { type: 'REMOVE'; payload: number };

function reducer(action: Action) {
  switch (action.type) {
    case 'ADD':
      // TypeScript knows payload is string here
      console.log(action.payload.toUpperCase());
      break;
    case 'REMOVE':
      // TypeScript knows payload is number here
      console.log(action.payload.toFixed(2));
      break;
  }
}

// Debugging utility types
type Debug<T> = { [K in keyof T]: T[K] };
type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

// Usage: Hover over 'Expanded' to see full type
type Expanded = Expand<Pick<User, 'name'> & { age: number }>;`,
    tags: ['debugging', 'typescript', 'types', 'errors'],
    timeEstimate: 5
  },
  {
    id: 'dbg-33',
    category: 'Debugging',
    question: 'How do you use source maps for debugging production issues?',
    answer: `Source maps connect minified code to original source:

Setup:
1. Generate source maps in build
2. Upload to error tracking (Sentry)
3. Keep maps private (not public)

Best practices:
- Hidden source maps in production
- Upload to Sentry/error service
- Version source maps
- Use stable file hashes`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// next.config.js - Source map configuration
module.exports = {
  // Generate source maps in production
  productionBrowserSourceMaps: true,
  
  // Or use hidden source maps (recommended for security)
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.devtool = 'hidden-source-map';
    }
    return config;
  },
};

// Sentry configuration with source maps
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
});

// next.config.js with Sentry
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  // Your config
};

module.exports = withSentryConfig(nextConfig, {
  // Upload source maps to Sentry
  org: 'your-org',
  project: 'your-project',
  
  // Hide source maps from browser
  hideSourceMaps: true,
  
  // Disable source map upload in development
  disableClientWebpackPlugin: process.env.NODE_ENV === 'development',
});

// .sentryclirc
[auth]
token=your-auth-token

[defaults]
org=your-org
project=your-project

// GitHub Actions for source map upload
// .github/workflows/deploy.yml
- name: Upload source maps to Sentry
  run: |
    npx @sentry/cli releases new \${{ github.sha }}
    npx @sentry/cli releases files \${{ github.sha }} upload-sourcemaps .next --ext js --ext map
    npx @sentry/cli releases finalize \${{ github.sha }}
  env:
    SENTRY_AUTH_TOKEN: \${{ secrets.SENTRY_AUTH_TOKEN }}
    SENTRY_ORG: your-org
    SENTRY_PROJECT: your-project

// Debugging production errors with source maps
// When error occurs in minified code:
// main.abc123.js:1:12345 TypeError: Cannot read property 'x' of undefined

// With source maps, Sentry shows:
// components/UserProfile.tsx:42 TypeError: Cannot read property 'x' of undefined
// 
// Original code:
// 41: function UserProfile({ user }) {
// 42:   const name = user.profile.name; // <- Error here
// 43:   return <div>{name}</div>;
// 44: }

// Vercel source map upload
// vercel.json
{
  "build": {
    "env": {
      "SENTRY_ORG": "@my-org",
      "SENTRY_PROJECT": "my-project"
    }
  }
}`,
    tags: ['debugging', 'source-maps', 'production', 'sentry'],
    timeEstimate: 5
  },
  {
    id: 'dbg-34',
    category: 'Debugging',
    question: 'How do you debug async/await and Promise issues?',
    answer: `Async debugging techniques:

Common issues:
1. Unhandled rejections
2. Race conditions
3. Missing await
4. Infinite loops
5. Stale closures

Debugging tools:
- async stack traces
- Chrome DevTools async debugging
- Promise rejection handlers
- Console timing`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// Enable async stack traces
// Chrome DevTools → Settings → Enable async stack traces

// Debug unhandled Promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise rejection:', event.reason);
  console.error('Promise:', event.promise);
  
  // Optionally prevent default browser behavior
  event.preventDefault();
  
  // Report to error tracking
  Sentry.captureException(event.reason);
});

// Common async bugs and fixes

// ❌ Missing await - function returns before async completes
async function badFetch() {
  const data = fetchData(); // Missing await!
  console.log(data); // Logs Promise, not data
  return data;
}

// ✅ Fixed
async function goodFetch() {
  const data = await fetchData();
  console.log(data);
  return data;
}

// ❌ Stale closure in async effect
function BadComponent({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    async function fetchUser() {
      const data = await api.getUser(userId);
      // userId might have changed by now!
      setUser(data);
    }
    fetchUser();
  }, [userId]);
}

// ✅ Fixed with abort controller
function GoodComponent({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    
    async function fetchUser() {
      try {
        const data = await api.getUser(userId, { 
          signal: controller.signal 
        });
        setUser(data);
      } catch (err) {
        if (err.name !== 'AbortError') throw err;
      }
    }
    
    fetchUser();
    return () => controller.abort();
  }, [userId]);
}

// Debug async timing
async function debugAsyncTiming() {
  console.time('fetchUser');
  const user = await fetchUser();
  console.timeEnd('fetchUser');
  
  console.time('fetchPosts');
  const posts = await fetchPosts();
  console.timeEnd('fetchPosts');
}

// Debug race conditions
async function debugRaceCondition() {
  let requestId = 0;
  
  async function fetchWithId() {
    const myId = ++requestId;
    console.log(\`Starting request \${myId}\`);
    
    const data = await fetch('/api/data');
    
    console.log(\`Completed request \${myId}, current: \${requestId}\`);
    
    // Only use response if this is still the latest request
    if (myId === requestId) {
      return data;
    }
    console.log(\`Discarding stale response \${myId}\`);
  }
}

// Debug Promise.all failures
async function debugPromiseAll() {
  const results = await Promise.allSettled([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(\`Request \${index} succeeded:\`, result.value);
    } else {
      console.error(\`Request \${index} failed:\`, result.reason);
    }
  });
}`,
    tags: ['debugging', 'async', 'promises', 'race-conditions'],
    timeEstimate: 5
  },
  {
    id: 'dbg-35',
    category: 'Debugging',
    question: 'How do you debug CSS and styling issues in React?',
    answer: `CSS debugging techniques:

Browser DevTools:
1. Elements panel - inspect styles
2. Computed tab - final values
3. Changes tab - track modifications
4. Force element state (:hover, :focus)

Common issues:
- Specificity conflicts
- Missing cascade
- Z-index stacking
- Flexbox/Grid issues
- Responsive breakpoints`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// Debug CSS-in-JS (styled-components, Emotion)
import styled from 'styled-components';

const Button = styled.button\`
  /* Add debug outline */
  outline: 2px solid red !important;
  
  /* Log computed values */
  \${({ theme }) => console.log('Theme:', theme) || ''}
  
  background: \${props => {
    console.log('Button props:', props);
    return props.primary ? 'blue' : 'gray';
  }};
\`;

// Debug Tailwind classes
function DebugComponent() {
  return (
    <div className="debug-screens">
      {/* Shows current breakpoint */}
      <div className="fixed bottom-0 right-0 bg-black text-white p-2 z-50">
        <span className="sm:hidden">xs</span>
        <span className="hidden sm:inline md:hidden">sm</span>
        <span className="hidden md:inline lg:hidden">md</span>
        <span className="hidden lg:inline xl:hidden">lg</span>
        <span className="hidden xl:inline">xl</span>
      </div>
      
      {/* Debug borders for layout */}
      <div className="[&_*]:border [&_*]:border-red-500">
        <YourComponent />
      </div>
    </div>
  );
}

// Debug z-index stacking
function ZIndexDebugger() {
  useEffect(() => {
    const elements = document.querySelectorAll('*');
    const zIndexMap = new Map();
    
    elements.forEach(el => {
      const style = getComputedStyle(el);
      const zIndex = style.zIndex;
      
      if (zIndex !== 'auto') {
        zIndexMap.set(el, {
          zIndex: parseInt(zIndex),
          position: style.position,
          element: el.tagName + (el.className ? '.' + el.className : ''),
        });
      }
    });
    
    console.table(Array.from(zIndexMap.values()));
  }, []);
  
  return null;
}

// Debug CSS Modules
import styles from './Button.module.css';

function Button({ className }) {
  console.log('CSS Module classes:', styles);
  // Outputs: { button: 'Button_button__abc123', primary: 'Button_primary__def456' }
  
  const finalClassName = cn(styles.button, className);
  console.log('Final className:', finalClassName);
  
  return <button className={finalClassName} />;
}

// Debug responsive styles
function useMediaQueryDebug() {
  useEffect(() => {
    const queries = {
      sm: '(min-width: 640px)',
      md: '(min-width: 768px)',
      lg: '(min-width: 1024px)',
      xl: '(min-width: 1280px)',
    };
    
    Object.entries(queries).forEach(([name, query]) => {
      const mql = window.matchMedia(query);
      console.log(\`\${name}: \${mql.matches}\`);
      
      mql.addEventListener('change', (e) => {
        console.log(\`\${name} changed: \${e.matches}\`);
      });
    });
  }, []);
}

// Debug CSS Grid/Flexbox
const GridDebug = styled.div\`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  
  /* Debug grid lines */
  background: repeating-linear-gradient(
    to right,
    rgba(255, 0, 0, 0.1),
    rgba(255, 0, 0, 0.1) calc(33.33% - 0.5rem),
    transparent calc(33.33% - 0.5rem),
    transparent 33.33%
  );
\`;`,
    tags: ['debugging', 'css', 'styling', 'devtools'],
    timeEstimate: 5
  },
  {
    id: 'dbg-36',
    category: 'Debugging',
    question: 'How do you debug context and state management issues?',
    answer: `Context debugging strategies:

Common issues:
1. Missing provider
2. Stale context values
3. Unnecessary re-renders
4. Wrong provider nesting

Debugging tools:
- React DevTools
- Custom debug providers
- Render tracking
- Context logging`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// Debug provider - wraps context with logging
import { createContext, useContext, useMemo, useEffect } from 'react';

function createDebugContext(name) {
  const Context = createContext(undefined);
  
  function Provider({ children, value }) {
    useEffect(() => {
      console.log(\`[\${name}] Context value updated:\`, value);
    }, [value]);
    
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }
  
  function useDebugContext() {
    const context = useContext(Context);
    
    if (context === undefined) {
      console.error(\`[\${name}] useContext must be used within Provider\`);
      throw new Error(\`\${name} context is undefined. Did you forget to wrap with Provider?\`);
    }
    
    return context;
  }
  
  return { Provider, useContext: useDebugContext, Context };
}

// Usage
const { Provider: UserProvider, useContext: useUser } = createDebugContext('User');

// Debug context re-renders
const RenderCountContext = createContext(0);

function RenderCountProvider({ children }) {
  const renderCount = useRef(0);
  renderCount.current++;
  
  console.log(\`Provider rendered \${renderCount.current} times\`);
  
  return (
    <RenderCountContext.Provider value={renderCount.current}>
      {children}
    </RenderCountContext.Provider>
  );
}

// Debug consumer re-renders
function DebugConsumer({ children }) {
  const renderCount = useRef(0);
  const value = useContext(SomeContext);
  
  renderCount.current++;
  
  useEffect(() => {
    console.log('Consumer re-render due to context change:', {
      renderCount: renderCount.current,
      value,
    });
  }, [value]);
  
  return children;
}

// Debug context value changes
function DebugThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const previousTheme = useRef(theme);
  
  useEffect(() => {
    if (previousTheme.current !== theme) {
      console.log('Theme changed:', {
        from: previousTheme.current,
        to: theme,
      });
      previousTheme.current = theme;
    }
  }, [theme]);
  
  const value = useMemo(() => {
    console.log('Creating new context value object');
    return { theme, setTheme };
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Debug missing provider
function useStrictContext(Context, name) {
  const context = useContext(Context);
  
  if (context === null || context === undefined) {
    // Log component tree for debugging
    console.error(\`Missing \${name} Provider. Component tree:\`);
    
    // This will help identify where the issue is
    throw new Error(
      \`\${name} context is undefined. \` +
      \`Make sure you're rendering <\${name}Provider> at a higher level.\`
    );
  }
  
  return context;
}

// Zustand debugging
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set, get) => ({
      count: 0,
      increment: () => {
        console.log('Before increment:', get().count);
        set(
          { count: get().count + 1 },
          false, // replace
          'increment' // action name for devtools
        );
        console.log('After increment:', get().count);
      },
    }),
    { name: 'MyStore' }
  )
);`,
    tags: ['debugging', 'context', 'state-management', 'providers'],
    timeEstimate: 5
  },
  {
    id: 'dbg-37',
    category: 'Debugging',
    question: 'How do you debug Next.js specific issues?',
    answer: `Next.js debugging techniques:

Server-side debugging:
- Server console logs
- Node.js inspector
- Error overlay

Client-side:
- Browser DevTools
- React DevTools

Common issues:
- Hydration mismatches
- Server/client code mixing
- Build errors
- Routing issues`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// Enable Node.js inspector for server debugging
// package.json
{
  "scripts": {
    "dev:debug": "NODE_OPTIONS='--inspect' next dev"
  }
}
// Then open chrome://inspect in Chrome

// Debug hydration mismatches
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

// Find hydration issues
function DebugHydration() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <div>Server render</div>;
  }
  
  return <div>Client render</div>;
}

// Debug server vs client rendering
function DebugRenderLocation() {
  const isServer = typeof window === 'undefined';
  
  console.log(\`Rendering on: \${isServer ? 'server' : 'client'}\`);
  
  // This will cause hydration mismatch if different!
  return <div>{isServer ? 'Server' : 'Client'}</div>;
}

// Debug API routes
// app/api/debug/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('Request URL:', request.url);
  console.log('Headers:', Object.fromEntries(request.headers));
  console.log('Search params:', Object.fromEntries(request.nextUrl.searchParams));
  
  return NextResponse.json({
    method: request.method,
    url: request.url,
    timestamp: new Date().toISOString(),
  });
}

// Debug middleware
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('Middleware:', {
    pathname: request.nextUrl.pathname,
    method: request.method,
    cookies: request.cookies.getAll(),
  });
  
  const response = NextResponse.next();
  
  // Add debug header
  response.headers.set('X-Debug-Pathname', request.nextUrl.pathname);
  
  return response;
}

// Debug Server Components
async function DebugServerComponent() {
  console.log('Server Component rendering');
  console.log('Environment:', process.env.NODE_ENV);
  
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 },
  });
  
  console.log('Fetch status:', data.status);
  
  return <div>...</div>;
}

// Debug build issues
// next.config.js
module.exports = {
  // Show more detailed build output
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  
  // Analyze bundle
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      );
    }
    return config;
  },
};`,
    tags: ['debugging', 'next.js', 'ssr', 'hydration'],
    timeEstimate: 6
  },
  {
    id: 'dbg-38',
    category: 'Debugging',
    question: 'How do you debug form validation issues?',
    answer: `Form debugging techniques:

Common issues:
1. Validation not triggering
2. Error messages not showing
3. Form state not updating
4. Submit not working

Tools:
- React Hook Form DevTools
- Console logging
- Form state inspection
- Network tab for submissions`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// React Hook Form debugging
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

function DebugForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty, touchedFields },
    control,
  } = useForm({
    mode: 'onChange', // Debug validation on every change
  });
  
  // Watch all form values
  const watchAll = watch();
  console.log('Form values:', watchAll);
  console.log('Errors:', errors);
  console.log('Touched fields:', touchedFields);
  console.log('Is dirty:', isDirty);
  
  const onSubmit = (data) => {
    console.log('Form submitted:', data);
  };
  
  const onError = (errors) => {
    console.error('Form errors:', errors);
  };
  
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <input {...register('email', { required: 'Email is required' })} />
        {errors.email && <span>{errors.email.message}</span>}
        
        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>
      </form>
      
      {/* React Hook Form DevTools */}
      <DevTool control={control} />
    </>
  );
}

// Debug Zod validation
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function debugZodValidation(data) {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    console.error('Validation failed:');
    console.error('Issues:', result.error.issues);
    console.error('Formatted:', result.error.format());
    console.error('Flattened:', result.error.flatten());
    return null;
  }
  
  console.log('Validation passed:', result.data);
  return result.data;
}

// Debug form submission
async function debugFormSubmit(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  
  console.log('Form data:', data);
  console.log('Form validity:', event.target.checkValidity());
  
  // Check each field
  Array.from(event.target.elements).forEach((element) => {
    if (element.name) {
      console.log(\`\${element.name}:\`, {
        value: element.value,
        valid: element.validity.valid,
        errors: {
          valueMissing: element.validity.valueMissing,
          typeMismatch: element.validity.typeMismatch,
          patternMismatch: element.validity.patternMismatch,
          tooShort: element.validity.tooShort,
        },
      });
    }
  });
}

// Debug controlled vs uncontrolled
function DebugControlledForm() {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  
  useEffect(() => {
    console.log('Controlled value:', value);
    console.log('DOM value:', inputRef.current?.value);
    console.log('Match:', value === inputRef.current?.value);
  }, [value]);
  
  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

// Server Action form debugging
async function debugServerAction(formData: FormData) {
  'use server';
  
  console.log('Server Action received:');
  for (const [key, value] of formData.entries()) {
    console.log(\`  \${key}: \${value}\`);
  }
  
  // Validate
  const result = schema.safeParse(Object.fromEntries(formData));
  console.log('Validation result:', result);
}`,
    tags: ['debugging', 'forms', 'validation', 'react-hook-form'],
    timeEstimate: 5
  },
  {
    id: 'dbg-39',
    category: 'Debugging',
    question: 'How do you debug accessibility (a11y) issues in React?',
    answer: `Accessibility debugging tools:

Automated testing:
- axe DevTools
- Lighthouse
- eslint-plugin-jsx-a11y

Manual testing:
- Screen reader testing
- Keyboard navigation
- Focus management
- Color contrast

React-specific:
- ARIA attributes
- Semantic HTML
- Focus traps`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// Install and configure eslint-plugin-jsx-a11y
// .eslintrc.js
module.exports = {
  extends: ['plugin:jsx-a11y/recommended'],
  rules: {
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/no-static-element-interactions': 'error',
  },
};

// Debug focus management
function useFocusDebug() {
  useEffect(() => {
    const handleFocus = (e) => {
      console.log('Focus:', {
        element: e.target,
        tagName: e.target.tagName,
        role: e.target.getAttribute('role'),
        ariaLabel: e.target.getAttribute('aria-label'),
        tabIndex: e.target.tabIndex,
      });
    };
    
    document.addEventListener('focusin', handleFocus);
    return () => document.removeEventListener('focusin', handleFocus);
  }, []);
}

// Debug keyboard navigation
function useKeyboardDebug() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        console.log('Tab navigation:', {
          from: document.activeElement,
          shiftKey: e.shiftKey,
        });
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}

// Axe DevTools in React
import { useEffect } from 'react';

function AxeDebugger() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      import('@axe-core/react').then(({ default: axe }) => {
        import('react-dom').then((ReactDOM) => {
          axe(React, ReactDOM, 1000);
        });
      });
    }
  }, []);
  
  return null;
}

// Debug ARIA attributes
function DebugAriaComponent({ id, label, expanded }) {
  console.log('ARIA attributes:', {
    'aria-labelledby': id,
    'aria-label': label,
    'aria-expanded': expanded,
  });
  
  return (
    <div
      role="button"
      aria-labelledby={id}
      aria-label={label}
      aria-expanded={expanded}
      tabIndex={0}
    >
      Content
    </div>
  );
}

// Debug focus trap
import { FocusTrap } from 'focus-trap-react';

function DebugModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened - focus should be trapped');
      console.log('Active element:', document.activeElement);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <FocusTrap
      focusTrapOptions={{
        onActivate: () => console.log('Focus trap activated'),
        onDeactivate: () => console.log('Focus trap deactivated'),
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">Modal Title</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </FocusTrap>
  );
}

// Lighthouse in CI
// In package.json scripts
{
  "scripts": {
    "lighthouse": "lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json --chrome-flags='--headless'"
  }
}

// Check Lighthouse results
const report = require('./lighthouse-report.json');
console.log('Accessibility score:', report.categories.accessibility.score * 100);
report.categories.accessibility.auditRefs.forEach(ref => {
  const audit = report.audits[ref.id];
  if (audit.score !== 1) {
    console.log(\`Issue: \${audit.title}\`);
    console.log(\`  \${audit.description}\`);
  }
});`,
    tags: ['debugging', 'accessibility', 'a11y', 'aria'],
    timeEstimate: 5
  },
  {
    id: 'dbg-40',
    category: 'Debugging',
    question: 'How do you debug React Testing Library tests?',
    answer: `Test debugging strategies:

Tools:
- screen.debug()
- prettyDOM
- testing-playground
- logRoles

Common issues:
- Element not found
- Timing issues
- Async operations
- Event handling`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Debug with screen.debug()
test('debug component output', () => {
  render(<MyComponent />);
  
  // Print entire DOM
  screen.debug();
  
  // Print specific element
  screen.debug(screen.getByRole('button'));
  
  // Print with custom options
  screen.debug(undefined, Infinity); // No truncation
});

// Debug with logRoles
import { logRoles } from '@testing-library/dom';

test('debug roles', () => {
  const { container } = render(<MyComponent />);
  
  logRoles(container);
  // Outputs all accessible roles in the container
});

// Debug element queries
test('find element', () => {
  render(<Form />);
  
  // Can't find element? Try different queries
  console.log(screen.queryByRole('textbox')); // Returns null if not found
  console.log(screen.queryByLabelText('Email'));
  console.log(screen.queryByPlaceholderText('Enter email'));
  console.log(screen.queryByTestId('email-input'));
  
  // Use testing-playground to find best query
  // screen.logTestingPlaygroundURL();
});

// Debug async operations
test('async operation', async () => {
  render(<AsyncComponent />);
  
  // Debug before async
  screen.debug();
  
  // Wait for element
  const element = await screen.findByText('Loaded');
  
  // Debug after async
  screen.debug();
  
  expect(element).toBeInTheDocument();
});

// Debug timing issues
test('timing issue', async () => {
  render(<SlowComponent />);
  
  // Increase timeout for slow operations
  await waitFor(
    () => {
      console.log('Checking for element...');
      expect(screen.getByText('Done')).toBeInTheDocument();
    },
    { timeout: 5000 }
  );
});

// Debug user events
test('user interaction', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  
  render(<Button onClick={onClick} />);
  
  const button = screen.getByRole('button');
  console.log('Button found:', button);
  console.log('Button disabled:', button.disabled);
  
  await user.click(button);
  
  console.log('onClick called:', onClick.mock.calls.length);
  expect(onClick).toHaveBeenCalled();
});

// Debug form submissions
test('form submission', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  
  render(<Form onSubmit={onSubmit} />);
  
  const emailInput = screen.getByLabelText('Email');
  console.log('Input value before:', emailInput.value);
  
  await user.type(emailInput, 'test@example.com');
  console.log('Input value after:', emailInput.value);
  
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  
  console.log('onSubmit calls:', onSubmit.mock.calls);
});

// Debug with prettyDOM
import { prettyDOM } from '@testing-library/dom';

test('custom debug output', () => {
  const { container } = render(<MyComponent />);
  
  // Get formatted DOM string
  const domString = prettyDOM(container, Infinity, {
    highlight: true,
  });
  
  console.log(domString);
});

// Debug MSW integration
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/api/user', () => {
    console.log('MSW: Intercepted /api/user');
    return HttpResponse.json({ name: 'John' });
  })
);

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());`,
    tags: ['debugging', 'testing', 'react-testing-library', 'jest'],
    timeEstimate: 5
  },
  {
    id: 'dbg-41',
    category: 'Debugging',
    question: 'How do you debug React Native applications?',
    answer: `React Native debugging tools:

Development:
- React Native Debugger
- Flipper
- Chrome DevTools
- VS Code debugger

Specific tools:
- Metro bundler logs
- Native logs (Xcode/Android Studio)
- Network inspector
- Layout inspector`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// Enable debugging in React Native
// Shake device or Cmd+D (iOS) / Cmd+M (Android)
// Select "Debug with Chrome"

// Console logging
console.log('Debug message');
console.warn('Warning message');
console.error('Error message');

// Remote debugging setup
// metro.config.js
module.exports = {
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx'],
  },
  server: {
    port: 8081,
  },
};

// Debug network requests with Flipper
// No code needed - Flipper auto-intercepts

// Debug with React Native Debugger
// Install: brew install --cask react-native-debugger
// Launch before running app

// Debug layouts
import { View, StyleSheet } from 'react-native';

function DebugLayout({ children }) {
  return (
    <View style={[styles.container, __DEV__ && styles.debug]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  debug: {
    borderWidth: 1,
    borderColor: 'red',
  },
});

// Debug performance
import { PerformanceObserver } from 'react-native';

if (__DEV__) {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log(\`\${entry.name}: \${entry.duration}ms\`);
    });
  });
  observer.observe({ entryTypes: ['measure'] });
}

// Debug native module issues
import { NativeModules, Platform } from 'react-native';

console.log('Native modules:', Object.keys(NativeModules));
console.log('Platform:', Platform.OS, Platform.Version);

// Debug async storage
import AsyncStorage from '@react-native-async-storage/async-storage';

async function debugStorage() {
  const keys = await AsyncStorage.getAllKeys();
  console.log('Storage keys:', keys);
  
  for (const key of keys) {
    const value = await AsyncStorage.getItem(key);
    console.log(\`\${key}:\`, value);
  }
}

// Debug navigation state
import { useNavigationState } from '@react-navigation/native';

function DebugNavigation() {
  const state = useNavigationState(state => state);
  
  console.log('Navigation state:', JSON.stringify(state, null, 2));
  
  return null;
}

// Logging utility for React Native
const logger = {
  log: (...args) => {
    if (__DEV__) {
      console.log('[APP]', ...args);
    }
  },
  error: (...args) => {
    console.error('[APP ERROR]', ...args);
    // Also send to crash reporting
    crashlytics().recordError(new Error(args.join(' ')));
  },
  network: (method, url, status) => {
    if (__DEV__) {
      console.log(\`[NET] \${method} \${url} -> \${status}\`);
    }
  },
};

// Debug gesture handlers
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';

function DebugGesture() {
  const pan = Gesture.Pan()
    .onStart((e) => {
      console.log('Pan start:', e);
    })
    .onUpdate((e) => {
      console.log('Pan update:', e.translationX, e.translationY);
    })
    .onEnd((e) => {
      console.log('Pan end:', e);
    });
  
  return (
    <GestureDetector gesture={pan}>
      <View style={{ width: 100, height: 100, backgroundColor: 'blue' }} />
    </GestureDetector>
  );
}`,
    tags: ['debugging', 'react-native', 'mobile', 'flipper'],
    timeEstimate: 6
  },
  {
    id: 'dbg-42',
    category: 'Debugging',
    question: 'How do you debug build and deployment issues?',
    answer: `Build debugging strategies:

Common issues:
1. Dependency conflicts
2. Environment variables
3. Build size
4. TypeScript errors
5. Module resolution

Tools:
- Build logs
- Bundle analyzer
- Source maps
- CI/CD logs`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// Debug build with verbose output
// package.json
{
  "scripts": {
    "build:debug": "NEXT_TELEMETRY_DISABLED=1 next build --debug"
  }
}

// Debug TypeScript build
// tsconfig.json
{
  "compilerOptions": {
    "extendedDiagnostics": true,
    "listFiles": true,
    "traceResolution": true
  }
}

// Debug bundle size
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // config
});

// Run: ANALYZE=true npm run build

// Debug environment variables
console.log('Build environment:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NEXT_PUBLIC vars:', Object.keys(process.env)
  .filter(key => key.startsWith('NEXT_PUBLIC_'))
);

// Debug dependency issues
// package.json
{
  "scripts": {
    "deps:check": "npm ls",
    "deps:duplicates": "npm dedupe --dry-run",
    "deps:outdated": "npm outdated"
  }
}

// Debug Webpack configuration
// next.config.js
module.exports = {
  webpack: (config, { buildId, dev, isServer }) => {
    console.log('Webpack config:', {
      buildId,
      dev,
      isServer,
      mode: config.mode,
      entry: Object.keys(config.entry),
    });
    
    // Debug specific module resolution
    config.resolve.plugins.push({
      apply: (resolver) => {
        resolver.hooks.resolve.tapAsync('DebugPlugin', (request, context, callback) => {
          if (request.request?.includes('problematic-module')) {
            console.log('Resolving:', request);
          }
          callback();
        });
      },
    });
    
    return config;
  },
};

// Debug CI/CD build
// .github/workflows/build.yml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Debug environment
        run: |
          echo "Node version: $(node -v)"
          echo "NPM version: $(npm -v)"
          echo "Working directory: $(pwd)"
          echo "Files: $(ls -la)"
          
      - name: Install dependencies
        run: npm ci --verbose
        
      - name: Build with debug output
        run: npm run build 2>&1 | tee build.log
        env:
          DEBUG: '*'
          
      - name: Upload build logs
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: build-logs
          path: build.log

// Debug Vercel deployment
// vercel.json
{
  "build": {
    "env": {
      "DEBUG": "true",
      "NEXT_DEBUG_BUILD": "true"
    }
  }
}

// Debug deployment errors
// Add to next.config.js
module.exports = {
  output: 'standalone',
  
  generateBuildId: async () => {
    const buildId = process.env.VERCEL_GIT_COMMIT_SHA || 'development';
    console.log('Build ID:', buildId);
    return buildId;
  },
  
  onError: (error) => {
    console.error('Build error:', error);
  },
};`,
    tags: ['debugging', 'build', 'deployment', 'ci-cd'],
    timeEstimate: 6
  },
  {
    id: 'dbg-43',
    category: 'Debugging',
    question: 'How do you debug infinite loops and maximum update depth errors?',
    answer: `Infinite loop debugging:

Common causes:
1. useEffect with changing deps
2. setState in render
3. Object/array deps not memoized
4. Circular state updates

Detection:
- "Maximum update depth exceeded"
- Browser freezing
- Console spam

Fixes:
- Review effect dependencies
- Memoize objects/functions
- Add conditional checks`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// ❌ Infinite loop: Object dependency changes every render
function BadComponent({ userId }) {
  const [user, setUser] = useState(null);
  
  // This runs on every render because config is new object each time
  const config = { id: userId };
  
  useEffect(() => {
    fetchUser(config).then(setUser);
  }, [config]); // config changes every render!
}

// ✅ Fixed: Memoize the object
function GoodComponent({ userId }) {
  const [user, setUser] = useState(null);
  
  const config = useMemo(() => ({ id: userId }), [userId]);
  
  useEffect(() => {
    fetchUser(config).then(setUser);
  }, [config]);
}

// ❌ Infinite loop: setState in effect without proper deps
function BadCounter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // This runs, updates count, triggers effect, updates count...
    setCount(count + 1);
  }, [count]);
}

// ✅ Fixed: Use functional update or remove dep
function GoodCounter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1); // Functional update
    }, 1000);
    return () => clearInterval(interval);
  }, []); // No dependency on count
}

// ❌ Infinite loop: setState in render
function BadRender() {
  const [data, setData] = useState([]);
  
  // This causes infinite loop!
  if (data.length === 0) {
    setData(['item']);
  }
  
  return <div>{data.length}</div>;
}

// ✅ Fixed: Move to effect or event handler
function GoodRender() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    if (data.length === 0) {
      setData(['item']);
    }
  }, []); // Only run once
  
  return <div>{data.length}</div>;
}

// Debug tool: Render counter
function useRenderCount(name) {
  const count = useRef(0);
  count.current++;
  
  useEffect(() => {
    console.log(\`[\${name}] Render #\${count.current}\`);
    
    if (count.current > 50) {
      console.error(\`[\${name}] Possible infinite loop detected!\`);
    }
  });
}

// Debug tool: Effect tracker
function useEffectDebug(effect, deps, name) {
  const renderCount = useRef(0);
  const prevDeps = useRef(deps);
  
  renderCount.current++;
  
  useEffect(() => {
    console.log(\`[\${name}] Effect running (render #\${renderCount.current})\`);
    
    // Log which deps changed
    if (prevDeps.current) {
      deps.forEach((dep, i) => {
        if (dep !== prevDeps.current[i]) {
          console.log(\`[\${name}] Dep \${i} changed:\`, {
            from: prevDeps.current[i],
            to: dep,
          });
        }
      });
    }
    
    prevDeps.current = deps;
    
    return effect();
  }, deps);
}

// Usage
function MyComponent({ userId }) {
  useEffectDebug(
    () => {
      fetchUser(userId);
    },
    [userId],
    'fetchUser'
  );
}

// Detect circular updates
function useCircularUpdateDetection() {
  const updates = useRef([]);
  
  return (source) => {
    const now = Date.now();
    updates.current.push({ source, time: now });
    
    // Keep only last second
    updates.current = updates.current.filter(u => now - u.time < 1000);
    
    if (updates.current.length > 100) {
      console.error('Circular update detected!', 
        updates.current.map(u => u.source)
      );
    }
  };
}`,
    tags: ['debugging', 'infinite-loops', 'useEffect', 'performance'],
    timeEstimate: 5
  },
  {
    id: 'dbg-44',
    category: 'Debugging',
    question: 'How do you debug ref and DOM manipulation issues?',
    answer: `Ref debugging techniques:

Common issues:
1. Ref is null on first render
2. Ref not updating
3. ForwardRef not working
4. Multiple refs

Best practices:
- Check ref timing
- Use callback refs
- Debug with useEffect
- Verify forwardRef setup`,
    difficulty: 'intermediate',
    type: 'debugging',
    codeExample: `// Debug ref timing
function DebugRef() {
  const ref = useRef(null);
  
  // ❌ Ref is null during render
  console.log('During render:', ref.current); // null
  
  // ✅ Ref is set after mount
  useEffect(() => {
    console.log('After mount:', ref.current); // HTMLElement
  }, []);
  
  return <div ref={ref}>Content</div>;
}

// Debug callback refs
function DebugCallbackRef() {
  const setRef = useCallback((node) => {
    console.log('Callback ref called:', {
      node,
      isNull: node === null,
    });
    
    if (node) {
      console.log('Node dimensions:', {
        width: node.offsetWidth,
        height: node.offsetHeight,
      });
    }
  }, []);
  
  return <div ref={setRef}>Content</div>;
}

// Debug forwardRef
const DebugForwardRef = forwardRef(function DebugForwardRef(props, ref) {
  console.log('ForwardRef received:', {
    ref,
    refType: typeof ref,
    isFunction: typeof ref === 'function',
    isObject: typeof ref === 'object',
  });
  
  return <input ref={ref} {...props} />;
});

// Parent using forwardRef
function Parent() {
  const inputRef = useRef(null);
  
  useEffect(() => {
    console.log('Parent ref:', inputRef.current);
  }, []);
  
  return <DebugForwardRef ref={inputRef} />;
}

// Debug ref with multiple elements
function DebugMultipleRefs() {
  const refs = useRef({});
  
  const setRef = (id) => (node) => {
    console.log(\`Setting ref for \${id}:\`, node);
    refs.current[id] = node;
  };
  
  useEffect(() => {
    console.log('All refs:', refs.current);
  }, []);
  
  return (
    <div>
      {['a', 'b', 'c'].map(id => (
        <div key={id} ref={setRef(id)}>
          Item {id}
        </div>
      ))}
    </div>
  );
}

// Debug imperative handle
const DebugImperative = forwardRef(function DebugImperative(props, ref) {
  const inputRef = useRef(null);
  
  useImperativeHandle(ref, () => {
    const handle = {
      focus: () => {
        console.log('Imperative focus called');
        inputRef.current?.focus();
      },
      getValue: () => {
        console.log('Imperative getValue called');
        return inputRef.current?.value;
      },
    };
    
    console.log('Created imperative handle:', Object.keys(handle));
    return handle;
  }, []);
  
  return <input ref={inputRef} {...props} />;
});

// Debug DOM mutations
function DebugDOMMutations() {
  const ref = useRef(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        console.log('DOM mutation:', {
          type: mutation.type,
          target: mutation.target,
          addedNodes: Array.from(mutation.addedNodes),
          removedNodes: Array.from(mutation.removedNodes),
          attributeName: mutation.attributeName,
          oldValue: mutation.oldValue,
        });
      });
    });
    
    observer.observe(ref.current, {
      childList: true,
      attributes: true,
      subtree: true,
      attributeOldValue: true,
    });
    
    return () => observer.disconnect();
  }, []);
  
  return <div ref={ref}>Watch me</div>;
}`,
    tags: ['debugging', 'refs', 'dom', 'forwardRef'],
    timeEstimate: 5
  },
  {
    id: 'dbg-45',
    category: 'Debugging',
    question: 'How do you debug third-party library integration issues?',
    answer: `Third-party debugging strategies:

Common issues:
1. Version mismatches
2. SSR compatibility
3. Peer dependencies
4. Type definitions

Debugging steps:
- Check library docs/issues
- Verify versions
- Test in isolation
- Check bundle size
- Review changelogs`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// Debug library loading
function DebugLibraryLoading() {
  useEffect(() => {
    console.log('Library loaded:', {
      react: React.version,
      // Check if library is available
      someLibrary: typeof SomeLibrary !== 'undefined',
    });
  }, []);
}

// Debug SSR issues with dynamic import
import dynamic from 'next/dynamic';

const ClientOnlyLibrary = dynamic(
  () => import('client-only-library').then(mod => {
    console.log('Library loaded dynamically:', mod);
    return mod.default;
  }),
  { 
    ssr: false,
    loading: () => {
      console.log('Loading client-only library...');
      return <div>Loading...</div>;
    },
  }
);

// Debug peer dependency issues
// Run: npm ls react
// Check for multiple React versions

// Debug type mismatches
// @ts-expect-error - Temporary workaround for library type issue
const result = libraryFunction(someValue);

// Wrap library with error boundary
function LibraryWrapper({ children }) {
  return (
    <ErrorBoundary
      fallback={<div>Library crashed</div>}
      onError={(error) => {
        console.error('Library error:', error);
        console.log('Library version:', LibraryModule.version);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Debug library configuration
function DebugLibraryConfig() {
  useEffect(() => {
    // Log configuration
    console.log('Library config:', {
      defaults: Library.defaults,
      options: Library.options,
      version: Library.version,
    });
    
    // Check for required setup
    if (!Library.initialized) {
      console.error('Library not initialized! Call Library.init() first.');
    }
  }, []);
}

// Debug bundle inclusion
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  webpack: (config) => {
    // Log which libraries are being bundled
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.done.tap('BundleDebug', (stats) => {
          const modules = stats.toJson({ modules: true }).modules;
          const libModules = modules.filter(m => 
            m.name.includes('node_modules/some-library')
          );
          console.log('Library modules in bundle:', libModules.length);
        });
      },
    });
    return config;
  },
});

// Debug library initialization
class LibraryDebugger {
  static init(options) {
    console.log('Initializing library with options:', options);
    
    try {
      Library.init(options);
      console.log('Library initialized successfully');
    } catch (error) {
      console.error('Library initialization failed:', error);
      console.log('Required options:', Library.requiredOptions);
      throw error;
    }
  }
}

// Check for conflicting versions
function checkDependencyConflicts() {
  const deps = require('./package.json').dependencies;
  const peerDeps = require('./node_modules/some-library/package.json').peerDependencies;
  
  Object.entries(peerDeps).forEach(([pkg, version]) => {
    if (deps[pkg] && !semver.satisfies(deps[pkg], version)) {
      console.warn(\`Peer dependency conflict: \${pkg}\`);
      console.warn(\`  Required: \${version}\`);
      console.warn(\`  Installed: \${deps[pkg]}\`);
    }
  });
}`,
    tags: ['debugging', 'libraries', 'dependencies', 'ssr'],
    timeEstimate: 5
  },
  {
    id: 'dbg-46',
    category: 'Debugging',
    question: 'How do you set up error monitoring and alerting in production?',
    answer: `Production error monitoring:

Tools:
- Sentry
- LogRocket
- Datadog
- New Relic

Setup includes:
- Error capture
- User context
- Performance monitoring
- Alerting rules
- Source maps`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// Sentry setup for Next.js
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Performance monitoring
  tracesSampleRate: 0.1,
  
  // Session replay for debugging
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Filter errors
  beforeSend(event, hint) {
    // Ignore specific errors
    if (event.message?.includes('ResizeObserver')) {
      return null;
    }
    
    // Add extra context
    event.extra = {
      ...event.extra,
      localStorage: Object.keys(localStorage),
    };
    
    return event;
  },
  
  // Environment
  environment: process.env.NODE_ENV,
});

// Set user context
export function setUserContext(user) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
}

// Custom error boundary with Sentry
class SentryErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      scope.setTag('errorBoundary', true);
      scope.setExtras(errorInfo);
      Sentry.captureException(error);
    });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong</h2>
          <button onClick={() => Sentry.showReportDialog()}>
            Report feedback
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Track custom events
function trackFeatureUsage(feature, metadata) {
  Sentry.addBreadcrumb({
    category: 'feature',
    message: \`Used \${feature}\`,
    level: 'info',
    data: metadata,
  });
}

// Performance monitoring
function trackPerformance(name, fn) {
  return Sentry.startSpan({ name }, async (span) => {
    try {
      const result = await fn();
      span.setStatus('ok');
      return result;
    } catch (error) {
      span.setStatus('internal_error');
      throw error;
    }
  });
}

// API route error handling
// app/api/example/route.ts
import * as Sentry from '@sentry/nextjs';

export async function GET(request) {
  try {
    // Your logic
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        url: request.url,
        method: request.method,
      },
    });
    
    return new Response('Internal error', { status: 500 });
  }
}

// Alerting configuration (Sentry dashboard or API)
const alertRules = {
  // Alert on high error rate
  highErrorRate: {
    conditions: [
      { type: 'event_frequency', value: 100, interval: '1h' }
    ],
    actions: [
      { type: 'slack', channel: '#alerts' },
      { type: 'email', target: 'team@example.com' }
    ]
  },
  
  // Alert on specific error
  criticalError: {
    conditions: [
      { type: 'event_attribute', key: 'level', value: 'fatal' }
    ],
    actions: [
      { type: 'pagerduty' }
    ]
  }
};`,
    tags: ['debugging', 'monitoring', 'sentry', 'production'],
    timeEstimate: 6
  },
  {
    id: 'dbg-47',
    category: 'Debugging',
    question: 'How do you debug WebSocket and real-time connection issues?',
    answer: `WebSocket debugging:

Common issues:
1. Connection failures
2. Message delivery
3. Reconnection logic
4. State synchronization

Tools:
- Browser DevTools Network tab
- WebSocket frames inspection
- Server logs
- Custom logging`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// Debug WebSocket connection
function useWebSocketDebug(url) {
  const [state, setState] = useState('connecting');
  const ws = useRef(null);
  const messageLog = useRef([]);
  
  useEffect(() => {
    console.log('[WS] Connecting to:', url);
    
    ws.current = new WebSocket(url);
    
    ws.current.onopen = () => {
      console.log('[WS] Connected');
      console.log('[WS] Protocol:', ws.current.protocol);
      console.log('[WS] ReadyState:', ws.current.readyState);
      setState('connected');
    };
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('[WS] Message received:', data);
      messageLog.current.push({
        type: 'received',
        data,
        timestamp: Date.now(),
      });
    };
    
    ws.current.onerror = (error) => {
      console.error('[WS] Error:', error);
      setState('error');
    };
    
    ws.current.onclose = (event) => {
      console.log('[WS] Closed:', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });
      setState('disconnected');
    };
    
    return () => {
      console.log('[WS] Cleanup');
      ws.current?.close();
    };
  }, [url]);
  
  const send = useCallback((data) => {
    console.log('[WS] Sending:', data);
    messageLog.current.push({
      type: 'sent',
      data,
      timestamp: Date.now(),
    });
    ws.current?.send(JSON.stringify(data));
  }, []);
  
  return { state, send, messageLog: messageLog.current };
}

// Debug Socket.io
import { io } from 'socket.io-client';

function useSocketDebug() {
  useEffect(() => {
    const socket = io({
      transports: ['websocket', 'polling'],
      reconnection: true,
    });
    
    // Connection events
    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id);
      console.log('[Socket] Transport:', socket.io.engine.transport.name);
    });
    
    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
      console.log('[Socket] Description:', error.description);
    });
    
    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });
    
    socket.on('reconnect_attempt', (attempt) => {
      console.log('[Socket] Reconnect attempt:', attempt);
    });
    
    socket.on('reconnect', (attempt) => {
      console.log('[Socket] Reconnected after', attempt, 'attempts');
    });
    
    // Debug all events
    socket.onAny((event, ...args) => {
      console.log('[Socket] Event:', event, args);
    });
    
    // Ping/pong for connection health
    const pingInterval = setInterval(() => {
      const start = Date.now();
      socket.emit('ping', () => {
        console.log('[Socket] Latency:', Date.now() - start, 'ms');
      });
    }, 10000);
    
    return () => {
      clearInterval(pingInterval);
      socket.disconnect();
    };
  }, []);
}

// Debug message queue and delivery
class MessageQueueDebugger {
  private queue = [];
  private delivered = new Set();
  
  enqueue(message) {
    const id = crypto.randomUUID();
    this.queue.push({ id, message, timestamp: Date.now() });
    console.log('[Queue] Enqueued:', id, message);
    return id;
  }
  
  acknowledge(id) {
    this.delivered.add(id);
    console.log('[Queue] Acknowledged:', id);
    console.log('[Queue] Pending:', this.getPending().length);
  }
  
  getPending() {
    return this.queue.filter(m => !this.delivered.has(m.id));
  }
  
  getStats() {
    return {
      total: this.queue.length,
      delivered: this.delivered.size,
      pending: this.getPending().length,
      oldestPending: this.getPending()[0]?.timestamp,
    };
  }
}

// Debug state synchronization
function useStateSyncDebug(serverState) {
  const localState = useRef(null);
  const conflicts = useRef([]);
  
  useEffect(() => {
    if (localState.current && localState.current !== serverState) {
      console.warn('[Sync] State conflict:', {
        local: localState.current,
        server: serverState,
      });
      conflicts.current.push({
        local: localState.current,
        server: serverState,
        timestamp: Date.now(),
      });
    }
    
    localState.current = serverState;
    console.log('[Sync] State updated:', serverState);
  }, [serverState]);
  
  return { conflicts: conflicts.current };
}`,
    tags: ['debugging', 'websocket', 'real-time', 'socket.io'],
    timeEstimate: 6
  },
  {
    id: 'dbg-48',
    category: 'Debugging',
    question: 'How do you create custom debugging utilities for your React app?',
    answer: `Custom debugging utilities:

Types:
1. Debug hooks
2. Debug components
3. Debug overlays
4. Performance monitors

Features:
- Conditional activation
- Zero production overhead
- Easy integration
- Visual feedback`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// Debug mode toggle
const DEBUG_KEY = 'debug_mode';

export function isDebugMode() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(DEBUG_KEY) === 'true';
}

export function toggleDebugMode() {
  const current = isDebugMode();
  localStorage.setItem(DEBUG_KEY, (!current).toString());
  window.location.reload();
}

// Press Ctrl+Shift+D to toggle
useEffect(() => {
  const handler = (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      toggleDebugMode();
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, []);

// Debug overlay component
function DebugOverlay() {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({});
  
  if (!isDebugMode()) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <button
        onClick={() => setVisible(!visible)}
        className="bg-red-500 text-white p-2 rounded-full"
      >
        🐛
      </button>
      
      {visible && (
        <div className="absolute bottom-12 right-0 bg-black/90 text-white p-4 rounded w-80 max-h-96 overflow-auto">
          <h3 className="font-bold mb-2">Debug Info</h3>
          <pre className="text-xs">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// Global debug registry
const debugRegistry = new Map();

export function registerDebugData(key, getData) {
  debugRegistry.set(key, getData);
}

export function getDebugData() {
  const data = {};
  debugRegistry.forEach((getData, key) => {
    try {
      data[key] = getData();
    } catch (e) {
      data[key] = { error: e.message };
    }
  });
  return data;
}

// Usage in components
function UserProfile({ userId }) {
  const { data: user } = useUser(userId);
  
  useEffect(() => {
    registerDebugData('user', () => ({
      id: userId,
      data: user,
      fetchedAt: new Date().toISOString(),
    }));
  }, [userId, user]);
}

// Performance monitor
function usePerformanceMonitor(name) {
  const metrics = useRef({
    renders: 0,
    totalTime: 0,
    lastRender: null,
  });
  
  useEffect(() => {
    const start = performance.now();
    metrics.current.renders++;
    
    return () => {
      const duration = performance.now() - start;
      metrics.current.totalTime += duration;
      metrics.current.lastRender = duration;
      
      if (isDebugMode()) {
        console.log(\`[Perf] \${name}:\`, {
          renders: metrics.current.renders,
          lastRender: \`\${duration.toFixed(2)}ms\`,
          avgRender: \`\${(metrics.current.totalTime / metrics.current.renders).toFixed(2)}ms\`,
        });
      }
    };
  });
  
  return metrics.current;
}

// Component tree debugger
function ComponentTreeDebugger() {
  const [tree, setTree] = useState([]);
  
  useEffect(() => {
    if (!isDebugMode()) return;
    
    // Use React DevTools global hook
    const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!hook) {
      console.warn('React DevTools not available');
      return;
    }
    
    // Get fiber tree
    const renderers = hook.renderers;
    renderers.forEach((renderer, id) => {
      console.log('Renderer:', id, renderer);
    });
  }, []);
  
  return isDebugMode() ? (
    <pre className="text-xs">{JSON.stringify(tree, null, 2)}</pre>
  ) : null;
}

// State inspector
function useStateInspector(state, name) {
  const history = useRef([]);
  const prevState = useRef(state);
  
  useEffect(() => {
    if (!isDebugMode()) return;
    
    if (prevState.current !== state) {
      const entry = {
        timestamp: Date.now(),
        from: prevState.current,
        to: state,
        diff: getStateDiff(prevState.current, state),
      };
      
      history.current.push(entry);
      console.log(\`[State] \${name}:\`, entry);
      
      prevState.current = state;
    }
  }, [state, name]);
  
  return history.current;
}

function getStateDiff(prev, next) {
  // Simple diff for objects
  if (typeof prev !== typeof next) {
    return { type: 'type_change', prev, next };
  }
  
  if (typeof prev !== 'object') {
    return prev !== next ? { changed: true, prev, next } : null;
  }
  
  const changes = {};
  const allKeys = new Set([...Object.keys(prev || {}), ...Object.keys(next || {})]);
  
  allKeys.forEach(key => {
    if (prev?.[key] !== next?.[key]) {
      changes[key] = { from: prev?.[key], to: next?.[key] };
    }
  });
  
  return Object.keys(changes).length > 0 ? changes : null;
}`,
    tags: ['debugging', 'utilities', 'dev-tools', 'monitoring'],
    timeEstimate: 6
  }
];

