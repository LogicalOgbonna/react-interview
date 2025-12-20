import { Question } from '../types';

export const hooksQuestions: Question[] = [
  {
    id: 'hooks-1',
    category: 'Hooks',
    question: 'Explain useState and how it works internally.',
    answer: `useState is a Hook that adds state to functional components. It returns an array with the current state value and a function to update it.

Internal workings:
1. React maintains a "fiber" for each component with a linked list of hooks
2. Hooks are called in the same order every render
3. State is stored in the fiber's memoizedState
4. Setter triggers a re-render with new state

Important behaviors:
- State updates are batched for performance
- Setter can accept a value or an updater function
- Initial state is only used on first render
- State updates are asynchronous`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `const [count, setCount] = useState(0);

// Direct update
setCount(5);

// Updater function (recommended for derived state)
setCount(prevCount => prevCount + 1);

// Lazy initial state (computed once)
const [data, setData] = useState(() => expensiveComputation());`,
    followUp: ['What happens if you call useState conditionally?', 'Why do we use array destructuring?'],
    tags: ['hooks', 'state', 'useState'],
    timeEstimate: 5
  },
  {
    id: 'hooks-2',
    category: 'Hooks',
    question: 'Explain useEffect and its lifecycle equivalents.',
    answer: `useEffect lets you perform side effects in functional components. It combines componentDidMount, componentDidUpdate, and componentWillUnmount.

Effect timing:
- Runs after every render by default
- Cleanup runs before next effect and on unmount
- Runs asynchronously after paint (non-blocking)

Dependency array:
- []: Run once on mount only
- [dep]: Run when dep changes
- undefined: Run after every render

Common uses:
- Data fetching
- Subscriptions
- DOM manipulation
- Timers`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// componentDidMount + componentWillUnmount
useEffect(() => {
  const subscription = subscribeToEvents();
  return () => subscription.unsubscribe(); // cleanup
}, []);

// componentDidUpdate for specific prop
useEffect(() => {
  fetchData(userId);
}, [userId]);

// Every render
useEffect(() => {
  document.title = \`Count: \${count}\`;
});`,
    followUp: ['What happens if you forget the dependency array?', 'How to handle async in useEffect?'],
    tags: ['hooks', 'effects', 'useEffect', 'lifecycle'],
    timeEstimate: 5
  },
  {
    id: 'hooks-3',
    category: 'Hooks',
    question: 'What is the difference between useEffect and useLayoutEffect?',
    answer: `Both run after render, but at different times:

useEffect:
- Runs asynchronously after browser paint
- Non-blocking, better for performance
- Use for: data fetching, subscriptions, logging

useLayoutEffect:
- Runs synchronously after DOM mutations, before paint
- Blocks visual updates
- Use for: DOM measurements, scroll position, preventing flicker

Rule: Start with useEffect. Only use useLayoutEffect if you see visual glitches.

SSR Note: useLayoutEffect shows warnings on server. Use useEffect or check typeof window.`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// useLayoutEffect for measuring DOM
function Tooltip({ targetRef }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const rect = targetRef.current.getBoundingClientRect();
    setPosition({ x: rect.left, y: rect.bottom });
  }, [targetRef]);

  return <div style={{ position: 'absolute', ...position }}>Tooltip</div>;
}`,
    tags: ['hooks', 'useLayoutEffect', 'useEffect', 'dom'],
    timeEstimate: 4
  },
  {
    id: 'hooks-4',
    category: 'Hooks',
    question: 'Explain useRef and its use cases.',
    answer: `useRef returns a mutable ref object with a .current property that persists across renders without causing re-renders when changed.

Primary use cases:
1. Accessing DOM elements directly
2. Storing mutable values that don't trigger re-renders
3. Storing previous values
4. Storing timeout/interval IDs

Key characteristics:
- .current is mutable
- Changes don't cause re-renders
- Value persists for component lifetime
- Initialized once (like instance variable)`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// DOM access
function TextInput() {
  const inputRef = useRef(null);
  const focusInput = () => inputRef.current.focus();
  return <input ref={inputRef} />;
}

// Storing previous value
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// Storing interval ID
function Timer() {
  const intervalRef = useRef(null);
  
  useEffect(() => {
    intervalRef.current = setInterval(() => {}, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);
}`,
    tags: ['hooks', 'useRef', 'dom', 'refs'],
    timeEstimate: 4
  },
  {
    id: 'hooks-5',
    category: 'Hooks',
    question: 'Explain useMemo and useCallback. What is the difference?',
    answer: `Both are memoization hooks that optimize performance:

useMemo: Memoizes a computed value
- Returns the memoized result
- Use for: expensive calculations, referential equality of objects/arrays

useCallback: Memoizes a function definition
- Returns the memoized function itself
- Use for: passing callbacks to optimized child components
- useCallback(fn, deps) === useMemo(() => fn, deps)

When to use:
- Only when you have measured performance issues
- When passing callbacks to React.memo'd components
- For expensive computations`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// useMemo - memoize expensive calculation
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.value - b.value);
}, [items]);

// useMemo - stable object reference
const style = useMemo(() => ({ color: 'red', fontSize: size }), [size]);

// useCallback - stable function reference
const handleClick = useCallback((id) => {
  setItems(items => items.filter(item => item.id !== id));
}, []); // Empty deps since using updater function

// Passing to memoized child
<MemoizedList items={items} onItemClick={handleClick} />`,
    followUp: ['When would useMemo actually hurt performance?', 'How do you measure if memoization helps?'],
    tags: ['hooks', 'useMemo', 'useCallback', 'performance', 'memoization'],
    timeEstimate: 5
  },
  {
    id: 'hooks-6',
    category: 'Hooks',
    question: 'Explain useReducer and when to use it over useState.',
    answer: `useReducer is a hook for managing complex state logic. It's similar to Redux but local to a component.

Syntax: const [state, dispatch] = useReducer(reducer, initialState);

When to use useReducer over useState:
- Complex state logic with multiple sub-values
- Next state depends on previous state
- State transitions have complex rules
- Need to pass dispatch down (stable reference)
- Testing: reducers are pure functions

useState is simpler for:
- Single values
- Simple updates
- Unrelated state pieces`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `const initialState = { count: 0, step: 1 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'setStep':
      return { ...state, step: action.payload };
    case 'reset':
      return initialState;
    default:
      throw new Error(\`Unknown action: \${action.type}\`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <input 
        type="number"
        value={state.step}
        onChange={e => dispatch({ type: 'setStep', payload: +e.target.value })}
      />
    </>
  );
}`,
    tags: ['hooks', 'useReducer', 'state-management'],
    timeEstimate: 6
  },
  {
    id: 'hooks-7',
    category: 'Hooks',
    question: 'How does useContext work? What are its performance implications?',
    answer: `useContext subscribes to a React context and returns its current value. When context value changes, all consuming components re-render.

Usage:
const value = useContext(MyContext);

Performance considerations:
- ALL consumers re-render when context value changes
- Even if they only use part of the context
- Context value should be stable (useMemo)

Optimization strategies:
- Split contexts by update frequency
- Memoize context value
- Colocate state with consumers
- Use context selectors (third-party libs)`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Creating context
const ThemeContext = createContext('light');

// Provider with memoized value
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light')
  }), [theme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Consuming context
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return <button onClick={toggleTheme}>{theme}</button>;
}`,
    tags: ['hooks', 'useContext', 'context', 'performance'],
    timeEstimate: 5
  },
  {
    id: 'hooks-8',
    category: 'Hooks',
    question: 'What is useImperativeHandle and when would you use it?',
    answer: `useImperativeHandle customizes the instance value exposed to parent components when using ref. It's used with forwardRef.

Use cases:
- Exposing specific methods to parent (focus, scroll, reset)
- Hiding internal implementation details
- Creating a controlled API for child components

Best practices:
- Only expose necessary methods
- Document the imperative API
- Consider if props/callbacks could work instead
- Use sparingly (declarative is usually better)`,
    difficulty: 'expert',
    type: 'conceptual',
    codeExample: `import { forwardRef, useImperativeHandle, useRef } from 'react';

const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();
  
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    scrollIntoView: () => inputRef.current.scrollIntoView(),
    clear: () => { inputRef.current.value = ''; }
  }), []);
  
  return <input ref={inputRef} {...props} />;
});

// Parent usage
function Parent() {
  const inputRef = useRef();
  
  return (
    <>
      <FancyInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
      <button onClick={() => inputRef.current.clear()}>Clear</button>
    </>
  );
}`,
    tags: ['hooks', 'useImperativeHandle', 'refs', 'forwardRef'],
    timeEstimate: 5
  },
  {
    id: 'hooks-9',
    category: 'Hooks',
    question: 'How do you create custom hooks? Give a practical example.',
    answer: `Custom hooks are functions that start with "use" and can call other hooks. They allow you to extract component logic into reusable functions.

Rules:
- Name must start with "use"
- Can call other hooks
- Each usage has its own isolated state
- Follow the rules of hooks

Benefits:
- Logic reuse across components
- Separation of concerns
- Easier testing
- Cleaner component code`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// useFetch - data fetching hook
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error('Network error');
        const json = await response.json();
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(\`/api/users/\${userId}\`);
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <Profile user={user} />;
}`,
    tags: ['hooks', 'custom-hooks', 'patterns', 'reusability'],
    timeEstimate: 6
  },
  {
    id: 'hooks-10',
    category: 'Hooks',
    question: 'What are the Rules of Hooks and why do they exist?',
    answer: `The Rules of Hooks are constraints that ensure hooks work correctly:

1. Only call hooks at the top level
   - Don't call in loops, conditions, or nested functions
   - Ensures hooks are called in the same order every render

2. Only call hooks from React functions
   - Functional components
   - Custom hooks
   - Not from regular JavaScript functions

Why these rules exist:
- React relies on call order to match state with hooks
- Hooks are stored in a linked list on the fiber
- Violating order corrupts state management

ESLint plugin: eslint-plugin-react-hooks enforces these rules.`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// ❌ BAD - conditional hook
function Bad({ condition }) {
  if (condition) {
    const [state, setState] = useState(0); // Will break!
  }
}

// ✅ GOOD - condition inside hook
function Good({ condition }) {
  const [state, setState] = useState(0);
  
  useEffect(() => {
    if (condition) {
      // do something
    }
  }, [condition]);
}

// ❌ BAD - hook in loop
function Bad({ items }) {
  items.forEach(item => {
    const [selected, setSelected] = useState(false); // Will break!
  });
}

// ✅ GOOD - extract to component
function Good({ items }) {
  return items.map(item => <Item key={item.id} item={item} />);
}

function Item({ item }) {
  const [selected, setSelected] = useState(false); // OK!
}`,
    tags: ['hooks', 'rules', 'best-practices'],
    timeEstimate: 4
  },
  {
    id: 'hooks-11',
    category: 'Hooks',
    question: 'How do you handle async operations in useEffect?',
    answer: `useEffect cannot directly use async/await because it expects either nothing or a cleanup function to be returned, not a Promise.

Solutions:
1. Define async function inside and call it
2. Use IIFE (Immediately Invoked Function Expression)
3. Use custom hook for data fetching

Important considerations:
- Handle race conditions with cleanup
- Use AbortController for fetch cancellation
- Check if component is still mounted
- Handle loading and error states`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Method 1: Named function
useEffect(() => {
  async function fetchData() {
    const result = await api.getData();
    setData(result);
  }
  fetchData();
}, []);

// Method 2: With cleanup and race condition handling
useEffect(() => {
  const controller = new AbortController();
  let isMounted = true;

  async function fetchData() {
    try {
      setLoading(true);
      const response = await fetch(url, { signal: controller.signal });
      const data = await response.json();
      
      if (isMounted) {
        setData(data);
        setError(null);
      }
    } catch (error) {
      if (isMounted && error.name !== 'AbortError') {
        setError(error);
      }
    } finally {
      if (isMounted) setLoading(false);
    }
  }

  fetchData();
  
  return () => {
    isMounted = false;
    controller.abort();
  };
}, [url]);`,
    tags: ['hooks', 'useEffect', 'async', 'data-fetching'],
    timeEstimate: 5
  },
  {
    id: 'hooks-12',
    category: 'Hooks',
    question: 'What is the difference between useState and useRef for storing values?',
    answer: `Both persist values across renders, but they differ in behavior:

useState:
- Changes trigger re-renders
- Returns [value, setter] tuple
- Value is immutable (replaced on update)
- Good for: UI state that affects rendering

useRef:
- Changes do NOT trigger re-renders
- Returns { current: value } object
- current is mutable (can be modified directly)
- Good for: values that shouldn't affect render

Common useRef use cases:
- DOM element references
- Timer IDs
- Previous values
- Any mutable value that doesn't affect UI`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `function Example() {
  // useState - triggers re-render on change
  const [count, setCount] = useState(0);
  
  // useRef - does NOT trigger re-render
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current++; // No re-render
    console.log('Rendered', renderCount.current, 'times');
  });
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Renders: {renderCount.current}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}`,
    tags: ['hooks', 'useState', 'useRef', 'state'],
    timeEstimate: 4
  },
  {
    id: 'hooks-13',
    category: 'Hooks',
    question: 'How do you prevent infinite loops with useEffect?',
    answer: `Infinite loops occur when useEffect updates state that's in its dependencies, causing continuous re-renders.

Common causes and solutions:

1. Object/array in deps (recreated each render)
   → Use useMemo or move creation inside effect

2. Function in deps
   → Use useCallback or move inside effect

3. Setting state unconditionally
   → Add conditions before setState

4. Missing deps causing stale closure bugs
   → Use functional updates or refs`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// ❌ INFINITE LOOP - object recreated each render
useEffect(() => {
  fetchData(options);
}, [options]); // { page: 1 } !== { page: 1 }

// ✅ FIX 1: useMemo for object
const options = useMemo(() => ({ page, limit }), [page, limit]);

// ✅ FIX 2: Spread individual deps
useEffect(() => {
  fetchData({ page, limit });
}, [page, limit]);

// ❌ INFINITE LOOP - updating dep
useEffect(() => {
  setCount(count + 1); // count is a dep, creates loop
}, [count]);

// ✅ FIX: Functional update
useEffect(() => {
  setCount(c => c + 1);
}, []); // No count dep needed

// ❌ INFINITE LOOP - function recreated
const handleClick = () => console.log(id);
useEffect(() => {
  window.addEventListener('click', handleClick);
}, [handleClick]); // New function each render!

// ✅ FIX: useCallback
const handleClick = useCallback(() => console.log(id), [id]);`,
    tags: ['hooks', 'useEffect', 'debugging', 'infinite-loop'],
    timeEstimate: 5
  },
  {
    id: 'hooks-14',
    category: 'Hooks',
    question: 'What is the useId hook and when would you use it?',
    answer: `useId is a React 18 hook that generates unique IDs that are stable across server and client rendering. It solves hydration mismatch issues.

Use cases:
- Accessibility attributes (htmlFor, aria-labelledby)
- Form field IDs
- Any case where you need unique IDs in SSR apps

Important notes:
- IDs are unique per component instance
- Same useId call returns same ID across renders
- Avoid using for list keys (use data IDs instead)
- Prefix with : for CSS selector safety`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `function PasswordField() {
  const passwordId = useId();
  const hintId = useId();
  
  return (
    <>
      <label htmlFor={passwordId}>Password:</label>
      <input 
        id={passwordId}
        type="password"
        aria-describedby={hintId}
      />
      <p id={hintId}>
        Password must be 8+ characters
      </p>
    </>
  );
}

// Multiple related IDs
function Form() {
  const id = useId();
  
  return (
    <>
      <label htmlFor={\`\${id}-firstName\`}>First Name</label>
      <input id={\`\${id}-firstName\`} />
      
      <label htmlFor={\`\${id}-lastName\`}>Last Name</label>
      <input id={\`\${id}-lastName\`} />
    </>
  );
}`,
    tags: ['hooks', 'useId', 'accessibility', 'ssr'],
    timeEstimate: 3
  },
  {
    id: 'hooks-15',
    category: 'Hooks',
    question: 'What is useImperativeHandle and when should you use it?',
    answer: `useImperativeHandle customizes the instance value exposed to parent components when using refs. It's used with forwardRef to expose only specific methods.

Use cases:
- Exposing specific methods (focus, scroll, play)
- Hiding implementation details
- Creating controlled APIs for child components
- Building reusable form components

Best practice: Avoid overuse - prefer declarative patterns. Use only when imperative actions are necessary.`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();
  const [value, setValue] = useState('');
  
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => setValue(''),
    getValue: () => value,
    scrollIntoView: () => inputRef.current.scrollIntoView()
  }), [value]);
  
  return (
    <input
      ref={inputRef}
      value={value}
      onChange={e => setValue(e.target.value)}
      {...props}
    />
  );
});

// Parent usage
function Form() {
  const inputRef = useRef();
  
  return (
    <>
      <FancyInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
      <button onClick={() => inputRef.current.clear()}>Clear</button>
    </>
  );
}`,
    tags: ['hooks', 'useImperativeHandle', 'refs', 'forwardRef'],
    timeEstimate: 5
  },
  {
    id: 'hooks-16',
    category: 'Hooks',
    question: 'What is useSyncExternalStore and when would you use it?',
    answer: `useSyncExternalStore is a hook for subscribing to external stores (data sources outside React). It ensures consistent reads during concurrent rendering.

Use cases:
- Integrating with external state libraries
- Subscribing to browser APIs (localStorage, online status)
- Reading from third-party state management
- Building custom state management solutions

It replaces patterns that previously used useEffect for subscriptions.`,
    difficulty: 'expert',
    type: 'conceptual',
    codeExample: `// Subscribe to browser online status
function useOnlineStatus() {
  const isOnline = useSyncExternalStore(
    // subscribe function
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    // getSnapshot (client)
    () => navigator.onLine,
    // getServerSnapshot (SSR)
    () => true
  );
  
  return isOnline;
}

// Subscribe to localStorage
function useLocalStorage(key) {
  const value = useSyncExternalStore(
    (callback) => {
      window.addEventListener('storage', callback);
      return () => window.removeEventListener('storage', callback);
    },
    () => localStorage.getItem(key),
    () => null // Server snapshot
  );
  
  return value;
}`,
    tags: ['hooks', 'useSyncExternalStore', 'external-store', 'subscription'],
    timeEstimate: 5
  },
  {
    id: 'hooks-17',
    category: 'Hooks',
    question: 'What is useDebugValue and how does it help with debugging?',
    answer: `useDebugValue is a hook that lets you display a label for custom hooks in React DevTools. It's purely for debugging and has no runtime impact.

Use cases:
- Custom hooks that return complex values
- Making hook state easier to inspect
- Showing derived/computed values
- Documenting hook behavior in DevTools

Best practices:
- Only use in custom hooks
- Add for widely-used/shared hooks
- Use format function for expensive formatting`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Basic usage
function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
}

// With format function (deferred until DevTools inspects)
function useFormattedDate(date) {
  useDebugValue(date, (d) => d.toLocaleDateString());
  return date;
}

// Complex hook with debug info
function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useDebugValue(
    user,
    (u) => u ? \`User: \${u.name} (id: \${u.id})\` : 'Loading...'
  );
  
  // ... fetch logic
  
  return { user, loading };
}`,
    tags: ['hooks', 'useDebugValue', 'debugging', 'devtools'],
    timeEstimate: 3
  },
  {
    id: 'hooks-18',
    category: 'Hooks',
    question: 'Explain the difference between useEffect and useInsertionEffect.',
    answer: `useInsertionEffect fires synchronously before DOM mutations, designed specifically for CSS-in-JS libraries to inject styles.

Timing order:
1. useInsertionEffect - Before DOM mutations
2. useLayoutEffect - After DOM mutations, before paint
3. useEffect - After paint

useInsertionEffect:
- Can't access refs (DOM not mutated yet)
- Can't schedule updates
- For injecting dynamic <style> tags
- Prevents layout thrashing from style injection

Regular developers rarely need it - it's for library authors.`,
    difficulty: 'expert',
    type: 'conceptual',
    codeExample: `// CSS-in-JS library implementation
function useCSS(rule) {
  useInsertionEffect(() => {
    // Inject styles before DOM is mutated
    const style = document.createElement('style');
    style.textContent = rule;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [rule]);
}

// Timing demonstration
function Component() {
  useInsertionEffect(() => {
    console.log('1. useInsertionEffect');
  });
  
  useLayoutEffect(() => {
    console.log('2. useLayoutEffect');
  });
  
  useEffect(() => {
    console.log('3. useEffect');
  });
  
  return <div>Check console</div>;
}`,
    tags: ['hooks', 'useInsertionEffect', 'css-in-js', 'timing'],
    timeEstimate: 4
  },
  {
    id: 'hooks-19',
    category: 'Hooks',
    question: 'How do you handle race conditions in useEffect with async operations?',
    answer: `Race conditions occur when multiple async operations complete in a different order than started. Common in search inputs or data fetching with changing params.

Solutions:
1. Cleanup flag (boolean) - Check if effect is stale
2. AbortController - Cancel fetch requests
3. Request ID tracking - Ignore stale responses
4. Debouncing - Reduce request frequency

The cleanup function in useEffect is key to preventing state updates from stale requests.`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// Solution 1: Boolean flag
useEffect(() => {
  let cancelled = false;
  
  async function fetchData() {
    const response = await fetch(\`/api/search?q=\${query}\`);
    const data = await response.json();
    
    if (!cancelled) {
      setResults(data);
    }
  }
  
  fetchData();
  return () => { cancelled = true; };
}, [query]);

// Solution 2: AbortController
useEffect(() => {
  const controller = new AbortController();
  
  fetch(\`/api/search?q=\${query}\`, { signal: controller.signal })
    .then(res => res.json())
    .then(setResults)
    .catch(err => {
      if (err.name !== 'AbortError') throw err;
    });
  
  return () => controller.abort();
}, [query]);

// Solution 3: Request ID
const requestIdRef = useRef(0);

useEffect(() => {
  const requestId = ++requestIdRef.current;
  
  fetchData(query).then(data => {
    if (requestId === requestIdRef.current) {
      setResults(data);
    }
  });
}, [query]);`,
    tags: ['hooks', 'useEffect', 'async', 'race-conditions'],
    timeEstimate: 5
  },
  {
    id: 'hooks-20',
    category: 'Hooks',
    question: 'What are the rules of hooks and why do they exist?',
    answer: `React hooks have two fundamental rules:

1. Only call hooks at the top level
   - Not inside loops, conditions, or nested functions
   - Ensures hooks are called in the same order every render

2. Only call hooks from React functions
   - React function components
   - Custom hooks (functions starting with "use")

Why these rules exist:
- React relies on call order to associate state with hooks
- Conditional hooks would break state association
- Ensures consistent behavior across renders
- Enables React to optimize hook performance

ESLint plugin 'eslint-plugin-react-hooks' enforces these rules.`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// ❌ WRONG - conditional hook
function Component({ isLoggedIn }) {
  if (isLoggedIn) {
    const [user, setUser] = useState(null); // Error!
  }
}

// ✅ CORRECT - conditional value
function Component({ isLoggedIn }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    if (isLoggedIn) {
      fetchUser().then(setUser);
    }
  }, [isLoggedIn]);
}

// ❌ WRONG - hook in loop
function Component({ items }) {
  for (const item of items) {
    const [count, setCount] = useState(0); // Error!
  }
}

// ✅ CORRECT - single state for array
function Component({ items }) {
  const [counts, setCounts] = useState(() => 
    items.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
  );
}`,
    tags: ['hooks', 'rules', 'fundamentals'],
    timeEstimate: 4
  },
  {
    id: 'hooks-21',
    category: 'Hooks',
    question: 'How do you share logic between hooks?',
    answer: `Custom hooks can call other hooks, enabling composition and reuse of stateful logic.

Patterns for sharing logic:
1. Extract repeated logic into custom hooks
2. Compose hooks together
3. Create specialized hooks from general ones
4. Build hook libraries for common patterns

Benefits:
- DRY principle
- Separation of concerns
- Testable logic units
- Composable behaviors`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Base hook
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  
  return { data, loading, error };
}

// Specialized hook using base
function useUser(userId) {
  return useFetch(\`/api/users/\${userId}\`);
}

// Composed hook
function useUserWithPosts(userId) {
  const user = useUser(userId);
  const posts = useFetch(
    user.data ? \`/api/users/\${userId}/posts\` : null
  );
  
  return {
    user: user.data,
    posts: posts.data,
    loading: user.loading || posts.loading,
    error: user.error || posts.error
  };
}`,
    tags: ['hooks', 'custom-hooks', 'composition', 'patterns'],
    timeEstimate: 4
  },
  {
    id: 'hooks-22',
    category: 'Hooks',
    question: 'What is the useOptimistic hook in React 19?',
    answer: `useOptimistic is a React 19 hook for managing optimistic UI updates. It lets you show an optimistic state while an async action is pending.

Benefits:
- Instant UI feedback
- Better perceived performance
- Automatic rollback on failure
- Cleaner than manual state management

Pattern:
1. Show optimistic value immediately
2. Perform async operation
3. Revert automatically if operation fails`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `function TodoList({ todos, addTodo }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo) => [...state, { ...newTodo, pending: true }]
  );
  
  async function handleAdd(formData) {
    const newTodo = { 
      id: Date.now(), 
      text: formData.get('text') 
    };
    
    // Show optimistic update immediately
    addOptimisticTodo(newTodo);
    
    // Actual server call
    await addTodo(formData);
    // If fails, optimistic state automatically reverts
  }
  
  return (
    <form action={handleAdd}>
      <input name="text" />
      <button>Add</button>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id} style={{ opacity: todo.pending ? 0.5 : 1 }}>
            {todo.text}
          </li>
        ))}
      </ul>
    </form>
  );
}`,
    tags: ['hooks', 'useOptimistic', 'react-19', 'optimistic-ui'],
    timeEstimate: 4
  },
  {
    id: 'hooks-23',
    category: 'Hooks',
    question: 'What is the useFormStatus hook and how does it work?',
    answer: `useFormStatus is a React 19 hook that provides status information about a parent form submission. It must be used within a component rendered inside a <form>.

Returns:
- pending: boolean - Is form submitting?
- data: FormData | null - Submitted data
- method: string - HTTP method
- action: function - Form action function

Use cases:
- Disable inputs during submission
- Show loading spinners
- Display submitted values
- Prevent double submissions`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

function Form() {
  async function handleSubmit(formData) {
    await saveToServer(formData);
  }
  
  return (
    <form action={handleSubmit}>
      <input name="email" type="email" />
      <SubmitButton />
    </form>
  );
}

// More complete example with status
function FormFields() {
  const { pending, data } = useFormStatus();
  
  return (
    <>
      <input 
        name="name" 
        disabled={pending}
        placeholder="Name" 
      />
      {pending && <span>Saving {data?.get('name')}...</span>}
    </>
  );
}`,
    tags: ['hooks', 'useFormStatus', 'react-19', 'forms'],
    timeEstimate: 4
  },
  {
    id: 'hooks-24',
    category: 'Hooks',
    question: 'How do you implement a custom useLocalStorage hook?',
    answer: `A useLocalStorage hook syncs state with browser localStorage, persisting data across page reloads.

Requirements:
- Initial value from localStorage or default
- Update localStorage on state change
- Handle SSR (localStorage undefined)
- Parse/stringify JSON values
- Sync across tabs (optional)`,
    difficulty: 'intermediate',
    type: 'coding',
    codeExample: `function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use default
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  // Update localStorage when value changes
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);
  
  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key]);
  
  return [storedValue, setValue];
}`,
    tags: ['hooks', 'custom-hooks', 'localStorage', 'persistence'],
    timeEstimate: 5
  },
  {
    id: 'hooks-25',
    category: 'Hooks',
    question: 'How do you implement a usePrevious hook?',
    answer: `usePrevious returns the previous value of a variable from the last render. It's useful for comparing current and previous values.

Use cases:
- Detecting value changes
- Animation between values
- Undo functionality
- Tracking prop changes

Implementation uses useRef to store the previous value and useEffect to update it after render.`,
    difficulty: 'intermediate',
    type: 'coding',
    codeExample: `function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

// Usage
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  
  return (
    <div>
      <p>Current: {count}, Previous: {prevCount}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}

// With type support
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

// Alternative: Get previous immediately
function usePreviousImmediate(value) {
  const ref = useRef({ current: value, previous: undefined });
  
  if (ref.current.current !== value) {
    ref.current.previous = ref.current.current;
    ref.current.current = value;
  }
  
  return ref.current.previous;
}`,
    tags: ['hooks', 'custom-hooks', 'usePrevious', 'patterns'],
    timeEstimate: 3
  },
  {
    id: 'hooks-26',
    category: 'Hooks',
    question: 'What is the useActionState hook in React 19?',
    answer: `useActionState (formerly useFormState) manages form action state in React 19. It handles the state returned from form actions and provides pending status.

Features:
- Tracks action state
- Provides pending status
- Works with progressive enhancement
- Integrates with Server Actions

Returns: [state, formAction, isPending]`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `import { useActionState } from 'react';

async function submitForm(previousState, formData) {
  const email = formData.get('email');
  
  try {
    await saveEmail(email);
    return { success: true, message: 'Saved!' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

function EmailForm() {
  const [state, formAction, isPending] = useActionState(
    submitForm,
    { success: null, message: '' }
  );
  
  return (
    <form action={formAction}>
      <input name="email" type="email" disabled={isPending} />
      <button disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
      {state.message && (
        <p style={{ color: state.success ? 'green' : 'red' }}>
          {state.message}
        </p>
      )}
    </form>
  );
}`,
    tags: ['hooks', 'useActionState', 'react-19', 'forms'],
    timeEstimate: 4
  },
  {
    id: 'hooks-27',
    category: 'Hooks',
    question: 'How do you implement a useDebounce hook?',
    answer: `useDebounce delays updating a value until a specified time has passed without changes. It's essential for search inputs, API calls, and expensive operations.

Benefits:
- Reduces API calls
- Improves performance
- Better UX for search inputs
- Prevents excessive re-renders`,
    difficulty: 'intermediate',
    type: 'coding',
    codeExample: `function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  
  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery).then(setResults);
    }
  }, [debouncedQuery]);
  
  return (
    <input 
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}

// Debounced callback version
function useDebouncedCallback(callback, delay) {
  const timeoutRef = useRef();
  
  return useCallback((...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}`,
    tags: ['hooks', 'custom-hooks', 'debounce', 'performance'],
    timeEstimate: 4
  },
  {
    id: 'hooks-28',
    category: 'Hooks',
    question: 'How do you implement a useClickOutside hook?',
    answer: `useClickOutside detects clicks outside a specified element, commonly used for closing dropdowns, modals, and menus.

Implementation:
- Use ref to track target element
- Add mousedown/touchstart listener to document
- Check if click is outside element
- Call handler if outside

Considerations:
- Handle both mouse and touch events
- Clean up listeners properly
- Consider portal elements`,
    difficulty: 'intermediate',
    type: 'coding',
    codeExample: `function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or its children
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// Usage
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useClickOutside(dropdownRef, () => setIsOpen(false));
  
  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        Toggle
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          <li>Option 1</li>
          <li>Option 2</li>
        </ul>
      )}
    </div>
  );
}`,
    tags: ['hooks', 'custom-hooks', 'useClickOutside', 'events'],
    timeEstimate: 4
  },
  {
    id: 'hooks-29',
    category: 'Hooks',
    question: 'What are the common mistakes when using useEffect?',
    answer: `Common useEffect mistakes and their solutions:

1. Missing dependencies
   - Causes stale closures
   - Fix: Add all used values to deps

2. Object/array dependencies
   - Causes infinite loops
   - Fix: useMemo or primitive deps

3. Forgetting cleanup
   - Memory leaks, race conditions
   - Fix: Return cleanup function

4. Async in useEffect
   - Can't return promise directly
   - Fix: Define async function inside

5. Over-fetching
   - No abort handling
   - Fix: AbortController

6. Running on every render
   - Empty array deps
   - Fix: Only include reactive values`,
    difficulty: 'senior',
    type: 'debugging',
    codeExample: `// ❌ Missing dependency
useEffect(() => {
  fetchUser(userId); // userId not in deps
}, []);

// ✅ Fixed
useEffect(() => {
  fetchUser(userId);
}, [userId]);

// ❌ Async return
useEffect(async () => { // Error!
  await fetchData();
}, []);

// ✅ Fixed
useEffect(() => {
  async function fetch() {
    await fetchData();
  }
  fetch();
}, []);

// ❌ No cleanup
useEffect(() => {
  const subscription = subscribe();
  // Memory leak!
}, []);

// ✅ With cleanup
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);

// ❌ Object in deps
useEffect(() => {
  doSomething(config);
}, [config]); // New object each render!

// ✅ Fixed
const stableConfig = useMemo(() => config, [config.id]);
useEffect(() => {
  doSomething(stableConfig);
}, [stableConfig]);`,
    tags: ['hooks', 'useEffect', 'debugging', 'mistakes'],
    timeEstimate: 5
  },
  {
    id: 'hooks-30',
    category: 'Hooks',
    question: 'How do you implement a useThrottle hook?',
    answer: `useThrottle limits how often a value updates, ensuring at most one update per specified time period. Unlike debounce, it fires immediately then throttles.

Use cases:
- Scroll event handlers
- Resize listeners
- Real-time search (show some results immediately)
- Rate-limited API calls`,
    difficulty: 'intermediate',
    type: 'coding',
    codeExample: `function useThrottle(value, limit) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());
  
  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));
    
    return () => clearTimeout(handler);
  }, [value, limit]);
  
  return throttledValue;
}

// Usage
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottle(scrollY, 200);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // API call only happens every 200ms max
  useEffect(() => {
    trackScrollPosition(throttledScrollY);
  }, [throttledScrollY]);
  
  return <div>Scroll: {throttledScrollY}</div>;
}

// Throttled callback version
function useThrottledCallback(callback, delay) {
  const lastRan = useRef(0);
  const timeoutRef = useRef();
  
  return useCallback((...args) => {
    const now = Date.now();
    
    if (now - lastRan.current >= delay) {
      callback(...args);
      lastRan.current = now;
    } else {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
        lastRan.current = Date.now();
      }, delay - (now - lastRan.current));
    }
  }, [callback, delay]);
}`,
    tags: ['hooks', 'custom-hooks', 'throttle', 'performance'],
    timeEstimate: 4
  },
  {
    id: 'hooks-31',
    category: 'Hooks',
    question: 'What is the use hook in React 19?',
    answer: `use is a new React 19 hook that lets you read resources (promises or contexts) during render. Unlike other hooks, it can be called conditionally.

Features:
- Can read promises (with Suspense)
- Can read context (like useContext)
- Can be called conditionally
- Works with async Server Components

Note: use integrates with Suspense for loading states and Error Boundaries for error handling.`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `import { use, Suspense } from 'react';

// Reading a promise
function Comments({ commentsPromise }) {
  const comments = use(commentsPromise);
  
  return (
    <ul>
      {comments.map(c => <li key={c.id}>{c.text}</li>)}
    </ul>
  );
}

// Parent with Suspense
function Post({ postId }) {
  const commentsPromise = fetchComments(postId);
  
  return (
    <Suspense fallback={<Loading />}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  );
}

// Conditional use (allowed!)
function UserProfile({ user, shouldShowPosts }) {
  if (shouldShowPosts) {
    const posts = use(fetchPosts(user.id));
    return <PostList posts={posts} />;
  }
  return <BasicProfile user={user} />;
}

// Reading context with use
function Button() {
  const theme = use(ThemeContext);
  return <button className={theme}>Click</button>;
}`,
    tags: ['hooks', 'use', 'react-19', 'suspense'],
    timeEstimate: 4
  },
  {
    id: 'hooks-32',
    category: 'Hooks',
    question: 'How do you test custom hooks?',
    answer: `Custom hooks can be tested using @testing-library/react's renderHook utility or by creating wrapper components.

Testing strategies:
1. renderHook - Direct hook testing
2. Wrapper component - Integration testing
3. Mock dependencies - Isolate hook logic
4. Test state changes - Verify updates
5. Test cleanup - Verify effect cleanup`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });
  
  it('should initialize with provided value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });
  
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
  
  it('should handle async operations', async () => {
    const { result } = renderHook(() => useFetch('/api/data'));
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toBeDefined();
  });
  
  it('should cleanup on unmount', () => {
    const unsubscribe = jest.fn();
    const { unmount } = renderHook(() => useSubscription(unsubscribe));
    
    unmount();
    
    expect(unsubscribe).toHaveBeenCalled();
  });
});`,
    tags: ['hooks', 'testing', 'custom-hooks', 'testing-library'],
    timeEstimate: 5
  },
  {
    id: 'hooks-33',
    category: 'Hooks',
    question: 'How do you handle dependent useEffects?',
    answer: `When effects depend on each other's results, you need to handle them carefully to avoid race conditions and ensure proper order.

Strategies:
1. Chain in single effect
2. Use state to trigger subsequent effects
3. Custom hook encapsulation
4. Async/await with proper cleanup
5. Use refs for intermediate values`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// Strategy 1: Single effect with async chain
useEffect(() => {
  let cancelled = false;
  
  async function fetchAll() {
    const user = await fetchUser(userId);
    if (cancelled) return;
    
    const posts = await fetchPosts(user.id);
    if (cancelled) return;
    
    const comments = await fetchComments(posts[0].id);
    if (cancelled) return;
    
    setData({ user, posts, comments });
  }
  
  fetchAll();
  return () => { cancelled = true; };
}, [userId]);

// Strategy 2: State-triggered chain
useEffect(() => {
  fetchUser(userId).then(setUser);
}, [userId]);

useEffect(() => {
  if (user) {
    fetchPosts(user.id).then(setPosts);
  }
}, [user]);

useEffect(() => {
  if (posts?.length > 0) {
    fetchComments(posts[0].id).then(setComments);
  }
}, [posts]);

// Strategy 3: Custom hook encapsulation
function useUserWithPosts(userId) {
  const [state, setState] = useState({ 
    user: null, 
    posts: [], 
    loading: true 
  });
  
  useEffect(() => {
    let cancelled = false;
    setState(s => ({ ...s, loading: true }));
    
    fetchUser(userId)
      .then(user => {
        if (cancelled) return;
        return fetchPosts(user.id).then(posts => ({ user, posts }));
      })
      .then(data => {
        if (!cancelled && data) {
          setState({ ...data, loading: false });
        }
      });
    
    return () => { cancelled = true; };
  }, [userId]);
  
  return state;
}`,
    tags: ['hooks', 'useEffect', 'patterns', 'async'],
    timeEstimate: 5
  },
  {
    id: 'hooks-34',
    category: 'Hooks',
    question: 'What is the difference between useRef and createRef?',
    answer: `Both create refs, but they're designed for different use cases:

useRef (hooks):
- For function components
- Returns same ref object across renders
- Persists for component lifetime
- Can store any mutable value

createRef:
- For class components
- Creates new ref each call
- In function components, would reset each render
- Designed for single use in constructor`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// useRef - persists across renders
function FunctionComponent() {
  const inputRef = useRef(null);
  const renderCount = useRef(0);
  
  renderCount.current++; // Same ref, increments
  
  return <input ref={inputRef} />;
}

// createRef - new ref each render (WRONG in function component)
function WrongComponent() {
  const inputRef = createRef(); // New ref each render!
  
  // ref.current is always null initially
  return <input ref={inputRef} />;
}

// createRef - correct in class component
class ClassComponent extends React.Component {
  inputRef = createRef(); // Created once in instance
  
  render() {
    return <input ref={this.inputRef} />;
  }
}

// useRef for mutable values
function Timer() {
  const intervalRef = useRef(null);
  
  const start = () => {
    intervalRef.current = setInterval(() => {
      console.log('tick');
    }, 1000);
  };
  
  const stop = () => {
    clearInterval(intervalRef.current);
  };
  
  return (
    <>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}`,
    tags: ['hooks', 'useRef', 'createRef', 'refs'],
    timeEstimate: 3
  }
];

