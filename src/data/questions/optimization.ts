import { Question } from '../types';

export const optimizationQuestions: Question[] = [
  {
    id: 'opt-1',
    category: 'Optimization',
    question: 'What causes unnecessary re-renders in React and how do you prevent them?',
    answer: `Common causes of unnecessary re-renders:

1. Parent component re-rendering
   → Use React.memo() for pure components

2. Unstable references (objects/arrays/functions)
   → Use useMemo/useCallback

3. Context updates
   → Split contexts, use selectors

4. State updates with same value
   → React bails out automatically for primitives

Detection tools:
- React DevTools Profiler
- why-did-you-render library

Remember: Not all re-renders are bad. Optimize only when needed.`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Problem: Child re-renders when parent state changes
function Parent() {
  const [count, setCount] = useState(0);
  
  // ❌ New object every render
  const style = { color: 'red' };
  // ❌ New function every render
  const handleClick = () => console.log('clicked');
  
  return <Child style={style} onClick={handleClick} />;
}

// Solution
function Parent() {
  const [count, setCount] = useState(0);
  
  // ✅ Stable reference
  const style = useMemo(() => ({ color: 'red' }), []);
  // ✅ Stable reference
  const handleClick = useCallback(() => console.log('clicked'), []);
  
  return <MemoizedChild style={style} onClick={handleClick} />;
}

const MemoizedChild = React.memo(function Child({ style, onClick }) {
  return <button style={style} onClick={onClick}>Click</button>;
});`,
    tags: ['optimization', 'performance', 're-renders', 'memoization'],
    timeEstimate: 6
  },
  {
    id: 'opt-2',
    category: 'Optimization',
    question: 'Explain code splitting and lazy loading in React.',
    answer: `Code splitting divides your bundle into smaller chunks loaded on demand, reducing initial load time.

React.lazy() for component-level splitting:
- Only loads component when rendered
- Must be wrapped in Suspense
- Works with default exports only

Route-based splitting:
- Most common pattern
- Split at route level for biggest impact

Library-level splitting:
- Import heavy libraries dynamically
- Load only when needed`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Component-level lazy loading
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));
const AdminPanel = lazy(() => import('./AdminPanel'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/charts" element={<HeavyChart />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Suspense>
  );
}

// Named export workaround
const MyComponent = lazy(() =>
  import('./components').then(module => ({
    default: module.MyComponent
  }))
);

// Dynamic import for libraries
async function handleExport() {
  const xlsx = await import('xlsx');
  xlsx.writeFile(workbook, 'data.xlsx');
}

// Preloading for better UX
const ChartComponent = lazy(() => import('./Chart'));

function Dashboard() {
  // Preload on hover
  const handleHover = () => {
    import('./Chart');
  };
  
  return <button onMouseEnter={handleHover}>View Chart</button>;
}`,
    tags: ['optimization', 'code-splitting', 'lazy-loading', 'bundle'],
    timeEstimate: 5
  },
  {
    id: 'opt-3',
    category: 'Optimization',
    question: 'What is the windowing/virtualization technique and when should you use it?',
    answer: `Windowing (virtualization) renders only visible items in long lists, dramatically reducing DOM nodes and improving performance.

When to use:
- Lists with 100+ items
- Grid views with many cells
- Tables with many rows
- Infinite scroll implementations

Popular libraries:
- react-window (lightweight, modern)
- react-virtualized (feature-rich)
- TanStack Virtual (framework-agnostic)

Key concept: Only render items in viewport + buffer zone.`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `import { FixedSizeList } from 'react-window';

// Basic virtualized list
function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style} className="row">
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      width="100%"
      itemCount={items.length}
      itemSize={50}
    >
      {Row}
    </FixedSizeList>
  );
}

// Variable size list
import { VariableSizeList } from 'react-window';

function VariableList({ items }) {
  const getItemSize = index => items[index].expanded ? 100 : 50;
  
  return (
    <VariableSizeList
      height={600}
      itemCount={items.length}
      itemSize={getItemSize}
    >
      {Row}
    </VariableSizeList>
  );
}

// With infinite loading
import InfiniteLoader from 'react-window-infinite-loader';

function InfiniteList({ hasMore, loadMore, items }) {
  return (
    <InfiniteLoader
      isItemLoaded={index => index < items.length}
      itemCount={hasMore ? items.length + 1 : items.length}
      loadMoreItems={loadMore}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          ref={ref}
          onItemsRendered={onItemsRendered}
          itemCount={items.length}
          itemSize={50}
          height={600}
        >
          {Row}
        </FixedSizeList>
      )}
    </InfiniteLoader>
  );
}`,
    tags: ['optimization', 'virtualization', 'windowing', 'lists'],
    timeEstimate: 5
  },
  {
    id: 'opt-4',
    category: 'Optimization',
    question: 'How do you optimize React Context to prevent unnecessary re-renders?',
    answer: `Context causes all consumers to re-render when value changes. Optimization strategies:

1. Split contexts by update frequency
2. Memoize context value
3. Split state and dispatch contexts
4. Use context selectors (libraries)
5. Move state closer to where it's needed

Key insight: Context is not designed to be a state management solution for frequently changing values.`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// ❌ Bad: Single context for everything
const AppContext = createContext();
function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [locale, setLocale] = useState('en');
  
  // All consumers re-render on ANY change
  return (
    <AppContext.Provider value={{ user, theme, locale, setUser, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

// ✅ Good: Split by update frequency
const UserContext = createContext();
const ThemeContext = createContext();

// ✅ Good: Memoize value
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

// ✅ Good: Split state and dispatch
const StateContext = createContext();
const DispatchContext = createContext();

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

// Components only reading dispatch don't re-render on state changes
function AddButton() {
  const dispatch = useContext(DispatchContext); // Stable reference
  return <button onClick={() => dispatch({ type: 'add' })}>Add</button>;
}`,
    tags: ['optimization', 'context', 'performance', 're-renders'],
    timeEstimate: 6
  },
  {
    id: 'opt-5',
    category: 'Optimization',
    question: 'Explain debouncing and throttling. When would you use each?',
    answer: `Both limit how often a function executes:

Debouncing: Delays execution until after a pause in events
- Use for: Search input, resize handlers, form validation
- Waits for user to "stop" before executing

Throttling: Limits execution to once per time period
- Use for: Scroll events, mousemove, rate limiting
- Executes at regular intervals during continuous events

In React, implement with useCallback and useRef, or use libraries like lodash.`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Custom useDebounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage for search
function Search() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery);
    }
  }, [debouncedQuery]);
  
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}

// Custom useThrottle hook
function useThrottle(callback, delay) {
  const lastRan = useRef(Date.now());
  
  return useCallback((...args) => {
    if (Date.now() - lastRan.current >= delay) {
      callback(...args);
      lastRan.current = Date.now();
    }
  }, [callback, delay]);
}

// Usage for scroll
function ScrollHandler() {
  const handleScroll = useThrottle(() => {
    console.log('Scroll position:', window.scrollY);
  }, 100);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
}`,
    tags: ['optimization', 'debounce', 'throttle', 'events'],
    timeEstimate: 5
  },
  {
    id: 'opt-6',
    category: 'Optimization',
    question: 'How do you measure and analyze React performance?',
    answer: `Performance measurement tools:

1. React DevTools Profiler
   - Flame graph of component renders
   - Ranked chart of render times
   - Identifies why components rendered

2. Browser DevTools
   - Performance tab for overall app
   - Memory tab for leaks
   - Lighthouse for audits

3. React.Profiler component
   - Programmatic performance measurement
   - Log or send metrics to analytics

4. why-did-you-render library
   - Logs unnecessary re-renders
   - Shows what changed

Key metrics: LCP, FID, CLS, TTI, bundle size`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// React Profiler component
import { Profiler } from 'react';

function onRenderCallback(
  id,                // Component tree id
  phase,             // "mount" or "update"
  actualDuration,    // Time spent rendering
  baseDuration,      // Estimated render without memoization
  startTime,         // When React started rendering
  commitTime,        // When React committed
  interactions       // Set of interactions
) {
  // Log to analytics
  analytics.track('render', {
    component: id,
    phase,
    duration: actualDuration
  });
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <MainContent />
    </Profiler>
  );
}

// Using why-did-you-render
// In development setup file
import React from 'react';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}

// On specific components
MyComponent.whyDidYouRender = true;

// Measuring with Performance API
function expensiveOperation() {
  performance.mark('start');
  // ... operation
  performance.mark('end');
  performance.measure('expensiveOperation', 'start', 'end');
  
  const [measure] = performance.getEntriesByName('expensiveOperation');
  console.log(\`Operation took \${measure.duration}ms\`);
}`,
    tags: ['optimization', 'performance', 'profiling', 'devtools'],
    timeEstimate: 5
  },
  {
    id: 'opt-7',
    category: 'Optimization',
    question: 'What are Web Vitals and how do you optimize them in React?',
    answer: `Core Web Vitals are Google's key metrics for user experience:

LCP (Largest Contentful Paint) - Loading
- Target: < 2.5s
- Optimize: Image optimization, SSR/SSG, preload critical resources

FID (First Input Delay) - Interactivity
- Target: < 100ms
- Optimize: Code splitting, defer non-critical JS, web workers

CLS (Cumulative Layout Shift) - Visual Stability
- Target: < 0.1
- Optimize: Reserve space for images/ads, avoid inserting content above existing

INP (Interaction to Next Paint) - Responsiveness
- Target: < 200ms
- Optimize: Reduce JavaScript execution time`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Measuring Web Vitals
import { getCLS, getFID, getLCP, getTTFB, getINP } from 'web-vitals';

function sendToAnalytics({ name, delta, id }) {
  analytics.send({
    metric: name,
    value: delta,
    id
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
getINP(sendToAnalytics);

// LCP Optimization - Preload critical image
<link rel="preload" as="image" href="/hero.jpg" />

// CLS Optimization - Reserve space
function ImageWithDimensions({ src, alt }) {
  return (
    <div style={{ aspectRatio: '16/9', position: 'relative' }}>
      <Image src={src} alt={alt} fill />
    </div>
  );
}

// FID Optimization - Defer non-critical work
useEffect(() => {
  // Use requestIdleCallback for non-critical work
  const id = requestIdleCallback(() => {
    initializeAnalytics();
    loadNonCriticalFeatures();
  });
  
  return () => cancelIdleCallback(id);
}, []);

// Use React.startTransition for non-urgent updates
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();
  
  function handleSearch(q) {
    startTransition(() => {
      setResults(filterResults(q));
    });
  }
}`,
    tags: ['optimization', 'web-vitals', 'performance', 'lcp', 'cls'],
    timeEstimate: 6
  },
  {
    id: 'opt-8',
    category: 'Optimization',
    question: 'How do you optimize images for web performance?',
    answer: `Image optimization strategies:

1. Format selection
   - WebP/AVIF for photos (30-50% smaller)
   - SVG for icons and illustrations
   - PNG for transparency needs

2. Responsive images
   - srcset and sizes attributes
   - Art direction with <picture>

3. Loading strategies
   - Lazy loading (loading="lazy")
   - Priority hints for LCP images
   - Blur-up placeholder technique

4. Compression
   - Lossy compression for photos
   - Proper dimensions (don't scale down in CSS)

Next.js Image component handles most of this automatically.`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Native lazy loading
<img src="image.jpg" loading="lazy" alt="..." />

// Responsive images with srcset
<img
  src="image-800.jpg"
  srcSet="
    image-400.jpg 400w,
    image-800.jpg 800w,
    image-1200.jpg 1200w
  "
  sizes="(max-width: 600px) 400px, 800px"
  alt="..."
/>

// Art direction with picture
<picture>
  <source media="(min-width: 800px)" srcSet="wide.jpg" />
  <source media="(min-width: 400px)" srcSet="medium.jpg" />
  <img src="narrow.jpg" alt="..." />
</picture>

// Next.js Image optimization
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority  // LCP image - no lazy load
  placeholder="blur"
  blurDataURL={blurDataUrl}
  sizes="100vw"
/>

// Blur placeholder generation
import { getPlaiceholder } from 'plaiceholder';

async function getBlurDataUrl(src) {
  const { base64 } = await getPlaiceholder(src);
  return base64;
}`,
    tags: ['optimization', 'images', 'performance', 'responsive'],
    timeEstimate: 4
  },
  {
    id: 'opt-9',
    category: 'Optimization',
    question: 'Explain React Concurrent Features and how they improve performance.',
    answer: `Concurrent Features allow React to interrupt rendering to handle more urgent updates, improving perceived performance.

Key features:

1. useTransition - Mark updates as non-urgent
2. useDeferredValue - Defer updating a value
3. Suspense - Declarative loading states
4. Streaming SSR - Progressive page loading

Benefits:
- Keep UI responsive during heavy updates
- Avoid blocking user input
- Better loading experiences
- Automatic batching in React 18`,
    difficulty: 'expert',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// useTransition - Non-blocking updates
function FilteredList({ items }) {
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [isPending, startTransition] = useTransition();
  
  function handleChange(e) {
    setQuery(e.target.value); // Urgent - update input immediately
    
    startTransition(() => {
      // Non-urgent - can be interrupted
      setFilteredItems(items.filter(item => 
        item.name.includes(e.target.value)
      ));
    });
  }
  
  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <List items={filteredItems} />
    </>
  );
}

// useDeferredValue - Defer expensive computation
function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  
  // Results based on deferred (possibly stale) value
  const results = useMemo(
    () => expensiveFilter(items, deferredQuery),
    [deferredQuery]
  );
  
  return (
    <div style={{ opacity: isStale ? 0.7 : 1 }}>
      <ResultsList results={results} />
    </div>
  );
}

// Suspense for data fetching (with React 18+ patterns)
function Profile({ userId }) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileDetails userId={userId} />
      <Suspense fallback={<PostsSkeleton />}>
        <ProfilePosts userId={userId} />
      </Suspense>
    </Suspense>
  );
}`,
    tags: ['optimization', 'concurrent', 'useTransition', 'suspense'],
    timeEstimate: 6
  },
  {
    id: 'opt-10',
    category: 'Optimization',
    question: 'How do you reduce bundle size in a React application?',
    answer: `Bundle size reduction strategies:

1. Code splitting
   - Route-based with React.lazy
   - Component-level for heavy features

2. Tree shaking
   - Use ES modules
   - Import only what you need

3. Bundle analysis
   - webpack-bundle-analyzer
   - source-map-explorer

4. Dependency optimization
   - Replace heavy libs with lighter alternatives
   - Use dynamic imports for occasional features

5. Compression
   - Gzip/Brotli compression
   - Minification`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Import optimization
// ❌ Bad - imports entire library
import _ from 'lodash';
const result = _.debounce(fn, 300);

// ✅ Good - imports only needed function
import debounce from 'lodash/debounce';
const result = debounce(fn, 300);

// Or even better - use native or lighter alternative
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Bundle analysis in Next.js
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // config
});

// Run: ANALYZE=true npm run build

// Dynamic import for heavy libraries
async function generatePDF() {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  // ...
}

// Replace heavy dependencies
// ❌ moment.js (~300KB)
import moment from 'moment';

// ✅ date-fns (~13KB for used functions)
import { format, parseISO } from 'date-fns';

// ✅ or native Intl API (0KB)
new Intl.DateTimeFormat('en-US').format(date);`,
    tags: ['optimization', 'bundle-size', 'tree-shaking', 'webpack'],
    timeEstimate: 5
  },
  {
    id: 'opt-11',
    category: 'Optimization',
    question: 'What is windowing/virtualization and when should you use it?',
    answer: `Windowing (virtualization) renders only visible items in a list, dramatically improving performance for large datasets.

How it works:
- Calculate visible viewport area
- Render only items in view (plus buffer)
- Recycle DOM nodes as user scrolls
- Maintain scroll position illusion

Use when:
- Lists > 100 items
- Complex list item components
- Mobile/low-power devices
- Memory-constrained environments`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Using react-window
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );
  
  return (
    <FixedSizeList
      height={400}
      width="100%"
      itemCount={items.length}
      itemSize={50}
    >
      {Row}
    </FixedSizeList>
  );
}

// Using @tanstack/react-virtual
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5 // Render 5 extra items as buffer
  });
  
  return (
    <div ref={parentRef} style={{ height: 400, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              transform: \`translateY(\${virtualRow.start}px)\`,
              height: virtualRow.size
            }}
          >
            {items[virtualRow.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    tags: ['optimization', 'virtualization', 'windowing', 'lists'],
    timeEstimate: 5
  },
  {
    id: 'opt-12',
    category: 'Optimization',
    question: 'How do you measure and improve Largest Contentful Paint (LCP)?',
    answer: `LCP measures loading performance - when the largest content element becomes visible. Target: under 2.5 seconds.

Common LCP elements:
- Hero images
- Large text blocks
- Video poster images
- Background images via url()

Improvement strategies:
- Preload critical resources
- Optimize image delivery
- Use priority attribute on images
- Remove render-blocking resources
- Use CDN for static assets`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Preload critical hero image
<head>
  <link 
    rel="preload" 
    href="/hero.jpg" 
    as="image"
    fetchpriority="high"
  />
</head>

// Next.js - priority prop for LCP image
import Image from 'next/image';

function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1200}
      height={600}
      priority // Preloads and disables lazy loading
      sizes="100vw"
    />
  );
}

// Preconnect to external origins
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://cdn.example.com" />

// Inline critical CSS
<style dangerouslySetInnerHTML={{ __html: criticalCSS }} />

// Measure LCP with web-vitals
import { onLCP } from 'web-vitals';

onLCP(metric => {
  console.log('LCP:', metric.value);
  // Send to analytics
  sendToAnalytics({
    name: metric.name,
    value: metric.value,
    id: metric.id
  });
});

// Check LCP element in DevTools
// Performance tab > Timings > LCP
// Shows which element triggered LCP`,
    tags: ['optimization', 'lcp', 'web-vitals', 'performance'],
    timeEstimate: 5
  },
  {
    id: 'opt-13',
    category: 'Optimization',
    question: 'What is Cumulative Layout Shift (CLS) and how do you prevent it?',
    answer: `CLS measures visual stability - unexpected layout shifts during page load. Target: under 0.1.

Common causes:
- Images without dimensions
- Ads/embeds without reserved space
- Dynamically injected content
- Web fonts causing FOIT/FOUT
- Animations using layout properties

Prevention strategies:
- Always set width/height on images
- Reserve space for dynamic content
- Use transform for animations
- Preload fonts with font-display`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Always specify image dimensions
<img src="/photo.jpg" width={800} height={600} alt="Photo" />

// Next.js Image handles this automatically
<Image src="/photo.jpg" width={800} height={600} alt="Photo" />

// Reserve space for dynamic content
.ad-container {
  min-height: 250px; /* Reserve ad space */
}

// Skeleton loaders prevent CLS
function ArticleWithSkeleton() {
  const { data, loading } = useArticle();
  
  if (loading) {
    return (
      <div className="article">
        <div className="skeleton-title" style={{ height: 32 }} />
        <div className="skeleton-content" style={{ height: 400 }} />
      </div>
    );
  }
  
  return <Article data={data} />;
}

// Use transform instead of layout properties
/* ❌ Causes layout shift */
.animated {
  margin-left: 0;
  transition: margin-left 0.3s;
}
.animated:hover {
  margin-left: 10px;
}

/* ✅ No layout shift */
.animated {
  transform: translateX(0);
  transition: transform 0.3s;
}
.animated:hover {
  transform: translateX(10px);
}

// Font loading without CLS
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: optional; /* or swap with size-adjust */
  size-adjust: 102%; /* Reduce font swap shift */
}`,
    tags: ['optimization', 'cls', 'web-vitals', 'layout-shift'],
    timeEstimate: 5
  },
  {
    id: 'opt-14',
    category: 'Optimization',
    question: 'What is Interaction to Next Paint (INP) and how do you improve it?',
    answer: `INP measures responsiveness - delay between user interaction and visual feedback. Target: under 200ms. Replaced FID in Core Web Vitals (March 2024).

INP considers all interactions:
- Clicks
- Taps
- Key presses

Improvement strategies:
- Break up long tasks
- Reduce main thread work
- Use web workers
- Defer non-critical JavaScript
- Optimize event handlers`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Break up long tasks with scheduler.yield()
async function processItems(items) {
  for (const item of items) {
    processItem(item);
    
    // Yield to main thread periodically
    if (navigator.scheduling?.isInputPending()) {
      await scheduler.yield();
    }
  }
}

// Or use requestIdleCallback
function processInChunks(items, callback) {
  let index = 0;
  
  function chunk(deadline) {
    while (index < items.length && deadline.timeRemaining() > 0) {
      callback(items[index]);
      index++;
    }
    
    if (index < items.length) {
      requestIdleCallback(chunk);
    }
  }
  
  requestIdleCallback(chunk);
}

// Debounce expensive handlers
function SearchInput() {
  const [query, setQuery] = useState('');
  
  // Expensive operation on each keystroke = bad INP
  // const results = expensiveSearch(query);
  
  // Better: debounce
  const debouncedSearch = useDebouncedCallback(
    (q) => setResults(expensiveSearch(q)),
    300
  );
  
  return (
    <input 
      value={query}
      onChange={e => {
        setQuery(e.target.value); // Immediate feedback
        debouncedSearch(e.target.value); // Deferred work
      }}
    />
  );
}

// Use startTransition for non-urgent updates
function FilterList({ items }) {
  const [filter, setFilter] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  
  function handleFilter(e) {
    setFilter(e.target.value);
    
    startTransition(() => {
      // Can be interrupted - won't block input
      setFilteredItems(items.filter(i => 
        i.name.includes(e.target.value)
      ));
    });
  }
}`,
    tags: ['optimization', 'inp', 'web-vitals', 'responsiveness'],
    timeEstimate: 5
  },
  {
    id: 'opt-15',
    category: 'Optimization',
    question: 'How do you implement lazy loading for routes in React?',
    answer: `Route-based code splitting loads route components only when navigated to, reducing initial bundle size.

Implementation:
- React.lazy() for component import
- Suspense for loading state
- Preloading on hover/intent
- Error boundaries for failures

Benefits:
- Smaller initial bundle
- Faster first load
- Better caching (per-route chunks)`,
    difficulty: 'intermediate',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy load route components
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// Preload on hover for instant navigation
const dashboardImport = () => import('./pages/Dashboard');
const Dashboard = lazy(dashboardImport);

function NavLink() {
  return (
    <Link 
      to="/dashboard"
      onMouseEnter={() => dashboardImport()} // Preload
    >
      Dashboard
    </Link>
  );
}

// Named exports with lazy
const AdminSettings = lazy(() =>
  import('./pages/Admin').then(module => ({
    default: module.AdminSettings
  }))
);

// With error boundary
function LazyRoute({ component: Component }) {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
}`,
    tags: ['optimization', 'lazy-loading', 'code-splitting', 'routing'],
    timeEstimate: 4
  },
  {
    id: 'opt-16',
    category: 'Optimization',
    question: 'What are the differences between useCallback and useMemo for optimization?',
    answer: `Both memoize values but for different purposes:

useCallback:
- Memoizes functions
- Returns the same function reference
- Used for event handlers passed as props
- Prevents child re-renders (with React.memo)

useMemo:
- Memoizes computed values
- Returns the computed result
- Used for expensive calculations
- Skips recalculation if deps unchanged

Both should be used judiciously - don't wrap everything.`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// useCallback - memoize function reference
function Parent() {
  const [count, setCount] = useState(0);
  
  // ❌ New function every render
  const handleClick = () => console.log('clicked');
  
  // ✅ Same function reference if deps unchanged
  const handleClick = useCallback(() => {
    console.log('clicked', count);
  }, [count]);
  
  return <MemoizedChild onClick={handleClick} />;
}

// useMemo - memoize computed value
function ExpensiveComponent({ items, filter }) {
  // ❌ Recalculates every render
  const filtered = items.filter(i => i.includes(filter));
  
  // ✅ Only recalculates when items or filter change
  const filtered = useMemo(
    () => items.filter(i => i.includes(filter)),
    [items, filter]
  );
  
  return <List items={filtered} />;
}

// When NOT to use (overhead > benefit)
function SimpleComponent({ value }) {
  // ❌ Overkill - simple operation
  const doubled = useMemo(() => value * 2, [value]);
  
  // ✅ Just compute directly
  const doubled = value * 2;
}

// Combined pattern
function SearchableList({ items }) {
  const [query, setQuery] = useState('');
  
  const filteredItems = useMemo(
    () => items.filter(item => item.name.includes(query)),
    [items, query]
  );
  
  const handleSelect = useCallback((item) => {
    console.log('Selected:', item);
  }, []);
  
  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <MemoizedList items={filteredItems} onSelect={handleSelect} />
    </>
  );
}`,
    tags: ['optimization', 'useCallback', 'useMemo', 'memoization'],
    timeEstimate: 4
  },
  {
    id: 'opt-17',
    category: 'Optimization',
    question: 'How do you optimize React Context to prevent unnecessary re-renders?',
    answer: `Context changes re-render all consumers. Optimization strategies:

1. Split contexts (separate frequently/rarely changing data)
2. Memoize context value
3. Use selectors (zustand, use-context-selector)
4. Colocate state closer to where it's needed
5. Combine with memo for consumers

Avoid putting everything in one context!`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// ❌ Single context with everything
const AppContext = createContext({
  user: null,
  theme: 'light',
  notifications: [],
  setTheme: () => {}
});

// ✅ Split into separate contexts
const UserContext = createContext(null);
const ThemeContext = createContext('light');
const NotificationContext = createContext([]);

// ✅ Memoize context value
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  // ❌ New object every render = all consumers re-render
  // const value = { theme, setTheme };
  
  // ✅ Memoized value
  const value = useMemo(
    () => ({ theme, setTheme }),
    [theme]
  );
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ✅ Split state and dispatch
const StateContext = createContext(null);
const DispatchContext = createContext(null);

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// Components only subscribe to what they need
function ActionButton() {
  const dispatch = useContext(DispatchContext); // Never re-renders from state changes
  return <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>;
}

// ✅ Use selectors library
import { createContext, useContextSelector } from 'use-context-selector';

const context = createContext(null);

function Counter() {
  // Only re-renders when count changes
  const count = useContextSelector(context, v => v.count);
  return <span>{count}</span>;
}`,
    tags: ['optimization', 'context', 're-renders', 'patterns'],
    timeEstimate: 5
  },
  {
    id: 'opt-18',
    category: 'Optimization',
    question: 'What is the Compiler (React Forget) and how will it change optimization?',
    answer: `React Compiler (formerly React Forget) automatically memoizes components and hooks, eliminating manual useMemo/useCallback.

How it works:
- Analyzes component at build time
- Automatically adds memoization
- Understands React's rules
- Preserves behavior while optimizing

Status: Meta is using it in production. Will be part of React ecosystem.

Benefits:
- No manual memoization needed
- Fewer bugs from stale closures
- Better DX
- Consistent optimization`,
    difficulty: 'expert',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Current: Manual memoization required
function ProductList({ products, onSelect }) {
  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.price - b.price),
    [products]
  );
  
  const handleSelect = useCallback(
    (product) => onSelect(product),
    [onSelect]
  );
  
  return (
    <ul>
      {sortedProducts.map(product => (
        <MemoizedProduct 
          key={product.id}
          product={product}
          onSelect={handleSelect}
        />
      ))}
    </ul>
  );
}

const MemoizedProduct = React.memo(Product);

// Future with React Compiler: Just write normal code
function ProductList({ products, onSelect }) {
  // Compiler automatically memoizes this
  const sortedProducts = [...products].sort((a, b) => a.price - b.price);
  
  // Compiler handles function stability
  const handleSelect = (product) => onSelect(product);
  
  return (
    <ul>
      {sortedProducts.map(product => (
        // Compiler optimizes re-renders automatically
        <Product 
          key={product.id}
          product={product}
          onSelect={handleSelect}
        />
      ))}
    </ul>
  );
}

// Compiler understands React rules and optimizes accordingly
// No React.memo, useMemo, or useCallback needed!`,
    tags: ['optimization', 'compiler', 'react-forget', 'future'],
    timeEstimate: 4
  },
  {
    id: 'opt-19',
    category: 'Optimization',
    question: 'How do you profile React applications to identify performance issues?',
    answer: `React provides built-in profiling tools:

React DevTools Profiler:
- Record render timings
- Identify slow components
- See why components re-rendered
- Flame graph visualization

Chrome DevTools:
- Performance tab for overall analysis
- Memory tab for leak detection
- Coverage for unused code

Third-party:
- why-did-you-render
- React Scan
- Lighthouse`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Enable profiling in production
// Build with: npx react-scripts build --profile

// Profiler component for programmatic profiling
import { Profiler } from 'react';

function onRenderCallback(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  console.log({
    id,              // Component name
    phase,           // "mount" or "update"
    actualDuration,  // Time spent rendering
    baseDuration,    // Estimated time without memoization
    startTime,       // When rendering started
    commitTime       // When changes were committed
  });
  
  // Send to monitoring service
  if (actualDuration > 16) { // Over 1 frame
    sendToMonitoring({ id, actualDuration });
  }
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <MainContent />
    </Profiler>
  );
}

// why-did-you-render setup
// wdyr.js
import React from 'react';
import whyDidYouRender from '@welldone-software/why-did-you-render';

if (process.env.NODE_ENV === 'development') {
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}

// Mark specific component
MyComponent.whyDidYouRender = true;

// User Timing API for custom marks
function ExpensiveComponent() {
  performance.mark('expensive-start');
  const result = expensiveOperation();
  performance.mark('expensive-end');
  performance.measure('expensive', 'expensive-start', 'expensive-end');
  
  return <div>{result}</div>;
}`,
    tags: ['optimization', 'profiling', 'devtools', 'debugging'],
    timeEstimate: 5
  },
  {
    id: 'opt-20',
    category: 'Optimization',
    question: 'What are the strategies for optimizing images in React applications?',
    answer: `Image optimization is crucial for performance. Strategies:

Format selection:
- WebP for photos (25-35% smaller than JPEG)
- AVIF for best compression (newer)
- SVG for icons and logos
- PNG only when transparency needed

Loading strategies:
- Lazy loading (loading="lazy")
- Responsive images (srcset, sizes)
- Blur placeholder while loading
- Priority loading for LCP images`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Native lazy loading
<img 
  src="photo.jpg" 
  loading="lazy" 
  alt="Photo"
  width="800"
  height="600"
/>

// Responsive images with srcset
<img
  srcSet="
    photo-320.jpg 320w,
    photo-640.jpg 640w,
    photo-1280.jpg 1280w
  "
  sizes="(max-width: 320px) 280px, (max-width: 640px) 600px, 1200px"
  src="photo-1280.jpg"
  alt="Photo"
/>

// Picture element for format selection
<picture>
  <source srcSet="photo.avif" type="image/avif" />
  <source srcSet="photo.webp" type="image/webp" />
  <img src="photo.jpg" alt="Photo" />
</picture>

// Custom lazy loading with IntersectionObserver
function LazyImage({ src, alt, placeholder }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    
    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={imgRef}>
      {isInView ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{ opacity: isLoaded ? 1 : 0 }}
        />
      ) : (
        <img src={placeholder} alt="" />
      )}
    </div>
  );
}

// Blur hash placeholder
import { Blurhash } from 'react-blurhash';

function ImageWithBlur({ src, hash, width, height }) {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div style={{ position: 'relative', width, height }}>
      {!loaded && (
        <Blurhash
          hash={hash}
          width={width}
          height={height}
          style={{ position: 'absolute' }}
        />
      )}
      <img
        src={src}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
}`,
    tags: ['optimization', 'images', 'lazy-loading', 'responsive'],
    timeEstimate: 5
  },
  {
    id: 'opt-21',
    category: 'Optimization',
    question: 'How do you implement infinite scrolling efficiently in React?',
    answer: `Infinite scroll loads content as user scrolls. Efficient implementation requires:

Key considerations:
- IntersectionObserver for scroll detection
- Virtualization for large lists
- Proper loading states
- Error handling and retry
- Memory management (limit items in DOM)

Avoid scroll event listeners - they're expensive.`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Using IntersectionObserver
function useInfiniteScroll(callback) {
  const observerRef = useRef();
  const sentinelRef = useRef();
  
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { rootMargin: '200px' }
    );
    
    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }
    
    return () => observerRef.current?.disconnect();
  }, [callback]);
  
  return sentinelRef;
}

function InfiniteList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    const newItems = await fetchItems(page);
    
    setItems(prev => [...prev, ...newItems]);
    setPage(p => p + 1);
    setHasMore(newItems.length === PAGE_SIZE);
    setLoading(false);
  }, [page, loading, hasMore]);
  
  const sentinelRef = useInfiniteScroll(loadMore);
  
  return (
    <div>
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
      
      {/* Sentinel element triggers loading */}
      <div ref={sentinelRef} style={{ height: 1 }} />
      
      {loading && <Spinner />}
      {!hasMore && <p>No more items</p>}
    </div>
  );
}

// With TanStack Query (recommended)
import { useInfiniteQuery } from '@tanstack/react-query';

function InfiniteListWithQuery() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['items'],
    queryFn: ({ pageParam = 1 }) => fetchItems(pageParam),
    getNextPageParam: (lastPage, pages) => 
      lastPage.length === PAGE_SIZE ? pages.length + 1 : undefined
  });
  
  const sentinelRef = useInfiniteScroll(() => {
    if (hasNextPage) fetchNextPage();
  });
  
  return (
    <div>
      {data?.pages.flat().map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
      <div ref={sentinelRef} />
      {isFetchingNextPage && <Spinner />}
    </div>
  );
}`,
    tags: ['optimization', 'infinite-scroll', 'pagination', 'intersection-observer'],
    timeEstimate: 6
  },
  {
    id: 'opt-22',
    category: 'Optimization',
    question: 'What is the importance of the key prop for performance?',
    answer: `The key prop helps React identify which items changed in lists. Proper keys are essential for:

Performance benefits:
- Efficient DOM updates (reuse nodes)
- Preserve component state
- Correct animation behavior
- Proper focus management

Key rules:
- Must be unique among siblings
- Must be stable (same key for same item)
- Never use array index for dynamic lists
- Use database IDs when available`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// ❌ Using index as key (problems with reordering)
{items.map((item, index) => (
  <ListItem key={index} item={item} />
))}
// If items reorder, React thinks components are the same
// Causes: Wrong state, broken animations, input focus issues

// ✅ Using stable unique ID
{items.map(item => (
  <ListItem key={item.id} item={item} />
))}

// Problem demonstration
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React' },
    { id: 2, text: 'Build app' }
  ]);
  
  const addToTop = () => {
    setTodos([
      { id: Date.now(), text: 'New todo' },
      ...todos
    ]);
  };
  
  return (
    <>
      <button onClick={addToTop}>Add to top</button>
      {todos.map((todo, index) => (
        // ❌ With index: new item gets key=0, 
        // pushes all other keys, all inputs re-render
        <TodoItem key={index} todo={todo} />
        
        // ✅ With id: only new item renders
        // <TodoItem key={todo.id} todo={todo} />
      ))}
    </>
  );
}

// When index IS okay:
// 1. Static list that never changes
// 2. List items have no state
// 3. List is never reordered/filtered

// Generating stable keys
const items = ['apple', 'banana', 'cherry'];

// ❌ Can't use value if duplicates possible
{items.map(item => <li key={item}>{item}</li>)}

// ✅ Generate stable keys
const itemsWithKeys = items.map((item, i) => ({
  id: \`\${item}-\${i}\`, // or use uuid
  value: item
}));`,
    tags: ['optimization', 'keys', 'reconciliation', 'lists'],
    timeEstimate: 4
  },
  {
    id: 'opt-23',
    category: 'Optimization',
    question: 'How do you reduce bundle size in React applications?',
    answer: `Bundle size directly impacts load time. Reduction strategies:

Analysis:
- webpack-bundle-analyzer
- source-map-explorer
- Lighthouse audits

Reduction techniques:
- Code splitting (routes, components)
- Tree shaking (ES modules)
- Replace heavy dependencies
- Dynamic imports
- Externalize large libraries`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// 1. Analyze bundle
// package.json
"scripts": {
  "analyze": "source-map-explorer 'build/static/js/*.js'"
}

// 2. Replace heavy libraries
// ❌ moment.js = 232KB
import moment from 'moment';
moment(date).format('YYYY-MM-DD');

// ✅ date-fns = 2KB per function
import { format } from 'date-fns';
format(date, 'yyyy-MM-dd');

// ✅ or dayjs = 7KB
import dayjs from 'dayjs';
dayjs(date).format('YYYY-MM-DD');

// 3. Import only what you need
// ❌ Imports entire lodash
import _ from 'lodash';
_.debounce(fn, 300);

// ✅ Import specific function
import debounce from 'lodash/debounce';
debounce(fn, 300);

// 4. Dynamic imports for heavy components
const HeavyEditor = dynamic(() => import('./HeavyEditor'), {
  loading: () => <EditorSkeleton />,
  ssr: false
});

// 5. Externalize large deps (for apps with CDN)
// webpack.config.js
externals: {
  react: 'React',
  'react-dom': 'ReactDOM'
}

// 6. Use production builds of libraries
// Many libs have smaller prod builds

// 7. Compression (Brotli > Gzip)
// next.config.js
module.exports = {
  compress: true, // Enables gzip
  // For Brotli, configure at CDN/server level
};

// 8. Remove unused code
// package.json - ensure sideEffects is correct
"sideEffects": [
  "*.css",
  "*.scss"
]`,
    tags: ['optimization', 'bundle-size', 'code-splitting', 'webpack'],
    timeEstimate: 5
  },
  {
    id: 'opt-24',
    category: 'Optimization',
    question: 'What is state colocation and why does it matter for performance?',
    answer: `State colocation means keeping state as close as possible to where it's used. Benefits:

Performance:
- Smaller re-render scope
- Fewer unnecessary updates
- Better component isolation

Maintainability:
- Easier to understand data flow
- Components are more self-contained
- Simpler refactoring

Rule: Lift state up only when you need to share it.`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// ❌ State too high - entire app re-renders on input change
function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  
  return (
    <>
      <Header user={user} />
      <SearchBar query={searchQuery} setQuery={setSearchQuery} />
      <MainContent />
      <Footer />
    </>
  );
}

// ✅ Colocated - only SearchBar re-renders
function App() {
  const [user, setUser] = useState(null);
  
  return (
    <>
      <Header user={user} />
      <SearchBar /> {/* Manages its own state */}
      <MainContent />
      <Footer />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');
  
  return (
    <input 
      value={query}
      onChange={e => setQuery(e.target.value)}
    />
  );
}

// When to lift state
function ProductPage() {
  // State needed by both components - lift to parent
  const [selectedSize, setSelectedSize] = useState('M');
  
  return (
    <div>
      <SizeSelector 
        selected={selectedSize} 
        onSelect={setSelectedSize} 
      />
      <AddToCartButton size={selectedSize} />
    </div>
  );
}

// Colocation hierarchy
// Global: Auth, theme (Context/Redux)
// Feature: Form state, modal open (Feature component)
// Local: Input value, hover state (Component itself)

function Form() {
  // Feature-level state (shared in form)
  const [formData, setFormData] = useState({});
  
  return (
    <form>
      {/* Local state (not shared) */}
      <EmailInput />
      <PasswordInput />
      <SubmitButton formData={formData} />
    </form>
  );
}

function EmailInput() {
  // Local validation state
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  
  return <input onBlur={() => setTouched(true)} />;
}`,
    tags: ['optimization', 'state-colocation', 'architecture', 'patterns'],
    timeEstimate: 4
  },
  {
    id: 'opt-25',
    category: 'Optimization',
    question: 'How do you optimize forms with many inputs in React?',
    answer: `Large forms can cause performance issues because typing triggers re-renders. Strategies:

1. Uncontrolled inputs with refs
2. Form libraries (React Hook Form)
3. Debounce validation
4. Isolate input components
5. Use useTransition for validation

React Hook Form is ideal - minimal re-renders by default.`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// ❌ Controlled form - re-renders on every keystroke
function SlowForm() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: ''
    // ... 20 more fields
  });
  
  return (
    <form>
      <input 
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
      />
      {/* Every keystroke re-renders entire form */}
    </form>
  );
}

// ✅ React Hook Form - only re-renders on submit/validation
import { useForm } from 'react-hook-form';

function FastForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => {
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name', { required: true })} />
      {errors.name && <span>Required</span>}
      
      <input {...register('email', { 
        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i 
      })} />
      {errors.email && <span>Invalid email</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
}

// ✅ Isolate inputs to prevent cascade re-renders
function IsolatedInput({ name, label }) {
  const [value, setValue] = useState('');
  
  return (
    <div>
      <label>{label}</label>
      <input value={value} onChange={e => setValue(e.target.value)} />
    </div>
  );
}

// ✅ Debounced validation
function DebouncedInput({ validate }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  
  const debouncedValidate = useDebouncedCallback((val) => {
    const error = validate(val);
    setError(error);
  }, 300);
  
  return (
    <>
      <input 
        value={value}
        onChange={e => {
          setValue(e.target.value);
          debouncedValidate(e.target.value);
        }}
      />
      {error && <span>{error}</span>}
    </>
  );
}

// ✅ useTransition for async validation
function AsyncValidatedInput() {
  const [value, setValue] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isAvailable, setIsAvailable] = useState(null);
  
  return (
    <>
      <input
        value={value}
        onChange={e => {
          setValue(e.target.value);
          startTransition(async () => {
            const available = await checkUsername(e.target.value);
            setIsAvailable(available);
          });
        }}
      />
      {isPending ? 'Checking...' : isAvailable ? '✓' : '✗'}
    </>
  );
}`,
    tags: ['optimization', 'forms', 'react-hook-form', 'performance'],
    timeEstimate: 5
  },
  {
    id: 'opt-26',
    category: 'Optimization',
    question: 'What is the difference between SSR, SSG, and ISR for performance?',
    answer: `Different rendering strategies have different performance characteristics:

SSG (Static Site Generation):
- Pre-rendered at build time
- Fastest initial load (served from CDN)
- Best for static content
- Must rebuild for updates

SSR (Server-Side Rendering):
- Rendered on each request
- Dynamic content possible
- Slower TTFB than SSG
- Better for personalized content

ISR (Incremental Static Regeneration):
- Static with background revalidation
- Best of both worlds
- Set revalidation interval
- Stale-while-revalidate pattern`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Next.js App Router examples

// SSG - Static (default for non-dynamic pages)
// app/about/page.tsx
export default function About() {
  return <div>About us</div>;
}

// SSG with data
// app/posts/page.tsx
async function getPosts() {
  const posts = await fetch('https://api.example.com/posts', {
    cache: 'force-cache' // SSG - cached indefinitely
  });
  return posts.json();
}

export default async function Posts() {
  const posts = await getPosts();
  return <PostList posts={posts} />;
}

// SSR - Dynamic on each request
// app/dashboard/page.tsx
export const dynamic = 'force-dynamic'; // Or use cookies(), headers()

async function getDashboardData() {
  const data = await fetch('https://api.example.com/dashboard', {
    cache: 'no-store' // SSR - no caching
  });
  return data.json();
}

export default async function Dashboard() {
  const data = await getDashboardData();
  return <DashboardUI data={data} />;
}

// ISR - Revalidate every 60 seconds
// app/products/page.tsx
async function getProducts() {
  const products = await fetch('https://api.example.com/products', {
    next: { revalidate: 60 } // ISR - revalidate every 60s
  });
  return products.json();
}

export default async function Products() {
  const products = await getProducts();
  return <ProductGrid products={products} />;
}

// ISR with on-demand revalidation
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const { path, tag } = await request.json();
  
  if (path) revalidatePath(path);
  if (tag) revalidateTag(tag);
  
  return Response.json({ revalidated: true });
}`,
    tags: ['optimization', 'ssr', 'ssg', 'isr', 'next.js'],
    timeEstimate: 5
  },
  {
    id: 'opt-27',
    category: 'Optimization',
    question: 'How do you implement prefetching and preloading in React?',
    answer: `Prefetching loads resources before they're needed. Strategies:

Link prefetching:
- Browser prefetches on hover/visibility
- Next.js Link prefetches automatically

Resource hints:
- preload: Critical resources for current page
- prefetch: Resources for next navigation
- preconnect: Establish early connections

React patterns:
- Preload components on hover
- Prefetch data before navigation`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Resource hints in <head>
<head>
  {/* Preload critical CSS */}
  <link rel="preload" href="/critical.css" as="style" />
  
  {/* Preload hero image */}
  <link rel="preload" href="/hero.jpg" as="image" />
  
  {/* Preload font */}
  <link 
    rel="preload" 
    href="/fonts/inter.woff2" 
    as="font" 
    type="font/woff2" 
    crossOrigin="anonymous"
  />
  
  {/* Preconnect to API */}
  <link rel="preconnect" href="https://api.example.com" />
  
  {/* Prefetch next page */}
  <link rel="prefetch" href="/next-page.js" />
</head>

// Preload component on hover
const heavyComponentPromise = () => import('./HeavyComponent');
const HeavyComponent = lazy(heavyComponentPromise);

function Navigation() {
  return (
    <Link
      to="/heavy"
      onMouseEnter={() => heavyComponentPromise()} // Preload on hover
    >
      Heavy Page
    </Link>
  );
}

// Prefetch data with React Query
import { useQueryClient } from '@tanstack/react-query';

function ProductList({ products }) {
  const queryClient = useQueryClient();
  
  const prefetchProduct = (id) => {
    queryClient.prefetchQuery({
      queryKey: ['product', id],
      queryFn: () => fetchProduct(id),
      staleTime: 60000
    });
  };
  
  return (
    <ul>
      {products.map(product => (
        <li 
          key={product.id}
          onMouseEnter={() => prefetchProduct(product.id)}
        >
          <Link to={\`/product/\${product.id}\`}>
            {product.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Next.js automatic prefetching
import Link from 'next/link';

// Prefetches automatically when link enters viewport
<Link href="/about">About</Link>

// Disable prefetching if needed
<Link href="/heavy-page" prefetch={false}>Heavy Page</Link>`,
    tags: ['optimization', 'prefetching', 'preloading', 'performance'],
    timeEstimate: 5
  },
  {
    id: 'opt-28',
    category: 'Optimization',
    question: 'How do you handle memory leaks in React applications?',
    answer: `Memory leaks in React typically occur from:

Common causes:
- Uncleared timers/intervals
- Event listeners not removed
- Subscriptions not unsubscribed
- State updates on unmounted components
- Closures holding references

Detection:
- Chrome DevTools Memory tab
- React DevTools Profiler
- Heap snapshots comparison

Prevention:
- Always cleanup in useEffect return
- Use AbortController for fetch
- Cancel async operations`,
    difficulty: 'senior',
    type: 'debugging',
    answerFormat: 'essay',
    codeExample: `// ❌ Memory leak - timer not cleared
useEffect(() => {
  const interval = setInterval(() => {
    setCount(c => c + 1);
  }, 1000);
  // No cleanup!
}, []);

// ✅ Fixed
useEffect(() => {
  const interval = setInterval(() => {
    setCount(c => c + 1);
  }, 1000);
  
  return () => clearInterval(interval); // Cleanup
}, []);

// ❌ Memory leak - event listener not removed
useEffect(() => {
  window.addEventListener('resize', handleResize);
  // No cleanup!
}, []);

// ✅ Fixed
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// ❌ Memory leak - updating state after unmount
useEffect(() => {
  fetchData().then(data => {
    setData(data); // Component might be unmounted
  });
}, []);

// ✅ Fixed with cleanup flag
useEffect(() => {
  let cancelled = false;
  
  fetchData().then(data => {
    if (!cancelled) {
      setData(data);
    }
  });
  
  return () => { cancelled = true; };
}, []);

// ✅ Better - AbortController
useEffect(() => {
  const controller = new AbortController();
  
  fetch(url, { signal: controller.signal })
    .then(res => res.json())
    .then(setData)
    .catch(err => {
      if (err.name !== 'AbortError') throw err;
    });
  
  return () => controller.abort();
}, [url]);

// ❌ Memory leak - subscription not cleaned
useEffect(() => {
  const subscription = eventEmitter.subscribe(handler);
  // No unsubscribe!
}, []);

// ✅ Fixed
useEffect(() => {
  const subscription = eventEmitter.subscribe(handler);
  return () => subscription.unsubscribe();
}, []);

// Detecting leaks in Chrome DevTools:
// 1. Open Memory tab
// 2. Take heap snapshot
// 3. Perform actions
// 4. Take another snapshot
// 5. Compare - look for retained objects`,
    tags: ['optimization', 'memory-leaks', 'debugging', 'cleanup'],
    timeEstimate: 5
  },
  {
    id: 'opt-29',
    category: 'Optimization',
    question: 'What is Time to Interactive (TTI) and how do you improve it?',
    answer: `TTI measures when a page becomes fully interactive - responds to user input within 50ms. A good TTI is under 3.8 seconds.

Factors affecting TTI:
- JavaScript bundle size
- Main thread blocking
- Third-party scripts
- Hydration time

Improvement strategies:
- Reduce JavaScript
- Code split aggressively
- Defer non-critical scripts
- Optimize hydration
- Use web workers for heavy computation`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// 1. Defer non-critical JavaScript
<script src="analytics.js" defer></script>
<script src="chat-widget.js" async></script>

// 2. Load third-party scripts lazily
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

// Load chat widget after page is interactive
useEffect(() => {
  const timer = setTimeout(() => {
    loadScript('https://chat.widget.com/widget.js');
  }, 5000);
  
  return () => clearTimeout(timer);
}, []);

// 3. Progressive hydration
// Only hydrate visible components first
import { lazy, Suspense } from 'react';

const BelowTheFold = lazy(() => import('./BelowTheFold'));

function Page() {
  return (
    <>
      {/* Hydrates immediately */}
      <AboveTheFold />
      
      {/* Hydrates when in view */}
      <Suspense fallback={<Placeholder />}>
        <BelowTheFold />
      </Suspense>
    </>
  );
}

// 4. Web Worker for heavy computation
// worker.js
self.onmessage = (e) => {
  const result = heavyComputation(e.data);
  self.postMessage(result);
};

// Component
function HeavyComponent() {
  const [result, setResult] = useState(null);
  
  useEffect(() => {
    const worker = new Worker('worker.js');
    worker.postMessage(data);
    worker.onmessage = (e) => setResult(e.data);
    
    return () => worker.terminate();
  }, [data]);
}

// 5. Use requestIdleCallback for non-urgent work
useEffect(() => {
  const id = requestIdleCallback(() => {
    // Non-critical initialization
    initAnalytics();
    preloadNextPage();
  });
  
  return () => cancelIdleCallback(id);
}, []);`,
    tags: ['optimization', 'tti', 'web-vitals', 'performance'],
    timeEstimate: 5
  },
  {
    id: 'opt-30',
    category: 'Optimization',
    question: 'How do you optimize SEO performance in React SPAs?',
    answer: `React SPAs face SEO challenges because search engines may not execute JavaScript. Solutions:

Rendering strategies:
- SSR (Server-Side Rendering)
- SSG (Static Site Generation)
- ISR (Incremental Static Regeneration)

Additional optimizations:
- Proper meta tags
- Structured data (JSON-LD)
- Semantic HTML
- Fast loading (Core Web Vitals)
- Proper routing with clean URLs`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Next.js metadata API
// app/products/[id]/page.tsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
    },
    alternates: {
      canonical: \`https://example.com/products/\${params.id}\`,
    },
  };
}

// Structured data (JSON-LD)
export default function ProductPage({ params }) {
  const product = await getProduct(params.id);
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
    },
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetails product={product} />
    </>
  );
}

// Semantic HTML
function Article({ post }) {
  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </header>
      <main>
        <p>{post.content}</p>
      </main>
      <footer>
        <address>By {post.author}</address>
      </footer>
    </article>
  );
}

// Dynamic sitemap
// app/sitemap.ts
export default async function sitemap() {
  const products = await getProducts();
  const posts = await getPosts();
  
  return [
    { url: 'https://example.com', lastModified: new Date() },
    ...products.map(p => ({
      url: \`https://example.com/products/\${p.id}\`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    ...posts.map(p => ({
      url: \`https://example.com/blog/\${p.slug}\`,
      lastModified: p.updatedAt,
    })),
  ];
}

// robots.txt
// app/robots.ts
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://example.com/sitemap.xml',
  };
}`,
    tags: ['optimization', 'seo', 'metadata', 'ssr'],
    timeEstimate: 5
  },
  {
    id: 'opt-31',
    category: 'Performance & Optimization',
    question: 'How do you optimize bundle size in React applications?',
    answer: `Bundle size optimization strategies:

1. Code splitting
   - Route-based splitting
   - Component-based splitting
   - Library splitting

2. Tree shaking
   - Use ES modules
   - Avoid side effects
   - Mark pure functions

3. Import optimization
   - Named imports
   - Avoid barrel files for large libs

4. Dependency audit
   - Bundle analyzer
   - Alternative smaller libs
   - Remove unused dependencies`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Analyze bundle
// npm run build -- --analyze
// Or: ANALYZE=true npm run build

// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({});

// Optimize imports - avoid barrel file import
// ❌ Bad - imports entire library
import { Button, Input, Modal } from '@/components/ui';

// ✅ Good - direct imports
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// ❌ Bad - imports entire lodash
import _ from 'lodash';
_.debounce(fn, 300);

// ✅ Good - imports only what's needed
import debounce from 'lodash/debounce';
debounce(fn, 300);

// Or use lodash-es for better tree shaking
import { debounce } from 'lodash-es';

// Dynamic imports for heavy libraries
const handleExport = async () => {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF();
  // ...
};

// Lazy load components
const HeavyChart = dynamic(() => import('@/components/Chart'), {
  loading: () => <Skeleton />,
  ssr: false,
});

// Replace heavy dependencies
// moment.js (~300KB) → date-fns (~13KB tree-shaken)
// lodash (~70KB) → lodash-es or native methods
// uuid (~9KB) → crypto.randomUUID() (0KB)

// Remove unused CSS
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // Removes unused styles in production
};

// Check for duplicate dependencies
// npm ls react
// npm dedupe

// package.json - check bundle impact
{
  "scripts": {
    "size": "npx size-limit",
    "size:why": "npx source-map-explorer .next/static/**/*.js"
  }
}

// .size-limit.json
[
  {
    "path": ".next/static/chunks/pages/_app.js",
    "limit": "100 KB"
  }
]`,
    tags: ['optimization', 'bundle-size', 'tree-shaking', 'code-splitting'],
    timeEstimate: 6
  },
  {
    id: 'opt-32',
    category: 'Performance & Optimization',
    question: 'How do you optimize animations in React?',
    answer: `Animation optimization techniques:

1. Use CSS transforms
   - translate, scale, rotate
   - Triggers GPU acceleration
   - Avoids layout thrashing

2. will-change property
   - Hints for optimization
   - Use sparingly

3. requestAnimationFrame
   - Sync with browser refresh
   - Avoid setTimeout/setInterval

4. Libraries
   - Framer Motion (React-optimized)
   - react-spring
   - CSS animations for simple cases`,
    difficulty: 'intermediate',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// CSS-only animation (best performance)
const slideIn = \`
  @keyframes slideIn {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-slide-in {
    animation: slideIn 0.3s ease-out;
  }
\`;

// Use transform instead of position
// ❌ Bad - triggers layout
const badAnimation = {
  left: isOpen ? 0 : -200,
  top: isOpen ? 0 : -200,
};

// ✅ Good - GPU accelerated
const goodAnimation = {
  transform: isOpen ? 'translate(0, 0)' : 'translate(-200px, -200px)',
};

// will-change for complex animations
function AnimatedCard({ isHovered }) {
  return (
    <div
      style={{
        willChange: isHovered ? 'transform, opacity' : 'auto',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.2s ease-out',
      }}
    >
      Content
    </div>
  );
}

// Framer Motion optimizations
import { motion, useReducedMotion } from 'framer-motion';

function OptimizedAnimation() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.3,
        // Use spring for smooth animations
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      // Layout animations
      layout
      layoutId="shared-element"
    >
      Content
    </motion.div>
  );
}

// AnimatePresence for exit animations
import { AnimatePresence } from 'framer-motion';

function List({ items }) {
  return (
    <AnimatePresence mode="popLayout">
      {items.map(item => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          layout
        >
          {item.name}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

// requestAnimationFrame for custom animations
function useAnimationFrame(callback) {
  const requestRef = useRef();
  const previousTimeRef = useRef();
  
  useEffect(() => {
    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [callback]);
}

// Reduce motion for accessibility
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const animationDuration = prefersReducedMotion ? 0 : 300;`,
    tags: ['optimization', 'animations', 'performance', 'framer-motion'],
    timeEstimate: 5
  },
  {
    id: 'opt-33',
    category: 'Performance & Optimization',
    question: 'How do you optimize forms with many fields?',
    answer: `Form optimization strategies:

1. Uncontrolled inputs
   - React Hook Form
   - No re-renders on input

2. Field isolation
   - Separate field components
   - Memoize expensive fields

3. Debounced validation
   - Validate on blur or debounced
   - Async validation

4. Virtual lists
   - For very long forms
   - Render visible fields only`,
    difficulty: 'intermediate',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// React Hook Form - uncontrolled, minimal re-renders
import { useForm, Controller } from 'react-hook-form';

function OptimizedForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onBlur', // Validate on blur, not every keystroke
    reValidateMode: 'onBlur',
  });
  
  // register() uses uncontrolled inputs - no re-render on type
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name', { required: true })} />
      <input {...register('email', { required: true })} />
      {/* Many more fields */}
    </form>
  );
}

// Isolate field components
const MemoizedField = memo(function Field({ name, register }) {
  console.log(\`Rendering \${name}\`);
  return <input {...register(name)} />;
});

// Debounced async validation
import { z } from 'zod';
import debounce from 'lodash/debounce';

const checkUsername = debounce(async (username) => {
  const response = await fetch(\`/api/check-username?u=\${username}\`);
  return response.json();
}, 500);

const schema = z.object({
  username: z.string()
    .min(3)
    .refine(async (val) => {
      const { available } = await checkUsername(val);
      return available;
    }, 'Username is taken'),
});

// Virtualized form for hundreds of fields
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualizedForm({ fields }) {
  const parentRef = useRef(null);
  
  const virtualizer = useVirtualizer({
    count: fields.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Height of each field
    overscan: 5,
  });
  
  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const field = fields[virtualItem.index];
          return (
            <div
              key={field.name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: virtualItem.size,
                transform: \`translateY(\${virtualItem.start}px)\`,
              }}
            >
              <FormField field={field} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Split large forms into sections
function MultiStepForm() {
  const [step, setStep] = useState(0);
  const { trigger, getValues } = useForm();
  
  const steps = [
    <PersonalInfoStep key="personal" />,
    <AddressStep key="address" />,
    <PaymentStep key="payment" />,
  ];
  
  const validateStep = async () => {
    const fieldsToValidate = stepFields[step];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep(s => s + 1);
  };
  
  return (
    <form>
      {steps[step]}
      <button type="button" onClick={validateStep}>
        Next
      </button>
    </form>
  );
}`,
    tags: ['optimization', 'forms', 'react-hook-form', 'performance'],
    timeEstimate: 5
  },
  {
    id: 'opt-34',
    category: 'Performance & Optimization',
    question: 'How do you implement optimistic UI updates?',
    answer: `Optimistic updates show expected result before server confirms:

Benefits:
- Faster perceived performance
- Better user experience
- Reduced waiting time

Implementation:
1. Update UI immediately
2. Send request to server
3. Rollback on error
4. Sync on success

Libraries:
- TanStack Query
- SWR
- Apollo Client`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// TanStack Query optimistic update
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useLikeMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postId) => api.likePost(postId),
    
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      
      // Snapshot current state
      const previousPosts = queryClient.getQueryData(['posts']);
      
      // Optimistically update
      queryClient.setQueryData(['posts'], (old) =>
        old.map(post =>
          post.id === postId
            ? { ...post, likes: post.likes + 1, isLiked: true }
            : post
        )
      );
      
      // Return context for rollback
      return { previousPosts };
    },
    
    onError: (err, postId, context) => {
      // Rollback on error
      queryClient.setQueryData(['posts'], context.previousPosts);
      toast.error('Failed to like post');
    },
    
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// Usage
function LikeButton({ postId, likes, isLiked }) {
  const { mutate: like, isPending } = useLikeMutation();
  
  return (
    <button 
      onClick={() => like(postId)}
      disabled={isPending}
      className={isLiked ? 'text-red-500' : ''}
    >
      ❤️ {likes}
    </button>
  );
}

// Custom hook for optimistic state
function useOptimistic(initialValue) {
  const [optimisticValue, setOptimisticValue] = useState(initialValue);
  const [pendingUpdates, setPendingUpdates] = useState([]);
  
  const applyOptimistic = async (update, action) => {
    const updateId = Date.now();
    
    // Apply optimistic update
    setOptimisticValue(prev => update(prev));
    setPendingUpdates(prev => [...prev, { id: updateId, update }]);
    
    try {
      await action();
      // Success - remove from pending
      setPendingUpdates(prev => prev.filter(u => u.id !== updateId));
    } catch (error) {
      // Rollback - revert this update
      setPendingUpdates(prev => {
        const remaining = prev.filter(u => u.id !== updateId);
        // Recompute state from scratch
        const newValue = remaining.reduce(
          (acc, { update }) => update(acc),
          initialValue
        );
        setOptimisticValue(newValue);
        return remaining;
      });
      throw error;
    }
  };
  
  return [optimisticValue, applyOptimistic, pendingUpdates.length > 0];
}

// Server Action with useOptimistic (React 19)
import { useOptimistic } from 'react';

function TodoList({ todos }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo) => [...state, { ...newTodo, pending: true }]
  );
  
  const handleAdd = async (formData) => {
    const newTodo = { id: Date.now(), text: formData.get('text') };
    addOptimisticTodo(newTodo);
    
    await addTodoAction(newTodo);
  };
  
  return (
    <ul>
      {optimisticTodos.map(todo => (
        <li key={todo.id} className={todo.pending ? 'opacity-50' : ''}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}`,
    tags: ['optimization', 'optimistic-updates', 'ux', 'mutations'],
    timeEstimate: 5
  },
  {
    id: 'opt-35',
    category: 'Performance & Optimization',
    question: 'How do you optimize WebSocket and real-time data?',
    answer: `Real-time optimization strategies:

1. Message batching
   - Group updates
   - Reduce message frequency

2. Selective subscriptions
   - Subscribe only to needed data
   - Unsubscribe when not visible

3. Throttling/debouncing
   - Limit update frequency
   - Batch UI updates

4. Connection management
   - Reconnection strategies
   - Connection pooling`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Optimized WebSocket hook
function useOptimizedWebSocket(url, options = {}) {
  const {
    batchInterval = 50,
    maxBatchSize = 100,
    reconnectDelay = 1000,
  } = options;
  
  const [messages, setMessages] = useState([]);
  const batchRef = useRef([]);
  const wsRef = useRef(null);
  
  useEffect(() => {
    let batchTimeout = null;
    
    const flushBatch = () => {
      if (batchRef.current.length > 0) {
        setMessages(prev => [...prev, ...batchRef.current]);
        batchRef.current = [];
      }
    };
    
    const ws = new WebSocket(url);
    wsRef.current = ws;
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Batch messages
      batchRef.current.push(data);
      
      // Flush if batch is full
      if (batchRef.current.length >= maxBatchSize) {
        flushBatch();
      } else if (!batchTimeout) {
        // Schedule flush
        batchTimeout = setTimeout(() => {
          flushBatch();
          batchTimeout = null;
        }, batchInterval);
      }
    };
    
    return () => {
      clearTimeout(batchTimeout);
      ws.close();
    };
  }, [url, batchInterval, maxBatchSize]);
  
  return messages;
}

// Selective subscriptions
function useSelectiveSubscription(topics) {
  const wsRef = useRef(null);
  
  useEffect(() => {
    if (!wsRef.current) return;
    
    // Subscribe to new topics
    topics.forEach(topic => {
      wsRef.current.send(JSON.stringify({ 
        type: 'subscribe', 
        topic 
      }));
    });
    
    return () => {
      // Unsubscribe when component unmounts or topics change
      topics.forEach(topic => {
        wsRef.current?.send(JSON.stringify({ 
          type: 'unsubscribe', 
          topic 
        }));
      });
    };
  }, [topics]);
}

// Throttle UI updates
function useThrottledState(initialValue, delay = 100) {
  const [state, setState] = useState(initialValue);
  const [throttledState, setThrottledState] = useState(initialValue);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setThrottledState(state);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [state, delay]);
  
  return [throttledState, setState];
}

// Visibility-based subscription
function usePausableSubscription(subscribe, unsubscribe) {
  const isVisible = usePageVisibility();
  
  useEffect(() => {
    if (isVisible) {
      subscribe();
      return () => unsubscribe();
    }
  }, [isVisible, subscribe, unsubscribe]);
}

// Page visibility hook
function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(!document.hidden);
  
  useEffect(() => {
    const handler = () => setIsVisible(!document.hidden);
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);
  
  return isVisible;
}

// Reconnection with exponential backoff
function useReconnectingWebSocket(url) {
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(url);
      
      ws.onclose = () => {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
        setTimeout(() => {
          setRetryCount(c => c + 1);
          connect();
        }, delay);
      };
      
      ws.onopen = () => setRetryCount(0);
    };
    
    connect();
  }, [url]);
}`,
    tags: ['optimization', 'websocket', 'real-time', 'batching'],
    timeEstimate: 6
  },
  {
    id: 'opt-36',
    category: 'Performance & Optimization',
    question: 'How do you use Web Workers for heavy computations?',
    answer: `Web Workers run scripts in background threads:

Use cases:
- Data processing
- Complex calculations
- Image manipulation
- Parsing large files

Benefits:
- Non-blocking UI
- Parallel processing
- Separate memory space

Integration:
- worker-loader
- comlink library
- Next.js web workers`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Basic Web Worker
// workers/calculation.worker.ts
self.onmessage = (e) => {
  const { data } = e;
  
  // Heavy computation
  const result = heavyCalculation(data);
  
  self.postMessage(result);
};

function heavyCalculation(data) {
  // CPU-intensive work
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += Math.sqrt(i);
  }
  return result;
}

// React hook for Web Worker
function useWorker(workerPath) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const workerRef = useRef(null);
  
  useEffect(() => {
    workerRef.current = new Worker(workerPath);
    
    workerRef.current.onmessage = (e) => {
      setResult(e.data);
      setLoading(false);
    };
    
    return () => workerRef.current?.terminate();
  }, [workerPath]);
  
  const run = useCallback((data) => {
    setLoading(true);
    workerRef.current?.postMessage(data);
  }, []);
  
  return { result, loading, run };
}

// Usage
function HeavyComputation() {
  const { result, loading, run } = useWorker('/workers/calculation.worker.js');
  
  return (
    <button onClick={() => run({ input: 1000 })} disabled={loading}>
      {loading ? 'Computing...' : 'Start'} - Result: {result}
    </button>
  );
}

// Comlink for easier Worker communication
// workers/api.worker.ts
import * as Comlink from 'comlink';

const api = {
  async processData(data) {
    // Heavy processing
    const processed = data.map(item => expensiveTransform(item));
    return processed;
  },
  
  async parseCSV(text) {
    // Parse large CSV
    const rows = text.split('\\n');
    return rows.map(row => row.split(','));
  },
};

Comlink.expose(api);

// React component
import * as Comlink from 'comlink';

function useComlinkWorker(workerPath) {
  const apiRef = useRef(null);
  
  useEffect(() => {
    const worker = new Worker(workerPath);
    apiRef.current = Comlink.wrap(worker);
    
    return () => worker.terminate();
  }, [workerPath]);
  
  return apiRef.current;
}

function DataProcessor() {
  const worker = useComlinkWorker('/workers/api.worker.js');
  const [result, setResult] = useState(null);
  
  const process = async (data) => {
    const processed = await worker.processData(data);
    setResult(processed);
  };
  
  return (
    <button onClick={() => process(largeDataset)}>
      Process Data
    </button>
  );
}

// Transfer large data efficiently
function sendLargeData(worker, data) {
  const buffer = new ArrayBuffer(data.length * 4);
  const view = new Float32Array(buffer);
  data.forEach((val, i) => view[i] = val);
  
  // Transfer ownership (zero-copy)
  worker.postMessage({ buffer }, [buffer]);
}

// Worker pool for parallel processing
class WorkerPool {
  constructor(workerPath, size = navigator.hardwareConcurrency) {
    this.workers = Array.from(
      { length: size },
      () => new Worker(workerPath)
    );
    this.queue = [];
    this.available = [...this.workers];
  }
  
  async execute(data) {
    return new Promise((resolve) => {
      const task = { data, resolve };
      
      if (this.available.length > 0) {
        this.runTask(this.available.pop(), task);
      } else {
        this.queue.push(task);
      }
    });
  }
  
  runTask(worker, task) {
    worker.onmessage = (e) => {
      task.resolve(e.data);
      
      if (this.queue.length > 0) {
        this.runTask(worker, this.queue.shift());
      } else {
        this.available.push(worker);
      }
    };
    
    worker.postMessage(task.data);
  }
}`,
    tags: ['optimization', 'web-workers', 'threading', 'performance'],
    timeEstimate: 6
  },
  {
    id: 'opt-37',
    category: 'Performance & Optimization',
    question: 'How do you optimize database queries in Next.js?',
    answer: `Database query optimization:

1. Connection pooling
2. Query optimization
3. Caching layers
4. Pagination
5. Indexing

Next.js specific:
- ISR for static pages
- API route caching
- Edge runtime
- Connection handling`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Prisma connection pooling
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Optimize queries - select only needed fields
async function getUsers() {
  // ❌ Bad - fetches all fields
  const users = await prisma.user.findMany();
  
  // ✅ Good - select specific fields
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  
  return users;
}

// Avoid N+1 queries
async function getPostsWithAuthors() {
  // ❌ Bad - N+1 problem
  const posts = await prisma.post.findMany();
  for (const post of posts) {
    post.author = await prisma.user.findUnique({
      where: { id: post.authorId },
    });
  }
  
  // ✅ Good - include related data
  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: { id: true, name: true },
      },
    },
  });
  
  return posts;
}

// Cursor-based pagination (more efficient)
async function getPaginatedPosts(cursor?: string) {
  const posts = await prisma.post.findMany({
    take: 20,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
  });
  
  const nextCursor = posts[posts.length - 1]?.id;
  
  return { posts, nextCursor };
}

// Cache database results
import { unstable_cache } from 'next/cache';

const getCachedUser = unstable_cache(
  async (id: string) => {
    return prisma.user.findUnique({ where: { id } });
  },
  ['user'],
  { 
    revalidate: 60, // Cache for 60 seconds
    tags: ['users'],
  }
);

// Revalidate cache
import { revalidateTag } from 'next/cache';

async function updateUser(id: string, data: UpdateUserData) {
  await prisma.user.update({ where: { id }, data });
  revalidateTag('users');
}

// Parallel queries
async function getDashboardData(userId: string) {
  const [user, posts, stats] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.post.findMany({ where: { authorId: userId } }),
    prisma.post.aggregate({
      where: { authorId: userId },
      _count: true,
      _sum: { views: true },
    }),
  ]);
  
  return { user, posts, stats };
}

// Raw queries for complex operations
const result = await prisma.$queryRaw\`
  SELECT u.*, COUNT(p.id) as post_count
  FROM users u
  LEFT JOIN posts p ON p.author_id = u.id
  WHERE u.created_at > \${startDate}
  GROUP BY u.id
  ORDER BY post_count DESC
  LIMIT 10
\`;

// Edge-compatible database (e.g., Planetscale, Neon)
// With serverless driver
import { neon } from '@neondatabase/serverless';

export const runtime = 'edge';

export async function GET() {
  const sql = neon(process.env.DATABASE_URL);
  const users = await sql\`SELECT * FROM users LIMIT 10\`;
  return Response.json(users);
}`,
    tags: ['optimization', 'database', 'prisma', 'queries'],
    timeEstimate: 6
  },
  {
    id: 'opt-38',
    category: 'Performance & Optimization',
    question: 'How do you implement efficient search with debouncing and caching?',
    answer: `Search optimization techniques:

1. Debounce input
   - Delay API calls
   - Cancel previous requests

2. Cache results
   - Local cache
   - Query cache

3. Optimistic UI
   - Show cached results
   - Update in background

4. Server-side
   - Full-text search
   - Elasticsearch/Algolia`,
    difficulty: 'intermediate',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Debounced search with caching
import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from './hooks';

function useSearch(query) {
  const debouncedQuery = useDebouncedValue(query, 300);
  
  return useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchAPI(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    placeholderData: (prev) => prev, // Keep previous results while loading
  });
}

// Debounce hook
function useDebouncedValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

// Search with AbortController
function useAbortableSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    
    const controller = new AbortController();
    
    const search = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          \`/api/search?q=\${encodeURIComponent(query)}\`,
          { signal: controller.signal }
        );
        const data = await response.json();
        setResults(data);
      } catch (err) {
        if (err.name !== 'AbortError') throw err;
      } finally {
        setLoading(false);
      }
    };
    
    const timeout = setTimeout(search, 300);
    
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);
  
  return { results, loading };
}

// Local cache with LRU
class SearchCache {
  private cache = new Map();
  private maxSize = 100;
  
  get(key) {
    if (!this.cache.has(key)) return null;
    
    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }
  
  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Delete oldest (first)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }
}

const searchCache = new SearchCache();

async function cachedSearch(query) {
  const cached = searchCache.get(query);
  if (cached) return cached;
  
  const results = await searchAPI(query);
  searchCache.set(query, results);
  
  return results;
}

// Search component
function SearchInput() {
  const [query, setQuery] = useState('');
  const { results, loading } = useSearch(query);
  
  return (
    <div className="relative">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-full p-2 border rounded"
      />
      
      {loading && (
        <div className="absolute right-2 top-2">
          <Spinner />
        </div>
      )}
      
      {results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white border rounded shadow">
          {results.map(result => (
            <li key={result.id} className="p-2 hover:bg-gray-100">
              {result.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    tags: ['optimization', 'search', 'debounce', 'caching'],
    timeEstimate: 5
  },
  {
    id: 'opt-39',
    category: 'Performance & Optimization',
    question: 'How do you optimize third-party scripts loading?',
    answer: `Third-party script optimization:

1. Load strategies
   - beforeInteractive
   - afterInteractive
   - lazyOnload

2. Script prioritization
   - Critical scripts first
   - Defer non-critical

3. Self-hosting
   - Reduce DNS lookups
   - Better caching

4. Alternatives
   - Partytown (worker thread)
   - Delayed loading`,
    difficulty: 'intermediate',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Next.js Script component
import Script from 'next/script';

function Analytics() {
  return (
    <>
      {/* Critical - loads before page is interactive */}
      <Script
        src="https://critical.example.com/script.js"
        strategy="beforeInteractive"
      />
      
      {/* Default - loads after page becomes interactive */}
      <Script
        src="https://analytics.example.com/script.js"
        strategy="afterInteractive"
        onLoad={() => console.log('Analytics loaded')}
      />
      
      {/* Lazy - loads during browser idle time */}
      <Script
        src="https://chat.example.com/widget.js"
        strategy="lazyOnload"
      />
      
      {/* Inline script */}
      <Script id="gtm" strategy="afterInteractive">
        {\`
          (function(w,d,s,l,i){
            // GTM code
          })(window,document,'script','dataLayer','GTM-XXXXX');
        \`}
      </Script>
    </>
  );
}

// Self-host Google Fonts (using next/font)
import { Inter, Roboto } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}

// Partytown for third-party scripts in worker
// next.config.js
module.exports = {
  experimental: {
    nextScriptWorkers: true,
  },
};

// Usage
<Script
  src="https://heavy-analytics.com/script.js"
  strategy="worker"
/>

// Manual lazy loading
function useLazyScript(src, { onLoad } = {}) {
  const [loaded, setLoaded] = useState(false);
  
  const load = useCallback(() => {
    if (loaded) return;
    
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      setLoaded(true);
      onLoad?.();
    };
    document.body.appendChild(script);
  }, [src, loaded, onLoad]);
  
  return { loaded, load };
}

// Load on interaction
function ChatWidget() {
  const { loaded, load } = useLazyScript('https://chat.example.com/widget.js');
  const [showChat, setShowChat] = useState(false);
  
  const handleClick = () => {
    if (!loaded) {
      load();
    }
    setShowChat(true);
  };
  
  return (
    <button onClick={handleClick}>
      {loaded ? 'Open Chat' : 'Load Chat'}
    </button>
  );
}

// Intersection Observer for viewport-based loading
function LazyScriptOnView({ src }) {
  const ref = useRef(null);
  const [load, setLoad] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    
    if (ref.current) observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={ref}>
      {load && <Script src={src} />}
    </div>
  );
}`,
    tags: ['optimization', 'scripts', 'loading', 'third-party'],
    timeEstimate: 5
  },
  {
    id: 'opt-40',
    category: 'Performance & Optimization',
    question: 'How do you implement efficient pagination in React?',
    answer: `Pagination strategies:

1. Offset/limit (traditional)
   - Simple but can skip/duplicate
   - O(n) for large offsets

2. Cursor-based
   - Consistent results
   - O(1) seek time

3. Infinite scroll
   - Better UX for feeds
   - Memory management needed

4. Virtual windowing
   - Render only visible items
   - Handle large lists`,
    difficulty: 'intermediate',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Cursor-based pagination with TanStack Query
import { useInfiniteQuery } from '@tanstack/react-query';

function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => fetchPosts({ cursor: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  });
}

async function fetchPosts({ cursor }) {
  const response = await fetch(
    \`/api/posts?\${cursor ? \`cursor=\${cursor}\` : ''}&limit=20\`
  );
  return response.json();
}

// Infinite scroll component
function InfinitePostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts();
  
  const observerRef = useRef(null);
  const lastPostRef = useCallback((node) => {
    if (isFetchingNextPage) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);
  
  const posts = data?.pages.flatMap(page => page.posts) ?? [];
  
  return (
    <div>
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          ref={index === posts.length - 1 ? lastPostRef : undefined}
        />
      ))}
      {isFetchingNextPage && <Spinner />}
    </div>
  );
}

// Virtual windowing for huge lists
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualizedList({ items }) {
  const parentRef = useRef(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });
  
  return (
    <div
      ref={parentRef}
      style={{ height: '100vh', overflow: 'auto' }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: virtualRow.size,
              transform: \`translateY(\${virtualRow.start}px)\`,
            }}
          >
            <ListItem item={items[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Combine infinite query with virtualization
function VirtualizedInfiniteList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = 
    useInfinitePosts();
  
  const allPosts = data?.pages.flatMap(p => p.posts) ?? [];
  const parentRef = useRef(null);
  
  const virtualizer = useVirtualizer({
    count: hasNextPage ? allPosts.length + 1 : allPosts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });
  
  useEffect(() => {
    const lastItem = virtualizer.getVirtualItems().at(-1);
    
    if (
      lastItem &&
      lastItem.index >= allPosts.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    virtualizer.getVirtualItems(),
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    allPosts.length,
  ]);
  
  return (
    <div ref={parentRef} style={{ height: '100vh', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const isLoader = virtualRow.index >= allPosts.length;
          const post = allPosts[virtualRow.index];
          
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: \`translateY(\${virtualRow.start}px)\`,
              }}
            >
              {isLoader ? <Spinner /> : <PostCard post={post} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}`,
    tags: ['optimization', 'pagination', 'virtualization', 'infinite-scroll'],
    timeEstimate: 6
  },
  {
    id: 'opt-41',
    category: 'Performance & Optimization',
    question: 'How do you optimize authentication and session handling?',
    answer: `Auth optimization strategies:

1. Token management
   - Short-lived access tokens
   - Refresh token rotation
   - Secure storage

2. Session handling
   - Server-side sessions
   - JWT with proper validation
   - Cookie security

3. Performance
   - Cache user data
   - Parallel auth checks
   - Middleware optimization`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Optimized auth with NextAuth.js
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      
      // Update session
      if (trigger === 'update' && session) {
        return { ...token, ...session };
      }
      
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
});

// Middleware for route protection
// middleware.ts
import { auth } from '@/auth';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthRoute = req.nextUrl.pathname.startsWith('/login');
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard');
  
  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.url));
  }
  
  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', req.url));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

// Cache user data
import { unstable_cache } from 'next/cache';

const getCachedUser = unstable_cache(
  async (userId: string) => {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
      },
    });
  },
  ['user'],
  { revalidate: 60, tags: ['user'] }
);

// Server component with auth
import { auth } from '@/auth';

async function Dashboard() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }
  
  const user = await getCachedUser(session.user.id);
  
  return <DashboardContent user={user} />;
}

// Parallel permission check
async function checkPermissions(userId: string, requiredPerms: string[]) {
  const [user, rolePermissions] = await Promise.all([
    getCachedUser(userId),
    getCachedRolePermissions(userId),
  ]);
  
  const userPerms = new Set([...user.permissions, ...rolePermissions]);
  
  return requiredPerms.every(perm => userPerms.has(perm));
}

// Token refresh hook
function useTokenRefresh() {
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      try {
        await fetch('/api/auth/refresh', { method: 'POST' });
      } catch (error) {
        console.error('Token refresh failed');
      }
    }, 4 * 60 * 1000); // Refresh every 4 minutes
    
    return () => clearInterval(refreshInterval);
  }, []);
}

// Secure cookie configuration
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
};`,
    tags: ['optimization', 'authentication', 'security', 'sessions'],
    timeEstimate: 6
  },
  {
    id: 'opt-42',
    category: 'Performance & Optimization',
    question: 'How do you optimize error boundaries for better UX?',
    answer: `Error boundary optimization:

1. Granular boundaries
   - Isolate failure zones
   - Keep working parts functional

2. Recovery strategies
   - Retry mechanisms
   - Fallback content
   - Reset state

3. Error reporting
   - Log to service
   - User feedback
   - Debug info (dev only)`,
    difficulty: 'intermediate',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Reusable error boundary with recovery
import { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error service
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
      Sentry.captureException(error);
    });
    
    this.props.onError?.(error, errorInfo);
  }
  
  reset = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };
  
  render() {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error!, this.reset);
      }
      
      return this.props.fallback ?? (
        <DefaultErrorFallback
          error={this.state.error!}
          onReset={this.reset}
        />
      );
    }
    
    return this.props.children;
  }
}

// Default fallback component
function DefaultErrorFallback({ error, onReset }) {
  return (
    <div className="p-4 bg-red-50 rounded-lg">
      <h2 className="text-red-800 font-bold">Something went wrong</h2>
      {process.env.NODE_ENV === 'development' && (
        <pre className="text-xs mt-2 overflow-auto">
          {error.message}
        </pre>
      )}
      <button
        onClick={onReset}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}

// Granular error boundaries
function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Each widget is isolated */}
      <ErrorBoundary fallback={<WidgetError name="Stats" />}>
        <StatsWidget />
      </ErrorBoundary>
      
      <ErrorBoundary fallback={<WidgetError name="Chart" />}>
        <ChartWidget />
      </ErrorBoundary>
      
      <ErrorBoundary 
        fallback={(error, reset) => (
          <WidgetErrorWithRetry error={error} onRetry={reset} />
        )}
      >
        <DataWidget />
      </ErrorBoundary>
    </div>
  );
}

// Error boundary with retry and exponential backoff
function RetryingErrorBoundary({ children, maxRetries = 3 }) {
  const [retryCount, setRetryCount] = useState(0);
  const [key, setKey] = useState(0);
  
  const handleError = useCallback((error) => {
    if (retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000;
      setTimeout(() => {
        setRetryCount(c => c + 1);
        setKey(k => k + 1);
      }, delay);
    }
  }, [retryCount, maxRetries]);
  
  const reset = () => {
    setRetryCount(0);
    setKey(k => k + 1);
  };
  
  return (
    <ErrorBoundary
      key={key}
      onError={handleError}
      fallback={
        retryCount >= maxRetries ? (
          <MaxRetriesError onReset={reset} />
        ) : (
          <RetryingIndicator attempt={retryCount + 1} />
        )
      }
    >
      {children}
    </ErrorBoundary>
  );
}

// Query error boundary (for TanStack Query)
import { QueryErrorResetBoundary } from '@tanstack/react-query';

function QueryBoundary({ children }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallback={(error, resetBoundary) => (
            <ErrorFallback
              error={error}
              onRetry={() => {
                reset();
                resetBoundary();
              }}
            />
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}`,
    tags: ['optimization', 'error-boundaries', 'error-handling', 'ux'],
    timeEstimate: 5
  },
  {
    id: 'opt-43',
    category: 'Performance & Optimization',
    question: 'How do you optimize Next.js API routes?',
    answer: `API route optimization:

1. Edge runtime
   - Faster cold starts
   - Global distribution
   - Limited Node.js APIs

2. Caching
   - Response caching
   - Database caching
   - CDN caching

3. Request handling
   - Validate early
   - Stream large responses
   - Proper error handling`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Edge runtime for faster responses
// app/api/fast/route.ts
export const runtime = 'edge';

export async function GET() {
  return new Response(JSON.stringify({ data: 'fast' }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=60, stale-while-revalidate=600',
    },
  });
}

// Cached API response
import { NextResponse } from 'next/server';

export async function GET() {
  const data = await fetchData();
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}

// Validate early, fail fast
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate first
    const validated = createUserSchema.parse(body);
    
    // Then process
    const user = await createUser(validated);
    
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Stream large responses
export async function GET() {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      const items = await getLargeDataset();
      
      controller.enqueue(encoder.encode('['));
      
      for (let i = 0; i < items.length; i++) {
        if (i > 0) controller.enqueue(encoder.encode(','));
        controller.enqueue(encoder.encode(JSON.stringify(items[i])));
      }
      
      controller.enqueue(encoder.encode(']'));
      controller.close();
    },
  });
  
  return new Response(stream, {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Rate limiting
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

export async function middleware(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success, limit, remaining } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response('Too many requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
      },
    });
  }
}

// Parallel data fetching
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  // Fetch in parallel
  const [user, posts, stats] = await Promise.all([
    getUser(userId),
    getUserPosts(userId),
    getUserStats(userId),
  ]);
  
  return NextResponse.json({ user, posts, stats });
}

// Revalidation endpoint
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const { secret, path, tag } = await request.json();
  
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }
  
  if (path) revalidatePath(path);
  if (tag) revalidateTag(tag);
  
  return NextResponse.json({ revalidated: true });
}`,
    tags: ['optimization', 'api-routes', 'edge', 'caching'],
    timeEstimate: 6
  },
  {
    id: 'opt-44',
    category: 'Performance & Optimization',
    question: 'How do you implement efficient state hydration?',
    answer: `State hydration optimization:

1. Minimal initial data
   - Only essential state
   - Lazy load rest

2. Progressive hydration
   - Critical content first
   - Islands architecture

3. Server state sync
   - Avoid double fetching
   - Reuse server data

4. Streaming
   - Suspense boundaries
   - Progressive loading`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Minimal hydration data
// Server component
async function Page() {
  // Fetch only essential data
  const criticalData = await getCriticalData();
  
  return (
    <>
      {/* Immediately visible */}
      <Header data={criticalData.header} />
      
      {/* Hydrate on demand */}
      <Suspense fallback={<Skeleton />}>
        <HeavyContent />
      </Suspense>
    </>
  );
}

// TanStack Query hydration
// app/layout.tsx
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';

export default async function RootLayout({ children }) {
  const queryClient = getQueryClient();
  
  // Prefetch on server
  await queryClient.prefetchQuery({
    queryKey: ['user'],
    queryFn: getUser,
  });
  
  return (
    <html>
      <body>
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}

// Query client singleton
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

// Zustand hydration
// store/user-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// Wait for hydration
function useHydration() {
  const [hydrated, setHydrated] = useState(false);
  
  useEffect(() => {
    const unsubscribe = useUserStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    
    return unsubscribe;
  }, []);
  
  return hydrated;
}

// Hydration-aware component
function HydratedContent({ children, fallback }) {
  const hydrated = useHydration();
  
  if (!hydrated) return fallback;
  
  return children;
}

// Streaming with Suspense
async function StreamedPage() {
  return (
    <div>
      {/* Immediate */}
      <h1>Page Title</h1>
      
      {/* Stream when ready */}
      <Suspense fallback={<UserSkeleton />}>
        <UserSection />
      </Suspense>
      
      <Suspense fallback={<ContentSkeleton />}>
        <ContentSection />
      </Suspense>
    </div>
  );
}

// Avoid hydration mismatch
function SafeHydration({ children, fallback = null }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return fallback;
  
  return children;
}

// Usage
function ThemeToggle() {
  return (
    <SafeHydration fallback={<div className="w-8 h-8" />}>
      <ClientThemeToggle />
    </SafeHydration>
  );
}`,
    tags: ['optimization', 'hydration', 'ssr', 'streaming'],
    timeEstimate: 6
  },
  {
    id: 'opt-45',
    category: 'Performance & Optimization',
    question: 'How do you measure and monitor Core Web Vitals?',
    answer: `Core Web Vitals monitoring:

Metrics:
- LCP (Largest Contentful Paint)
- FID/INP (Interaction to Next Paint)
- CLS (Cumulative Layout Shift)

Tools:
- web-vitals library
- Google PageSpeed Insights
- Chrome DevTools
- Vercel Analytics

Monitoring:
- Real user monitoring (RUM)
- Synthetic monitoring
- Alerts and dashboards`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// web-vitals integration
import { onCLS, onFID, onLCP, onINP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    id: metric.id,
    name: metric.name,
    value: metric.value,
    rating: metric.rating, // 'good', 'needs-improvement', 'poor'
    delta: metric.delta,
    navigationType: metric.navigationType,
  });
  
  // Use sendBeacon for reliability
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/vitals', body);
  } else {
    fetch('/api/vitals', { body, method: 'POST', keepalive: true });
  }
}

// Measure all vitals
export function reportWebVitals() {
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
  onINP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}

// Next.js built-in web vitals
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

// Custom metrics hook
function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState({});
  
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        setMetrics(prev => ({
          ...prev,
          [entry.name]: {
            value: entry.startTime,
            duration: entry.duration,
          },
        }));
      });
    });
    
    observer.observe({ 
      entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] 
    });
    
    return () => observer.disconnect();
  }, []);
  
  return metrics;
}

// API endpoint for vitals
// app/api/vitals/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const metric = await request.json();
  
  // Log to your analytics service
  console.log('Web Vital:', metric);
  
  // Send to analytics service
  await fetch('https://analytics.example.com/vitals', {
    method: 'POST',
    body: JSON.stringify(metric),
  });
  
  // Alert on poor scores
  if (metric.rating === 'poor') {
    await sendAlert({
      metric: metric.name,
      value: metric.value,
      page: metric.navigationType,
    });
  }
  
  return NextResponse.json({ received: true });
}

// Debug component
function VitalsDebugger() {
  const [vitals, setVitals] = useState({});
  
  useEffect(() => {
    onLCP(m => setVitals(v => ({ ...v, LCP: m })));
    onFID(m => setVitals(v => ({ ...v, FID: m })));
    onCLS(m => setVitals(v => ({ ...v, CLS: m })));
    onINP(m => setVitals(v => ({ ...v, INP: m })));
  }, []);
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded text-sm z-50">
      <h3 className="font-bold">Web Vitals</h3>
      {Object.entries(vitals).map(([name, metric]) => (
        <div key={name} className={\`\${
          metric.rating === 'good' ? 'text-green-400' :
          metric.rating === 'needs-improvement' ? 'text-yellow-400' :
          'text-red-400'
        }\`}>
          {name}: {metric.value.toFixed(2)}
        </div>
      ))}
    </div>
  );
}`,
    tags: ['optimization', 'web-vitals', 'monitoring', 'performance'],
    timeEstimate: 5
  },
  
  // Multiple Choice Questions
  {
    id: 'opt-mcq-1',
    category: 'Performance & Optimization',
    question: 'What does React.memo() do?',
    answer: 'Memoizes a component to prevent re-renders when props have not changed.',
    difficulty: 'beginner',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Stores data in local storage', isCorrect: false },
      { id: 'b', text: 'Memoizes a component to prevent unnecessary re-renders', isCorrect: true },
      { id: 'c', text: 'Creates a memory leak', isCorrect: false },
      { id: 'd', text: 'Improves CSS performance', isCorrect: false }
    ],
    tags: ['optimization', 'memo', 'react'],
    timeEstimate: 1
  },
  {
    id: 'opt-mcq-2',
    category: 'Performance & Optimization',
    question: 'Which hook memoizes the result of a calculation?',
    answer: 'useMemo - It returns a memoized value that only recalculates when dependencies change.',
    difficulty: 'beginner',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'useCallback', isCorrect: false },
      { id: 'b', text: 'useMemo', isCorrect: true },
      { id: 'c', text: 'useRef', isCorrect: false },
      { id: 'd', text: 'useEffect', isCorrect: false }
    ],
    tags: ['optimization', 'useMemo', 'hooks'],
    timeEstimate: 1
  },
  {
    id: 'opt-mcq-3',
    category: 'Performance & Optimization',
    question: 'What is code splitting in React?',
    answer: 'Breaking your code into smaller chunks that are loaded on demand to reduce initial bundle size.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Dividing code into multiple files for organization', isCorrect: false },
      { id: 'b', text: 'Breaking code into chunks loaded on demand', isCorrect: true },
      { id: 'c', text: 'Splitting a component into smaller components', isCorrect: false },
      { id: 'd', text: 'Writing code in multiple languages', isCorrect: false }
    ],
    tags: ['optimization', 'code-splitting'],
    timeEstimate: 1
  },
  {
    id: 'opt-mcq-4',
    category: 'Performance & Optimization',
    question: 'Which function is used for lazy loading components in React?',
    answer: 'React.lazy() - It allows you to dynamically import components.',
    difficulty: 'beginner',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'React.lazy()', isCorrect: true },
      { id: 'b', text: 'React.defer()', isCorrect: false },
      { id: 'c', text: 'React.async()', isCorrect: false },
      { id: 'd', text: 'React.load()', isCorrect: false }
    ],
    tags: ['optimization', 'lazy-loading'],
    timeEstimate: 1
  },
  {
    id: 'opt-mcq-5',
    category: 'Performance & Optimization',
    question: 'What is the primary cause of unnecessary re-renders in React?',
    answer: 'Parent component re-renders causing all children to re-render, or creating new object/function references.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Using too many components', isCorrect: false },
      { id: 'b', text: 'Parent re-renders or new object/function references in props', isCorrect: true },
      { id: 'c', text: 'Using CSS animations', isCorrect: false },
      { id: 'd', text: 'Having too much JSX', isCorrect: false }
    ],
    tags: ['optimization', 're-renders'],
    timeEstimate: 1
  },
  {
    id: 'opt-mcq-6',
    category: 'Performance & Optimization',
    question: 'What does useCallback return?',
    answer: 'A memoized callback function that only changes when dependencies change.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'The result of calling a function', isCorrect: false },
      { id: 'b', text: 'A memoized callback function', isCorrect: true },
      { id: 'c', text: 'A promise', isCorrect: false },
      { id: 'd', text: 'An event listener', isCorrect: false }
    ],
    tags: ['optimization', 'useCallback'],
    timeEstimate: 1
  },
  {
    id: 'opt-mcq-7',
    category: 'Performance & Optimization',
    question: 'What is virtualization in the context of React performance?',
    answer: 'Rendering only the visible items in a long list instead of all items.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Using virtual machines for React', isCorrect: false },
      { id: 'b', text: 'Rendering only visible items in a list', isCorrect: true },
      { id: 'c', text: 'Creating virtual components', isCorrect: false },
      { id: 'd', text: 'Using the Virtual DOM', isCorrect: false }
    ],
    tags: ['optimization', 'virtualization'],
    timeEstimate: 1
  },
  {
    id: 'opt-mcq-8',
    category: 'Performance & Optimization',
    question: 'Which Core Web Vital measures visual stability?',
    answer: 'CLS (Cumulative Layout Shift) - It measures unexpected layout shifts during page load.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'LCP (Largest Contentful Paint)', isCorrect: false },
      { id: 'b', text: 'FID (First Input Delay)', isCorrect: false },
      { id: 'c', text: 'CLS (Cumulative Layout Shift)', isCorrect: true },
      { id: 'd', text: 'TTFB (Time to First Byte)', isCorrect: false }
    ],
    tags: ['optimization', 'web-vitals', 'cls'],
    timeEstimate: 1
  },
  {
    id: 'opt-mcq-9',
    category: 'Performance & Optimization',
    question: 'When should you NOT use useMemo?',
    answer: 'For cheap calculations where memoization overhead exceeds the computation cost.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'For expensive calculations', isCorrect: false },
      { id: 'b', text: 'When passing objects to memoized children', isCorrect: false },
      { id: 'c', text: 'For cheap calculations where overhead exceeds benefit', isCorrect: true },
      { id: 'd', text: 'When values are used in useEffect', isCorrect: false }
    ],
    tags: ['optimization', 'useMemo'],
    timeEstimate: 1
  },
  {
    id: 'opt-mcq-10',
    category: 'Performance & Optimization',
    question: 'What React DevTools feature helps identify unnecessary re-renders?',
    answer: 'Profiler and "Highlight updates" - They help visualize component renders.',
    difficulty: 'beginner',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Console.log', isCorrect: false },
      { id: 'b', text: 'Profiler and Highlight updates', isCorrect: true },
      { id: 'c', text: 'Network tab', isCorrect: false },
      { id: 'd', text: 'Memory tab', isCorrect: false }
    ],
    tags: ['optimization', 'devtools'],
    timeEstimate: 1
  },
  {
    id: 'opt-mcq-11',
    category: 'Performance & Optimization',
    question: 'What is tree shaking?',
    answer: 'Eliminating dead code during the build process to reduce bundle size.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Reorganizing the component tree', isCorrect: false },
      { id: 'b', text: 'Eliminating dead code during build', isCorrect: true },
      { id: 'c', text: 'Removing unused CSS', isCorrect: false },
      { id: 'd', text: 'Optimizing the Virtual DOM', isCorrect: false }
    ],
    tags: ['optimization', 'tree-shaking', 'bundling'],
    timeEstimate: 1
  },
  {
    id: 'opt-mcq-12',
    category: 'Performance & Optimization',
    question: 'Which library is commonly used for list virtualization in React?',
    answer: 'react-window or react-virtualized - These libraries efficiently render large lists.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'react-list', isCorrect: false },
      { id: 'b', text: 'react-window or react-virtualized', isCorrect: true },
      { id: 'c', text: 'react-infinite', isCorrect: false },
      { id: 'd', text: 'react-scroll', isCorrect: false }
    ],
    tags: ['optimization', 'virtualization'],
    timeEstimate: 1
  },
  {
    id: 'opt-mcq-13',
    category: 'Performance & Optimization',
    question: 'What is the recommended way to handle images in Next.js for performance?',
    answer: 'Using the next/image component - It provides automatic optimization, lazy loading, and responsive images.',
    difficulty: 'beginner',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Regular <img> tag', isCorrect: false },
      { id: 'b', text: 'next/image component', isCorrect: true },
      { id: 'c', text: 'CSS background images', isCorrect: false },
      { id: 'd', text: 'SVG only', isCorrect: false }
    ],
    tags: ['optimization', 'images', 'next.js'],
    timeEstimate: 1
  },
  {
    id: 'opt-mcq-14',
    category: 'Performance & Optimization',
    question: 'What is debouncing used for?',
    answer: 'Delaying function execution until a specified time has passed since the last call.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Executing a function immediately', isCorrect: false },
      { id: 'b', text: 'Delaying execution until after the last call', isCorrect: true },
      { id: 'c', text: 'Running a function multiple times', isCorrect: false },
      { id: 'd', text: 'Canceling function execution', isCorrect: false }
    ],
    tags: ['optimization', 'debounce'],
    timeEstimate: 1
  },
  {
    id: 'opt-mcq-15',
    category: 'Performance & Optimization',
    question: 'What is the difference between debouncing and throttling?',
    answer: 'Debouncing waits until activity stops, throttling limits execution to once per time period.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'They are the same', isCorrect: false },
      { id: 'b', text: 'Debouncing waits until activity stops, throttling limits rate', isCorrect: true },
      { id: 'c', text: 'Throttling is faster than debouncing', isCorrect: false },
      { id: 'd', text: 'Debouncing is deprecated', isCorrect: false }
    ],
    tags: ['optimization', 'debounce', 'throttle'],
    timeEstimate: 1
  }
];

