import { Question } from '../types';

export const reactCoreQuestions: Question[] = [
  {
    id: 'rc-1',
    category: 'React Core',
    question: 'What is React?',
    answer: `React (aka React.js or ReactJS) is an open-source front-end JavaScript library used for building composable user interfaces, especially for single-page applications. It follows a component-based approach for creating reusable UI components.

Key characteristics:
- Declarative: React makes it painless to create interactive UIs
- Component-Based: Build encapsulated components that manage their own state
- Learn Once, Write Anywhere: Works with existing code and can render on server using Node

React is used by many Fortune 500 companies including Meta, Netflix, Airbnb, and more.`,
    difficulty: 'beginner',
    type: 'conceptual',
    tags: ['fundamentals', 'basics'],
    timeEstimate: 2
  },
  {
    id: 'rc-2',
    category: 'React Core',
    question: 'What is JSX?',
    answer: `JSX stands for JavaScript XML. It's a syntax extension for JavaScript that allows you to write HTML-like code within JavaScript. JSX produces React "elements".

Key points:
- JSX is not required to use React, but it makes the code more readable
- JSX gets compiled to React.createElement() calls
- JSX expressions must have one parent element
- You can embed JavaScript expressions inside JSX using curly braces {}
- JSX prevents injection attacks by escaping embedded values`,
    difficulty: 'beginner',
    type: 'conceptual',
    codeExample: `// JSX
const element = <h1>Hello, {user.name}</h1>;

// Compiles to:
const element = React.createElement('h1', null, 'Hello, ', user.name);`,
    tags: ['jsx', 'fundamentals'],
    timeEstimate: 3
  },
  {
    id: 'rc-3',
    category: 'React Core',
    question: 'What is the difference between an Element and a Component?',
    answer: `An Element is a plain JavaScript object describing what you want to appear on screen in terms of DOM nodes or other components. Elements are immutable and cheap to create.

A Component is a function or class that accepts inputs (props) and returns React elements. Components can be reused throughout your application.

Key differences:
- Elements are immutable, simple objects
- Components are functions/classes that can have state and lifecycle
- Elements describe what to render
- Components describe how to render`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Element
const element = <div id="container">Hello</div>;

// Function Component
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// Class Component
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}`,
    tags: ['elements', 'components'],
    timeEstimate: 3
  },
  {
    id: 'rc-4',
    category: 'React Core',
    question: 'What is the Virtual DOM and how does it work?',
    answer: `The Virtual DOM (VDOM) is a lightweight JavaScript representation of the actual DOM. React keeps a virtual DOM in memory and syncs it with the real DOM through a process called reconciliation.

How it works:
1. When state changes, React creates a new Virtual DOM tree
2. React compares (diffs) the new tree with the previous one
3. React calculates the minimum number of changes needed
4. Only those changes are applied to the real DOM (batch updates)

Benefits:
- Performance optimization through batched updates
- Abstraction layer that enables cross-platform rendering
- Declarative programming model`,
    difficulty: 'intermediate',
    type: 'conceptual',
    tags: ['virtual-dom', 'performance', 'reconciliation'],
    timeEstimate: 4
  },
  {
    id: 'rc-5',
    category: 'React Core',
    question: 'What is React Fiber?',
    answer: `React Fiber is a complete rewrite of React's core reconciliation algorithm, introduced in React 16. It enables incremental rendering of the virtual DOM.

Key features:
- Ability to split rendering work into chunks
- Ability to pause, abort, or reuse work
- Ability to assign priority to different types of updates
- New concurrency primitives

Fiber enables:
- Better handling of animations and gestures
- Improved perceived performance
- Foundation for concurrent features like Suspense
- Time-slicing for expensive renders`,
    difficulty: 'senior',
    type: 'conceptual',
    tags: ['fiber', 'internals', 'performance'],
    timeEstimate: 5
  },
  {
    id: 'rc-6',
    category: 'React Core',
    question: 'Explain the difference between controlled and uncontrolled components.',
    answer: `Controlled Components: Form elements whose values are controlled by React state. The component's state is the "single source of truth".

Uncontrolled Components: Form elements that maintain their own internal state. You access values using refs.

Controlled (Recommended):
- More control over form data
- Enables instant input validation
- Conditionally disable submit buttons
- Enforce input formats

Uncontrolled:
- Less code for simple forms
- Easier integration with non-React code
- Better for file inputs`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Controlled
function ControlledInput() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}

// Uncontrolled
function UncontrolledInput() {
  const inputRef = useRef(null);
  const handleSubmit = () => console.log(inputRef.current.value);
  return <input ref={inputRef} defaultValue="initial" />;
}`,
    tags: ['forms', 'controlled', 'uncontrolled'],
    timeEstimate: 4
  },
  {
    id: 'rc-7',
    category: 'React Core',
    question: 'What are Higher-Order Components (HOCs)?',
    answer: `A Higher-Order Component is a function that takes a component and returns a new component with additional props or behavior. HOCs are a pattern for reusing component logic.

HOC signature: const EnhancedComponent = higherOrderComponent(WrappedComponent);

Use cases:
- Code reuse and logic abstraction
- Render hijacking
- State abstraction and manipulation
- Props manipulation

Common HOCs: connect() from Redux, withRouter() from React Router

Note: With Hooks, many HOC use cases can be replaced with custom hooks.`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) return <div>Loading...</div>;
    return <WrappedComponent {...props} />;
  };
}

// Usage
const UserListWithLoading = withLoading(UserList);
<UserListWithLoading isLoading={true} users={users} />`,
    tags: ['hoc', 'patterns', 'composition'],
    timeEstimate: 5
  },
  {
    id: 'rc-8',
    category: 'React Core',
    question: 'What is reconciliation in React?',
    answer: `Reconciliation is the process React uses to update the DOM efficiently. When a component's state or props change, React compares the new element tree with the previous one and determines what needs to change.

The Diffing Algorithm:
1. Elements of different types produce different trees (full rebuild)
2. Elements of same type: React keeps the same DOM node and only updates changed attributes
3. For lists, React uses keys to match children

Key assumptions:
- Two elements of different types will produce different trees
- Developer can hint which elements are stable using keys
- React batches multiple changes for efficiency`,
    difficulty: 'senior',
    type: 'conceptual',
    tags: ['reconciliation', 'diffing', 'performance'],
    timeEstimate: 4
  },
  {
    id: 'rc-9',
    category: 'React Core',
    question: 'Why is the key prop important in lists?',
    answer: `Keys help React identify which items have changed, been added, or removed. They give elements a stable identity and enable efficient reconciliation.

Why keys matter:
- Without keys, React re-renders all list items on any change
- Keys enable React to reuse existing DOM elements
- Improves performance for dynamic lists

Best practices:
- Use stable, unique identifiers (database IDs)
- Avoid using array indices as keys (unless list is static)
- Keys must be unique among siblings, not globally`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Bad - using index
{items.map((item, index) => <Item key={index} {...item} />)}

// Good - using unique ID
{items.map(item => <Item key={item.id} {...item} />)}`,
    followUp: ['What happens when you use array index as key?', 'Can keys be reused across different arrays?'],
    tags: ['keys', 'lists', 'performance'],
    timeEstimate: 3
  },
  {
    id: 'rc-10',
    category: 'React Core',
    question: 'What are Fragments and why are they useful?',
    answer: `Fragments let you group multiple children without adding extra nodes to the DOM. They solve the problem of needing a single parent element without polluting the DOM with unnecessary wrapper divs.

Benefits:
- Cleaner DOM structure
- Slightly better performance (no extra DOM node)
- Required for certain layouts (flexbox, grid children)
- Useful in tables where extra divs would be invalid

Two syntaxes:
- <React.Fragment> (can accept key prop)
- Short syntax: <> </> (no key support)`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Short syntax
function Columns() {
  return (
    <>
      <td>Hello</td>
      <td>World</td>
    </>
  );
}

// With key (for lists)
{items.map(item => (
  <React.Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.description}</dd>
  </React.Fragment>
))}`,
    tags: ['fragments', 'jsx'],
    timeEstimate: 2
  },
  {
    id: 'rc-11',
    category: 'React Core',
    question: 'What are Portals in React?',
    answer: `Portals provide a way to render children into a DOM node that exists outside the parent component's DOM hierarchy. This is useful for modals, tooltips, and dropdowns that need to "break out" of their container.

Key characteristics:
- Event bubbling works as expected (through React tree, not DOM tree)
- Context is preserved
- Useful for z-index and overflow:hidden issues

Use cases:
- Modal dialogs
- Tooltips
- Floating menus
- Widgets that need to escape overflow:hidden containers`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `import { createPortal } from 'react-dom';

function Modal({ children, isOpen }) {
  if (!isOpen) return null;
  
  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">{children}</div>
    </div>,
    document.getElementById('modal-root')
  );
}`,
    tags: ['portals', 'dom', 'modals'],
    timeEstimate: 4
  },
  {
    id: 'rc-12',
    category: 'React Core',
    question: 'What are synthetic events in React?',
    answer: `Synthetic events are React's cross-browser wrapper around native browser events. They provide a consistent interface regardless of the browser being used.

Key features:
- Same interface as native events (stopPropagation, preventDefault)
- Cross-browser compatibility
- Events are pooled for performance (reused across events)
- Camel-case naming (onClick vs onclick)

Note: As of React 17, event pooling was removed, so you no longer need to call e.persist() to access event properties asynchronously.`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `function handleClick(e) {
  // e is a SyntheticEvent
  e.preventDefault();
  console.log(e.nativeEvent); // Access native event if needed
}

<button onClick={handleClick}>Click me</button>`,
    tags: ['events', 'synthetic-events'],
    timeEstimate: 3
  },
  {
    id: 'rc-13',
    category: 'React Core',
    question: 'What is lifting state up?',
    answer: `Lifting state up is a pattern where shared state is moved to the closest common ancestor of components that need it. This ensures a single source of truth and enables sibling components to stay in sync.

When to lift state:
- When multiple components need access to the same state
- When sibling components need to communicate
- When you need to coordinate state across components

The pattern involves:
1. Remove state from child components
2. Move state to common parent
3. Pass state down via props
4. Pass event handlers to update state`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Parent manages shared state
function Parent() {
  const [temperature, setTemperature] = useState(0);
  
  return (
    <>
      <CelsiusInput 
        value={temperature} 
        onChange={setTemperature} 
      />
      <FahrenheitInput 
        value={toFahrenheit(temperature)} 
        onChange={c => setTemperature(toCelsius(c))} 
      />
    </>
  );
}`,
    tags: ['state-management', 'patterns'],
    timeEstimate: 3
  },
  {
    id: 'rc-14',
    category: 'React Core',
    question: 'Explain React Server Components and their benefits.',
    answer: `React Server Components (RSC) are components that render on the server and send HTML to the client, without the component code being sent to the browser.

Benefits:
- Zero client-side JavaScript for server components
- Direct database/filesystem access
- Automatic code splitting
- Reduced bundle size
- Better SEO and initial load performance

Key distinctions:
- Server Components: Can't use hooks or browser APIs
- Client Components: Traditional React components with interactivity
- You can mix both in the same app

RSCs are the foundation for Next.js App Router architecture.`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Server Component (default in Next.js App Router)
async function UserProfile({ id }) {
  const user = await db.user.findUnique({ where: { id } });
  return <div>{user.name}</div>;
}

// Client Component
'use client';
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}`,
    tags: ['rsc', 'server-components', 'next.js'],
    timeEstimate: 5
  },
  {
    id: 'rc-15',
    category: 'React Core',
    question: 'What is prop drilling and how can you avoid it?',
    answer: `Prop drilling is the process of passing props through multiple levels of components to reach a deeply nested component that needs the data.

Problems with prop drilling:
- Makes components tightly coupled
- Hard to maintain and refactor
- Intermediate components receive props they don't use

Solutions:
1. Context API - For global/widely-shared state
2. Component composition - Pass components as children
3. State management libraries (Redux, Zustand)
4. Custom hooks for shared logic`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Instead of prop drilling:
<App user={user}>
  <Layout user={user}>
    <Content user={user}>
      <UserProfile user={user} />
    </Content>
  </Layout>
</App>

// Use Context:
const UserContext = createContext();

function App() {
  return (
    <UserContext.Provider value={user}>
      <Layout><Content><UserProfile /></Content></Layout>
    </UserContext.Provider>
  );
}

function UserProfile() {
  const user = useContext(UserContext);
  return <div>{user.name}</div>;
}`,
    tags: ['prop-drilling', 'context', 'patterns'],
    timeEstimate: 4
  },
  {
    id: 'rc-16',
    category: 'React Core',
    question: 'What is React.memo and when should you use it?',
    answer: `React.memo is a higher-order component that memoizes functional components, preventing re-renders if props haven't changed (shallow comparison).

When to use:
- Pure functional components with expensive renders
- Components that receive the same props frequently
- Components in lists that don't change often

When NOT to use:
- Components that almost always receive different props
- Simple components (memoization overhead > render cost)
- Components that need to re-render with parent

Note: For custom comparison logic, pass a comparison function as the second argument.`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `const ExpensiveComponent = React.memo(function MyComponent({ data }) {
  // expensive render logic
  return <div>{processData(data)}</div>;
});

// With custom comparison
const MyComponent = React.memo(
  function MyComponent({ user }) {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => prevProps.user.id === nextProps.user.id
);`,
    tags: ['memo', 'performance', 'optimization'],
    timeEstimate: 4
  },
  {
    id: 'rc-17',
    category: 'React Core',
    question: 'What is the difference between state and props?',
    answer: `Props (properties) are read-only inputs passed from parent to child components. They cannot be modified by the receiving component.

State is mutable data managed within a component. Changes to state trigger re-renders.

Key differences:
| Props | State |
|-------|-------|
| Passed from parent | Managed within component |
| Immutable (read-only) | Mutable (via setState/useState) |
| Used for configuration | Used for dynamic data |
| Changes come from outside | Changes come from within |

Both props and state changes trigger re-renders.`,
    difficulty: 'beginner',
    type: 'conceptual',
    tags: ['props', 'state', 'fundamentals'],
    timeEstimate: 3
  },
  {
    id: 'rc-18',
    category: 'React Core',
    question: 'Explain the children prop and component composition.',
    answer: `The children prop is a special prop that contains whatever is passed between the opening and closing tags of a component. It enables component composition.

Benefits of composition:
- More flexible than inheritance
- Enables "slots" pattern for customization
- Makes components more reusable
- Follows React's declarative nature

Special cases:
- Single child: React.Children.only()
- Manipulating children: React.Children.map()
- Counting: React.Children.count()`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Basic composition
function Card({ children, title }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// Multiple slots pattern
function Layout({ header, sidebar, children }) {
  return (
    <div className="layout">
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}

<Layout 
  header={<Nav />}
  sidebar={<Menu />}
>
  <Content />
</Layout>`,
    tags: ['children', 'composition', 'patterns'],
    timeEstimate: 4
  },
  {
    id: 'rc-19',
    category: 'React Core',
    question: 'What are Error Boundaries?',
    answer: `Error Boundaries are React components that catch JavaScript errors in their child component tree, log them, and display a fallback UI instead of crashing the whole app.

Key points:
- Must be class components (no hook equivalent yet)
- Implement static getDerivedStateFromError() and/or componentDidCatch()
- Don't catch errors in: event handlers, async code, SSR, errors in the boundary itself

Best practices:
- Wrap route components in error boundaries
- Use multiple boundaries for different parts of UI
- Log errors to error monitoring services`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>`,
    tags: ['error-boundaries', 'error-handling'],
    timeEstimate: 5
  },
  {
    id: 'rc-20',
    category: 'React Core',
    question: 'What is Strict Mode in React?',
    answer: `Strict Mode is a development tool that helps identify potential problems in an application. It doesn't render any visible UI but activates additional checks and warnings.

What Strict Mode detects:
- Components with unsafe lifecycles
- Legacy string ref API usage
- Deprecated findDOMNode usage
- Unexpected side effects
- Legacy context API

In React 18, Strict Mode also:
- Double-invokes effects to catch cleanup bugs
- Simulates unmounting and remounting

Note: Strict Mode only runs in development, not in production.`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `import { StrictMode } from 'react';

function App() {
  return (
    <StrictMode>
      <MainContent />
    </StrictMode>
  );
}`,
    tags: ['strict-mode', 'development', 'debugging'],
    timeEstimate: 3
  },
  {
    id: 'rc-21',
    category: 'React Core',
    question: 'What is the difference between createElement and cloneElement?',
    answer: `createElement creates a new React element from scratch, while cloneElement clones an existing element and allows you to modify its props.

createElement(type, props, ...children):
- Creates a new element
- Used internally by JSX
- First argument is element type (string or component)

cloneElement(element, props, ...children):
- Clones an existing element
- Preserves original key and ref
- Merges new props with original props
- Useful for adding props to children`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// createElement
const element = React.createElement('div', { className: 'box' }, 'Hello');

// cloneElement - useful for enhancing children
function Parent({ children }) {
  return React.Children.map(children, child =>
    React.cloneElement(child, { 
      className: 'enhanced',
      onClick: handleClick 
    })
  );
}`,
    tags: ['createElement', 'cloneElement', 'api'],
    timeEstimate: 4
  },
  {
    id: 'rc-22',
    category: 'React Core',
    question: 'What is the Shadow DOM and how does it differ from the Virtual DOM?',
    answer: `Shadow DOM is a browser API for DOM encapsulation, while Virtual DOM is React's abstraction for efficient DOM updates.

Shadow DOM:
- Browser-native technology
- Used for encapsulating styles and markup
- Creates isolated DOM trees
- Used by Web Components

Virtual DOM:
- JavaScript representation of the DOM
- React-specific concept
- Used for performance optimization
- Enables declarative programming

They serve completely different purposes and can be used together.`,
    difficulty: 'intermediate',
    type: 'conceptual',
    tags: ['shadow-dom', 'virtual-dom', 'browser'],
    timeEstimate: 3
  },
  {
    id: 'rc-23',
    category: 'React Core',
    question: 'How do you conditionally render components in React?',
    answer: `React supports several patterns for conditional rendering:

1. if/else statements - for complex conditions
2. Ternary operator (? :) - for inline conditionals
3. Logical AND (&&) - for "render or nothing"
4. Switch statements - for multiple conditions
5. IIFE - for complex inline logic

Best practices:
- Avoid deeply nested ternaries
- Extract complex conditions to variables
- Consider early returns for cleaner code
- Be careful with && and falsy values (0, '')`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Ternary
{isLoggedIn ? <Dashboard /> : <Login />}

// Logical AND
{hasError && <ErrorMessage />}

// Early return
function Component({ user }) {
  if (!user) return <LoginPrompt />;
  if (user.isPremium) return <PremiumDashboard />;
  return <FreeDashboard />;
}

// Avoid this - renders "0" if count is 0
{count && <Items count={count} />}

// Better
{count > 0 && <Items count={count} />}`,
    tags: ['conditional-rendering', 'jsx', 'patterns'],
    timeEstimate: 3
  },
  {
    id: 'rc-24',
    category: 'React Core',
    question: 'What is the purpose of displayName in React components?',
    answer: `displayName is a property used to give components a name for debugging purposes. It appears in React DevTools and error messages.

When to use:
- HOCs that wrap components
- Components created dynamically
- Anonymous function components
- When component name is minified

React automatically infers displayName from:
- Function name
- Class name
- Variable assignment (const MyComponent = ...)`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// HOC with displayName
function withLogger(WrappedComponent) {
  function WithLogger(props) {
    console.log('Props:', props);
    return <WrappedComponent {...props} />;
  }
  
  WithLogger.displayName = \`WithLogger(\${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })\`;
  
  return WithLogger;
}

// forwardRef with displayName
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref}>{props.children}</button>
));
FancyButton.displayName = 'FancyButton';`,
    tags: ['displayName', 'debugging', 'devtools'],
    timeEstimate: 3
  },
  {
    id: 'rc-25',
    category: 'React Core',
    question: 'What are Pure Components and how do they differ from regular components?',
    answer: `Pure Components are class components that implement shouldComponentUpdate with a shallow prop and state comparison. For functional components, React.memo provides similar functionality.

Regular Component:
- Re-renders on every parent render
- No automatic optimization

Pure Component:
- Shallow comparison of props and state
- Skips render if nothing changed
- Can improve performance

Caveats:
- Shallow comparison only (nested objects won't trigger updates)
- Don't use with complex data structures unless properly memoized
- Can cause bugs if you mutate data`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Class - Pure Component
class MyPureComponent extends React.PureComponent {
  render() {
    return <div>{this.props.value}</div>;
  }
}

// Functional equivalent
const MyComponent = React.memo(function MyComponent({ value }) {
  return <div>{value}</div>;
});

// With custom comparison
const MyComponent = React.memo(
  ({ data }) => <div>{data.value}</div>,
  (prevProps, nextProps) => prevProps.data.id === nextProps.data.id
);`,
    tags: ['pure-components', 'performance', 'optimization'],
    timeEstimate: 4
  },
  {
    id: 'rc-26',
    category: 'React Core',
    question: 'What is forwardRef and when would you use it?',
    answer: `forwardRef is a technique for passing a ref through a component to one of its children. It's necessary because refs are not passed like regular props.

Use cases:
1. Wrapper components that need to expose child's ref
2. HOCs that need to forward refs
3. UI component libraries
4. Focus management
5. Imperative animations

Note: With React 19, refs can be passed as regular props, making forwardRef less necessary.`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `const FancyInput = React.forwardRef((props, ref) => (
  <input ref={ref} className="fancy-input" {...props} />
));

// Usage
function Form() {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  return (
    <>
      <FancyInput ref={inputRef} placeholder="Enter text" />
      <button onClick={focusInput}>Focus Input</button>
    </>
  );
}`,
    tags: ['forwardRef', 'refs', 'patterns'],
    timeEstimate: 4
  },
  {
    id: 'rc-27',
    category: 'React Core',
    question: 'Explain the component lifecycle in class components.',
    answer: `React class components go through three main phases: Mounting, Updating, and Unmounting.

Mounting (component is created):
1. constructor()
2. static getDerivedStateFromProps()
3. render()
4. componentDidMount()

Updating (props/state change):
1. static getDerivedStateFromProps()
2. shouldComponentUpdate()
3. render()
4. getSnapshotBeforeUpdate()
5. componentDidUpdate()

Unmounting:
1. componentWillUnmount()

Error Handling:
- static getDerivedStateFromError()
- componentDidCatch()`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `class LifecycleDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  
  componentDidMount() {
    // Fetch data, setup subscriptions
    this.subscription = subscribe();
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.count !== this.state.count;
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (prevState.count !== this.state.count) {
      // React to state changes
    }
  }
  
  componentWillUnmount() {
    // Cleanup subscriptions
    this.subscription.unsubscribe();
  }
  
  render() {
    return <div>{this.state.count}</div>;
  }
}`,
    tags: ['lifecycle', 'class-components', 'fundamentals'],
    timeEstimate: 5
  },
  {
    id: 'rc-28',
    category: 'React Core',
    question: 'What is the difference between render props and HOCs?',
    answer: `Both are patterns for sharing component logic, but they work differently:

Render Props:
- Pass a function as prop that returns React elements
- More explicit about what's being shared
- Easier to compose multiple behaviors
- Can lead to "callback hell" if overused

HOCs:
- Function that takes a component, returns enhanced component
- Props are implicitly passed
- Can be composed (but order matters)
- Harder to trace where props come from

Modern alternative: Custom Hooks provide cleaner logic sharing for most use cases.`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Render Props
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  return render(position);
}

<MouseTracker render={({ x, y }) => <Cursor x={x} y={y} />} />

// HOC
function withMouse(Component) {
  return function WithMouse(props) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    return <Component {...props} mouse={position} />;
  };
}

const CursorWithMouse = withMouse(Cursor);

// Modern: Custom Hook
function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // ... event listeners
  return position;
}`,
    tags: ['render-props', 'hoc', 'patterns'],
    timeEstimate: 5
  },
  {
    id: 'rc-29',
    category: 'React Core',
    question: 'How does React handle events differently from vanilla JavaScript?',
    answer: `React's event system differs from vanilla JavaScript in several ways:

1. Naming: camelCase (onClick) vs lowercase (onclick)
2. Handler: Function reference vs string
3. preventDefault: Must call explicitly (return false doesn't work)
4. Synthetic Events: Cross-browser wrapper
5. Event Delegation: Events are delegated to root, not individual elements (React 17+: to root container)

Other differences:
- Event pooling (removed in React 17)
- Capture phase events with onClickCapture
- Passive event listeners for scroll/touch`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// HTML
<button onclick="handleClick()">Click</button>

// React
<button onClick={handleClick}>Click</button>

// Preventing default
function handleSubmit(e) {
  e.preventDefault(); // Required - return false doesn't work
  // handle form
}

// Accessing native event
function handleClick(e) {
  console.log(e.nativeEvent); // Native browser event
}

// Capture phase
<div onClickCapture={handleCapture}>
  <button onClick={handleClick}>Click</button>
</div>`,
    tags: ['events', 'dom', 'fundamentals'],
    timeEstimate: 4
  },
  {
    id: 'rc-30',
    category: 'React Core',
    question: 'What is batching in React and how has it changed in React 18?',
    answer: `Batching is React's optimization of grouping multiple state updates into a single re-render for better performance.

Before React 18:
- Only batched updates inside React event handlers
- Updates in setTimeout, promises, native events were NOT batched

React 18 (Automatic Batching):
- All updates are batched by default
- Works in timeouts, promises, native events
- Consistent behavior everywhere

To opt out of batching, use flushSync() from react-dom.`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// React 18 - All batched automatically
function handleClick() {
  setCount(c => c + 1); // No re-render yet
  setFlag(f => !f);     // No re-render yet
  // React re-renders once at the end
}

// Even in async code (React 18)
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // Single re-render in React 18
}, 1000);

// Opt out with flushSync
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCount(c => c + 1);
  });
  // DOM updated here
  flushSync(() => {
    setFlag(f => !f);
  });
  // DOM updated here
}`,
    tags: ['batching', 'react-18', 'performance'],
    timeEstimate: 4
  },
  {
    id: 'rc-31',
    category: 'React Core',
    question: 'What is hydration in React?',
    answer: `Hydration is the process of attaching React to server-rendered HTML. React takes over the static HTML and makes it interactive without re-rendering it.

Process:
1. Server renders HTML string
2. HTML is sent to client
3. React "hydrates" - attaches event listeners to existing markup
4. App becomes interactive

Requirements:
- Server and client render must produce identical HTML
- Use hydrateRoot() instead of createRoot()

Common hydration errors:
- Mismatched content between server/client
- Using browser-only APIs during initial render
- Different data on server vs client`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Server-side
import { renderToString } from 'react-dom/server';
const html = renderToString(<App />);

// Client-side
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);

// Avoiding hydration mismatch
function Component() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient ? <ClientOnlyComponent /> : <Placeholder />;
}`,
    tags: ['hydration', 'ssr', 'server-rendering'],
    timeEstimate: 4
  },
  {
    id: 'rc-32',
    category: 'React Core',
    question: 'What are the rules of JSX?',
    answer: `JSX has several rules that must be followed:

1. Return a single root element
   - Use fragments <>...</> or wrapper div

2. Close all tags
   - Self-closing: <img />, <input />

3. camelCase for attributes
   - className (not class)
   - htmlFor (not for)
   - tabIndex (not tabindex)

4. JavaScript expressions in curly braces
   - {expression}
   - No statements (if, for)

5. Style is an object
   - style={{ color: 'red' }}

6. Comments use {/* */}`,
    difficulty: 'beginner',
    type: 'conceptual',
    codeExample: `// Valid JSX
function ValidJSX() {
  return (
    <>
      <label htmlFor="name" className="label">
        Name:
      </label>
      <input 
        id="name" 
        type="text"
        style={{ border: '1px solid black' }}
        tabIndex={1}
      />
      {/* This is a comment */}
      <img src="/logo.png" alt="Logo" />
      {items.map(item => <Item key={item.id} {...item} />)}
    </>
  );
}`,
    tags: ['jsx', 'syntax', 'fundamentals'],
    timeEstimate: 3
  },
  {
    id: 'rc-33',
    category: 'React Core',
    question: 'How do you handle forms in React?',
    answer: `React supports both controlled and uncontrolled forms:

Controlled Forms (Recommended):
- Form data handled by React state
- Input values bound to state
- onChange handlers update state
- Full control over input values

Uncontrolled Forms:
- Form data handled by DOM
- Use refs to access values
- defaultValue instead of value
- Simpler for basic cases

Modern approaches:
- React Hook Form (performance)
- Formik (feature-rich)
- Conform (progressive enhancement)`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Controlled Form
function ControlledForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
}`,
    tags: ['forms', 'controlled', 'input'],
    timeEstimate: 4
  },
  {
    id: 'rc-34',
    category: 'React Core',
    question: 'What is the difference between defaultProps and default parameters?',
    answer: `Both set default values for props, but they work differently:

defaultProps:
- Class component pattern
- Defined outside component
- Works with PropTypes
- Being deprecated for function components

Default Parameters:
- ES6 feature in function signature
- More intuitive for function components
- Works with destructuring
- Recommended for function components

Note: defaultProps is being phased out for function components in favor of default parameters.`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// defaultProps (older pattern)
function Button({ color, size }) {
  return <button className={\`btn-\${color} btn-\${size}\`}>Click</button>;
}
Button.defaultProps = {
  color: 'blue',
  size: 'medium'
};

// Default parameters (recommended)
function Button({ color = 'blue', size = 'medium' }) {
  return <button className={\`btn-\${color} btn-\${size}\`}>Click</button>;
}

// With TypeScript
interface ButtonProps {
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

function Button({ color = 'blue', size = 'medium' }: ButtonProps) {
  return <button className={\`btn-\${color} btn-\${size}\`}>Click</button>;
}`,
    tags: ['props', 'defaults', 'patterns'],
    timeEstimate: 3
  },
  {
    id: 'rc-35',
    category: 'React Core',
    question: 'What is the purpose of dangerouslySetInnerHTML?',
    answer: `dangerouslySetInnerHTML is React's replacement for innerHTML. It's named "dangerously" to remind developers of XSS risks.

Use cases:
- Rendering sanitized HTML from CMS
- Markdown converted to HTML
- Rich text editor content
- Third-party widget integration

Security considerations:
- Always sanitize HTML before rendering
- Use libraries like DOMPurify
- Never render unsanitized user input
- Consider alternatives when possible`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `import DOMPurify from 'dompurify';

function RichContent({ html }) {
  // ALWAYS sanitize HTML
  const sanitizedHtml = DOMPurify.sanitize(html);
  
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}

// BAD - XSS vulnerability!
function UnsafeContent({ userInput }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: userInput }} />
  );
}

// Alternative for simple cases
function SafeContent({ text }) {
  return <div>{text}</div>; // Automatically escaped
}`,
    tags: ['security', 'innerHTML', 'xss'],
    timeEstimate: 4
  },
  {
    id: 'rc-36',
    category: 'React Core',
    question: 'How do you handle multiple inputs in a single handler?',
    answer: `Instead of creating separate handlers for each input, use a single handler with computed property names and the input's name attribute.

Benefits:
- Less code duplication
- Easier to maintain
- Scalable for large forms
- Works with any number of inputs

Pattern:
1. Give each input a name attribute
2. Use event.target.name to identify the input
3. Use computed property names [name]: value`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `function MultiInputForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  // Single handler for all inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  return (
    <form>
      <input name="firstName" value={formData.firstName} onChange={handleChange} />
      <input name="lastName" value={formData.lastName} onChange={handleChange} />
      <input name="email" type="email" value={formData.email} onChange={handleChange} />
      <input name="phone" type="tel" value={formData.phone} onChange={handleChange} />
    </form>
  );
}`,
    tags: ['forms', 'patterns', 'handlers'],
    timeEstimate: 3
  },
  {
    id: 'rc-37',
    category: 'React Core',
    question: 'What is the difference between React and ReactDOM?',
    answer: `React and ReactDOM are separate packages serving different purposes:

React (react):
- Core library for building components
- Contains createElement, Component, hooks
- Platform-agnostic
- Can be used with any renderer

ReactDOM (react-dom):
- Renderer for web browsers
- Contains createRoot, render, hydrate
- DOM-specific methods
- Bridges React and browser DOM

Other renderers:
- react-native (mobile)
- react-three-fiber (3D/WebGL)
- ink (CLI)
- react-pdf (PDF)`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// react - core library
import { useState, useEffect, Component } from 'react';

// react-dom - browser renderer
import { createRoot } from 'react-dom/client';

// Entry point
const root = createRoot(document.getElementById('root'));
root.render(<App />);

// Server rendering
import { renderToString } from 'react-dom/server';
const html = renderToString(<App />);`,
    tags: ['react', 'react-dom', 'architecture'],
    timeEstimate: 3
  },
  {
    id: 'rc-38',
    category: 'React Core',
    question: 'How do you prevent a component from rendering?',
    answer: `There are several ways to prevent rendering:

1. Return null - Renders nothing
2. Conditional rendering - Don't include in tree
3. shouldComponentUpdate - Class components
4. React.memo - Function components
5. useMemo - For expensive calculations

When to use each:
- null: Hide component completely
- Conditional: Mount/unmount based on condition
- memo: Skip re-render if props unchanged
- shouldComponentUpdate: Fine-grained control`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Return null
function ConditionalComponent({ show }) {
  if (!show) return null;
  return <div>Visible</div>;
}

// Conditional in parent
function Parent({ showChild }) {
  return (
    <div>
      {showChild && <Child />}
    </div>
  );
}

// React.memo - skip if props same
const MemoizedComponent = React.memo(function MyComponent({ data }) {
  return <div>{data}</div>;
});

// shouldComponentUpdate - class
class MyComponent extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.id !== this.props.id;
  }
}`,
    tags: ['rendering', 'optimization', 'conditional'],
    timeEstimate: 4
  },
  {
    id: 'rc-39',
    category: 'React Core',
    question: 'What are the common patterns for sharing logic between components?',
    answer: `React offers several patterns for sharing logic:

1. Custom Hooks (Recommended)
   - Share stateful logic
   - Composable and reusable
   - Clean separation of concerns

2. Render Props
   - Explicit about dependencies
   - More flexible but verbose

3. Higher-Order Components
   - Wrap components with behavior
   - Can obscure prop sources

4. Component Composition
   - Children and slots
   - Most straightforward

5. Context API
   - Share state across tree
   - Avoid prop drilling`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Custom Hook (Best for most cases)
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
}

// Usage
function MyComponent() {
  const { width, height } = useWindowSize();
  return <div>Window: {width} x {height}</div>;
}`,
    tags: ['patterns', 'hooks', 'composition'],
    timeEstimate: 5
  },
  {
    id: 'rc-40',
    category: 'React Core',
    question: 'What is the purpose of the key prop when not using lists?',
    answer: `The key prop can be used outside of lists to force React to remount a component, resetting all state.

Use cases:
1. Reset form state when editing different items
2. Restart animations
3. Reinitialize effects
4. Clear component state on navigation
5. Force full re-render of third-party components

This works because changing the key tells React it's a completely different component instance.`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Reset form when user changes
function UserEditor({ userId }) {
  return (
    <UserForm key={userId} userId={userId} />
  );
}

// UserForm starts fresh for each userId
function UserForm({ userId }) {
  const [formData, setFormData] = useState({});
  
  useEffect(() => {
    fetchUser(userId).then(setFormData);
  }, [userId]);
  
  return <form>...</form>;
}

// Reset animation
function AnimatedComponent({ trigger }) {
  return (
    <motion.div key={trigger} animate={{ opacity: 1 }}>
      Content
    </motion.div>
  );
}`,
    tags: ['keys', 'state-reset', 'patterns'],
    timeEstimate: 4
  }
];

