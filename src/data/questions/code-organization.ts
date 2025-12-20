import { Question } from '../types';

export const codeOrganizationQuestions: Question[] = [
  {
    id: 'co-1',
    category: 'Code Organization',
    question: 'What are common folder structures for React/Next.js applications?',
    answer: `Popular folder structure patterns:

1. Feature-based (recommended)
   - Group by feature/domain
   - Components, hooks, utils per feature
   - Scales well for large apps

2. Type-based (traditional)
   - Group by file type (components/, hooks/, utils/)
   - Simple but doesn't scale

3. Atomic Design
   - atoms → molecules → organisms → templates → pages
   - Good for design systems

Next.js App Router enforces app/ structure.`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Feature-based structure (recommended)
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route group
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   └── layout.tsx
├── features/              # Feature modules
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api.ts
│   │   └── types.ts
│   ├── products/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── api.ts
│   └── cart/
├── components/            # Shared components
│   ├── ui/               # Design system
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Modal/
│   └── layouts/
├── hooks/                 # Shared hooks
├── lib/                   # Utilities
│   ├── api.ts
│   ├── utils.ts
│   └── validations.ts
├── types/                 # Shared types
└── styles/

// Component folder structure
components/ui/Button/
├── Button.tsx
├── Button.test.tsx
├── Button.stories.tsx
├── Button.module.css
└── index.ts`,
    tags: ['architecture', 'folder-structure', 'organization'],
    timeEstimate: 4
  },
  {
    id: 'co-2',
    category: 'Code Organization',
    question: 'How do you organize components for reusability and maintainability?',
    answer: `Component organization principles:

1. Single Responsibility
   - One component, one purpose
   - Extract when logic becomes complex

2. Presentational vs Container
   - Dumb components: UI only
   - Smart components: data/logic

3. Composition over Inheritance
   - Build complex from simple
   - Use children and render props

4. Co-location
   - Keep related code together
   - Tests, styles, types nearby

5. Barrel exports (index.ts)
   - Clean imports
   - Controlled public API`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Presentational component (dumb)
// components/ui/Button/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ 
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  onClick 
}: ButtonProps) {
  return (
    <button 
      className={cn(styles.button, styles[variant], styles[size])}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}

// Container component (smart)
// features/auth/components/LoginButton.tsx
export function LoginButton() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  
  const handleLogin = async () => {
    await login();
    router.push('/dashboard');
  };
  
  return (
    <Button onClick={handleLogin} isLoading={isLoading}>
      Log In
    </Button>
  );
}

// Barrel export
// components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Modal } from './Modal';

// Clean imports
import { Button, Input, Modal } from '@/components/ui';`,
    tags: ['architecture', 'components', 'patterns'],
    timeEstimate: 5
  },
  {
    id: 'co-3',
    category: 'Code Organization',
    question: 'What are best practices for organizing custom hooks?',
    answer: `Custom hooks organization:

1. Naming: Always start with "use"
2. Location:
   - Feature-specific: features/[feature]/hooks/
   - Shared: hooks/ or lib/hooks/

3. Single responsibility
   - One hook, one concern
   - Compose hooks together

4. Return interface
   - Consistent return patterns
   - Consider object vs tuple

5. Documentation
   - JSDoc for complex hooks
   - Type definitions`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Organized hooks structure
hooks/
├── useDebounce.ts
├── useLocalStorage.ts
├── useMediaQuery.ts
├── useClickOutside.ts
└── index.ts

// Well-structured custom hook
// hooks/useAsync.ts
interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
}

interface UseAsyncReturn<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  execute: () => Promise<T | void>;
  reset: () => void;
}

/**
 * Hook for handling async operations with loading and error states
 * @param asyncFn - The async function to execute
 * @param options - Configuration options
 */
export function useAsync<T>(
  asyncFn: () => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T> {
  const { onSuccess, onError, immediate = false } = options;
  
  const [state, setState] = useState<{
    data: T | null;
    error: Error | null;
    loading: boolean;
  }>({
    data: null,
    error: null,
    loading: immediate,
  });
  
  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await asyncFn();
      setState({ data, error: null, loading: false });
      onSuccess?.(data);
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState(prev => ({ ...prev, error: err, loading: false }));
      onError?.(err);
    }
  }, [asyncFn, onSuccess, onError]);
  
  const reset = useCallback(() => {
    setState({ data: null, error: null, loading: false });
  }, []);
  
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  
  return { ...state, execute, reset };
}

// Composing hooks
function useUsers() {
  const { data, loading, execute } = useAsync(() => api.getUsers(), {
    immediate: true,
  });
  
  const debounced = useDebounce(searchTerm, 300);
  
  return { users: data, loading, refetch: execute };
}`,
    tags: ['hooks', 'custom-hooks', 'architecture', 'organization'],
    timeEstimate: 5
  },
  {
    id: 'co-4',
    category: 'Code Organization',
    question: 'How do you structure and organize API calls in a React application?',
    answer: `API organization patterns:

1. Centralized API module
   - Base configuration
   - Interceptors
   - Error handling

2. Feature-based API files
   - One file per domain
   - Typed request/response

3. API hooks
   - Abstract fetch logic
   - Loading/error states

4. Use data fetching libraries
   - TanStack Query
   - SWR
   - RTK Query`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// lib/api/client.ts - Base API configuration
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await refreshToken();
      return apiClient(error.config);
    }
    return Promise.reject(error);
  }
);

export { apiClient };

// features/users/api.ts - Feature API
import { apiClient } from '@/lib/api/client';
import { User, CreateUserDto, UpdateUserDto } from './types';

export const usersApi = {
  getAll: () => 
    apiClient.get<User[]>('/users').then(res => res.data),
    
  getById: (id: string) => 
    apiClient.get<User>(\`/users/\${id}\`).then(res => res.data),
    
  create: (data: CreateUserDto) => 
    apiClient.post<User>('/users', data).then(res => res.data),
    
  update: (id: string, data: UpdateUserDto) => 
    apiClient.patch<User>(\`/users/\${id}\`, data).then(res => res.data),
    
  delete: (id: string) => 
    apiClient.delete(\`/users/\${id}\`),
};

// features/users/hooks/useUsers.ts - API Hooks with TanStack Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}`,
    tags: ['api', 'architecture', 'organization', 'data-fetching'],
    timeEstimate: 6
  },
  {
    id: 'co-5',
    category: 'Code Organization',
    question: 'What are best practices for TypeScript in React projects?',
    answer: `TypeScript best practices:

1. Type vs Interface
   - Interface for objects (extendable)
   - Type for unions, primitives, tuples

2. Avoid "any"
   - Use unknown for truly unknown types
   - Narrow types with guards

3. Component props
   - Interface for props
   - Required vs optional explicit

4. Generic components
   - Reusable with type parameters

5. Strict mode
   - Enable strict in tsconfig
   - Catch more errors`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// types/index.ts - Shared types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

// Discriminated unions
export type ApiResponse<T> = 
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// Utility types
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Generic component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

export function List<T>({ 
  items, 
  renderItem, 
  keyExtractor,
  emptyMessage = 'No items' 
}: ListProps<T>) {
  if (items.length === 0) {
    return <p>{emptyMessage}</p>;
  }
  
  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}

// Usage with type inference
<List
  items={users}
  renderItem={(user) => <span>{user.name}</span>}
  keyExtractor={(user) => user.id}
/>

// Type guards
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value
  );
}

// Strict event handlers
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setValue(e.target.value);
}

// Strict refs
const inputRef = useRef<HTMLInputElement>(null);

// Component with forwardRef
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => (
    <div>
      <label>{label}</label>
      <input ref={ref} {...props} />
      {error && <span>{error}</span>}
    </div>
  )
);`,
    tags: ['typescript', 'types', 'best-practices'],
    timeEstimate: 6
  },
  {
    id: 'co-6',
    category: 'Code Organization',
    question: 'How do you implement and organize error handling in React?',
    answer: `Error handling strategies:

1. Error Boundaries
   - Catch render errors
   - Fallback UI
   - Error reporting

2. API error handling
   - Centralized in interceptors
   - Typed error responses
   - Toast notifications

3. Form validation errors
   - Schema validation (Zod)
   - Field-level errors

4. Global error state
   - Context or store
   - Error queue/toast system`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// lib/errors.ts - Custom error classes
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public fields: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// hooks/useErrorHandler.ts
export function useErrorHandler() {
  const { toast } = useToast();
  
  const handleError = useCallback((error: unknown) => {
    if (error instanceof ApiError) {
      if (error.statusCode === 401) {
        // Redirect to login
        router.push('/login');
        return;
      }
      toast({ title: 'Error', description: error.message, variant: 'error' });
    } else if (error instanceof ValidationError) {
      // Handle form errors
      return error.fields;
    } else {
      toast({ 
        title: 'Unexpected error', 
        description: 'Please try again',
        variant: 'error' 
      });
      Sentry.captureException(error);
    }
  }, [toast]);
  
  return { handleError };
}

// Usage with TanStack Query
const { mutate } = useMutation({
  mutationFn: createUser,
  onError: handleError,
});`,
    tags: ['error-handling', 'architecture', 'error-boundary'],
    timeEstimate: 6
  },
  {
    id: 'co-7',
    category: 'Code Organization',
    question: 'What is the container/presentational pattern and is it still relevant?',
    answer: `Container/Presentational (Smart/Dumb) pattern:

Presentational (Dumb):
- Only UI, no logic
- Receive data via props
- No state (or only UI state)
- Highly reusable

Container (Smart):
- Handle data/logic
- Connect to state/APIs
- Pass data to presentational

Modern perspective:
- Hooks reduced need for containers
- Pattern still useful conceptually
- Think: "logic hooks" + "UI components"`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Traditional Container/Presentational

// Presentational (dumb) - only UI
interface UserCardProps {
  name: string;
  email: string;
  avatar: string;
  onEdit: () => void;
}

function UserCard({ name, email, avatar, onEdit }: UserCardProps) {
  return (
    <div className="card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{email}</p>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
}

// Container (smart) - handles logic
function UserCardContainer({ userId }: { userId: string }) {
  const { data: user, isLoading } = useUser(userId);
  const { mutate: updateUser } = useUpdateUser();
  const [isEditing, setIsEditing] = useState(false);
  
  if (isLoading) return <Skeleton />;
  
  return (
    <>
      <UserCard
        name={user.name}
        email={user.email}
        avatar={user.avatar}
        onEdit={() => setIsEditing(true)}
      />
      {isEditing && (
        <EditModal 
          user={user} 
          onSave={updateUser}
          onClose={() => setIsEditing(false)} 
        />
      )}
    </>
  );
}

// Modern approach with hooks
// The "container" is now a custom hook
function useUserCard(userId: string) {
  const { data: user, isLoading } = useUser(userId);
  const { mutate: updateUser } = useUpdateUser();
  const [isEditing, setIsEditing] = useState(false);
  
  return {
    user,
    isLoading,
    isEditing,
    startEditing: () => setIsEditing(true),
    stopEditing: () => setIsEditing(false),
    updateUser,
  };
}

// Component uses the hook directly
function UserCard({ userId }: { userId: string }) {
  const { user, isLoading, isEditing, startEditing, stopEditing, updateUser } = 
    useUserCard(userId);
  
  if (isLoading) return <Skeleton />;
  
  return (
    <div className="card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <button onClick={startEditing}>Edit</button>
      {isEditing && <EditModal user={user} onSave={updateUser} onClose={stopEditing} />}
    </div>
  );
}`,
    tags: ['patterns', 'architecture', 'components', 'hooks'],
    timeEstimate: 5
  },
  {
    id: 'co-8',
    category: 'Code Organization',
    question: 'How do you organize and manage environment-specific configurations?',
    answer: `Environment configuration strategies:

1. .env files (Next.js)
   - .env.local (local secrets)
   - .env.development
   - .env.production
   
2. Runtime config
   - next.config.js env
   - publicRuntimeConfig

3. Feature flags
   - Environment-based features
   - LaunchDarkly, Flagsmith

4. Validation
   - Validate at startup
   - Fail fast on missing vars`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// .env.local (git-ignored)
DATABASE_URL="postgresql://..."
AUTH_SECRET="super-secret"

// .env.development
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_ENV="development"

// .env.production  
NEXT_PUBLIC_API_URL="https://api.example.com"
NEXT_PUBLIC_ENV="production"

// lib/env.ts - Validated environment
import { z } from 'zod';

const envSchema = z.object({
  // Server-only
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  
  // Public (available on client)
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_ENV: z.enum(['development', 'staging', 'production']),
});

// Validate on module load
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;

// Feature flags based on environment
// lib/features.ts
export const features = {
  newDashboard: env.NEXT_PUBLIC_ENV !== 'production',
  betaFeatures: ['staging', 'development'].includes(env.NEXT_PUBLIC_ENV),
  debugMode: env.NEXT_PUBLIC_ENV === 'development',
};

// Usage
if (features.newDashboard) {
  // Show new dashboard
}

// next.config.js - Build-time config
module.exports = {
  env: {
    BUILD_TIME: new Date().toISOString(),
  },
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  },
  serverRuntimeConfig: {
    dbUrl: process.env.DATABASE_URL,
  },
};`,
    tags: ['configuration', 'environment', 'best-practices'],
    timeEstimate: 4
  },
  {
    id: 'co-9',
    category: 'Code Organization',
    question: 'How do you organize tests in a React/Next.js project?',
    answer: `Test organization patterns:

1. Co-located tests (recommended)
   - Tests next to source files
   - Button.test.tsx next to Button.tsx
   - Easy to find and maintain

2. Separate __tests__ folder
   - All tests in one place
   - Mirrors src structure

3. By test type
   - unit/, integration/, e2e/
   - Different configs per type

Test naming:
- Component.test.tsx (unit)
- feature.integration.test.tsx
- feature.e2e.test.tsx`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Co-located structure (recommended)
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.test.tsx      // Unit tests
│       ├── Button.stories.tsx   // Storybook
│       └── index.ts
├── features/
│   └── auth/
│       ├── components/
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   └── useAuth.test.ts
│       └── __tests__/
│           └── auth.integration.test.ts
├── __tests__/
│   └── e2e/
│       └── login.e2e.test.ts

// Test file structure
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  describe('rendering', () => {
    it('renders with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders loading state', () => {
      render(<Button isLoading>Click me</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('interactions', () => {
    it('calls onClick when clicked', () => {
      const onClick = jest.fn();
      render(<Button onClick={onClick}>Click me</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('variants', () => {
    it.each(['primary', 'secondary', 'danger'])('renders %s variant', (variant) => {
      render(<Button variant={variant}>Button</Button>);
      expect(screen.getByRole('button')).toHaveClass(\`btn-\${variant}\`);
    });
  });
});

// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: [
    '**/*.test.ts?(x)',
    '**/*.spec.ts?(x)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.stories.tsx',
    '!src/**/*.d.ts',
  ],
};`,
    tags: ['testing', 'jest', 'organization', 'best-practices'],
    timeEstimate: 5
  },
  {
    id: 'co-10',
    category: 'Code Organization',
    question: 'What are compound components and how do you implement them?',
    answer: `Compound components share implicit state through context:

Benefits:
- Flexible composition
- Cleaner API for complex components
- Users control structure
- Better separation of concerns

Examples:
- Tabs, Accordion, Select
- Menu, Dropdown
- Form with Fields

Pattern uses:
- Context for shared state
- Children composition
- Static properties or named exports`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Compound component pattern
import { createContext, useContext, useState, ReactNode } from 'react';

// Context for shared state
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within Tabs');
  }
  return context;
}

// Main component
interface TabsProps {
  defaultTab: string;
  children: ReactNode;
}

function Tabs({ defaultTab, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

// Sub-components
function TabList({ children }: { children: ReactNode }) {
  return <div role="tablist" className="tab-list">{children}</div>;
}

function Tab({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab, setActiveTab } = useTabsContext();
  
  return (
    <button
      role="tab"
      aria-selected={activeTab === id}
      className={\`tab \${activeTab === id ? 'active' : ''}\`}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

function TabPanels({ children }: { children: ReactNode }) {
  return <div className="tab-panels">{children}</div>;
}

function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab } = useTabsContext();
  
  if (activeTab !== id) return null;
  
  return (
    <div role="tabpanel" className="tab-panel">
      {children}
    </div>
  );
}

// Attach sub-components
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panels = TabPanels;
Tabs.Panel = TabPanel;

// Usage - flexible composition!
function App() {
  return (
    <Tabs defaultTab="profile">
      <Tabs.List>
        <Tabs.Tab id="profile">Profile</Tabs.Tab>
        <Tabs.Tab id="settings">Settings</Tabs.Tab>
        <Tabs.Tab id="billing">Billing</Tabs.Tab>
      </Tabs.List>
      
      <Tabs.Panels>
        <Tabs.Panel id="profile">
          <ProfileContent />
        </Tabs.Panel>
        <Tabs.Panel id="settings">
          <SettingsContent />
        </Tabs.Panel>
        <Tabs.Panel id="billing">
          <BillingContent />
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
}`,
    tags: ['patterns', 'compound-components', 'composition', 'architecture'],
    timeEstimate: 6
  },
  {
    id: 'co-11',
    category: 'Code Organization',
    question: 'How do you organize CSS/styling in a React project?',
    answer: `CSS organization strategies:

1. CSS Modules
   - Scoped by default
   - Component.module.css

2. CSS-in-JS (styled-components, Emotion)
   - Co-located styles
   - Dynamic styling

3. Utility-first (Tailwind)
   - Consistent design system
   - Fast development

4. Component libraries (shadcn/ui)
   - Pre-built components
   - Customizable

Organization:
- Design tokens in CSS variables
- Shared styles in globals
- Component styles co-located`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// 1. CSS Modules
// Button.module.css
.button {
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
}

.primary {
  background: var(--color-primary);
  color: white;
}

// Button.tsx
import styles from './Button.module.css';
import cn from 'classnames';

function Button({ variant = 'primary', children }) {
  return (
    <button className={cn(styles.button, styles[variant])}>
      {children}
    </button>
  );
}

// 2. Tailwind with class variance authority
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

// 3. Design tokens / CSS variables
// globals.css
:root {
  --color-primary: 220 90% 56%;
  --color-secondary: 220 14% 96%;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
}

.dark {
  --color-primary: 220 90% 66%;
  --color-secondary: 220 14% 16%;
}

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--color-primary))',
        secondary: 'hsl(var(--color-secondary))',
      },
    },
  },
};`,
    tags: ['css', 'styling', 'tailwind', 'css-modules'],
    timeEstimate: 5
  },
  {
    id: 'co-12',
    category: 'Code Organization',
    question: 'How do you implement the render props pattern?',
    answer: `Render props = passing a function as a prop that returns JSX:

Use cases:
- Sharing stateful logic
- Customizable rendering
- Headless components

Variations:
- children as function
- render prop
- Named render props

Note: Custom hooks have largely replaced render props for logic sharing, but pattern still useful for customizable rendering.`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Render prop pattern
interface MouseTrackerProps {
  render: (position: { x: number; y: number }) => React.ReactNode;
}

function MouseTracker({ render }: MouseTrackerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);
  
  return <>{render(position)}</>;
}

// Usage
<MouseTracker
  render={({ x, y }) => (
    <div>
      Mouse position: {x}, {y}
    </div>
  )}
/>

// Children as function pattern
interface ToggleProps {
  children: (props: { isOn: boolean; toggle: () => void }) => React.ReactNode;
}

function Toggle({ children }: ToggleProps) {
  const [isOn, setIsOn] = useState(false);
  const toggle = () => setIsOn(prev => !prev);
  
  return <>{children({ isOn, toggle })}</>;
}

// Usage
<Toggle>
  {({ isOn, toggle }) => (
    <button onClick={toggle}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  )}
</Toggle>

// Practical example: Sortable list
interface SortableListProps<T> {
  items: T[];
  onSort: (items: T[]) => void;
  renderItem: (item: T, props: { dragHandleProps: object }) => React.ReactNode;
}

function SortableList<T>({ items, onSort, renderItem }: SortableListProps<T>) {
  // Drag and drop logic...
  
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {renderItem(item, { dragHandleProps: getDragHandleProps(index) })}
        </li>
      ))}
    </ul>
  );
}

// Usage
<SortableList
  items={todos}
  onSort={setTodos}
  renderItem={(todo, { dragHandleProps }) => (
    <div className="todo-item">
      <span {...dragHandleProps}>⋮⋮</span>
      <span>{todo.text}</span>
    </div>
  )}
/>

// Modern alternative: Custom hook
function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);
  
  return position;
}

// Usage - cleaner for most cases
function Component() {
  const { x, y } = useMousePosition();
  return <div>Mouse: {x}, {y}</div>;
}`,
    tags: ['render-props', 'patterns', 'composition', 'hooks'],
    timeEstimate: 5
  },
  {
    id: 'co-13',
    category: 'Code Organization',
    question: 'How do you manage and organize constants and configuration?',
    answer: `Constants organization:

1. Location
   - lib/constants.ts or config/
   - Feature-specific constants nearby

2. Categories
   - API endpoints
   - Route paths
   - Validation rules
   - UI constants
   - Feature flags

3. Best practices
   - Use TypeScript enums or const objects
   - Group logically
   - Document purpose
   - Use as const for literal types`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// lib/constants/index.ts
export * from './routes';
export * from './api';
export * from './validation';
export * from './ui';

// lib/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
  },
  DASHBOARD: {
    ROOT: '/dashboard',
    SETTINGS: '/dashboard/settings',
    PROFILE: '/dashboard/profile',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => \`/products/\${id}\` as const,
    CREATE: '/products/new',
  },
} as const;

// Type-safe route params
type ProductDetailRoute = ReturnType<typeof ROUTES.PRODUCTS.DETAIL>;

// lib/constants/api.ts
export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  ENDPOINTS: {
    USERS: '/users',
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
    },
    PRODUCTS: '/products',
  },
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
} as const;

// lib/constants/validation.ts
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/,
    MESSAGE: 'Password must contain uppercase, lowercase, and number',
  },
  EMAIL: {
    PATTERN: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
    MESSAGE: 'Invalid email address',
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
} as const;

// Usage with Zod
import { z } from 'zod';
import { VALIDATION } from '@/lib/constants';

const passwordSchema = z
  .string()
  .min(VALIDATION.PASSWORD.MIN_LENGTH)
  .max(VALIDATION.PASSWORD.MAX_LENGTH)
  .regex(VALIDATION.PASSWORD.PATTERN, VALIDATION.PASSWORD.MESSAGE);

// lib/constants/ui.ts
export const UI = {
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
  },
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  TOAST: {
    DURATION: 5000,
    MAX_VISIBLE: 3,
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },
} as const;

// Feature flags
export const FEATURES = {
  NEW_DASHBOARD: process.env.NEXT_PUBLIC_FEATURE_NEW_DASHBOARD === 'true',
  BETA_FEATURES: process.env.NEXT_PUBLIC_BETA === 'true',
  MAINTENANCE_MODE: process.env.NEXT_PUBLIC_MAINTENANCE === 'true',
} as const;`,
    tags: ['constants', 'configuration', 'organization', 'typescript'],
    timeEstimate: 4
  },
  {
    id: 'co-14',
    category: 'Code Organization',
    question: 'What is the Higher-Order Component (HOC) pattern?',
    answer: `HOC = function that takes a component and returns an enhanced component:

Use cases (historical):
- Adding authentication checks
- Providing data/props
- Logging, analytics
- Code reuse

Modern status:
- Hooks preferred for logic reuse
- HOCs still useful for:
  - Component composition
  - Wrapping third-party components
  - Adding behavior without changing source

Naming: withSomething (withAuth, withTheme)`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// HOC pattern
import { ComponentType, useEffect } from 'react';

// Type for HOC props
interface WithLoadingProps {
  isLoading?: boolean;
}

// Generic HOC with TypeScript
function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P & WithLoadingProps> {
  return function WithLoadingComponent({ isLoading, ...props }: P & WithLoadingProps) {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    return <WrappedComponent {...(props as P)} />;
  };
}

// Authentication HOC
function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options?: { redirectTo?: string }
): ComponentType<P> {
  return function WithAuthComponent(props: P) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
      if (!isLoading && !user) {
        router.push(options?.redirectTo || '/login');
      }
    }, [user, isLoading, router]);
    
    if (isLoading) return <LoadingScreen />;
    if (!user) return null;
    
    return <WrappedComponent {...props} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);
const ProtectedAdmin = withAuth(AdminPanel, { redirectTo: '/unauthorized' });

// Analytics HOC
function withAnalytics<P extends object>(
  WrappedComponent: ComponentType<P>,
  pageName: string
): ComponentType<P> {
  return function WithAnalyticsComponent(props: P) {
    useEffect(() => {
      analytics.trackPageView(pageName);
    }, []);
    
    return <WrappedComponent {...props} />;
  };
}

// Compose multiple HOCs
import { compose } from 'lodash';

const EnhancedDashboard = compose(
  withAuth,
  withLoading,
  (Component) => withAnalytics(Component, 'Dashboard')
)(Dashboard);

// Modern alternative: Custom hooks + wrapper components
// Instead of withAuth HOC:
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading]);
  
  if (isLoading) return <LoadingScreen />;
  if (!user) return null;
  
  return <>{children}</>;
}

// Usage
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>`,
    tags: ['hoc', 'patterns', 'composition', 'authentication'],
    timeEstimate: 6
  },
  {
    id: 'co-15',
    category: 'Code Organization',
    question: 'How do you organize a monorepo with React/Next.js projects?',
    answer: `Monorepo organization with modern tools:

Tools:
- Turborepo (Vercel) - Build system
- pnpm workspaces - Package manager
- npm workspaces - Alternative
- Nx - Full-featured solution

Structure:
- apps/ - Applications
- packages/ - Shared code
- tooling/ - Configs

Benefits:
- Shared code without publishing
- Consistent tooling
- Atomic changes
- Better DX`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Monorepo structure
my-monorepo/
├── apps/
│   ├── web/              # Next.js main app
│   │   ├── app/
│   │   ├── package.json
│   │   └── next.config.js
│   ├── admin/            # Next.js admin
│   │   └── package.json
│   └── docs/             # Documentation site
│       └── package.json
├── packages/
│   ├── ui/               # Shared UI components
│   │   ├── src/
│   │   │   ├── Button/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── utils/            # Shared utilities
│   │   └── package.json
│   ├── config/           # Shared configs
│   │   ├── eslint/
│   │   ├── typescript/
│   │   └── tailwind/
│   └── database/         # Shared DB schema/client
│       └── package.json
├── package.json
├── pnpm-workspace.yaml
└── turbo.json

// pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'

// Root package.json
{
  "name": "my-monorepo",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}

// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    }
  }
}

// packages/ui/package.json
{
  "name": "@repo/ui",
  "version": "0.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./button": "./src/Button/index.ts"
  },
  "peerDependencies": {
    "react": "^18.0.0"
  }
}

// apps/web/package.json
{
  "name": "web",
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/utils": "workspace:*"
  }
}

// Usage in app
import { Button } from '@repo/ui';
import { formatDate } from '@repo/utils';`,
    tags: ['monorepo', 'turborepo', 'architecture', 'workspace'],
    timeEstimate: 6
  },
  {
    id: 'co-16',
    category: 'Code Organization',
    question: 'How do you implement the Provider pattern in React?',
    answer: `Provider pattern = using Context to inject dependencies:

Use cases:
- Theme/styling
- Authentication
- Internationalization
- Feature flags
- App configuration

Best practices:
- Create custom hook for consuming
- Memoize context value
- Split contexts by update frequency
- Consider Zustand for frequent updates`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Complete provider pattern implementation
import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

// 1. Define types
interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleMode: () => void;
}

// 2. Create context with undefined default
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// 3. Create custom hook with error handling
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 4. Create provider component
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ 
  children, 
  defaultTheme = { mode: 'light', primaryColor: '#3b82f6' } 
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  
  // Memoize to prevent unnecessary re-renders
  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    setTheme,
    toggleMode: () => setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light'
    })),
  }), [theme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// 5. Compose multiple providers
function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// 6. Usage in components
function Header() {
  const { theme, toggleMode } = useTheme();
  
  return (
    <header className={theme.mode}>
      <button onClick={toggleMode}>
        {theme.mode === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  );
}

// Provider composition helper
function composeProviders(...providers: React.FC<{ children: ReactNode }>[]) {
  return function ComposedProviders({ children }: { children: ReactNode }) {
    return providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children
    );
  };
}

const Providers = composeProviders(
  ThemeProvider,
  AuthProvider,
  QueryProvider
);

// Usage
<Providers>
  <App />
</Providers>`,
    tags: ['provider', 'context', 'patterns', 'dependency-injection'],
    timeEstimate: 5
  },
  {
    id: 'co-17',
    category: 'Code Organization',
    question: 'How do you configure and organize ESLint and Prettier?',
    answer: `Linting/formatting setup:

ESLint:
- Catch bugs and enforce patterns
- React-specific rules
- TypeScript integration

Prettier:
- Consistent formatting
- No debates about style

Organization:
- Shared configs in monorepo
- Editor integration
- Pre-commit hooks (lint-staged)
- CI enforcement`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// .eslintrc.js
module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier', // Must be last!
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // TypeScript
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    
    // React
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // General
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
  },
  overrides: [
    {
      files: ['*.test.ts', '*.test.tsx'],
      env: { jest: true },
    },
  ],
};

// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}

// package.json scripts
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx --max-warnings 0",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}

// .lintstagedrc.js - Pre-commit hooks
module.exports = {
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,css}': ['prettier --write'],
};

// .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx lint-staged

// VS Code settings - .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}

// Monorepo shared config - packages/config/eslint/index.js
module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  // ... shared rules
};

// apps/web/.eslintrc.js
module.exports = {
  extends: ['@repo/eslint-config'],
  // App-specific overrides
};`,
    tags: ['eslint', 'prettier', 'linting', 'tooling'],
    timeEstimate: 5
  },
  {
    id: 'co-18',
    category: 'Code Organization',
    question: 'How do you organize utility functions and helpers?',
    answer: `Utility organization:

1. Location
   - lib/utils/ or utils/
   - Feature-specific utils in feature folders

2. Categories
   - String manipulation
   - Date formatting
   - Array/object helpers
   - Validation
   - Type guards

3. Best practices
   - Pure functions
   - Single responsibility
   - Well-typed (generics)
   - Tested
   - Tree-shakeable (named exports)`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// lib/utils/index.ts - Barrel export
export * from './string';
export * from './date';
export * from './array';
export * from './cn'; // classnames helper

// lib/utils/cn.ts - Common utility
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// lib/utils/string.ts
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// lib/utils/date.ts
import { format, formatDistance, parseISO } from 'date-fns';

export function formatDate(date: string | Date, pattern = 'PPP'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern);
}

export function timeAgo(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(d, new Date(), { addSuffix: true });
}

// lib/utils/array.ts
export function groupBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}

// lib/utils/validation.ts - Type guards
export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function hasProperty<T extends object, K extends PropertyKey>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> {
  return key in obj;
}

// Usage
import { cn, formatDate, groupBy } from '@/lib/utils';

// Or specific imports for tree-shaking
import { formatDate } from '@/lib/utils/date';`,
    tags: ['utilities', 'helpers', 'organization', 'pure-functions'],
    timeEstimate: 5
  },
  {
    id: 'co-19',
    category: 'Code Organization',
    question: 'How do you implement code splitting and lazy loading?',
    answer: `Code splitting strategies:

1. Route-based (automatic in Next.js)
   - Each page is a chunk
   - App Router handles automatically

2. Component-based
   - React.lazy + Suspense
   - next/dynamic

3. Library splitting
   - Import heavy libs conditionally
   - Dynamic imports

Benefits:
- Smaller initial bundle
- Faster first paint
- Load on demand`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// 1. next/dynamic for components
import dynamic from 'next/dynamic';

// Basic lazy loading
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
});

// Disable SSR for client-only components
const ClientOnlyEditor = dynamic(
  () => import('@/components/RichTextEditor'),
  { ssr: false }
);

// Named exports
const Modal = dynamic(
  () => import('@/components/ui').then(mod => mod.Modal)
);

// 2. React.lazy (for React apps without Next.js)
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
}

// 3. Conditional dynamic imports
function Editor({ type }) {
  const [EditorComponent, setEditorComponent] = useState(null);
  
  useEffect(() => {
    async function loadEditor() {
      if (type === 'markdown') {
        const mod = await import('@/components/MarkdownEditor');
        setEditorComponent(() => mod.default);
      } else if (type === 'code') {
        const mod = await import('@monaco-editor/react');
        setEditorComponent(() => mod.default);
      }
    }
    loadEditor();
  }, [type]);
  
  if (!EditorComponent) return <EditorSkeleton />;
  return <EditorComponent />;
}

// 4. Library lazy loading
async function handleExport() {
  // Only load heavy library when needed
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF();
  pdf.text('Hello world!', 10, 10);
  pdf.save('document.pdf');
}

// 5. Route groups for shared layouts (Next.js App Router)
// app/(marketing)/layout.tsx - Separate bundle
// app/(dashboard)/layout.tsx - Separate bundle

// 6. Parallel routes for modal content
// app/@modal/(.)photos/[id]/page.tsx
// Only loads when modal opens

// 7. Analyze bundles
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // config
});

// Run: ANALYZE=true npm run build`,
    tags: ['code-splitting', 'lazy-loading', 'performance', 'dynamic-imports'],
    timeEstimate: 5
  },
  {
    id: 'co-20',
    category: 'Code Organization',
    question: 'How do you document React components and APIs?',
    answer: `Documentation approaches:

1. JSDoc/TSDoc
   - Inline documentation
   - IDE integration
   - Type hints

2. Storybook
   - Visual component docs
   - Interactive examples
   - Design system

3. README files
   - Feature documentation
   - Setup instructions

4. Generated docs
   - TypeDoc
   - Docusaurus
   - API documentation`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// 1. JSDoc/TSDoc for components
/**
 * A customizable button component with multiple variants and sizes.
 * 
 * @example
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Click me
 * </Button>
 */
interface ButtonProps {
  /**
   * The visual style of the button
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  
  /**
   * The size of the button
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether the button is in a loading state
   * Shows a spinner and disables the button
   */
  isLoading?: boolean;
  
  /**
   * The content to render inside the button
   */
  children: React.ReactNode;
  
  /**
   * Click handler
   * @param event - The click event
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  onClick,
}: ButtonProps) {
  // Implementation
}

// 2. Storybook stories
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

// 3. Hook documentation
/**
 * Hook for managing async operations with loading and error states
 * 
 * @template T - The type of data returned by the async function
 * @param asyncFn - The async function to execute
 * @param options - Configuration options
 * @returns Object containing data, loading state, error, and execute function
 * 
 * @example
 * const { data, loading, error, execute } = useAsync(
 *   () => api.getUsers(),
 *   { immediate: true }
 * );
 */
export function useAsync<T>(
  asyncFn: () => Promise<T>,
  options?: UseAsyncOptions<T>
): UseAsyncReturn<T> {
  // Implementation
}`,
    tags: ['documentation', 'jsdoc', 'storybook', 'best-practices'],
    timeEstimate: 5
  },
  {
    id: 'co-21',
    category: 'Code Organization',
    question: 'What are the patterns for organizing shared types in TypeScript?',
    answer: `Type organization strategies:

1. Centralized types folder
   - types/index.ts
   - Shared across features

2. Co-located types
   - Feature-specific types
   - Component prop types

3. Generated types
   - From API schemas
   - Prisma/database types

4. Best practices
   - Export types explicitly
   - Use namespaces sparingly
   - Prefer interfaces for objects`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// types/index.ts - Centralized shared types
export * from './user';
export * from './api';
export * from './common';

// types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  profile?: UserProfile;
}

export type UserRole = 'admin' | 'user' | 'guest';

export interface UserProfile {
  avatar?: string;
  bio?: string;
  location?: string;
}

// Derived types
export type CreateUserInput = Omit<User, 'id' | 'createdAt'>;
export type UpdateUserInput = Partial<CreateUserInput>;
export type PublicUser = Pick<User, 'id' | 'name' | 'profile'>;

// types/api.ts - API response types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    page: number;
    total: number;
    hasMore: boolean;
  };
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, string[]>;
}

export type ApiResult<T> = 
  | { success: true; data: T }
  | { success: false; error: ApiError };

// types/common.ts - Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make all properties of T nullable
export type DeepNullable<T> = {
  [K in keyof T]: T[K] extends object ? DeepNullable<T[K]> : T[K] | null;
};

// Feature-specific types
// features/products/types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
}

export type ProductCategory = 'electronics' | 'clothing' | 'books';

export interface ProductFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

// Generated types example (from API schema or Prisma)
// Generated by prisma
export type { User, Product, Order } from '@prisma/client';

// Generated from OpenAPI
export type { paths, components } from './generated/api';
export type User = components['schemas']['User'];

// Type augmentation
// types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession['user'];
  }
}`,
    tags: ['typescript', 'types', 'organization', 'architecture'],
    timeEstimate: 5
  },
  {
    id: 'co-22',
    category: 'Code Organization',
    question: 'How do you structure service layers and business logic?',
    answer: `Service layer patterns:

1. Purpose
   - Abstract business logic
   - Reusable across components
   - Easier testing

2. Structure
   - services/ or lib/services/
   - One service per domain
   - Methods for operations

3. Patterns
   - Repository pattern (data access)
   - Use cases/actions
   - Domain-driven design (complex apps)

4. Testing
   - Mock dependencies
   - Test business rules`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// lib/services/user.service.ts
import { prisma } from '@/lib/prisma';
import { hash, compare } from 'bcrypt';
import { User, CreateUserInput, UpdateUserInput } from '@/types';

export const userService = {
  async getById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  },
  
  async getByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },
  
  async create(input: CreateUserInput): Promise<User> {
    const existingUser = await this.getByEmail(input.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }
    
    const hashedPassword = await hash(input.password, 10);
    
    return prisma.user.create({
      data: {
        ...input,
        password: hashedPassword,
      },
    });
  },
  
  async update(id: string, input: UpdateUserInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: input,
    });
  },
  
  async verifyPassword(user: User, password: string): Promise<boolean> {
    return compare(password, user.password);
  },
  
  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  },
};

// lib/services/auth.service.ts
import { userService } from './user.service';
import { signJWT, verifyJWT } from '@/lib/jwt';

export const authService = {
  async login(email: string, password: string) {
    const user = await userService.getByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const isValid = await userService.verifyPassword(user, password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }
    
    const token = await signJWT({ userId: user.id, role: user.role });
    
    return { user, token };
  },
  
  async register(input: CreateUserInput) {
    const user = await userService.create(input);
    const token = await signJWT({ userId: user.id, role: user.role });
    
    return { user, token };
  },
};

// Use case pattern for complex operations
// lib/use-cases/checkout.ts
interface CheckoutInput {
  userId: string;
  cartId: string;
  paymentMethod: string;
  shippingAddress: Address;
}

export async function executeCheckout(input: CheckoutInput) {
  // 1. Validate cart
  const cart = await cartService.getById(input.cartId);
  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }
  
  // 2. Check inventory
  for (const item of cart.items) {
    const available = await inventoryService.checkAvailability(
      item.productId,
      item.quantity
    );
    if (!available) {
      throw new Error(\`\${item.name} is out of stock\`);
    }
  }
  
  // 3. Process payment
  const payment = await paymentService.charge({
    amount: cart.total,
    method: input.paymentMethod,
  });
  
  // 4. Create order
  const order = await orderService.create({
    userId: input.userId,
    items: cart.items,
    payment: payment.id,
    shippingAddress: input.shippingAddress,
  });
  
  // 5. Update inventory
  await inventoryService.decrementStock(cart.items);
  
  // 6. Clear cart
  await cartService.clear(input.cartId);
  
  // 7. Send confirmation
  await emailService.sendOrderConfirmation(order);
  
  return order;
}

// Usage in Server Action or API route
async function handleCheckout(formData: FormData) {
  'use server';
  
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  
  return executeCheckout({
    userId: session.user.id,
    cartId: formData.get('cartId'),
    paymentMethod: formData.get('paymentMethod'),
    shippingAddress: parseAddress(formData),
  });
}`,
    tags: ['services', 'business-logic', 'architecture', 'clean-code'],
    timeEstimate: 6
  },
  {
    id: 'co-23',
    category: 'Code Organization',
    question: 'How do you implement and organize form builders?',
    answer: `Form builder patterns:

1. Configuration-driven
   - Define fields as config
   - Render dynamically

2. Typed form schemas
   - Zod/Yup for validation
   - Infer types from schema

3. Component composition
   - Reusable field components
   - Consistent error handling

4. Benefits
   - DRY form creation
   - Consistent UX
   - Easier maintenance`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// lib/forms/types.ts
export type FieldType = 'text' | 'email' | 'password' | 'select' | 'checkbox' | 'textarea';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[]; // For select
  validation?: z.ZodType;
}

export interface FormConfig {
  fields: FieldConfig[];
  submitLabel?: string;
}

// components/forms/FormBuilder.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface FormBuilderProps {
  config: FormConfig;
  schema: z.ZodType;
  onSubmit: (data: any) => void | Promise<void>;
  defaultValues?: Record<string, any>;
}

export function FormBuilder({ 
  config, 
  schema, 
  onSubmit, 
  defaultValues 
}: FormBuilderProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {config.fields.map((field) => (
        <FormField key={field.name} field={field} form={form} />
      ))}
      
      <button type="submit" disabled={form.formState.isSubmitting}>
        {config.submitLabel || 'Submit'}
      </button>
    </form>
  );
}

function FormField({ field, form }: { field: FieldConfig; form: any }) {
  const { register, formState: { errors } } = form;
  const error = errors[field.name]?.message;
  
  const renderInput = () => {
    switch (field.type) {
      case 'select':
        return (
          <select {...register(field.name)}>
            <option value="">Select...</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return <textarea {...register(field.name)} placeholder={field.placeholder} />;
      
      case 'checkbox':
        return <input type="checkbox" {...register(field.name)} />;
      
      default:
        return (
          <input
            type={field.type}
            {...register(field.name)}
            placeholder={field.placeholder}
          />
        );
    }
  };
  
  return (
    <div className="form-field">
      <label>{field.label}</label>
      {renderInput()}
      {error && <span className="error">{error}</span>}
    </div>
  );
}

// Usage
const userFormConfig: FormConfig = {
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { 
      name: 'role', 
      label: 'Role', 
      type: 'select',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
      ]
    },
    { name: 'bio', label: 'Bio', type: 'textarea' },
  ],
  submitLabel: 'Create User',
};

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['admin', 'user']),
  bio: z.string().optional(),
});

function CreateUserForm() {
  const handleSubmit = async (data: z.infer<typeof userSchema>) => {
    await createUser(data);
  };
  
  return (
    <FormBuilder
      config={userFormConfig}
      schema={userSchema}
      onSubmit={handleSubmit}
    />
  );
}`,
    tags: ['forms', 'form-builder', 'react-hook-form', 'patterns'],
    timeEstimate: 6
  },
  {
    id: 'co-24',
    category: 'Code Organization',
    question: 'How do you implement the repository pattern in React/Next.js?',
    answer: `Repository pattern separates data access from business logic:

Benefits:
- Swap data sources easily
- Testable (mock repositories)
- Consistent data access interface
- Encapsulate queries

Structure:
- Repository interface
- Concrete implementations
- Dependency injection

Use cases:
- Database abstraction
- API client abstraction
- Cache layer`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// lib/repositories/types.ts
export interface Repository<T, CreateInput, UpdateInput> {
  findById(id: string): Promise<T | null>;
  findMany(filter?: Partial<T>): Promise<T[]>;
  create(data: CreateInput): Promise<T>;
  update(id: string, data: UpdateInput): Promise<T>;
  delete(id: string): Promise<void>;
}

// lib/repositories/user.repository.ts
import { User, CreateUserInput, UpdateUserInput } from '@/types';
import { Repository } from './types';

// Interface
export interface UserRepository extends Repository<User, CreateUserInput, UpdateUserInput> {
  findByEmail(email: string): Promise<User | null>;
}

// Prisma implementation
import { prisma } from '@/lib/prisma';

export class PrismaUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }
  
  async findMany(filter?: Partial<User>): Promise<User[]> {
    return prisma.user.findMany({ where: filter });
  }
  
  async create(data: CreateUserInput): Promise<User> {
    return prisma.user.create({ data });
  }
  
  async update(id: string, data: UpdateUserInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }
  
  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}

// In-memory implementation (for testing)
export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];
  
  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }
  
  async findMany(filter?: Partial<User>): Promise<User[]> {
    if (!filter) return this.users;
    return this.users.filter(user =>
      Object.entries(filter).every(([key, value]) => user[key] === value)
    );
  }
  
  async create(data: CreateUserInput): Promise<User> {
    const user = { id: crypto.randomUUID(), ...data, createdAt: new Date() };
    this.users.push(user);
    return user;
  }
  
  // ... other methods
}

// lib/repositories/index.ts - Factory/DI
let userRepository: UserRepository;

export function getUserRepository(): UserRepository {
  if (!userRepository) {
    // In production, use Prisma
    // In tests, this can be overridden
    userRepository = new PrismaUserRepository();
  }
  return userRepository;
}

// For testing
export function setUserRepository(repo: UserRepository) {
  userRepository = repo;
}

// Usage in service
import { getUserRepository } from '@/lib/repositories';

export const userService = {
  async getById(id: string) {
    const repo = getUserRepository();
    return repo.findById(id);
  },
  
  async create(input: CreateUserInput) {
    const repo = getUserRepository();
    const existing = await repo.findByEmail(input.email);
    if (existing) throw new Error('Email in use');
    return repo.create(input);
  },
};

// Test
describe('userService', () => {
  beforeEach(() => {
    setUserRepository(new InMemoryUserRepository());
  });
  
  it('creates a user', async () => {
    const user = await userService.create({ email: 'test@test.com' });
    expect(user.email).toBe('test@test.com');
  });
});`,
    tags: ['repository', 'patterns', 'architecture', 'testing'],
    timeEstimate: 6
  },
  {
    id: 'co-25',
    category: 'Code Organization',
    question: 'What are module boundaries and how do you enforce them?',
    answer: `Module boundaries define what can be imported from where:

Benefits:
- Prevents circular dependencies
- Clear public APIs
- Better encapsulation
- Easier refactoring

Enforcement:
- Barrel exports (index.ts)
- ESLint import rules
- Project references (TypeScript)
- Architecture tests

Patterns:
- Feature modules
- Layered architecture
- Public/internal separation`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Feature module structure with boundaries
features/
├── auth/
│   ├── index.ts          # Public API
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   └── internal/     # Internal components
│   │       └── PasswordInput.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   └── internal/         # Internal modules
│       ├── auth.service.ts
│       └── auth.utils.ts

// features/auth/index.ts - Public API only
// This is what other modules can import

// Components
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';

// Hooks
export { useAuth } from './hooks/useAuth';

// Types
export type { User, AuthState } from './types';

// No internal exports!
// DON'T: export { authService } from './internal/auth.service';

// ESLint config for import boundaries
// .eslintrc.js
module.exports = {
  plugins: ['import', 'boundaries'],
  rules: {
    // Prevent deep imports
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/features/*/*'],
            message: 'Import from feature index only: @/features/auth',
          },
          {
            group: ['../**/internal/*'],
            message: 'Cannot import from internal modules',
          },
        ],
      },
    ],
    
    // Enforce import order
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
      },
    ],
  },
  
  // boundaries plugin for layer enforcement
  settings: {
    'boundaries/elements': [
      { type: 'components', pattern: 'components/*' },
      { type: 'features', pattern: 'features/*' },
      { type: 'lib', pattern: 'lib/*' },
      { type: 'app', pattern: 'app/*' },
    ],
  },
};

// TypeScript project references for larger projects
// tsconfig.json
{
  "references": [
    { "path": "./packages/ui" },
    { "path": "./packages/utils" },
    { "path": "./packages/core" }
  ]
}

// packages/core/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist"
  },
  "references": [
    { "path": "../utils" }
  ]
}

// Architecture test (with jest or similar)
describe('Module boundaries', () => {
  it('auth feature does not import from user internals', () => {
    const authFiles = glob.sync('features/auth/**/*.ts');
    authFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).not.toMatch(/from.*features\\/user\\/internal/);
    });
  });
});`,
    tags: ['architecture', 'modules', 'boundaries', 'eslint'],
    timeEstimate: 6
  },
  {
    id: 'co-26',
    category: 'Code Organization',
    question: 'How do you organize and manage translations/i18n?',
    answer: `Internationalization organization:

1. Structure
   - locales/ or messages/
   - One file per locale
   - Namespace by feature

2. Libraries
   - next-intl (Next.js)
   - react-i18next
   - formatjs

3. Best practices
   - Extract strings to files
   - Use ICU message format
   - Handle plurals, dates, numbers
   - Type-safe keys`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Project structure
locales/
├── en/
│   ├── common.json
│   ├── auth.json
│   └── products.json
├── es/
│   ├── common.json
│   ├── auth.json
│   └── products.json
└── index.ts

// locales/en/common.json
{
  "navigation": {
    "home": "Home",
    "products": "Products",
    "cart": "Cart ({count, plural, =0 {empty} one {# item} other {# items}})"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  },
  "errors": {
    "required": "This field is required",
    "invalid_email": "Please enter a valid email"
  }
}

// locales/en/auth.json
{
  "login": {
    "title": "Welcome back",
    "subtitle": "Sign in to your account",
    "email_label": "Email address",
    "password_label": "Password",
    "submit": "Sign in",
    "forgot_password": "Forgot password?",
    "no_account": "Don't have an account? {link}"
  },
  "errors": {
    "invalid_credentials": "Invalid email or password"
  }
}

// next-intl setup
// i18n.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: {
    ...(await import(\`./locales/\${locale}/common.json\`)).default,
    ...(await import(\`./locales/\${locale}/auth.json\`)).default,
    ...(await import(\`./locales/\${locale}/products.json\`)).default,
  },
}));

// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'es', 'fr'],
  defaultLocale: 'en',
});

// Type-safe translations
// types/i18n.d.ts
type Messages = typeof import('./locales/en/common.json') &
  typeof import('./locales/en/auth.json');

declare global {
  interface IntlMessages extends Messages {}
}

// Usage in components
import { useTranslations } from 'next-intl';

function LoginForm() {
  const t = useTranslations('auth.login');
  const tCommon = useTranslations('common');
  
  return (
    <form>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      
      <label>{t('email_label')}</label>
      <input type="email" />
      
      <label>{t('password_label')}</label>
      <input type="password" />
      
      <button type="submit">{t('submit')}</button>
      
      <p>
        {t('no_account', {
          link: <Link href="/register">{tCommon('actions.register')}</Link>
        })}
      </p>
    </form>
  );
}

// Server component with translations
import { getTranslations } from 'next-intl/server';

async function ProductsPage() {
  const t = await getTranslations('products');
  
  return (
    <div>
      <h1>{t('title')}</h1>
    </div>
  );
}`,
    tags: ['i18n', 'translations', 'next-intl', 'localization'],
    timeEstimate: 5
  },
  {
    id: 'co-27',
    category: 'Code Organization',
    question: 'How do you structure Next.js API routes and server actions?',
    answer: `API organization in Next.js:

App Router patterns:
1. Route Handlers (app/api/)
   - REST endpoints
   - External integrations
   - Webhooks

2. Server Actions
   - Form submissions
   - Mutations
   - Co-located with components

Best practices:
- Separate concerns
- Validate inputs
- Handle errors consistently
- Type request/response`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// API route structure
app/
├── api/
│   ├── auth/
│   │   ├── login/route.ts
│   │   └── logout/route.ts
│   ├── users/
│   │   ├── route.ts           # GET all, POST create
│   │   └── [id]/route.ts      # GET, PATCH, DELETE by id
│   └── webhooks/
│       └── stripe/route.ts

// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { userService } from '@/lib/services/user';

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const { users, total } = await userService.getMany({ page, limit });
    
    return NextResponse.json({
      data: users,
      meta: { page, limit, total },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createUserSchema.parse(body);
    
    const user = await userService.create(validated);
    
    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// Server Actions organization
// lib/actions/user.actions.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

const updateProfileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().max(500).optional(),
});

export async function updateProfile(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  
  const validated = updateProfileSchema.parse({
    name: formData.get('name'),
    bio: formData.get('bio'),
  });
  
  await userService.update(session.user.id, validated);
  
  revalidatePath('/profile');
  
  return { success: true };
}

export async function deleteAccount() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  
  await userService.delete(session.user.id);
  
  redirect('/');
}

// Usage in component
import { updateProfile } from '@/lib/actions/user.actions';

function ProfileForm({ user }) {
  return (
    <form action={updateProfile}>
      <input name="name" defaultValue={user.name} />
      <textarea name="bio" defaultValue={user.bio} />
      <button type="submit">Save</button>
    </form>
  );
}

// Or with useFormState for better UX
'use client';
import { useFormState } from 'react-dom';

function ProfileForm({ user }) {
  const [state, formAction] = useFormState(updateProfile, null);
  
  return (
    <form action={formAction}>
      {state?.error && <p className="error">{state.error}</p>}
      <input name="name" defaultValue={user.name} />
      <SubmitButton />
    </form>
  );
}`,
    tags: ['api-routes', 'server-actions', 'next.js', 'architecture'],
    timeEstimate: 6
  },
  {
    id: 'co-28',
    category: 'Code Organization',
    question: 'What are the best practices for managing git workflow and commits?',
    answer: `Git workflow best practices:

1. Branch strategy
   - main (production)
   - develop (integration)
   - feature/, bugfix/, hotfix/

2. Commit conventions
   - Conventional commits
   - Atomic commits
   - Meaningful messages

3. Code review
   - PR templates
   - Required reviews
   - CI checks

4. Automation
   - Pre-commit hooks
   - Semantic versioning
   - Changelogs`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Conventional commit format
// type(scope): description
// 
// [optional body]
// [optional footer]

// Examples:
feat(auth): add password reset functionality
fix(cart): resolve quantity update race condition
docs(readme): add installation instructions
refactor(api): extract validation middleware
test(users): add integration tests for user service
chore(deps): update next.js to 14.1

// Breaking change
feat(api)!: change authentication endpoint response format

BREAKING CHANGE: The /api/auth/login endpoint now returns
{ user, token } instead of { data: { user, token } }

// .commitlintrc.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf'],
    ],
    'scope-enum': [
      2,
      'always',
      ['auth', 'users', 'products', 'cart', 'api', 'ui', 'deps'],
    ],
  },
};

// .husky/commit-msg
#!/bin/sh
npx --no -- commitlint --edit $1

// PR template - .github/pull_request_template.md
## Description
<!-- What does this PR do? -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
<!-- Describe the tests you ran -->

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have added tests
- [ ] I have updated documentation

## Screenshots (if applicable)

// Branch protection rules (GitHub)
// - Require pull request reviews
// - Require status checks (CI, tests, lint)
// - Require conversation resolution
// - Restrict who can push to main

// Git hooks - .husky/pre-push
#!/bin/sh
npm run lint
npm run test

// Semantic release config
// release.config.js
module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/git',
    '@semantic-release/github',
  ],
};

// package.json
{
  "scripts": {
    "release": "semantic-release",
    "prepare": "husky install"
  }
}`,
    tags: ['git', 'workflow', 'commits', 'conventions'],
    timeEstimate: 5
  },
  {
    id: 'co-29',
    category: 'Code Organization',
    question: 'What is Storybook and how do you set it up for a React/Next.js project?',
    answer: `Storybook is a tool for developing UI components in isolation:

Benefits:
- Develop components independently
- Visual testing and review
- Interactive documentation
- Design system development
- Catch UI bugs early

Key features:
- Component stories
- Controls for props
- Actions for events
- Addons ecosystem
- Visual regression testing`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Installation
npx storybook@latest init

// Project structure after setup
.storybook/
├── main.ts         # Config
├── preview.ts      # Global decorators
└── preview-head.html

// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
};

export default config;

// .storybook/preview.ts
import type { Preview } from '@storybook/react';
import '../src/app/globals.css'; // Import global styles

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default preview;

// Basic component story
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
      description: 'The visual style of the button',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Individual stories
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};`,
    tags: ['storybook', 'documentation', 'component-development', 'design-system'],
    timeEstimate: 6
  },
  {
    id: 'co-30',
    category: 'Code Organization',
    question: 'How do you write effective Storybook stories with controls and actions?',
    answer: `Effective Storybook stories:

1. Controls
   - Interactive prop editing
   - Type-based controls
   - Custom control types

2. Actions
   - Track event handlers
   - Log interactions
   - Test callbacks

3. Decorators
   - Wrap stories with providers
   - Add styling context
   - Mock data/state

4. Args & ArgTypes
   - Default values
   - Control configuration
   - Documentation`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// Comprehensive story example
// Card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  
  // ArgTypes for control configuration
  argTypes: {
    title: {
      control: 'text',
      description: 'Card title',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'outlined', 'elevated'],
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
    },
    isLoading: {
      control: 'boolean',
    },
    image: {
      control: { type: 'file', accept: '.png,.jpg,.jpeg' },
    },
    onClick: { action: 'card-clicked' },
    onClose: { action: 'close-clicked' },
  },
  
  // Default args
  args: {
    title: 'Card Title',
    variant: 'default',
    size: 'md',
    isLoading: false,
  },
  
  // Decorators
  decorators: [
    (Story) => (
      <div className="max-w-md p-4 bg-gray-100">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story
export const Default: Story = {
  args: {
    title: 'Welcome',
    description: 'This is a card component',
  },
};

// Story with custom render
export const WithImage: Story = {
  args: {
    title: 'Featured Article',
    description: 'Click to read more',
    image: '/placeholder.jpg',
  },
  render: (args) => (
    <Card {...args}>
      <Card.Image src={args.image} alt={args.title} />
      <Card.Content>
        <Card.Title>{args.title}</Card.Title>
        <Card.Description>{args.description}</Card.Description>
      </Card.Content>
    </Card>
  ),
};

// Interaction testing
export const WithInteraction: Story = {
  args: {
    title: 'Interactive Card',
    closable: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Find and click the card
    const card = canvas.getByRole('article');
    await userEvent.click(card);
    
    // Verify action was called
    await expect(args.onClick).toHaveBeenCalled();
    
    // Find and click close button
    const closeButton = canvas.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);
    
    await expect(args.onClose).toHaveBeenCalled();
  },
};

// Multiple variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      {(['default', 'outlined', 'elevated'] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <Card.Content>
            <Card.Title>{variant} variant</Card.Title>
          </Card.Content>
        </Card>
      ))}
    </div>
  ),
};

// Loading state
export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

// With mock data
const mockProducts = [
  { id: 1, name: 'Product A', price: 99 },
  { id: 2, name: 'Product B', price: 149 },
];

export const ProductCards: Story = {
  render: () => (
    <div className="grid gap-4 grid-cols-2">
      {mockProducts.map((product) => (
        <Card key={product.id}>
          <Card.Content>
            <Card.Title>{product.name}</Card.Title>
            <Card.Description>\${product.price}</Card.Description>
          </Card.Content>
        </Card>
      ))}
    </div>
  ),
};`,
    tags: ['storybook', 'controls', 'actions', 'testing'],
    timeEstimate: 6
  },
  {
    id: 'co-31',
    category: 'Code Organization',
    question: 'How do you use Storybook addons for accessibility, viewport, and visual testing?',
    answer: `Essential Storybook addons:

1. @storybook/addon-a11y
   - Accessibility auditing
   - WCAG compliance checks
   
2. @storybook/addon-viewport
   - Responsive testing
   - Device presets

3. Chromatic
   - Visual regression testing
   - UI review workflow

4. Other useful addons:
   - addon-designs (Figma)
   - addon-measure
   - addon-outline`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// .storybook/main.ts - Addon configuration
const config: StorybookConfig = {
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    '@chromatic-com/storybook',
    'storybook-addon-designs',
  ],
};

// .storybook/preview.ts - Global addon config
const preview: Preview = {
  parameters: {
    // Viewport addon configuration
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
        },
      },
      defaultViewport: 'desktop',
    },
    
    // A11y addon configuration
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'label', enabled: true },
        ],
      },
    },
    
    // Backgrounds addon
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
        { name: 'gray', value: '#f5f5f5' },
      ],
    },
  },
};

// Story with accessibility testing
// Form.stories.tsx
export const AccessibleForm: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    required: true,
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'label', enabled: true },
          { id: 'aria-required-attr', enabled: true },
        ],
      },
    },
  },
};

// Story with viewport testing
export const ResponsiveNavigation: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Mobile should show hamburger menu
    const menuButton = canvas.getByRole('button', { name: /menu/i });
    await expect(menuButton).toBeVisible();
  },
};

// Story with Figma design link
export const WithDesign: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/xxx/Design?node-id=123',
    },
  },
};

// Chromatic visual testing
// Capture specific states
export const HoverState: Story = {
  parameters: {
    // Chromatic waits for animations
    chromatic: { delay: 300 },
    pseudo: { hover: true },
  },
};

// Skip in Chromatic
export const AnimatedLoader: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

// Multiple viewports in Chromatic
export const ResponsiveCard: Story = {
  parameters: {
    chromatic: {
      viewports: [320, 768, 1200],
    },
  },
};

// package.json - Chromatic script
{
  "scripts": {
    "chromatic": "chromatic --project-token=xxx",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}

// CI/CD integration - .github/workflows/chromatic.yml
name: Chromatic
on: push
jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
      - run: npm ci
      - uses: chromaui/action@latest
        with:
          projectToken: \${{ secrets.CHROMATIC_PROJECT_TOKEN }}`,
    tags: ['storybook', 'accessibility', 'testing', 'chromatic'],
    timeEstimate: 6
  },
  {
    id: 'co-32',
    category: 'Code Organization',
    question: 'How do you create MDX documentation in Storybook?',
    answer: `MDX in Storybook combines Markdown with JSX:

Benefits:
- Rich documentation
- Interactive examples
- Component API docs
- Design guidelines
- Usage patterns

Features:
- Doc blocks (Canvas, Controls)
- Custom MDX pages
- ArgsTable generation
- Source code display`,
    difficulty: 'intermediate',
    type: 'coding',
    codeExample: `// Button.mdx - Component documentation
import { Meta, Canvas, Controls, Story, Source, ArgTypes } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

# Button Component

The Button component is used to trigger actions or navigate.

## Overview

Buttons communicate actions that users can take. They are typically 
placed throughout your UI, in places like dialogs, forms, cards, and toolbars.

<Canvas of={ButtonStories.Primary} />

## Usage

\`\`\`tsx
import { Button } from '@/components/ui/Button';

function Example() {
  return (
    <Button variant="primary" onClick={() => alert('Clicked!')}>
      Click me
    </Button>
  );
}
\`\`\`

## Props

<ArgTypes of={ButtonStories} />

## Variants

Our button comes in several variants to communicate different intents:

### Primary
Use for the main action on a page.

<Canvas of={ButtonStories.Primary} />

### Secondary
Use for secondary actions.

<Canvas of={ButtonStories.Secondary} />

### Outline
Use for less prominent actions.

<Canvas of={ButtonStories.Outline} />

## Sizes

<Canvas of={ButtonStories.AllSizes} />

## States

### Loading State
Shows a spinner and disables interaction.

<Canvas of={ButtonStories.Loading} />

### Disabled State
Prevents interaction and shows a muted appearance.

<Canvas of={ButtonStories.Disabled} />

## Accessibility

- Uses native \`<button>\` element
- Supports keyboard navigation
- Includes proper ARIA attributes when loading
- Color contrast meets WCAG AA standards

## Best Practices

### Do's
- Use clear, action-oriented labels
- Use primary for the most important action
- Provide visual feedback on interaction

### Don'ts
- Don't use too many primary buttons
- Don't disable without explanation
- Don't make buttons too small for touch

## Related Components

- [IconButton](/docs/ui-iconbutton--docs)
- [ButtonGroup](/docs/ui-buttongroup--docs)
- [Link](/docs/ui-link--docs)

---

// Standalone documentation page
// docs/Introduction.mdx
import { Meta } from '@storybook/blocks';

<Meta title="Introduction" />

# Welcome to Our Design System

This Storybook documents all components in our design system.

## Getting Started

\`\`\`bash
npm install @company/ui
\`\`\`

\`\`\`tsx
import { Button, Card, Input } from '@company/ui';
\`\`\`

## Principles

1. **Consistency** - Components follow unified patterns
2. **Accessibility** - WCAG 2.1 AA compliant
3. **Flexibility** - Composable and customizable
4. **Performance** - Optimized for production

## Structure

- **UI** - Basic building blocks (Button, Input, Card)
- **Layout** - Page structure components
- **Forms** - Form controls and validation
- **Feedback** - Toasts, alerts, modals

---

// .storybook/main.ts - Enable MDX
const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-docs'],
};`,
    tags: ['storybook', 'mdx', 'documentation', 'design-system'],
    timeEstimate: 5
  },
  {
    id: 'co-33',
    category: 'Code Organization',
    question: 'What are micro-frontends and when should you use them?',
    answer: `Micro-frontends extend microservices to the frontend:

Definition:
- Independent, deployable frontend units
- Owned by different teams
- Composed into one application

When to use:
- Large organizations (multiple teams)
- Different tech stacks needed
- Independent deployment cycles
- Legacy migration

When NOT to use:
- Small teams
- Simple applications
- Overhead > benefit
- Strong coupling needed`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Micro-frontend architecture patterns

// 1. Build-time integration (npm packages)
// - Compile-time composition
// - Version management
// - Shared builds

// 2. Server-side composition
// - HTML fragments from different services
// - Edge-side includes (ESI)
// - Server-side rendering

// 3. Client-side composition (most common)
// - Module Federation
// - Single-SPA
// - iframes (legacy)

// Example architecture:
/*
┌─────────────────────────────────────────┐
│           Shell Application             │
│  (routing, auth, shared state)          │
├──────────┬──────────┬──────────┬────────┤
│  Header  │  Search  │  Cart    │ Footer │
│   MFE    │   MFE    │  MFE     │  MFE   │
├──────────┴──────────┴──────────┴────────┤
│              Content Area                │
│  ┌────────────────────────────────┐     │
│  │  Product Catalog MFE (Team A)   │     │
│  │  /products/*                    │     │
│  └────────────────────────────────┘     │
│  ┌────────────────────────────────┐     │
│  │  Checkout MFE (Team B)          │     │
│  │  /checkout/*                    │     │
│  └────────────────────────────────┘     │
│  ┌────────────────────────────────┐     │
│  │  Account MFE (Team C)           │     │
│  │  /account/*                     │     │
│  └────────────────────────────────┘     │
└─────────────────────────────────────────┘
*/

// Key considerations:
// 1. Routing - How to handle cross-MFE navigation
// 2. Styling - CSS isolation, shared design system
// 3. State - Cross-MFE communication
// 4. Auth - Shared authentication
// 5. Performance - Bundle size, loading

// Communication patterns:
// - Custom events
// - Shared state (Redux, etc.)
// - URL/query params
// - Pub/sub message bus

// Custom event communication
// In MFE A:
window.dispatchEvent(new CustomEvent('cart:add', {
  detail: { productId: '123', quantity: 1 }
}));

// In MFE B (Shell or Cart):
window.addEventListener('cart:add', (event) => {
  const { productId, quantity } = event.detail;
  addToCart(productId, quantity);
});

// Shared contracts (TypeScript)
// packages/shared-types/index.ts
export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface AddToCartEvent {
  type: 'cart:add';
  payload: CartItem;
}

export interface User {
  id: string;
  email: string;
  token: string;
}`,
    tags: ['micro-frontends', 'architecture', 'scalability', 'teams'],
    timeEstimate: 6
  },
  {
    id: 'co-34',
    category: 'Code Organization',
    question: 'How do you implement micro-frontends with Webpack Module Federation?',
    answer: `Module Federation enables runtime sharing between applications:

Key concepts:
- Host: Container application
- Remote: Micro-frontend exposed
- Shared: Common dependencies

Benefits:
- True runtime integration
- Independent deployments
- Shared dependencies
- Dynamic loading

Setup:
- Configure exposes/remotes
- Define shared modules
- Handle loading states`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// Shell Application (Host)
// next.config.js
const NextFederationPlugin = require('@module-federation/nextjs-mf');

module.exports = {
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'shell',
        filename: 'static/chunks/remoteEntry.js',
        remotes: {
          // Remote MFEs - loaded at runtime
          products: \`products@\${process.env.PRODUCTS_URL}/_next/static/chunks/remoteEntry.js\`,
          checkout: \`checkout@\${process.env.CHECKOUT_URL}/_next/static/chunks/remoteEntry.js\`,
          account: \`account@\${process.env.ACCOUNT_URL}/_next/static/chunks/remoteEntry.js\`,
        },
        shared: {
          // Shared dependencies - loaded once
          react: { singleton: true, requiredVersion: '^18.0.0' },
          'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
          '@tanstack/react-query': { singleton: true },
        },
        extraOptions: {
          exposePages: true,
        },
      })
    );
    return config;
  },
};

// Products MFE (Remote)
// next.config.js
module.exports = {
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'products',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          // Components exposed to shell
          './ProductList': './src/components/ProductList',
          './ProductDetail': './src/components/ProductDetail',
          './ProductCard': './src/components/ProductCard',
          // Expose entire pages
          './pages/products': './src/pages/products/index',
        },
        shared: {
          react: { singleton: true, requiredVersion: '^18.0.0' },
          'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        },
      })
    );
    return config;
  },
};

// Shell - Loading remote components
// app/products/page.tsx
import dynamic from 'next/dynamic';

const ProductList = dynamic(
  () => import('products/ProductList'),
  {
    loading: () => <ProductListSkeleton />,
    ssr: false, // Important for MFE
  }
);

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <ProductList 
        onAddToCart={(item) => {
          // Cross-MFE communication
          window.dispatchEvent(new CustomEvent('cart:add', { detail: item }));
        }}
      />
    </div>
  );
}

// Shell - Dynamic remote loading with fallback
// lib/loadRemote.ts
export async function loadRemoteComponent(
  scope: string,
  module: string
) {
  try {
    // @ts-ignore - Dynamic federation
    await __webpack_init_sharing__('default');
    const container = window[scope];
    
    // @ts-ignore
    await container.init(__webpack_share_scopes__.default);
    // @ts-ignore
    const factory = await container.get(module);
    const Module = factory();
    
    return Module.default || Module;
  } catch (error) {
    console.error(\`Failed to load \${scope}/\${module}\`, error);
    return null;
  }
}

// Usage with error boundary
function RemoteWrapper({ scope, module, fallback, ...props }) {
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadRemoteComponent(scope, module)
      .then(setComponent)
      .catch(setError);
  }, [scope, module]);
  
  if (error) return fallback || <div>Failed to load component</div>;
  if (!Component) return <Skeleton />;
  
  return <Component {...props} />;
}

// Shared state across MFEs
// packages/shared-store/index.ts
import { create } from 'zustand';

export const useSharedStore = create((set) => ({
  user: null,
  cart: [],
  setUser: (user) => set({ user }),
  addToCart: (item) => set((s) => ({ 
    cart: [...s.cart, item] 
  })),
}));

// Each MFE imports from shared package
import { useSharedStore } from '@company/shared-store';`,
    tags: ['micro-frontends', 'module-federation', 'webpack', 'architecture'],
    timeEstimate: 8
  },
  {
    id: 'co-35',
    category: 'Code Organization',
    question: 'How do you implement micro-frontends with Single-SPA?',
    answer: `Single-SPA is a meta-framework for micro-frontends:

Features:
- Framework agnostic (React, Vue, Angular)
- Lifecycle management
- Routing integration
- Lazy loading

Concepts:
- Root config: Entry point
- Applications: MFEs with lifecycles
- Parcels: Reusable components
- Utility modules: Shared code`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// Root Config - index.html
<!DOCTYPE html>
<html>
  <head>
    <script type="systemjs-importmap">
      {
        "imports": {
          "single-spa": "https://cdn.jsdelivr.net/npm/single-spa/lib/system/single-spa.min.js",
          "react": "https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js",
          "react-dom": "https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js",
          "@company/root-config": "/root-config.js",
          "@company/navbar": "//localhost:8001/navbar.js",
          "@company/products": "//localhost:8002/products.js",
          "@company/checkout": "//localhost:8003/checkout.js"
        }
      }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/systemjs/dist/system.js"></script>
  </head>
  <body>
    <div id="navbar"></div>
    <main id="content"></main>
    <script>
      System.import('@company/root-config');
    </script>
  </body>
</html>

// Root Config - root-config.js
import { registerApplication, start } from 'single-spa';

// Register navbar (always active)
registerApplication({
  name: '@company/navbar',
  app: () => System.import('@company/navbar'),
  activeWhen: ['/'],
  customProps: {
    domElement: document.getElementById('navbar'),
  },
});

// Register products MFE
registerApplication({
  name: '@company/products',
  app: () => System.import('@company/products'),
  activeWhen: (location) => location.pathname.startsWith('/products'),
  customProps: {
    domElement: document.getElementById('content'),
  },
});

// Register checkout MFE
registerApplication({
  name: '@company/checkout',
  app: () => System.import('@company/checkout'),
  activeWhen: ['/checkout', '/cart'],
  customProps: {
    domElement: document.getElementById('content'),
  },
});

start();

// Products MFE - single-spa-react wrapper
// products/src/company-products.tsx
import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import { App } from './App';

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: App,
  errorBoundary(err, info, props) {
    return <div>Error loading products: {err.message}</div>;
  },
});

// Lifecycle functions
export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;

// Products MFE - App component
// products/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export function App({ customProps }) {
  return (
    <BrowserRouter basename="/products">
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

// Webpack config for MFE
// products/webpack.config.js
module.exports = {
  entry: './src/company-products.tsx',
  output: {
    filename: 'products.js',
    libraryTarget: 'system',
    publicPath: 'http://localhost:8002/',
  },
  externals: ['single-spa', 'react', 'react-dom'],
  // ...
};

// Cross-MFE communication with custom events
// In products MFE:
function ProductCard({ product }) {
  const addToCart = () => {
    window.dispatchEvent(
      new CustomEvent('add-to-cart', {
        detail: { product }
      })
    );
  };
  
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={addToCart}>Add to Cart</button>
    </div>
  );
}

// In checkout MFE - listen for events:
useEffect(() => {
  const handler = (event) => {
    addToCart(event.detail.product);
  };
  
  window.addEventListener('add-to-cart', handler);
  return () => window.removeEventListener('add-to-cart', handler);
}, []);

// Utility module for shared logic
// @company/utils
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}`,
    tags: ['micro-frontends', 'single-spa', 'architecture', 'scalability'],
    timeEstimate: 8
  },
  {
    id: 'co-36',
    category: 'Code Organization',
    question: 'How do you handle shared state and authentication across micro-frontends?',
    answer: `Cross-MFE state management challenges:

1. Authentication
   - Shared auth tokens
   - SSO integration
   - Session management

2. Shared State
   - Global store
   - Event-based communication
   - URL state

3. Patterns
   - Utility modules
   - Custom events
   - Shared context
   - Message bus`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// Shared Auth Module
// packages/auth/index.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
}

// Singleton store shared across MFEs
export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  
  login: async (credentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    const { user, token } = await response.json();
    
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
    
    // Notify other MFEs
    window.dispatchEvent(new CustomEvent('auth:login', { detail: { user } }));
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
    
    // Notify other MFEs
    window.dispatchEvent(new CustomEvent('auth:logout'));
  },
  
  getToken: () => get().token,
}));

// Auth listener hook for MFEs
export function useAuthListener() {
  const setUser = useAuth((s) => s.setUser);
  
  useEffect(() => {
    const handleLogin = (e: CustomEvent) => {
      setUser(e.detail.user);
    };
    
    const handleLogout = () => {
      setUser(null);
    };
    
    window.addEventListener('auth:login', handleLogin);
    window.addEventListener('auth:logout', handleLogout);
    
    return () => {
      window.removeEventListener('auth:login', handleLogin);
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);
}

// Shared API Client with auth
// packages/api-client/index.ts
import { useAuth } from '@company/auth';

const apiClient = {
  async fetch(url: string, options: RequestInit = {}) {
    const token = useAuth.getState().getToken();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        ...(token && { Authorization: \`Bearer \${token}\` }),
      },
    });
    
    if (response.status === 401) {
      useAuth.getState().logout();
      window.location.href = '/login';
    }
    
    return response;
  },
};

export { apiClient };

// Event Bus for complex communication
// packages/event-bus/index.ts
type EventCallback = (data: any) => void;

class EventBus {
  private events: Map<string, Set<EventCallback>> = new Map();
  
  subscribe(event: string, callback: EventCallback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
    
    return () => this.events.get(event)?.delete(callback);
  }
  
  publish(event: string, data: any) {
    this.events.get(event)?.forEach(callback => callback(data));
    
    // Also dispatch DOM event for cross-bundle communication
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
}

// Singleton instance
export const eventBus = new EventBus();

// Usage in different MFEs
// Products MFE
import { eventBus } from '@company/event-bus';

function ProductCard({ product }) {
  const handleAddToCart = () => {
    eventBus.publish('cart:add', {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };
  
  return <button onClick={handleAddToCart}>Add to Cart</button>;
}

// Cart MFE
import { eventBus } from '@company/event-bus';

function CartWidget() {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    const unsubscribe = eventBus.subscribe('cart:add', (item) => {
      setItems(prev => [...prev, item]);
    });
    
    return unsubscribe;
  }, []);
  
  return <span>Cart: {items.length} items</span>;
}

// Shared Design System
// packages/design-system/index.ts
export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';
export { theme } from './theme';

// Each MFE imports shared components
import { Button, Card } from '@company/design-system';`,
    tags: ['micro-frontends', 'authentication', 'state-management', 'event-bus'],
    timeEstimate: 7
  },
  {
    id: 'co-37',
    category: 'Code Organization',
    question: 'How do you create a design system documentation site?',
    answer: `Design system documentation approaches:

Tools:
- Storybook (component-focused)
- Docusaurus (documentation-focused)
- Custom Next.js site

Content:
- Design tokens
- Component API
- Usage guidelines
- Accessibility
- Code examples

Best practices:
- Live examples
- Copy-able code
- Version history
- Search functionality`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Design System Structure
packages/
├── design-system/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   └── Input/
│   │   ├── tokens/
│   │   │   ├── colors.ts
│   │   │   ├── spacing.ts
│   │   │   └── typography.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
└── design-system-docs/
    ├── .storybook/
    ├── docs/
    │   ├── getting-started.mdx
    │   ├── tokens/
    │   └── components/
    └── package.json

// Design Tokens Documentation
// docs/tokens/colors.mdx
import { Meta, ColorPalette, ColorItem } from '@storybook/blocks';
import { colors } from '@company/design-system';

<Meta title="Tokens/Colors" />

# Color Palette

Our color system is designed for accessibility and consistency.

## Brand Colors

<ColorPalette>
  <ColorItem
    title="Primary"
    subtitle="--color-primary"
    colors={{
      50: colors.primary[50],
      100: colors.primary[100],
      500: colors.primary[500],
      900: colors.primary[900],
    }}
  />
</ColorPalette>

## Semantic Colors

<ColorPalette>
  <ColorItem title="Success" colors={{ DEFAULT: colors.success }} />
  <ColorItem title="Warning" colors={{ DEFAULT: colors.warning }} />
  <ColorItem title="Error" colors={{ DEFAULT: colors.error }} />
</ColorPalette>

## Usage

\`\`\`css
.button-primary {
  background-color: var(--color-primary-500);
  color: var(--color-primary-50);
}
\`\`\`

---

// Component Documentation Page
// docs/components/Button.mdx
import { Meta, Canvas, Controls, Story, ArgTypes } from '@storybook/blocks';
import * as ButtonStories from '../../src/components/Button/Button.stories';

<Meta of={ButtonStories} />

# Button

Buttons trigger actions when clicked.

## Installation

\`\`\`bash
npm install @company/design-system
\`\`\`

## Import

\`\`\`tsx
import { Button } from '@company/design-system';
\`\`\`

## Examples

### Default

<Canvas of={ButtonStories.Primary} />

### With Icon

<Canvas of={ButtonStories.WithIcon} />

## API Reference

<ArgTypes of={ButtonStories} />

## Accessibility

- Uses native \`<button>\` element
- Supports \`aria-label\` for icon-only buttons
- Focus visible states included
- Meets WCAG 2.1 AA contrast requirements

## Design Guidelines

### When to use

- Triggering an action (submit, save, delete)
- Navigating to a new page or view
- Opening a modal or dialog

### When not to use

- For navigation links (use \`Link\` component)
- For toggles (use \`Switch\` component)

## Figma

[View in Figma](https://figma.com/file/xxx)

---

// Storybook manager for navigation
// .storybook/manager.ts
import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: {
    ...themes.light,
    brandTitle: 'Company Design System',
    brandUrl: 'https://design.company.com',
    brandImage: '/logo.svg',
  },
  sidebar: {
    showRoots: true,
  },
});

// Custom theme
// .storybook/theme.ts
import { create } from '@storybook/theming/create';

export default create({
  base: 'light',
  brandTitle: 'Design System',
  brandUrl: '/',
  
  colorPrimary: '#3b82f6',
  colorSecondary: '#6366f1',
  
  // UI
  appBg: '#f8fafc',
  appContentBg: '#ffffff',
  appBorderColor: '#e2e8f0',
  appBorderRadius: 8,
  
  // Typography
  fontBase: '"Inter", sans-serif',
  fontCode: '"Fira Code", monospace',
  
  // Text colors
  textColor: '#1e293b',
  textInverseColor: '#f8fafc',
});`,
    tags: ['design-system', 'documentation', 'storybook', 'tokens'],
    timeEstimate: 6
  },
  {
    id: 'co-38',
    category: 'Code Organization',
    question: 'How do you document APIs and generate documentation automatically?',
    answer: `API documentation approaches:

1. OpenAPI/Swagger
   - Industry standard
   - Auto-generate from code
   - Interactive testing

2. TypeDoc
   - TypeScript documentation
   - JSDoc comments
   - Auto-generated

3. Docusaurus/GitBook
   - Manual documentation
   - Markdown-based
   - Versioning

Best practices:
- Keep docs close to code
- Auto-generate when possible
- Include examples
- Version documentation`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// OpenAPI with Next.js API Routes
// lib/swagger.ts
import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  return createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'My API',
        version: '1.0.0',
        description: 'API documentation for My App',
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Development' },
        { url: 'https://api.myapp.com', description: 'Production' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });
};

// API Route with JSDoc annotations
// app/api/users/route.ts
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 meta:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Unauthorized
 */
export async function GET(request: Request) {
  // Implementation
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 */
export async function POST(request: Request) {
  // Implementation
}

// Swagger UI page
// app/api-docs/page.tsx
import { getApiDocs } from '@/lib/swagger';
import ReactSwagger from './ReactSwagger';

export default async function ApiDocs() {
  const spec = await getApiDocs();
  return <ReactSwagger spec={spec} />;
}

// TypeDoc for library documentation
// typedoc.json
{
  "entryPoints": ["./src/index.ts"],
  "out": "docs",
  "name": "@company/ui",
  "readme": "./README.md",
  "plugin": ["typedoc-plugin-markdown"],
  "excludePrivate": true,
  "excludeProtected": true
}

// Well-documented function
/**
 * Formats a date according to the specified format string.
 * 
 * @param date - The date to format (Date object or ISO string)
 * @param formatStr - The format pattern (default: 'PPP')
 * @returns The formatted date string
 * 
 * @example
 * \`\`\`ts
 * formatDate(new Date(), 'yyyy-MM-dd')
 * // Returns: "2024-01-15"
 * 
 * formatDate('2024-01-15T10:30:00Z', 'PPP')
 * // Returns: "January 15th, 2024"
 * \`\`\`
 * 
 * @see {@link https://date-fns.org/docs/format} for format patterns
 * @throws {Error} If the date is invalid
 */
export function formatDate(
  date: Date | string,
  formatStr: string = 'PPP'
): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }
  
  return format(d, formatStr);
}

// package.json scripts
{
  "scripts": {
    "docs": "typedoc",
    "docs:watch": "typedoc --watch"
  }
}`,
    tags: ['documentation', 'openapi', 'swagger', 'typedoc'],
    timeEstimate: 6
  },
  {
    id: 'co-39',
    category: 'Code Organization',
    question: 'How do you handle CSS isolation in micro-frontends?',
    answer: `CSS isolation strategies for micro-frontends:

Challenges:
- Style conflicts
- Specificity wars
- Global styles leaking

Solutions:
1. CSS Modules
2. CSS-in-JS with unique prefixes
3. Shadow DOM
4. Naming conventions (BEM)
5. PostCSS prefixing

Best practices:
- Scope all styles
- Use design tokens
- Avoid !important
- Test in isolation and together`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// 1. CSS Modules - Automatic scoping
// Button.module.css
.button {
  padding: 8px 16px;
  border-radius: 4px;
}

.primary {
  background: var(--color-primary);
  color: white;
}

// Button.tsx
import styles from './Button.module.css';

function Button({ variant = 'primary', children }) {
  return (
    <button className={\`\${styles.button} \${styles[variant]}\`}>
      {children}
    </button>
  );
}

// 2. CSS-in-JS with prefixed class names
// styled-components configuration
import { StyleSheetManager } from 'styled-components';

function ProductsMFE() {
  return (
    <StyleSheetManager 
      namespace="products"  // Prefix all generated classes
      disableVendorPrefixes
    >
      <App />
    </StyleSheetManager>
  );
}

// Generated: .products_Button-abc123

// 3. PostCSS prefix plugin
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-prefix-selector')({
      prefix: '[data-mfe="products"]',
      transform: (prefix, selector) => {
        // Don't prefix :root or html selectors
        if (selector.match(/^(html|:root)/)) {
          return selector;
        }
        return \`\${prefix} \${selector}\`;
      },
    }),
  ],
};

// Wrap MFE root
function ProductsMFE() {
  return (
    <div data-mfe="products">
      <App />
    </div>
  );
}

// 4. Shadow DOM encapsulation
// WebComponent wrapper for React MFE
class ProductsMFE extends HTMLElement {
  private root: Root | null = null;
  
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    
    // Inject styles into shadow DOM
    const style = document.createElement('style');
    style.textContent = cssStyles; // Bundled CSS
    shadow.appendChild(style);
    
    const container = document.createElement('div');
    shadow.appendChild(container);
    
    this.root = createRoot(container);
    this.root.render(<App />);
  }
  
  disconnectedCallback() {
    this.root?.unmount();
  }
}

customElements.define('products-mfe', ProductsMFE);

// 5. BEM naming convention with MFE prefix
// products-mfe/styles.css
.products-button {
  /* Base styles */
}

.products-button--primary {
  /* Variant */
}

.products-button__icon {
  /* Element */
}

.products-card {
  /* Another component */
}

// 6. Tailwind with prefix
// tailwind.config.js (Products MFE)
module.exports = {
  prefix: 'products-',
  // ...
};

// Usage
<button className="products-bg-blue-500 products-text-white">
  Add to Cart
</button>

// 7. Shared design tokens across MFEs
// packages/tokens/index.css
:root {
  /* Colors */
  --ds-color-primary-50: #eff6ff;
  --ds-color-primary-500: #3b82f6;
  --ds-color-primary-900: #1e3a8a;
  
  /* Spacing */
  --ds-space-1: 4px;
  --ds-space-2: 8px;
  --ds-space-4: 16px;
  
  /* Typography */
  --ds-font-sans: 'Inter', sans-serif;
  --ds-font-size-sm: 0.875rem;
  --ds-font-size-base: 1rem;
}

// Each MFE uses tokens
// products-mfe/styles.css
.products-button {
  background: var(--ds-color-primary-500);
  padding: var(--ds-space-2) var(--ds-space-4);
  font-family: var(--ds-font-sans);
}`,
    tags: ['micro-frontends', 'css', 'isolation', 'styling'],
    timeEstimate: 6
  },
  {
    id: 'co-40',
    category: 'Code Organization',
    question: 'What are the challenges and best practices for testing micro-frontends?',
    answer: `Micro-frontend testing challenges:

Levels:
1. Unit tests (per MFE)
2. Integration tests (MFE boundaries)
3. E2E tests (full application)

Challenges:
- Cross-MFE interactions
- Mocking remote modules
- Consistent environments
- Contract testing

Best practices:
- Test in isolation first
- Contract tests for APIs
- Shared test utilities
- Visual regression testing`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// 1. Unit Testing within MFE
// products-mfe/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
  };
  
  it('renders product information', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });
  
  it('emits add to cart event', () => {
    const onAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
    
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    
    expect(onAddToCart).toHaveBeenCalledWith({
      productId: '1',
      quantity: 1,
    });
  });
});

// 2. Mocking cross-MFE communication
// products-mfe/tests/mocks/eventBus.ts
export const mockEventBus = {
  publish: jest.fn(),
  subscribe: jest.fn(() => jest.fn()), // Returns unsubscribe
};

jest.mock('@company/event-bus', () => ({
  eventBus: mockEventBus,
}));

// Test with mock
it('publishes cart event to event bus', () => {
  render(<ProductCard product={mockProduct} />);
  
  fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
  
  expect(mockEventBus.publish).toHaveBeenCalledWith('cart:add', {
    productId: '1',
    name: 'Test Product',
    price: 99.99,
    quantity: 1,
  });
});

// 3. Contract Testing with Pact
// products-mfe/tests/contracts/products.pact.ts
import { Pact } from '@pact-foundation/pact';

const provider = new Pact({
  consumer: 'ProductsMFE',
  provider: 'ProductsAPI',
});

describe('Products API Contract', () => {
  beforeAll(() => provider.setup());
  afterAll(() => provider.finalize());
  afterEach(() => provider.verify());
  
  it('returns products list', async () => {
    await provider.addInteraction({
      state: 'products exist',
      uponReceiving: 'a request for products',
      withRequest: {
        method: 'GET',
        path: '/api/products',
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          data: [
            {
              id: '1',
              name: 'Product 1',
              price: 99.99,
            },
          ],
        },
      },
    });
    
    const products = await fetchProducts();
    expect(products).toHaveLength(1);
  });
});

// 4. Integration Testing MFE boundaries
// shell/tests/integration/mfe-loading.test.ts
import { render, screen, waitFor } from '@testing-library/react';
import { Shell } from '../Shell';

// Mock remote modules
jest.mock('products/ProductList', () => ({
  __esModule: true,
  default: () => <div data-testid="products-mfe">Products MFE</div>,
}));

describe('Shell MFE Integration', () => {
  it('loads products MFE on /products route', async () => {
    render(<Shell initialRoute="/products" />);
    
    await waitFor(() => {
      expect(screen.getByTestId('products-mfe')).toBeInTheDocument();
    });
  });
  
  it('handles MFE load failure gracefully', async () => {
    // Mock load failure
    jest.mock('products/ProductList', () => {
      throw new Error('Failed to load');
    });
    
    render(<Shell initialRoute="/products" />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });
});

// 5. E2E Testing with Playwright
// e2e/cross-mfe-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Cross-MFE User Flow', () => {
  test('user can add product to cart and checkout', async ({ page }) => {
    // Start on products page (Products MFE)
    await page.goto('/products');
    
    // Find and click add to cart
    await page.click('[data-testid="product-card-1"] button');
    
    // Verify cart badge updated (Shell MFE)
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1');
    
    // Navigate to cart (Checkout MFE)
    await page.click('[data-testid="cart-icon"]');
    await expect(page).toHaveURL('/cart');
    
    // Verify product in cart
    await expect(page.locator('[data-testid="cart-item-1"]')).toBeVisible();
    
    // Proceed to checkout
    await page.click('text=Checkout');
    await expect(page).toHaveURL('/checkout');
  });
});

// 6. Visual Regression Testing
// Run Chromatic on each MFE
// .github/workflows/visual-test.yml
jobs:
  chromatic:
    strategy:
      matrix:
        mfe: [shell, products, checkout]
    steps:
      - run: cd packages/\${{ matrix.mfe }} && npm run chromatic`,
    tags: ['micro-frontends', 'testing', 'contract-testing', 'e2e'],
    timeEstimate: 7
  }
];

