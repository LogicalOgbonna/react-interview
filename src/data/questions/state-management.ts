import { Question } from '../types';

export const stateManagementQuestions: Question[] = [
  {
    id: 'sm-1',
    category: 'State Management',
    question: 'What is Redux and what are its core principles?',
    answer: `Redux is a predictable state container for JavaScript apps.

Core principles:
1. Single Source of Truth
   - Entire app state in one store
   - Easier debugging and serialization

2. State is Read-Only
   - Only way to change is dispatching actions
   - Predictable state changes

3. Pure Reducer Functions
   - Reducers are pure functions
   - (state, action) => newState
   - No side effects

Key concepts:
- Store: Holds state tree
- Actions: Plain objects describing changes
- Reducers: Pure functions that update state
- Dispatch: Method to send actions`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Action types
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';

// Action creators
const addTodo = (text) => ({
  type: ADD_TODO,
  payload: { id: Date.now(), text, completed: false }
});

// Reducer
const todosReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return [...state, action.payload];
    case TOGGLE_TODO:
      return state.map(todo =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    default:
      return state;
  }
};

// Store
import { createStore } from 'redux';
const store = createStore(todosReducer);

// Usage
store.dispatch(addTodo('Learn Redux'));
console.log(store.getState());`,
    tags: ['redux', 'state-management', 'flux'],
    timeEstimate: 5
  },
  {
    id: 'sm-2',
    category: 'State Management',
    question: 'How does Redux Toolkit simplify Redux development?',
    answer: `Redux Toolkit (RTK) is the official, recommended way to write Redux logic:

Key features:
1. configureStore - Simplified store setup
2. createSlice - Reduces boilerplate
3. createAsyncThunk - Async operations
4. RTK Query - Data fetching/caching
5. Immer integration - "Mutating" syntax

Benefits:
- 60-90% less code than vanilla Redux
- TypeScript support built-in
- Best practices by default
- DevTools configured automatically`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `import { createSlice, configureStore, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async () => {
    const response = await fetch('/api/todos');
    return response.json();
  }
);

// Slice = reducer + actions
const todosSlice = createSlice({
  name: 'todos',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    addTodo: (state, action) => {
      // Immer allows "mutation" syntax
      state.items.push(action.payload);
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Store
const store = configureStore({
  reducer: {
    todos: todosSlice.reducer,
  },
});

// Export actions
export const { addTodo, toggleTodo } = todosSlice.actions;`,
    tags: ['redux', 'redux-toolkit', 'state-management'],
    timeEstimate: 6
  },
  {
    id: 'sm-3',
    category: 'State Management',
    question: 'Compare Zustand, Jotai, and Redux for state management.',
    answer: `Modern state management comparison:

Redux:
- Pros: Mature ecosystem, DevTools, middleware
- Cons: More boilerplate, learning curve
- Best for: Large apps, complex state logic

Zustand:
- Pros: Minimal API, small bundle, no providers
- Cons: Less opinionated, fewer patterns
- Best for: Simple to medium complexity

Jotai:
- Pros: Atomic model, fine-grained updates
- Cons: Different mental model
- Best for: When you want atom-based state

Context API:
- Pros: Built-in, no dependencies
- Cons: Performance issues at scale
- Best for: Simple, rarely-changing state`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Zustand - minimal and simple
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));

// Usage - no provider needed!
function Counter() {
  const { count, increment } = useStore();
  return <button onClick={increment}>{count}</button>;
}

// Jotai - atomic state
import { atom, useAtom } from 'jotai';

const countAtom = atom(0);
const doubleCountAtom = atom((get) => get(countAtom) * 2);

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const [double] = useAtom(doubleCountAtom);
  
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <p>Double: {double}</p>
    </div>
  );
}

// Zustand with TypeScript and middleware
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface BearState {
  bears: number;
  addBear: () => void;
}

const useBearStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        bears: 0,
        addBear: () => set((state) => ({ bears: state.bears + 1 })),
      }),
      { name: 'bear-storage' }
    )
  )
);`,
    tags: ['state-management', 'zustand', 'jotai', 'redux'],
    timeEstimate: 6
  },
  {
    id: 'sm-4',
    category: 'State Management',
    question: 'When should you use Context API vs a state management library?',
    answer: `Context API best suited for:
- Theme/localization (infrequent updates)
- User authentication state
- Small apps with simple state
- When you want zero dependencies

State library better when:
- State updates frequently
- Many consumers of same state
- Complex state logic (async, derived)
- Need DevTools/time-travel debugging
- Large team needs conventions

Key insight: Context is for prop drilling, not for frequently updating state.`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Good use of Context - infrequent updates
const ThemeContext = createContext<'light' | 'dark'>('light');

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Value rarely changes - good for context
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Bad use of Context - frequent updates
function BadRealTimeContext() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handler = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  
  // All consumers re-render on every mouse move!
  return (
    <MouseContext.Provider value={position}>
      {children}
    </MouseContext.Provider>
  );
}

// Better - use a state library for frequent updates
import { create } from 'zustand';

const useMouseStore = create((set) => ({
  position: { x: 0, y: 0 },
  setPosition: (x, y) => set({ position: { x, y } }),
}));

// Components subscribe to just what they need
function XCoordinate() {
  const x = useMouseStore((state) => state.position.x);
  return <span>{x}</span>;
}`,
    tags: ['state-management', 'context', 'performance', 'architecture'],
    timeEstimate: 5
  },
  {
    id: 'sm-5',
    category: 'State Management',
    question: 'What is TanStack Query and how does it differ from traditional state management?',
    answer: `TanStack Query (React Query) is a server state management library:

Key distinction:
- Client state: UI state, form state, local preferences
- Server state: Data from APIs, shared across users

TanStack Query handles:
- Caching
- Background refetching
- Stale data management
- Request deduplication
- Optimistic updates
- Infinite scroll/pagination

It's not a replacement for Redux/Zustand, but complements them for server state.`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetching data
function UserProfile({ userId }) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000, // Data fresh for 5 min
    cacheTime: 30 * 60 * 1000, // Cache for 30 min
  });
  
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <Profile user={user} />;
}

// Mutations with optimistic updates
function TodoList() {
  const queryClient = useQueryClient();
  
  const { mutate: addTodo } = useMutation({
    mutationFn: createTodo,
    onMutate: async (newTodo) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      
      // Snapshot previous value
      const previousTodos = queryClient.getQueryData(['todos']);
      
      // Optimistically update
      queryClient.setQueryData(['todos'], (old) => [...old, newTodo]);
      
      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      // Rollback on error
      queryClient.setQueryData(['todos'], context.previousTodos);
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
  
  return (
    <button onClick={() => addTodo({ text: 'New todo' })}>
      Add Todo
    </button>
  );
}

// Infinite scroll
function PostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}`,
    tags: ['state-management', 'tanstack-query', 'data-fetching', 'caching'],
    timeEstimate: 6
  },
  {
    id: 'sm-6',
    category: 'State Management',
    question: 'How do you handle global state in Next.js App Router?',
    answer: `State management in App Router requires understanding RSC:

Server Components:
- No useState/useContext
- Data fetching is state
- Use cookies/headers for persistent state

Client Components:
- Traditional state management
- Wrap providers carefully

Patterns:
1. URL state (searchParams)
2. Cookies for persistence
3. React context for client state
4. External stores (Zustand) for shared client state`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Pattern 1: URL as state (searchParams)
// Works with Server Components!
async function ProductsPage({ searchParams }) {
  const { category, sort } = searchParams;
  const products = await getProducts({ category, sort });
  
  return (
    <>
      <Filters current={{ category, sort }} />
      <ProductList products={products} />
    </>
  );
}

// Pattern 2: Provider wrapper at layout level
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './theme-context';

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

// Pattern 3: Zustand for client state (no provider!)
// stores/cart.ts
import { create } from 'zustand';

export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
}));

// Works in any client component
'use client';
function CartButton() {
  const itemCount = useCartStore((state) => state.items.length);
  return <button>Cart ({itemCount})</button>;
}

// Pattern 4: Server Actions for mutations
async function updateProfile(formData) {
  'use server';
  await db.user.update(...);
  revalidatePath('/profile');
}`,
    tags: ['state-management', 'next.js', 'app-router', 'server-components'],
    timeEstimate: 6
  },
  {
    id: 'sm-7',
    category: 'State Management',
    question: 'Explain the difference between mapStateToProps and mapDispatchToProps in React Redux.',
    answer: `Legacy Redux connect() pattern (still used in many codebases):

mapStateToProps:
- Subscribes component to store
- Receives state as first argument
- Returns object merged into props
- Called on every state change

mapDispatchToProps:
- Provides dispatch capabilities
- Can be object (shorthand) or function
- Actions are wrapped with dispatch

Modern alternative: useSelector and useDispatch hooks.`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `import { connect } from 'react-redux';
import { addTodo, toggleTodo } from './actions';

// Component
function TodoList({ todos, addTodo, toggleTodo }) {
  return (
    <ul>
      {todos.map(todo => (
        <li 
          key={todo.id} 
          onClick={() => toggleTodo(todo.id)}
        >
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// mapStateToProps - select data from store
const mapStateToProps = (state, ownProps) => ({
  todos: state.todos.filter(t => 
    t.category === ownProps.category
  ),
});

// mapDispatchToProps - function form
const mapDispatchToProps = (dispatch) => ({
  addTodo: (text) => dispatch(addTodo(text)),
  toggleTodo: (id) => dispatch(toggleTodo(id)),
});

// mapDispatchToProps - object shorthand
const mapDispatchToProps = {
  addTodo,
  toggleTodo,
};

// Connect HOC
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);

// Modern hooks approach (preferred)
import { useSelector, useDispatch } from 'react-redux';

function TodoList({ category }) {
  const dispatch = useDispatch();
  const todos = useSelector(state => 
    state.todos.filter(t => t.category === category)
  );
  
  return (
    <ul>
      {todos.map(todo => (
        <li 
          key={todo.id}
          onClick={() => dispatch(toggleTodo(todo.id))}
        >
          {todo.text}
        </li>
      ))}
    </ul>
  );
}`,
    tags: ['redux', 'connect', 'state-management'],
    timeEstimate: 5
  },
  {
    id: 'sm-8',
    category: 'State Management',
    question: 'What are Redux selectors and why use them?',
    answer: `Selectors are functions that extract and derive data from the Redux store.

Benefits:
1. Encapsulation - Hide store structure
2. Reusability - Same logic in multiple components
3. Memoization - Prevent recalculations
4. Testability - Pure functions, easy to test
5. Performance - Reselect prevents unnecessary renders

Reselect library provides createSelector for memoized selectors.`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `import { createSelector } from '@reduxjs/toolkit';

// Basic selector
const selectTodos = (state) => state.todos.items;

// Parameterized selector
const selectTodoById = (state, todoId) => 
  state.todos.items.find(t => t.id === todoId);

// Memoized derived selector
const selectCompletedTodos = createSelector(
  [selectTodos],
  (todos) => todos.filter(t => t.completed)
);

// Composing selectors
const selectCompletedCount = createSelector(
  [selectCompletedTodos],
  (completed) => completed.length
);

// Parameterized memoized selector
const makeSelectTodosByCategory = () => createSelector(
  [selectTodos, (_, category) => category],
  (todos, category) => todos.filter(t => t.category === category)
);

// Usage in component
function TodoStats() {
  const completedCount = useSelector(selectCompletedCount);
  const totalCount = useSelector(state => selectTodos(state).length);
  
  return (
    <div>
      Completed: {completedCount} / {totalCount}
    </div>
  );
}

// With RTK Query - selectors are generated
const api = createApi({
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => '/todos',
    }),
  }),
});

// Auto-generated selectors
const { selectData, selectIsLoading } = api.endpoints.getTodos.select();`,
    tags: ['redux', 'selectors', 'reselect', 'performance'],
    timeEstimate: 5
  },
  {
    id: 'sm-9',
    category: 'State Management',
    question: 'How do you handle async operations in Redux?',
    answer: `Redux itself is synchronous. Async requires middleware:

1. Redux Thunk (simple)
   - Functions as actions
   - Access to dispatch and getState

2. Redux Saga (complex)
   - Generator functions
   - Advanced control flow

3. RTK createAsyncThunk (recommended)
   - Built into Redux Toolkit
   - Handles pending/fulfilled/rejected

4. RTK Query (data fetching)
   - Complete data fetching solution
   - Caching, polling, invalidation`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Thunk (manual)
const fetchUser = (userId) => async (dispatch, getState) => {
  dispatch({ type: 'user/loading' });
  
  try {
    const response = await api.getUser(userId);
    dispatch({ type: 'user/loaded', payload: response.data });
  } catch (error) {
    dispatch({ type: 'user/error', payload: error.message });
  }
};

// createAsyncThunk (RTK)
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const fetchUser = createAsyncThunk(
  'user/fetch',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.getUser(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// RTK Query (best for data fetching)
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => \`users/\${id}\`,
    }),
    updateUser: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: \`users/\${id}\`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Auto-generated hooks
export const { useGetUserQuery, useUpdateUserMutation } = api;`,
    tags: ['redux', 'async', 'thunk', 'rtk-query'],
    timeEstimate: 6
  },
  {
    id: 'sm-10',
    category: 'State Management',
    question: 'What is MobX and how does it differ from Redux?',
    answer: `MobX is a reactive state management library using observables:

Key differences from Redux:

Redux:
- Single store, immutable state
- Explicit updates via actions
- Unidirectional data flow
- More boilerplate, more predictable

MobX:
- Multiple stores, mutable state
- Automatic tracking of dependencies
- Less boilerplate
- More "magical", less explicit

Choose MobX when:
- Smaller apps, faster setup
- Team prefers OOP
- Fine-grained reactivity needed`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `import { makeAutoObservable, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';

// Store class
class TodoStore {
  todos = [];
  loading = false;
  
  constructor() {
    makeAutoObservable(this);
  }
  
  // Computed value - automatically derived
  get completedCount() {
    return this.todos.filter(t => t.completed).length;
  }
  
  // Action - modifies state
  addTodo(text) {
    this.todos.push({
      id: Date.now(),
      text,
      completed: false,
    });
  }
  
  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) todo.completed = !todo.completed;
  }
  
  // Async action
  async fetchTodos() {
    this.loading = true;
    try {
      const response = await api.getTodos();
      runInAction(() => {
        this.todos = response.data;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

const todoStore = new TodoStore();

// Observer component - re-renders on observed changes
const TodoList = observer(function TodoList() {
  const { todos, completedCount, loading, addTodo, toggleTodo } = todoStore;
  
  if (loading) return <Spinner />;
  
  return (
    <div>
      <p>Completed: {completedCount}</p>
      <ul>
        {todos.map(todo => (
          <li 
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
          >
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
});`,
    tags: ['mobx', 'state-management', 'observables', 'reactive'],
    timeEstimate: 5
  },
  {
    id: 'sm-11',
    category: 'State Management',
    question: 'What is Redux Saga and when would you use it over Thunks?',
    answer: `Redux Saga uses ES6 generators for complex async flows:

Use Saga when you need:
- Complex async sequences
- Cancellation of requests
- Debouncing/throttling
- Race conditions handling
- Background sync
- WebSocket management

Use Thunks for:
- Simple async operations
- Quick setup
- Smaller bundle size`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `import { call, put, takeEvery, takeLatest, all, race, delay } from 'redux-saga/effects';

// Basic saga
function* fetchUserSaga(action) {
  try {
    yield put({ type: 'USER_LOADING' });
    const user = yield call(api.getUser, action.payload);
    yield put({ type: 'USER_SUCCESS', payload: user });
  } catch (error) {
    yield put({ type: 'USER_ERROR', payload: error.message });
  }
}

// Debounced search
function* searchSaga(action) {
  yield delay(300); // Debounce
  const results = yield call(api.search, action.payload);
  yield put({ type: 'SEARCH_RESULTS', payload: results });
}

// Race condition - timeout
function* fetchWithTimeout(action) {
  const { response, timeout } = yield race({
    response: call(api.getData, action.payload),
    timeout: delay(5000)
  });
  
  if (timeout) {
    yield put({ type: 'FETCH_TIMEOUT' });
  } else {
    yield put({ type: 'FETCH_SUCCESS', payload: response });
  }
}

// Cancellable saga
function* watchSearch() {
  yield takeLatest('SEARCH_REQUEST', searchSaga); // Cancels previous
}

// Root saga
function* rootSaga() {
  yield all([
    takeEvery('FETCH_USER', fetchUserSaga),
    takeLatest('SEARCH', searchSaga),
    watchSearch(),
  ]);
}`,
    tags: ['redux', 'saga', 'generators', 'async'],
    timeEstimate: 6
  },
  {
    id: 'sm-12',
    category: 'State Management',
    question: 'How do you normalize state in Redux?',
    answer: `Normalization is storing relational data in a flat structure:

Benefits:
1. No data duplication
2. Easy updates (single location)
3. Predictable state shape
4. Better performance with selectors

Structure:
- entities: { [id]: entity }
- ids: [array of ids]
- byId lookup tables

Tools:
- normalizr library
- RTK's createEntityAdapter`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Without normalization (nested, duplicated)
const badState = {
  posts: [
    {
      id: 1,
      title: 'Post 1',
      author: { id: 1, name: 'John' }, // Duplicated!
      comments: [
        { id: 1, text: 'Great!', author: { id: 1, name: 'John' } }
      ]
    }
  ]
};

// With normalization (flat, no duplication)
const normalizedState = {
  entities: {
    users: {
      1: { id: 1, name: 'John' },
      2: { id: 2, name: 'Jane' }
    },
    posts: {
      1: { id: 1, title: 'Post 1', author: 1, comments: [1] }
    },
    comments: {
      1: { id: 1, text: 'Great!', author: 1, post: 1 }
    }
  },
  ids: {
    users: [1, 2],
    posts: [1],
    comments: [1]
  }
};

// RTK's createEntityAdapter
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const usersAdapter = createEntityAdapter({
  selectId: (user) => user.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState(),
  reducers: {
    addUser: usersAdapter.addOne,
    updateUser: usersAdapter.updateOne,
    removeUser: usersAdapter.removeOne,
    setUsers: usersAdapter.setAll,
  },
});

// Generated selectors
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state) => state.users);`,
    tags: ['redux', 'normalization', 'entity-adapter', 'architecture'],
    timeEstimate: 6
  },
  {
    id: 'sm-13',
    category: 'State Management',
    question: 'What is Immer and how does it enable immutable updates?',
    answer: `Immer lets you write mutable code that produces immutable updates:

How it works:
1. Creates a draft (proxy) of the state
2. You "mutate" the draft
3. Immer produces new immutable state

Benefits:
- Simpler code for nested updates
- Structural sharing (performance)
- TypeScript support
- Built into Redux Toolkit`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `import produce from 'immer';

// Without Immer - verbose immutable updates
const updateNestedWithoutImmer = (state, userId, addressField, value) => ({
  ...state,
  users: {
    ...state.users,
    [userId]: {
      ...state.users[userId],
      address: {
        ...state.users[userId].address,
        [addressField]: value
      }
    }
  }
});

// With Immer - looks like mutation but isn't!
const updateNestedWithImmer = produce((draft, userId, addressField, value) => {
  draft.users[userId].address[addressField] = value;
});

// Redux Toolkit uses Immer automatically
const userSlice = createSlice({
  name: 'users',
  initialState: { list: [], selected: null },
  reducers: {
    addUser: (state, action) => {
      // This looks like mutation but Immer handles it!
      state.list.push(action.payload);
    },
    updateUser: (state, action) => {
      const user = state.list.find(u => u.id === action.payload.id);
      if (user) {
        user.name = action.payload.name;
        user.email = action.payload.email;
      }
    },
    removeUser: (state, action) => {
      const index = state.list.findIndex(u => u.id === action.payload);
      state.list.splice(index, 1);
    }
  }
});

// Immer with React's useState
import { useImmer } from 'use-immer';

function Form() {
  const [person, updatePerson] = useImmer({
    name: '',
    address: { street: '', city: '' }
  });
  
  const updateStreet = (street) => {
    updatePerson(draft => {
      draft.address.street = street; // "mutation" syntax
    });
  };
}`,
    tags: ['immer', 'immutability', 'redux-toolkit', 'state-updates'],
    timeEstimate: 5
  },
  {
    id: 'sm-14',
    category: 'State Management',
    question: 'How do you persist state across page refreshes?',
    answer: `State persistence strategies:

1. localStorage/sessionStorage
   - Simple, synchronous
   - 5MB limit, strings only

2. IndexedDB
   - Larger storage, async
   - Structured data

3. Cookies
   - Server-accessible
   - Small size limit

Libraries:
- redux-persist
- zustand/middleware persist
- localforage (abstraction)`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Redux Persist
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'cart'], // Only persist these
  blacklist: ['temp'], // Don't persist these
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

const persistor = persistStore(store);

// In App
import { PersistGate } from 'redux-persist/integration/react';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

// Zustand with persist middleware
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      cart: [],
      setUser: (user) => set({ user }),
      addToCart: (item) => set((state) => ({ 
        cart: [...state.cart, item] 
      })),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart }), // Only persist cart
    }
  )
);

// Manual persistence with custom hook
function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  
  return [state, setState];
}`,
    tags: ['persistence', 'localStorage', 'redux-persist', 'zustand'],
    timeEstimate: 5
  },
  {
    id: 'sm-15',
    category: 'State Management',
    question: 'What is Recoil and how does it compare to other solutions?',
    answer: `Recoil is Facebook's state management library with atomic model:

Key concepts:
1. Atoms - units of state
2. Selectors - derived state
3. Concurrent mode ready

Advantages:
- Fine-grained subscriptions
- Async selectors built-in
- React-like API
- Great for complex derived state

Best for:
- React-specific apps
- Complex dependency graphs
- When you need derived async state`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';

// Atoms - basic units of state
const textState = atom({
  key: 'textState',
  default: '',
});

const todoListState = atom({
  key: 'todoListState',
  default: [],
});

const filterState = atom({
  key: 'filterState',
  default: 'all',
});

// Selector - derived state
const filteredTodoListState = selector({
  key: 'filteredTodoListState',
  get: ({ get }) => {
    const filter = get(filterState);
    const todos = get(todoListState);
    
    switch (filter) {
      case 'completed':
        return todos.filter(t => t.completed);
      case 'uncompleted':
        return todos.filter(t => !t.completed);
      default:
        return todos;
    }
  },
});

// Async selector
const userDataSelector = selector({
  key: 'userData',
  get: async ({ get }) => {
    const userId = get(currentUserIdState);
    const response = await fetch(\`/api/users/\${userId}\`);
    return response.json();
  },
});

// Using in components
function TodoList() {
  const [todos, setTodos] = useRecoilState(todoListState);
  const filteredTodos = useRecoilValue(filteredTodoListState);
  
  const addTodo = (text) => {
    setTodos(old => [...old, { id: Date.now(), text, completed: false }]);
  };
  
  return (
    <ul>
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} item={todo} />
      ))}
    </ul>
  );
}

// Async data with Suspense
function UserProfile() {
  const userData = useRecoilValue(userDataSelector);
  return <div>{userData.name}</div>;
}

// Parent wraps with Suspense
<Suspense fallback={<Loading />}>
  <UserProfile />
</Suspense>`,
    tags: ['recoil', 'atoms', 'selectors', 'state-management'],
    timeEstimate: 6
  },
  {
    id: 'sm-16',
    category: 'State Management',
    question: 'How do you handle form state in React applications?',
    answer: `Form state approaches:

1. Controlled components (useState)
   - React controls value
   - Good for simple forms

2. Uncontrolled components (useRef)
   - DOM controls value
   - Better performance

3. Form libraries:
   - React Hook Form (performance)
   - Formik (features)
   - Zod/Yup (validation)

Key considerations:
- Validation timing
- Error handling
- Submission handling
- Field-level vs form-level state`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// React Hook Form - performant, minimal re-renders
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });
  
  const onSubmit = async (data) => {
    await api.signup(data);
    reset();
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      
      <input type="password" {...register('confirmPassword')} />
      {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
      
      <button disabled={isSubmitting}>
        {isSubmitting ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
}

// Formik with Yup
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(8).required(),
});

function LoginForm() {
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await api.login(values);
        resetForm();
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field name="email" type="email" />
          <ErrorMessage name="email" component="span" />
          
          <Field name="password" type="password" />
          <ErrorMessage name="password" component="span" />
          
          <button type="submit" disabled={isSubmitting}>
            Login
          </button>
        </Form>
      )}
    </Formik>
  );
}`,
    tags: ['forms', 'react-hook-form', 'formik', 'validation'],
    timeEstimate: 6
  },
  {
    id: 'sm-17',
    category: 'State Management',
    question: 'What is XState and when would you use it?',
    answer: `XState is a state machine library for predictable state management:

Best suited for:
- Complex UI flows (wizards, modals)
- Auth flows
- API request states
- Anything with clear states/transitions

Benefits:
- Visual state diagrams
- Impossible states prevented
- Predictable behavior
- Great for testing

Concepts:
- States, transitions, guards
- Actions, services, context`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

// Auth machine
const authMachine = createMachine({
  id: 'auth',
  initial: 'idle',
  context: {
    user: null,
    error: null,
  },
  states: {
    idle: {
      on: {
        LOGIN: 'authenticating',
      },
    },
    authenticating: {
      invoke: {
        src: 'loginService',
        onDone: {
          target: 'authenticated',
          actions: assign({ user: (_, event) => event.data }),
        },
        onError: {
          target: 'error',
          actions: assign({ error: (_, event) => event.data }),
        },
      },
    },
    authenticated: {
      on: {
        LOGOUT: {
          target: 'idle',
          actions: assign({ user: null }),
        },
      },
    },
    error: {
      on: {
        RETRY: 'authenticating',
        RESET: 'idle',
      },
    },
  },
});

// Using in component
function AuthComponent() {
  const [state, send] = useMachine(authMachine, {
    services: {
      loginService: async (context, event) => {
        const response = await api.login(event.credentials);
        return response.user;
      },
    },
  });
  
  if (state.matches('authenticating')) {
    return <Spinner />;
  }
  
  if (state.matches('error')) {
    return (
      <div>
        <p>Error: {state.context.error}</p>
        <button onClick={() => send('RETRY')}>Retry</button>
      </div>
    );
  }
  
  if (state.matches('authenticated')) {
    return (
      <div>
        <p>Welcome, {state.context.user.name}!</p>
        <button onClick={() => send('LOGOUT')}>Logout</button>
      </div>
    );
  }
  
  return (
    <button onClick={() => send({ type: 'LOGIN', credentials: { ... } })}>
      Login
    </button>
  );
}`,
    tags: ['xstate', 'state-machines', 'finite-state', 'complex-state'],
    timeEstimate: 6
  },
  {
    id: 'sm-18',
    category: 'State Management',
    question: 'How do you handle optimistic updates in state management?',
    answer: `Optimistic updates show expected results before server confirmation:

Steps:
1. Update UI immediately
2. Send request to server
3. On success: optionally refresh
4. On error: rollback to previous state

Benefits:
- Faster perceived performance
- Better UX

Considerations:
- Need rollback strategy
- Handle conflicts
- Show error states`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// With TanStack Query
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useTodoMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateTodo,
    onMutate: async (newTodo) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      
      // Snapshot previous value
      const previousTodos = queryClient.getQueryData(['todos']);
      
      // Optimistically update
      queryClient.setQueryData(['todos'], (old) =>
        old.map(todo =>
          todo.id === newTodo.id ? { ...todo, ...newTodo } : todo
        )
      );
      
      // Return context for rollback
      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      // Rollback on error
      queryClient.setQueryData(['todos'], context.previousTodos);
      toast.error('Failed to update todo');
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

// With Zustand
const useTodoStore = create((set, get) => ({
  todos: [],
  
  updateTodo: async (id, updates) => {
    const previousTodos = get().todos;
    
    // Optimistic update
    set({
      todos: previousTodos.map(todo =>
        todo.id === id ? { ...todo, ...updates } : todo
      ),
    });
    
    try {
      await api.updateTodo(id, updates);
    } catch (error) {
      // Rollback on error
      set({ todos: previousTodos });
      throw error;
    }
  },
}));

// With Redux Toolkit
const todosSlice = createSlice({
  name: 'todos',
  initialState: { items: [], pending: {} },
  reducers: {
    optimisticUpdate: (state, action) => {
      const { id, updates } = action.payload;
      // Store original for rollback
      const original = state.items.find(t => t.id === id);
      state.pending[id] = original;
      
      // Apply optimistic update
      const todo = state.items.find(t => t.id === id);
      Object.assign(todo, updates);
    },
    confirmUpdate: (state, action) => {
      delete state.pending[action.payload.id];
    },
    rollbackUpdate: (state, action) => {
      const { id } = action.payload;
      const original = state.pending[id];
      const index = state.items.findIndex(t => t.id === id);
      state.items[index] = original;
      delete state.pending[id];
    },
  },
});`,
    tags: ['optimistic-updates', 'ux', 'mutations', 'rollback'],
    timeEstimate: 6
  },
  {
    id: 'sm-19',
    category: 'State Management',
    question: 'How do you debug state management issues in React?',
    answer: `State debugging tools and techniques:

1. Redux DevTools
   - Time travel debugging
   - Action/state inspection
   - State diff view

2. React DevTools
   - Component state inspection
   - Hooks viewer

3. Zustand/Jotai DevTools

4. Console debugging
   - Middleware for logging
   - useEffect for state changes

5. Testing
   - Unit test reducers
   - Integration test flows`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Redux logger middleware
import { configureStore } from '@reduxjs/toolkit';

const loggerMiddleware = (store) => (next) => (action) => {
  console.group(action.type);
  console.log('dispatching', action);
  console.log('prev state', store.getState());
  const result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) => 
    getDefault().concat(loggerMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Zustand devtools
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set(
        (state) => ({ count: state.count + 1 }),
        false,
        'increment' // Action name for devtools
      ),
    }),
    { name: 'MyStore' }
  )
);

// Debug hook for any state
function useDebugState(value, label) {
  useEffect(() => {
    console.log(\`[\${label}] State changed:\`, value);
  }, [value, label]);
}

// Usage
function MyComponent() {
  const [state, setState] = useState(initialState);
  useDebugState(state, 'MyComponent');
  // ...
}

// State snapshot for bug reports
function captureStateSnapshot() {
  return {
    redux: store.getState(),
    localStorage: { ...localStorage },
    url: window.location.href,
    timestamp: new Date().toISOString(),
  };
}

// Testing reducers
describe('todosReducer', () => {
  it('should add a todo', () => {
    const initialState = { items: [] };
    const action = { type: 'todos/add', payload: { id: 1, text: 'Test' } };
    
    const newState = todosReducer(initialState, action);
    
    expect(newState.items).toHaveLength(1);
    expect(newState.items[0].text).toBe('Test');
  });
});`,
    tags: ['debugging', 'devtools', 'testing', 'middleware'],
    timeEstimate: 5
  },
  {
    id: 'sm-20',
    category: 'State Management',
    question: 'What is the difference between client state and server state?',
    answer: `Key distinction for modern state management:

Client State:
- UI state (modals, forms, selections)
- User preferences
- Ephemeral (doesn't persist)
- Synchronous
- Owned by app

Server State:
- Remote data (API responses)
- Shared across users
- Persisted in database
- Asynchronous
- Owned by server

Implications:
- Use different tools for each
- Server state needs caching, invalidation
- Client state needs reactivity`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Client state - Zustand (or useState, Context)
const useUIStore = create((set) => ({
  sidebarOpen: false,
  selectedTheme: 'dark',
  modalStack: [],
  
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setTheme: (theme) => set({ selectedTheme: theme }),
  openModal: (modal) => set((s) => ({ 
    modalStack: [...s.modalStack, modal] 
  })),
}));

// Server state - TanStack Query
function useServerState() {
  // Users from server
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 min
  });
  
  // Posts from server
  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });
  
  return { users, posts, isLoading };
}

// Combined usage
function Dashboard() {
  // Client state
  const { sidebarOpen, toggleSidebar } = useUIStore();
  
  // Server state
  const { users, isLoading } = useServerState();
  
  return (
    <div className={sidebarOpen ? 'sidebar-open' : ''}>
      <Sidebar onToggle={toggleSidebar} />
      {isLoading ? <Loading /> : <UserList users={users} />}
    </div>
  );
}

// Anti-pattern: Storing server data in Redux
// Don't do this!
const badReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USERS': // Duplicating server state
      return { ...state, users: action.payload };
  }
};

// Instead, let React Query manage server state
// and use Redux/Zustand only for client state`,
    tags: ['client-state', 'server-state', 'architecture', 'react-query'],
    timeEstimate: 5
  },
  {
    id: 'sm-21',
    category: 'State Management',
    question: 'How do you handle loading, error, and success states?',
    answer: `Managing async state transitions:

States to track:
- idle: Initial state
- loading: Request in progress
- success: Data received
- error: Request failed

Patterns:
1. Boolean flags (simple)
2. Status enum (cleaner)
3. Discriminated union (TypeScript)
4. State machines (complex flows)`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Pattern 1: Boolean flags (can have invalid states)
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);
// Problem: isLoading && error could both be true

// Pattern 2: Status enum (cleaner)
type Status = 'idle' | 'loading' | 'success' | 'error';

interface State<T> {
  status: Status;
  data: T | null;
  error: Error | null;
}

function useAsync<T>() {
  const [state, setState] = useState<State<T>>({
    status: 'idle',
    data: null,
    error: null,
  });
  
  const execute = async (promise: Promise<T>) => {
    setState({ status: 'loading', data: null, error: null });
    try {
      const data = await promise;
      setState({ status: 'success', data, error: null });
    } catch (error) {
      setState({ status: 'error', data: null, error });
    }
  };
  
  return { ...state, execute };
}

// Pattern 3: Discriminated union (TypeScript best practice)
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function renderState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'idle':
      return <p>Ready to load</p>;
    case 'loading':
      return <Spinner />;
    case 'success':
      return <Data data={state.data} />; // data is typed!
    case 'error':
      return <Error error={state.error} />; // error is typed!
  }
}

// Pattern 4: With TanStack Query (handles all this)
function UserProfile({ userId }) {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  
  if (isLoading) return <Skeleton />;
  if (isError) return <ErrorMessage error={error} />;
  if (isSuccess) return <Profile user={data} />;
}

// RTK Query provides similar states
const { data, isLoading, isError, error } = useGetUserQuery(userId);`,
    tags: ['async-state', 'loading-states', 'error-handling', 'typescript'],
    timeEstimate: 5
  },
  {
    id: 'sm-22',
    category: 'State Management',
    question: 'How do you share state between unrelated components?',
    answer: `Sharing state without prop drilling:

1. Context API
   - Built-in, no dependencies
   - Good for infrequent updates

2. External stores (Zustand, Redux)
   - Better for frequent updates
   - DevTools support

3. URL state
   - Shareable, bookmarkable
   - Good for filters, pagination

4. Event bus pattern
   - Loose coupling
   - Good for cross-cutting concerns`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Method 1: Zustand (simplest for shared state)
// No provider needed - works anywhere
import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id: Date.now() }],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

// Component A - deep in tree
function SaveButton() {
  const addNotification = useNotificationStore((s) => s.addNotification);
  
  const handleSave = async () => {
    await saveData();
    addNotification({ message: 'Saved!', type: 'success' });
  };
  
  return <button onClick={handleSave}>Save</button>;
}

// Component B - somewhere else entirely
function NotificationList() {
  const notifications = useNotificationStore((s) => s.notifications);
  const remove = useNotificationStore((s) => s.removeNotification);
  
  return (
    <div className="notifications">
      {notifications.map((n) => (
        <Toast key={n.id} {...n} onClose={() => remove(n.id)} />
      ))}
    </div>
  );
}

// Method 2: URL state for shareable state
import { useSearchParams } from 'next/navigation';

function ProductFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.push(\`?\${params.toString()}\`);
  };
  
  return (
    <select onChange={(e) => setFilter('category', e.target.value)}>
      <option value="all">All</option>
      <option value="electronics">Electronics</option>
    </select>
  );
}

// Another component reads same URL state
function ProductList() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'all';
  
  // Filter products based on URL state
  const filtered = products.filter(p => 
    category === 'all' || p.category === category
  );
}`,
    tags: ['state-sharing', 'zustand', 'url-state', 'prop-drilling'],
    timeEstimate: 5
  },
  {
    id: 'sm-23',
    category: 'State Management',
    question: 'What are Redux middleware and how do they work?',
    answer: `Middleware sits between dispatch and reducer:

dispatch(action) → middleware → reducer → new state

Common uses:
1. Logging
2. Async operations (thunk, saga)
3. Analytics tracking
4. Error reporting
5. API calls

Middleware signature:
store => next => action => result`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Middleware signature
const myMiddleware = (store) => (next) => (action) => {
  // Before reducer
  console.log('dispatching', action);
  
  // Call next middleware or reducer
  const result = next(action);
  
  // After reducer
  console.log('new state', store.getState());
  
  return result;
};

// Async middleware (simplified thunk)
const thunkMiddleware = (store) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};

// Analytics middleware
const analyticsMiddleware = (store) => (next) => (action) => {
  if (action.meta?.analytics) {
    analytics.track(action.meta.analytics.event, {
      ...action.meta.analytics.properties,
      action: action.type,
    });
  }
  return next(action);
};

// Error reporting middleware
const crashReporter = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (err) {
    Sentry.captureException(err, {
      extra: {
        action,
        state: store.getState(),
      },
    });
    throw err;
  }
};

// API middleware
const apiMiddleware = (store) => (next) => async (action) => {
  if (action.type !== 'API_CALL') return next(action);
  
  const { endpoint, method, onSuccess, onError } = action.payload;
  
  store.dispatch({ type: \`\${action.type}_PENDING\` });
  
  try {
    const response = await fetch(endpoint, { method });
    const data = await response.json();
    store.dispatch({ type: onSuccess, payload: data });
  } catch (error) {
    store.dispatch({ type: onError, payload: error.message });
  }
};

// Applying middleware
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(analyticsMiddleware)
      .concat(crashReporter),
});`,
    tags: ['redux', 'middleware', 'async', 'architecture'],
    timeEstimate: 6
  },
  {
    id: 'sm-24',
    category: 'State Management',
    question: 'How do you implement undo/redo functionality?',
    answer: `Undo/redo patterns:

1. Command pattern
   - Store commands, not states
   - Commands have execute/undo methods

2. State history
   - Store past/present/future states
   - More memory, simpler logic

3. Patches (Immer)
   - Store diffs
   - Memory efficient

Libraries:
- redux-undo
- use-undo
- Immer patches`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Pattern 1: State history with Zustand
import { create } from 'zustand';

const useUndoStore = create((set, get) => ({
  past: [],
  present: { items: [] },
  future: [],
  
  set: (newPresent) => {
    set((state) => ({
      past: [...state.past, state.present],
      present: typeof newPresent === 'function' 
        ? newPresent(state.present) 
        : newPresent,
      future: [],
    }));
  },
  
  undo: () => {
    set((state) => {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      };
    });
  },
  
  redo: () => {
    set((state) => {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      };
    });
  },
  
  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
}));

// Pattern 2: Immer patches
import { produceWithPatches, applyPatches, enablePatches } from 'immer';

enablePatches();

function useUndoableState(initialState) {
  const [state, setState] = useState(initialState);
  const [history, setHistory] = useState({ undos: [], redos: [] });
  
  const update = (updater) => {
    const [nextState, patches, inversePatches] = produceWithPatches(
      state,
      updater
    );
    setState(nextState);
    setHistory({
      undos: [...history.undos, inversePatches],
      redos: [],
    });
  };
  
  const undo = () => {
    if (history.undos.length === 0) return;
    const patches = history.undos[history.undos.length - 1];
    setState(applyPatches(state, patches));
    setHistory({
      undos: history.undos.slice(0, -1),
      redos: [patches, ...history.redos],
    });
  };
  
  return { state, update, undo, redo, canUndo, canRedo };
}

// Usage
function DrawingApp() {
  const { present, set, undo, redo, canUndo, canRedo } = useUndoStore();
  
  const addShape = (shape) => {
    set((state) => ({ items: [...state.items, shape] }));
  };
  
  return (
    <div>
      <button onClick={undo} disabled={!canUndo()}>Undo</button>
      <button onClick={redo} disabled={!canRedo()}>Redo</button>
      <Canvas shapes={present.items} onAdd={addShape} />
    </div>
  );
}`,
    tags: ['undo-redo', 'history', 'immer', 'command-pattern'],
    timeEstimate: 6
  },
  {
    id: 'sm-25',
    category: 'State Management',
    question: 'How do you handle real-time state updates (WebSockets)?',
    answer: `Real-time state management patterns:

1. WebSocket + State Library
   - Socket updates trigger state changes
   - State library manages UI

2. Subscription-based
   - Components subscribe to topics
   - Auto-cleanup on unmount

3. Optimistic + Sync
   - Optimistic local updates
   - Server reconciliation

Considerations:
- Reconnection handling
- Message queuing
- Conflict resolution`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// WebSocket + Zustand
import { create } from 'zustand';

const useChatStore = create((set, get) => ({
  messages: [],
  connected: false,
  socket: null,
  
  connect: () => {
    const socket = new WebSocket('wss://api.example.com/chat');
    
    socket.onopen = () => set({ connected: true, socket });
    
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      set((state) => ({
        messages: [...state.messages, message],
      }));
    };
    
    socket.onclose = () => {
      set({ connected: false, socket: null });
      // Reconnect after delay
      setTimeout(() => get().connect(), 3000);
    };
  },
  
  sendMessage: (content) => {
    const { socket } = get();
    if (socket?.readyState === WebSocket.OPEN) {
      const message = { content, timestamp: Date.now() };
      
      // Optimistic update
      set((state) => ({
        messages: [...state.messages, { ...message, pending: true }],
      }));
      
      socket.send(JSON.stringify(message));
    }
  },
  
  disconnect: () => {
    get().socket?.close();
  },
}));

// Custom hook for subscriptions
function useSubscription(topic) {
  const subscribe = useChatStore((s) => s.subscribe);
  const unsubscribe = useChatStore((s) => s.unsubscribe);
  
  useEffect(() => {
    subscribe(topic);
    return () => unsubscribe(topic);
  }, [topic, subscribe, unsubscribe]);
}

// With TanStack Query for polling fallback
function useRealtimeData(key, fetchFn) {
  const queryClient = useQueryClient();
  
  // Regular query with polling fallback
  const query = useQuery({
    queryKey: [key],
    queryFn: fetchFn,
    refetchInterval: 30000, // Fallback polling
  });
  
  // WebSocket for real-time updates
  useEffect(() => {
    const socket = new WebSocket('wss://api.example.com');
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.key === key) {
        queryClient.setQueryData([key], data.value);
      }
    };
    
    return () => socket.close();
  }, [key, queryClient]);
  
  return query;
}

// Component usage
function ChatRoom() {
  const { messages, sendMessage, connect, connected } = useChatStore();
  
  useEffect(() => {
    connect();
    return () => useChatStore.getState().disconnect();
  }, []);
  
  return (
    <div>
      <ConnectionStatus connected={connected} />
      <MessageList messages={messages} />
      <MessageInput onSend={sendMessage} disabled={!connected} />
    </div>
  );
}`,
    tags: ['websockets', 'real-time', 'subscriptions', 'sync'],
    timeEstimate: 6
  },
  {
    id: 'sm-26',
    category: 'State Management',
    question: 'What is state colocation and why is it important?',
    answer: `State colocation = keeping state close to where it's used.

Principle: State should live in the lowest common ancestor of components that need it.

Benefits:
1. Better performance (fewer re-renders)
2. Easier to understand
3. Better encapsulation
4. Simpler testing

Guidelines:
- Start local, lift only when needed
- Don't put everything in global state
- URL state for shareable state`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Anti-pattern: Everything in global state
// Don't do this!
const globalStore = create((set) => ({
  // Modal state for one component
  isModalOpen: false,
  modalContent: null,
  // Form state that only one form uses
  formName: '',
  formEmail: '',
  // Search that's only in header
  searchQuery: '',
}));

// Good: Colocate state where it's used
function Modal({ children }) {
  // Modal state stays in Modal
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open</button>
      {isOpen && <Dialog onClose={() => setIsOpen(false)}>{children}</Dialog>}
    </>
  );
}

function ContactForm() {
  // Form state stays in form
  const [formData, setFormData] = useState({ name: '', email: '' });
  return <form>...</form>;
}

function Header() {
  // Search state stays in header
  const [query, setQuery] = useState('');
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}

// Only lift state when truly shared
function App() {
  // User is genuinely global - used everywhere
  const user = useUserStore((s) => s.user);
  
  return (
    <Layout>
      <Header /> {/* Has its own search state */}
      <Modal>  {/* Has its own open/close state */}
        <ContactForm /> {/* Has its own form state */}
      </Modal>
    </Layout>
  );
}

// Decision tree for state placement:
/*
1. Only used in one component?
   → useState in that component

2. Shared by few nearby components?
   → Lift to nearest common ancestor

3. Shared across distant components?
   → Context (if infrequent updates)
   → Zustand/Redux (if frequent updates)

4. Needs to be in URL (shareable)?
   → URL params / searchParams

5. Needs persistence?
   → localStorage + state sync
*/`,
    tags: ['colocation', 'architecture', 'performance', 'best-practices'],
    timeEstimate: 5
  },
  {
    id: 'sm-27',
    category: 'State Management',
    question: 'How do you prevent unnecessary re-renders with state management?',
    answer: `Re-render prevention strategies:

1. Selective subscriptions
   - Subscribe to specific state slices
   - Zustand selectors, useSelector

2. Memoization
   - useMemo for derived values
   - React.memo for components

3. State structure
   - Normalize to minimize updates
   - Split contexts by update frequency

4. Batching
   - React 18 auto-batches
   - Manual batching for external stores`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Problem: Selecting entire store = re-render on any change
function BadComponent() {
  const store = useStore(); // Re-renders on ANY state change
  return <span>{store.user.name}</span>;
}

// Solution 1: Selective subscription with selector
function GoodComponent() {
  const userName = useStore((state) => state.user.name);
  // Only re-renders when user.name changes
  return <span>{userName}</span>;
}

// Solution 2: Shallow equality for objects
import { shallow } from 'zustand/shallow';

function UserCard() {
  const { name, email } = useStore(
    (state) => ({ name: state.user.name, email: state.user.email }),
    shallow // Compare object shallowly
  );
  return <div>{name} - {email}</div>;
}

// Solution 3: Split stores by domain
const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

const useUIStore = create((set) => ({
  theme: 'dark',
  sidebarOpen: true,
  // UI changes don't affect user subscribers
}));

// Solution 4: Memoize derived values
function TodoStats() {
  const todos = useStore((s) => s.todos);
  
  // Memoize expensive computation
  const stats = useMemo(() => ({
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
  }), [todos]);
  
  return <Stats {...stats} />;
}

// Solution 5: Use React.memo for child components
const ExpensiveList = React.memo(function ExpensiveList({ items }) {
  return items.map(item => <ExpensiveItem key={item.id} {...item} />);
});

// Solution 6: Context splitting
const UserContext = createContext(); // User data (changes rarely)
const UIContext = createContext(); // UI state (changes often)

// Components only subscribe to what they need
function UserAvatar() {
  const { user } = useContext(UserContext); // Not affected by UI changes
  return <Avatar src={user.avatar} />;
}`,
    tags: ['performance', 're-renders', 'selectors', 'memoization'],
    timeEstimate: 6
  },
  {
    id: 'sm-28',
    category: 'State Management',
    question: 'What is the useReducer hook and when should you use it?',
    answer: `useReducer is React's built-in reducer pattern:

Use over useState when:
- Complex state logic
- Multiple sub-values
- Next state depends on previous
- Related state updates
- Testable state transitions

Benefits:
- Predictable updates
- Easy to test
- Can pass dispatch down (stable reference)
- Good for complex forms`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Simple counter - useState is fine
const [count, setCount] = useState(0);

// Complex state - useReducer is better
interface State {
  items: Item[];
  loading: boolean;
  error: string | null;
  filter: 'all' | 'active' | 'completed';
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Item[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'TOGGLE_ITEM'; payload: string }
  | { type: 'SET_FILTER'; payload: State['filter'] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, items: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'TOGGLE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload
            ? { ...item, completed: !item.completed }
            : item
        ),
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    loading: false,
    error: null,
    filter: 'all',
  });
  
  // dispatch is stable - safe to pass to children
  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      <FilterBar />
      <TodoList />
      <AddTodoForm />
    </TodoContext.Provider>
  );
}

// Testing is easy - pure function
describe('reducer', () => {
  it('adds item', () => {
    const state = { items: [], loading: false, error: null, filter: 'all' };
    const action = { type: 'ADD_ITEM', payload: { id: '1', text: 'Test' } };
    
    const newState = reducer(state, action);
    
    expect(newState.items).toHaveLength(1);
  });
});`,
    tags: ['useReducer', 'reducer', 'state-management', 'hooks'],
    timeEstimate: 5
  },
  {
    id: 'sm-29',
    category: 'State Management',
    question: 'How do you handle derived/computed state?',
    answer: `Derived state = values calculated from other state.

Approaches:
1. Calculate during render (simple)
2. useMemo (expensive calculations)
3. Selectors (Redux/Zustand)
4. Computed properties (MobX)

Anti-pattern: Storing derived state separately (causes sync issues)`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Anti-pattern: Storing derived state
function BadExample() {
  const [todos, setTodos] = useState([]);
  const [completedCount, setCompletedCount] = useState(0); // Don't do this!
  
  // Must manually keep in sync - error prone!
  const addTodo = (todo) => {
    setTodos([...todos, todo]);
    if (todo.completed) setCompletedCount(c => c + 1);
  };
}

// Good: Calculate during render
function GoodExample() {
  const [todos, setTodos] = useState([]);
  
  // Derived - always in sync
  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.length - completedCount;
  
  return <Stats completed={completedCount} active={activeCount} />;
}

// Good: useMemo for expensive derivations
function FilteredList({ items, filter }) {
  const filtered = useMemo(() => {
    console.log('Filtering...'); // Only runs when deps change
    return items.filter(item => {
      // Expensive filtering logic
      return matchesFilter(item, filter);
    });
  }, [items, filter]);
  
  return <List items={filtered} />;
}

// Good: Zustand with derived state
const useTodoStore = create((set, get) => ({
  todos: [],
  filter: 'all',
  
  // Actions
  addTodo: (todo) => set((s) => ({ todos: [...s.todos, todo] })),
  
  // Derived (computed on access)
  getFilteredTodos: () => {
    const { todos, filter } = get();
    if (filter === 'all') return todos;
    return todos.filter(t => 
      filter === 'completed' ? t.completed : !t.completed
    );
  },
}));

// Or use a selector with useMemo
function TodoList() {
  const todos = useTodoStore((s) => s.todos);
  const filter = useTodoStore((s) => s.filter);
  
  const filtered = useMemo(
    () => todos.filter(t => 
      filter === 'all' || 
      (filter === 'completed') === t.completed
    ),
    [todos, filter]
  );
  
  return <List items={filtered} />;
}

// Redux with Reselect (memoized selectors)
import { createSelector } from '@reduxjs/toolkit';

const selectTodos = (state) => state.todos.items;
const selectFilter = (state) => state.todos.filter;

const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => {
    if (filter === 'all') return todos;
    return todos.filter(t => 
      (filter === 'completed') === t.completed
    );
  }
);`,
    tags: ['derived-state', 'computed', 'useMemo', 'selectors'],
    timeEstimate: 5
  },
  {
    id: 'sm-30',
    category: 'State Management',
    question: 'What are the patterns for managing modal/dialog state?',
    answer: `Modal state patterns:

1. Local state (simplest)
   - State in parent component
   - Good for single modal

2. Portal + local state
   - Render at document root
   - Escape z-index issues

3. Global modal store
   - Centralized modal management
   - Good for many modals

4. URL-based modals
   - Modal state in URL
   - Shareable, back button works`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Pattern 1: Local state (simple)
function ProductCard({ product }) {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => setShowDetails(true)}>Details</button>
      
      {showDetails && (
        <Modal onClose={() => setShowDetails(false)}>
          <ProductDetails product={product} />
        </Modal>
      )}
    </div>
  );
}

// Pattern 2: Global modal store
const useModalStore = create((set) => ({
  modals: [],
  
  openModal: (modal) => set((state) => ({
    modals: [...state.modals, { ...modal, id: Date.now() }],
  })),
  
  closeModal: (id) => set((state) => ({
    modals: state.modals.filter((m) => m.id !== id),
  })),
  
  closeAll: () => set({ modals: [] }),
}));

// Modal container at app root
function ModalContainer() {
  const modals = useModalStore((s) => s.modals);
  const closeModal = useModalStore((s) => s.closeModal);
  
  return (
    <>
      {modals.map((modal) => (
        <Modal key={modal.id} onClose={() => closeModal(modal.id)}>
          {modal.content}
        </Modal>
      ))}
    </>
  );
}

// Open modal from anywhere
function SomeComponent() {
  const openModal = useModalStore((s) => s.openModal);
  
  const handleClick = () => {
    openModal({
      content: <ConfirmDialog onConfirm={handleConfirm} />,
    });
  };
}

// Pattern 3: URL-based modals (Next.js)
// app/products/[id]/page.tsx
function ProductPage({ params }) {
  return <ProductDetails id={params.id} />;
}

// app/products/[id]/@modal/(.)edit/page.tsx (parallel route)
function EditModal({ params }) {
  const router = useRouter();
  return (
    <Modal onClose={() => router.back()}>
      <EditProductForm id={params.id} />
    </Modal>
  );
}

// Pattern 4: Custom hook for confirmation dialogs
function useConfirmDialog() {
  const [state, setState] = useState({ isOpen: false, resolve: null });
  
  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setState({ isOpen: true, message, resolve });
    });
  }, []);
  
  const handleConfirm = () => {
    state.resolve?.(true);
    setState({ isOpen: false, resolve: null });
  };
  
  const handleCancel = () => {
    state.resolve?.(false);
    setState({ isOpen: false, resolve: null });
  };
  
  return { confirm, ...state, handleConfirm, handleCancel };
}

// Usage
const { confirm, isOpen, message, handleConfirm, handleCancel } = useConfirmDialog();

const handleDelete = async () => {
  if (await confirm('Are you sure?')) {
    deleteItem();
  }
};`,
    tags: ['modals', 'dialogs', 'ui-state', 'patterns'],
    timeEstimate: 5
  },
  
  // Multiple Choice Questions
  {
    id: 'state-mcq-1',
    category: 'State Management',
    question: 'What is the primary difference between local state and global state?',
    answer: 'Local state is confined to a single component, while global state is shared across multiple components.',
    difficulty: 'beginner',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Local is faster, global is slower', isCorrect: false },
      { id: 'b', text: 'Local is for one component, global is shared across components', isCorrect: true },
      { id: 'c', text: 'Local uses Redux, global uses useState', isCorrect: false },
      { id: 'd', text: 'There is no difference', isCorrect: false }
    ],
    tags: ['state', 'fundamentals'],
    timeEstimate: 1
  },
  {
    id: 'state-mcq-2',
    category: 'State Management',
    question: 'Which hook is used to manage complex state logic in React?',
    answer: 'useReducer - it\'s ideal for state with complex update logic.',
    difficulty: 'beginner',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'useState', isCorrect: false },
      { id: 'b', text: 'useEffect', isCorrect: false },
      { id: 'c', text: 'useReducer', isCorrect: true },
      { id: 'd', text: 'useRef', isCorrect: false }
    ],
    tags: ['hooks', 'useReducer'],
    timeEstimate: 1
  },
  {
    id: 'state-mcq-3',
    category: 'State Management',
    question: 'What is Redux primarily used for?',
    answer: 'Predictable state management with a single source of truth.',
    difficulty: 'beginner',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Routing', isCorrect: false },
      { id: 'b', text: 'Styling components', isCorrect: false },
      { id: 'c', text: 'Predictable state management', isCorrect: true },
      { id: 'd', text: 'API calls', isCorrect: false }
    ],
    tags: ['redux', 'state'],
    timeEstimate: 1
  },
  {
    id: 'state-mcq-4',
    category: 'State Management',
    question: 'What problem does React Context solve?',
    answer: 'Prop drilling - passing props through many intermediate components.',
    difficulty: 'beginner',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Slow rendering', isCorrect: false },
      { id: 'b', text: 'Prop drilling', isCorrect: true },
      { id: 'c', text: 'API rate limiting', isCorrect: false },
      { id: 'd', text: 'CSS conflicts', isCorrect: false }
    ],
    tags: ['context', 'prop-drilling'],
    timeEstimate: 1
  },
  {
    id: 'state-mcq-5',
    category: 'State Management',
    question: 'Which library is known for its minimal boilerplate and hook-based API?',
    answer: 'Zustand - a small, fast state management library.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Redux', isCorrect: false },
      { id: 'b', text: 'MobX', isCorrect: false },
      { id: 'c', text: 'Zustand', isCorrect: true },
      { id: 'd', text: 'Recoil', isCorrect: false }
    ],
    tags: ['zustand', 'state'],
    timeEstimate: 1
  },
  {
    id: 'state-mcq-6',
    category: 'State Management',
    question: 'What is the purpose of Redux middleware?',
    answer: 'To intercept and process actions before they reach the reducer.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'To style Redux components', isCorrect: false },
      { id: 'b', text: 'To intercept actions before they reach the reducer', isCorrect: true },
      { id: 'c', text: 'To create components', isCorrect: false },
      { id: 'd', text: 'To manage routing', isCorrect: false }
    ],
    tags: ['redux', 'middleware'],
    timeEstimate: 1
  },
  {
    id: 'state-mcq-7',
    category: 'State Management',
    question: 'What is "immutability" in state management?',
    answer: 'Not modifying state directly, but creating new copies with changes.',
    difficulty: 'beginner',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'State that never changes', isCorrect: false },
      { id: 'b', text: 'Creating new state copies instead of modifying directly', isCorrect: true },
      { id: 'c', text: 'Storing state in localStorage', isCorrect: false },
      { id: 'd', text: 'Using TypeScript readonly types', isCorrect: false }
    ],
    tags: ['immutability', 'patterns'],
    timeEstimate: 1
  },
  {
    id: 'state-mcq-8',
    category: 'State Management',
    question: 'What is React Query primarily used for?',
    answer: 'Server state management - fetching, caching, and syncing remote data.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Form validation', isCorrect: false },
      { id: 'b', text: 'Server state management and caching', isCorrect: true },
      { id: 'c', text: 'Component styling', isCorrect: false },
      { id: 'd', text: 'Animation', isCorrect: false }
    ],
    tags: ['react-query', 'server-state'],
    timeEstimate: 1
  },
  {
    id: 'state-mcq-9',
    category: 'State Management',
    question: 'What pattern does Redux follow?',
    answer: 'Flux pattern - unidirectional data flow with actions, reducers, and store.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'MVC pattern', isCorrect: false },
      { id: 'b', text: 'Flux pattern', isCorrect: true },
      { id: 'c', text: 'Observer pattern', isCorrect: false },
      { id: 'd', text: 'Factory pattern', isCorrect: false }
    ],
    tags: ['redux', 'flux', 'patterns'],
    timeEstimate: 1
  },
  {
    id: 'state-mcq-10',
    category: 'State Management',
    question: 'When should you lift state up?',
    answer: 'When multiple components need to share the same changing data.',
    difficulty: 'beginner',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'When the app is slow', isCorrect: false },
      { id: 'b', text: 'When multiple components need the same data', isCorrect: true },
      { id: 'c', text: 'When using TypeScript', isCorrect: false },
      { id: 'd', text: 'Always, for all state', isCorrect: false }
    ],
    tags: ['lifting-state', 'patterns'],
    timeEstimate: 1
  },
  {
    id: 'state-mcq-11',
    category: 'State Management',
    question: 'What is the difference between Recoil atoms and selectors?',
    answer: 'Atoms are units of state, selectors are derived state computed from atoms.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Atoms are for numbers, selectors are for strings', isCorrect: false },
      { id: 'b', text: 'Atoms are state units, selectors are derived/computed state', isCorrect: true },
      { id: 'c', text: 'There is no difference', isCorrect: false },
      { id: 'd', text: 'Selectors are faster than atoms', isCorrect: false }
    ],
    tags: ['recoil', 'atoms', 'selectors'],
    timeEstimate: 1
  },
  {
    id: 'state-mcq-12',
    category: 'State Management',
    question: 'What is the purpose of Redux Toolkit\'s createSlice?',
    answer: 'To simplify reducer and action creation with less boilerplate.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'To create React components', isCorrect: false },
      { id: 'b', text: 'To simplify reducer and action creation', isCorrect: true },
      { id: 'c', text: 'To handle API calls', isCorrect: false },
      { id: 'd', text: 'To style components', isCorrect: false }
    ],
    tags: ['redux-toolkit', 'createSlice'],
    timeEstimate: 1
  },
  {
    id: 'state-mcq-13',
    category: 'State Management',
    question: 'What is "optimistic update" in state management?',
    answer: 'Updating UI immediately before server confirmation, then reverting if it fails.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Always assuming requests will fail', isCorrect: false },
      { id: 'b', text: 'Updating UI before server confirmation', isCorrect: true },
      { id: 'c', text: 'Waiting for all data to load', isCorrect: false },
      { id: 'd', text: 'Using local storage for backup', isCorrect: false }
    ],
    tags: ['optimistic-update', 'patterns'],
    timeEstimate: 1
  },
  {
    id: 'state-mcq-14',
    category: 'State Management',
    question: 'What is state normalization?',
    answer: 'Structuring state like a database with IDs as keys to avoid duplication.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Converting state to strings', isCorrect: false },
      { id: 'b', text: 'Structuring state like a database with IDs as keys', isCorrect: true },
      { id: 'c', text: 'Removing all state', isCorrect: false },
      { id: 'd', text: 'Making state lowercase', isCorrect: false }
    ],
    tags: ['normalization', 'patterns'],
    timeEstimate: 1
  },
  {
    id: 'state-mcq-15',
    category: 'State Management',
    question: 'What is the main benefit of using Immer with Redux?',
    answer: 'Write mutable-looking code that produces immutable updates.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Faster performance', isCorrect: false },
      { id: 'b', text: 'Write mutable code that produces immutable updates', isCorrect: true },
      { id: 'c', text: 'Better TypeScript support', isCorrect: false },
      { id: 'd', text: 'Smaller bundle size', isCorrect: false }
    ],
    tags: ['immer', 'immutability'],
    timeEstimate: 1
  }
];

