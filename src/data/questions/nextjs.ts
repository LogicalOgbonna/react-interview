import { Question } from '../types';

export const nextjsQuestions: Question[] = [
  {
    id: 'next-1',
    category: 'Next.js',
    question: 'What is Next.js and what are its major features?',
    answer: `Next.js is a React framework that enables server-side rendering and static site generation. Created by Vercel, it provides a complete solution for production React applications.

Major features:
- Server-Side Rendering (SSR) and Static Site Generation (SSG)
- App Router with React Server Components
- File-based routing
- API routes
- Image optimization
- Built-in CSS and Sass support
- TypeScript support
- Fast Refresh
- Middleware
- Incremental Static Regeneration (ISR)`,
    difficulty: 'beginner',
    type: 'conceptual',
    tags: ['next.js', 'fundamentals', 'ssr'],
    timeEstimate: 3
  },
  {
    id: 'next-2',
    category: 'Next.js',
    question: 'Explain the differences between Page Router and App Router.',
    answer: `Page Router (pages/):
- Original routing system
- File = route (pages/about.js → /about)
- getServerSideProps, getStaticProps for data
- _app.js and _document.js for layouts
- API routes in pages/api/

App Router (app/):
- Introduced in Next.js 13
- React Server Components by default
- Nested layouts with layout.js
- Loading UI with loading.js
- Error handling with error.js
- Parallel routes and intercepting routes
- Server Actions for mutations
- Better streaming and Suspense support

App Router is the recommended approach for new projects.`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Page Router (pages/about.js)
export default function About() {
  return <h1>About</h1>;
}

export async function getServerSideProps() {
  const data = await fetchData();
  return { props: { data } };
}

// App Router (app/about/page.tsx)
export default async function About() {
  const data = await fetchData(); // Direct fetch in component
  return <h1>About: {data.title}</h1>;
}`,
    tags: ['next.js', 'routing', 'app-router', 'pages-router'],
    timeEstimate: 5
  },
  {
    id: 'next-3',
    category: 'Next.js',
    question: 'Explain the difference between SSR, SSG, and ISR in Next.js.',
    answer: `SSR (Server-Side Rendering):
- Page generated on each request
- Always fresh data
- Slower TTFB, higher server load
- Use for: personalized content, frequently updated data

SSG (Static Site Generation):
- Page generated at build time
- Fastest performance
- Data can become stale
- Use for: marketing pages, docs, blogs

ISR (Incremental Static Regeneration):
- Static page with background regeneration
- Best of both: fast + relatively fresh
- Revalidates after specified interval
- Use for: e-commerce, news sites

CSR (Client-Side Rendering):
- Page shell is static, data fetched on client
- Use for: dashboards, authenticated content`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// SSR - Page Router
export async function getServerSideProps() {
  const data = await fetchData();
  return { props: { data } };
}

// SSG - Page Router
export async function getStaticProps() {
  const data = await fetchData();
  return { props: { data } };
}

// ISR - Page Router
export async function getStaticProps() {
  const data = await fetchData();
  return { 
    props: { data },
    revalidate: 60 // Regenerate every 60 seconds
  };
}

// App Router equivalents
// SSG (default)
async function Page() {
  const data = await fetch(url, { cache: 'force-cache' });
}

// SSR
async function Page() {
  const data = await fetch(url, { cache: 'no-store' });
}

// ISR
async function Page() {
  const data = await fetch(url, { next: { revalidate: 60 } });
}`,
    tags: ['next.js', 'ssr', 'ssg', 'isr', 'rendering'],
    timeEstimate: 6
  },
  {
    id: 'next-4',
    category: 'Next.js',
    question: 'What are React Server Components and how do they work in Next.js?',
    answer: `React Server Components (RSC) are components that render exclusively on the server. In Next.js App Router, all components are Server Components by default.

Characteristics:
- No JavaScript sent to client for RSC
- Can directly access databases, filesystems
- Cannot use hooks or browser APIs
- Cannot use event handlers
- Can be async functions

Benefits:
- Smaller bundle sizes
- Direct backend access
- Improved initial page load
- Better SEO

To make a Client Component, add 'use client' directive.`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Server Component (default)
// app/products/page.tsx
import { db } from '@/lib/db';

export default async function ProductsPage() {
  // Direct database query - never exposed to client
  const products = await db.product.findMany();
  
  return (
    <div>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

// Client Component
// app/components/AddToCart.tsx
'use client';

import { useState } from 'react';

export default function AddToCart({ productId }) {
  const [quantity, setQuantity] = useState(1);
  
  return (
    <button onClick={() => addToCart(productId, quantity)}>
      Add to Cart
    </button>
  );
}`,
    tags: ['next.js', 'rsc', 'server-components', 'app-router'],
    timeEstimate: 5
  },
  {
    id: 'next-5',
    category: 'Next.js',
    question: 'What are Server Actions in Next.js and how do you use them?',
    answer: `Server Actions are async functions that run on the server. They can be called directly from Client Components for mutations, eliminating the need for API routes.

Key features:
- Progressive enhancement (work without JavaScript)
- Integrated with React's form handling
- Automatic request handling
- Type-safe with TypeScript
- Can revalidate data and redirect

Usage:
- Define with 'use server' directive
- Can be in separate files or inline in Server Components
- Call from forms or event handlers`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  await db.post.create({ data: { title, content } });
  
  revalidatePath('/posts');
  redirect('/posts');
}

// app/posts/new/page.tsx
import { createPost } from '@/app/actions';

export default function NewPost() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Title" required />
      <textarea name="content" placeholder="Content" />
      <button type="submit">Create Post</button>
    </form>
  );
}

// Client Component usage
'use client';
import { createPost } from '@/app/actions';

function CreateButton() {
  const handleClick = async () => {
    await createPost(new FormData());
  };
  
  return <button onClick={handleClick}>Create</button>;
}`,
    tags: ['next.js', 'server-actions', 'mutations', 'forms'],
    timeEstimate: 5
  },
  {
    id: 'next-6',
    category: 'Next.js',
    question: 'How does routing work in the Next.js App Router?',
    answer: `App Router uses file-system based routing with special file conventions:

File conventions:
- page.tsx: UI unique to a route (required for route to be accessible)
- layout.tsx: Shared UI that wraps children
- loading.tsx: Loading UI (uses Suspense)
- error.tsx: Error UI (uses Error Boundary)
- not-found.tsx: 404 UI
- route.ts: API endpoint

Route types:
- Static routes: app/about/page.tsx → /about
- Dynamic routes: app/posts/[id]/page.tsx → /posts/123
- Catch-all: app/docs/[...slug]/page.tsx → /docs/a/b/c
- Optional catch-all: app/[[...slug]]/page.tsx
- Route groups: (group)/page.tsx (doesn't affect URL)
- Parallel routes: @modal/page.tsx`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// app/blog/[slug]/page.tsx
interface Props {
  params: { slug: string };
}

export default function BlogPost({ params }: Props) {
  return <h1>Post: {params.slug}</h1>;
}

// Generate static paths
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({ slug: post.slug }));
}

// Dynamic metadata
export async function generateMetadata({ params }: Props) {
  const post = await getPost(params.slug);
  return { title: post.title };
}

// Layout that persists across child routes
// app/blog/layout.tsx
export default function BlogLayout({ children }) {
  return (
    <div className="blog-layout">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}`,
    tags: ['next.js', 'routing', 'app-router', 'file-system'],
    timeEstimate: 6
  },
  {
    id: 'next-7',
    category: 'Next.js',
    question: 'How does data fetching work in Next.js App Router?',
    answer: `In App Router, data fetching is simplified with async Server Components and the extended fetch API.

Fetch options:
- cache: 'force-cache' (default) - SSG behavior
- cache: 'no-store' - SSR behavior  
- next: { revalidate: 60 } - ISR behavior
- next: { tags: ['posts'] } - On-demand revalidation

Patterns:
- Parallel fetching with Promise.all
- Sequential fetching when data depends on previous
- Streaming with Suspense for better UX

Request deduplication: Same fetch calls are automatically deduped.`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Parallel data fetching
async function Dashboard() {
  // These run in parallel
  const [user, posts, analytics] = await Promise.all([
    getUser(),
    getPosts(),
    getAnalytics()
  ]);
  
  return <div>...</div>;
}

// Sequential (when data depends on previous)
async function UserPosts({ userId }) {
  const user = await getUser(userId);
  const posts = await getPostsByAuthor(user.id); // Needs user first
  
  return <div>...</div>;
}

// Streaming with Suspense
export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<Loading />}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}

// On-demand revalidation
import { revalidateTag, revalidatePath } from 'next/cache';

async function updatePost() {
  await db.post.update(...);
  revalidateTag('posts');
  // or
  revalidatePath('/posts');
}`,
    tags: ['next.js', 'data-fetching', 'caching', 'suspense'],
    timeEstimate: 6
  },
  {
    id: 'next-8',
    category: 'Next.js',
    question: 'What is Next.js Middleware and how do you use it?',
    answer: `Middleware allows you to run code before a request is completed. It runs on the Edge Runtime (V8 isolates), making it fast and lightweight.

Use cases:
- Authentication/Authorization
- Redirects based on conditions
- A/B testing
- Internationalization
- Bot protection
- Request/Response modification

Middleware runs for every route. Use matcher to limit scope.
Location: middleware.ts in project root.`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check authentication
  const token = request.cookies.get('token');
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Add headers
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'my-value');
  
  // Rewrite URL (internal redirect)
  if (request.nextUrl.pathname === '/old-path') {
    return NextResponse.rewrite(new URL('/new-path', request.url));
  }
  
  return response;
}

// Configure which routes middleware runs on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
    '/((?!_next/static|favicon.ico).*)'
  ]
};`,
    tags: ['next.js', 'middleware', 'edge', 'authentication'],
    timeEstimate: 5
  },
  {
    id: 'next-9',
    category: 'Next.js',
    question: 'How do you optimize images in Next.js?',
    answer: `Next.js provides the Image component for automatic image optimization:

Features:
- Automatic format conversion (WebP, AVIF)
- Responsive images with srcset
- Lazy loading by default
- Prevents Cumulative Layout Shift (CLS)
- On-demand optimization
- Blur placeholder support

Configuration in next.config.js for external domains.
For static images, import them for automatic dimensions.`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `import Image from 'next/image';
import profilePic from './profile.jpg';

// Static import - dimensions auto-detected
function Avatar() {
  return (
    <Image
      src={profilePic}
      alt="Profile"
      placeholder="blur" // Auto blur placeholder
    />
  );
}

// Remote image - must specify dimensions
function RemoteImage() {
  return (
    <Image
      src="https://example.com/image.jpg"
      alt="Remote"
      width={500}
      height={300}
      priority // Disable lazy loading for LCP
    />
  );
}

// Responsive image
function ResponsiveImage() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      fill // Takes parent dimensions
      sizes="(max-width: 768px) 100vw, 50vw"
      style={{ objectFit: 'cover' }}
    />
  );
}

// next.config.js - allow external domains
module.exports = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'example.com' }
    ]
  }
};`,
    tags: ['next.js', 'images', 'optimization', 'performance'],
    timeEstimate: 4
  },
  {
    id: 'next-10',
    category: 'Next.js',
    question: 'How do you handle authentication in Next.js?',
    answer: `Common authentication patterns in Next.js:

1. Session-based (cookies)
   - Use next-auth (Auth.js) or similar
   - Store session in HTTP-only cookies
   - Validate in middleware or server components

2. JWT-based
   - Store token in HTTP-only cookie (preferred) or localStorage
   - Validate on server for protected routes

3. Third-party providers
   - OAuth with next-auth
   - Clerk, Auth0, Supabase Auth

Key considerations:
- Use middleware for route protection
- Server Components for secure data access
- Never expose secrets to client`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Using next-auth (Auth.js)
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
});

export const { GET, POST } = handlers;

// middleware.ts
import { auth } from '@/auth';

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/login', req.url));
  }
});

// Server Component
import { auth } from '@/auth';

async function Dashboard() {
  const session = await auth();
  if (!session) redirect('/login');
  
  return <div>Welcome {session.user.name}</div>;
}

// Client Component
'use client';
import { useSession, signIn, signOut } from 'next-auth/react';

function AuthButton() {
  const { data: session } = useSession();
  
  if (session) {
    return <button onClick={() => signOut()}>Sign out</button>;
  }
  return <button onClick={() => signIn()}>Sign in</button>;
}`,
    tags: ['next.js', 'authentication', 'security', 'middleware'],
    timeEstimate: 6
  },
  {
    id: 'next-11',
    category: 'Next.js',
    question: 'Explain streaming and Suspense in Next.js App Router.',
    answer: `Streaming allows you to progressively render UI, sending parts of the page as they become ready instead of waiting for all data.

Benefits:
- Faster Time to First Byte (TTFB)
- Better perceived performance
- Progressive loading experience
- Parallel data fetching

Implementation:
- Wrap slow components in Suspense
- Use loading.tsx for route-level loading UI
- Stream with generateStaticParams for static routes

Works automatically with Server Components.`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Route-level loading (automatic Suspense)
// app/dashboard/loading.tsx
export default function Loading() {
  return <DashboardSkeleton />;
}

// Component-level Suspense
// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Shows immediately */}
      <StaticContent />
      
      {/* Streams when ready */}
      <Suspense fallback={<ChartSkeleton />}>
        <SlowChart />
      </Suspense>
      
      <Suspense fallback={<ListSkeleton />}>
        <SlowList />
      </Suspense>
    </div>
  );
}

// These components can be async
async function SlowChart() {
  const data = await fetchChartData(); // 3 second fetch
  return <Chart data={data} />;
}

async function SlowList() {
  const items = await fetchItems(); // 2 second fetch
  return <List items={items} />;
}`,
    tags: ['next.js', 'streaming', 'suspense', 'performance'],
    timeEstimate: 5
  },
  {
    id: 'next-12',
    category: 'Next.js',
    question: 'How do you handle SEO and metadata in Next.js App Router?',
    answer: `Next.js App Router provides a Metadata API for managing SEO:

Static metadata:
- Export metadata object from layout/page

Dynamic metadata:
- Export generateMetadata async function
- Access params and searchParams

Special files:
- opengraph-image.tsx - OG images
- twitter-image.tsx - Twitter cards
- sitemap.ts - Dynamic sitemap
- robots.ts - Robots.txt

Metadata is automatically merged from layouts to pages.`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Static metadata
// app/layout.tsx
export const metadata = {
  title: {
    default: 'My App',
    template: '%s | My App'
  },
  description: 'My awesome application',
  openGraph: {
    title: 'My App',
    description: 'My awesome application',
    url: 'https://myapp.com',
    siteName: 'My App',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  }
};

// Dynamic metadata
// app/posts/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      images: [post.image],
    }
  };
}

// Dynamic sitemap
// app/sitemap.ts
export default async function sitemap() {
  const posts = await getPosts();
  
  return [
    { url: 'https://myapp.com', lastModified: new Date() },
    ...posts.map(post => ({
      url: \`https://myapp.com/posts/\${post.slug}\`,
      lastModified: post.updatedAt
    }))
  ];
}`,
    tags: ['next.js', 'seo', 'metadata', 'opengraph'],
    timeEstimate: 4
  },
  {
    id: 'next-13',
    category: 'Next.js',
    question: 'What are Route Handlers in Next.js and how do they work?',
    answer: `Route Handlers are Next.js's way of creating API endpoints in the App Router. They replace API Routes from the Pages Router.

Features:
- HTTP method exports (GET, POST, PUT, DELETE, etc.)
- Support streaming responses
- Edge and Node.js runtime support
- Automatic request/response handling
- Built-in caching for GET requests

Location: app/api/[route]/route.ts`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') ?? '1';
  
  const users = await db.user.findMany({
    skip: (parseInt(page) - 1) * 10,
    take: 10
  });
  
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const user = await db.user.create({
    data: body
  });
  
  return NextResponse.json(user, { status: 201 });
}

// Dynamic route: app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await db.user.findUnique({
    where: { id: params.id }
  });
  
  if (!user) {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(user);
}`,
    tags: ['next.js', 'api', 'route-handlers'],
    timeEstimate: 4
  },
  {
    id: 'next-14',
    category: 'Next.js',
    question: 'What is the difference between cookies() and headers() in Next.js?',
    answer: `Both are server-only functions for accessing request information, but serve different purposes:

cookies():
- Read and set cookies
- Mutable in Server Actions and Route Handlers
- Read-only in Server Components
- Used for authentication, preferences

headers():
- Read HTTP headers
- Immutable (read-only)
- Access User-Agent, Accept-Language, etc.
- Used for content negotiation, localization`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `import { cookies, headers } from 'next/headers';

// Server Component - reading
async function ServerComponent() {
  const cookieStore = cookies();
  const theme = cookieStore.get('theme')?.value;
  
  const headersList = headers();
  const userAgent = headersList.get('user-agent');
  const language = headersList.get('accept-language');
  
  return (
    <div data-theme={theme}>
      User Agent: {userAgent}
    </div>
  );
}

// Server Action - setting cookies
async function setTheme(formData: FormData) {
  'use server';
  
  const theme = formData.get('theme') as string;
  
  cookies().set('theme', theme, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 365 // 1 year
  });
}

// Route Handler
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  response.cookies.set('session', token, {
    httpOnly: true,
    secure: true
  });
  
  return response;
}`,
    tags: ['next.js', 'cookies', 'headers', 'server'],
    timeEstimate: 4
  },
  {
    id: 'next-15',
    category: 'Next.js',
    question: 'How do you implement authentication in Next.js App Router?',
    answer: `Authentication in Next.js App Router typically involves:

1. Session management (cookies/JWT)
2. Middleware for route protection
3. Server-side validation
4. Auth providers (NextAuth.js, Clerk, Auth0)

Key considerations:
- Server Components can access session directly
- Client Components need context/hooks
- Middleware runs on Edge runtime
- Use httpOnly cookies for security`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*']
};

// lib/auth.ts
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function getSession() {
  const token = cookies().get('session')?.value;
  if (!token) return null;
  
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

// Server Component usage
async function DashboardPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  return <Dashboard user={session.user} />;
}

// Server Action for login
async function login(formData: FormData) {
  'use server';
  
  const email = formData.get('email');
  const password = formData.get('password');
  
  const user = await validateCredentials(email, password);
  if (!user) throw new Error('Invalid credentials');
  
  const token = await createToken(user);
  
  cookies().set('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax'
  });
  
  redirect('/dashboard');
}`,
    tags: ['next.js', 'authentication', 'middleware', 'security'],
    timeEstimate: 6
  },
  {
    id: 'next-16',
    category: 'Next.js',
    question: 'What are Parallel Routes in Next.js?',
    answer: `Parallel Routes allow rendering multiple pages in the same layout simultaneously using named slots. They enable:

- Split views (dashboard + settings)
- Modals that preserve context
- Conditional rendering based on route
- Independent loading/error states per slot

Slots are defined with @folder convention and passed as props to layout.`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Folder structure
app/
  @dashboard/
    page.tsx
    loading.tsx
  @analytics/
    page.tsx
    loading.tsx
  layout.tsx
  page.tsx

// app/layout.tsx
export default function Layout({
  children,
  dashboard,
  analytics
}: {
  children: React.ReactNode;
  dashboard: React.ReactNode;
  analytics: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2">
      <div>{dashboard}</div>
      <div>{analytics}</div>
      <div className="col-span-2">{children}</div>
    </div>
  );
}

// Modal example with parallel routes
app/
  @modal/
    (.)photo/[id]/
      page.tsx  // Intercepted modal view
    default.tsx  // Renders null when no modal
  photo/[id]/
    page.tsx    // Full page view
  layout.tsx
  page.tsx

// app/layout.tsx
export default function Layout({
  children,
  modal
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}`,
    tags: ['next.js', 'parallel-routes', 'layouts', 'routing'],
    timeEstimate: 5
  },
  {
    id: 'next-17',
    category: 'Next.js',
    question: 'What are Intercepting Routes in Next.js?',
    answer: `Intercepting Routes allow loading a route within the current layout while showing a different URL. Common for modals that can also be accessed directly.

Convention:
- (.) - Same level
- (..) - One level up
- (..)(..) - Two levels up
- (...) - Root level

Use cases:
- Photo modals (like Instagram)
- Login modals
- Quick previews
- Cart overlays`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Structure for Instagram-like photo modal
app/
  feed/
    page.tsx
  photo/[id]/
    page.tsx           // Full page: /photo/123
  @modal/
    (.)photo/[id]/
      page.tsx         // Modal: intercepts /photo/123 from feed
    default.tsx

// feed/page.tsx
export default function Feed() {
  return (
    <div>
      {photos.map(photo => (
        <Link href={\`/photo/\${photo.id}\`} key={photo.id}>
          <Image src={photo.thumbnail} alt="" />
        </Link>
      ))}
    </div>
  );
}

// @modal/(.)photo/[id]/page.tsx
export default function PhotoModal({ 
  params 
}: { 
  params: { id: string } 
}) {
  const photo = await getPhoto(params.id);
  
  return (
    <Modal>
      <Image src={photo.url} alt="" />
      <p>{photo.description}</p>
    </Modal>
  );
}

// photo/[id]/page.tsx (direct access)
export default function PhotoPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const photo = await getPhoto(params.id);
  
  return (
    <div className="full-page-photo">
      <Image src={photo.url} alt="" />
      <Comments photoId={params.id} />
    </div>
  );
}`,
    tags: ['next.js', 'intercepting-routes', 'modals', 'routing'],
    timeEstimate: 5
  },
  {
    id: 'next-18',
    category: 'Next.js',
    question: 'How do you optimize images in Next.js?',
    answer: `Next.js provides an Image component with automatic optimization:

Features:
- Automatic WebP/AVIF conversion
- Lazy loading by default
- Responsive sizing
- Blur placeholder support
- Priority loading for LCP
- Remote image configuration

Best practices:
- Use priority for above-fold images
- Specify width/height or fill
- Use sizes prop for responsive
- Configure remote patterns`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `import Image from 'next/image';

// Basic usage
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // Load immediately for LCP
/>

// Fill container
<div className="relative h-64 w-full">
  <Image
    src="/background.jpg"
    alt="Background"
    fill
    style={{ objectFit: 'cover' }}
  />
</div>

// Responsive with sizes
<Image
  src="/product.jpg"
  alt="Product"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// With blur placeholder
<Image
  src="/photo.jpg"
  alt="Photo"
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// next.config.js for remote images
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
        pathname: '/images/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};`,
    tags: ['next.js', 'images', 'optimization', 'performance'],
    timeEstimate: 4
  },
  {
    id: 'next-19',
    category: 'Next.js',
    question: 'What is the Link component and how does prefetching work?',
    answer: `Next.js Link component enables client-side navigation with automatic prefetching.

Prefetching behavior:
- Production: Prefetches when link enters viewport
- Development: Prefetches on hover
- Static routes: Full prefetch
- Dynamic routes: Partial prefetch (shared layout)

Options:
- prefetch={false} - Disable prefetching
- scroll={false} - Preserve scroll position
- replace - Replace history instead of push`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `import Link from 'next/link';

// Basic usage
<Link href="/about">About</Link>

// With dynamic route
<Link href={\`/posts/\${post.slug}\`}>
  {post.title}
</Link>

// Object href (query params)
<Link
  href={{
    pathname: '/search',
    query: { q: 'react' },
  }}
>
  Search React
</Link>

// Disable prefetching
<Link href="/heavy-page" prefetch={false}>
  Heavy Page
</Link>

// Preserve scroll position
<Link href="/page#section" scroll={false}>
  Go to Section
</Link>

// Replace history
<Link href="/new-page" replace>
  Replace Current Page
</Link>

// With child component
<Link href="/profile" passHref legacyBehavior>
  <a className="custom-link">Profile</a>
</Link>

// Programmatic navigation
'use client';
import { useRouter } from 'next/navigation';

function NavigateButton() {
  const router = useRouter();
  
  return (
    <button onClick={() => router.push('/dashboard')}>
      Go to Dashboard
    </button>
  );
}`,
    tags: ['next.js', 'link', 'navigation', 'prefetching'],
    timeEstimate: 3
  },
  {
    id: 'next-20',
    category: 'Next.js',
    question: 'How do you implement internationalization (i18n) in Next.js?',
    answer: `Next.js supports i18n through various approaches:

App Router approach:
- Middleware for locale detection
- Dynamic route segments [lang]
- Server Components for translations

Key considerations:
- URL structure (/en/about vs subdomain)
- Default locale handling
- Language detection (Accept-Language, cookies)
- Static generation per locale`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'fr', 'de'];
const defaultLocale = 'en';

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language');
  // Parse and match to supported locales
  return matchLocale(acceptLanguage, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if pathname has locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(\`/\${locale}/\`) || pathname === \`/\${locale}\`
  );
  
  if (pathnameHasLocale) return;
  
  // Redirect to locale path
  const locale = getLocale(request);
  return NextResponse.redirect(
    new URL(\`/\${locale}\${pathname}\`, request.url)
  );
}

// app/[lang]/layout.tsx
export async function generateStaticParams() {
  return locales.map(lang => ({ lang }));
}

export default function Layout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang}>
      <body>{children}</body>
    </html>
  );
}

// dictionaries/index.ts
const dictionaries = {
  en: () => import('./en.json').then(m => m.default),
  fr: () => import('./fr.json').then(m => m.default),
};

export const getDictionary = (locale: string) => dictionaries[locale]();

// app/[lang]/page.tsx
export default async function Page({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang);
  
  return <h1>{dict.welcome}</h1>;
}`,
    tags: ['next.js', 'i18n', 'internationalization', 'middleware'],
    timeEstimate: 6
  },
  {
    id: 'next-21',
    category: 'Next.js',
    question: 'What is the edge runtime in Next.js and when should you use it?',
    answer: `The Edge runtime runs code at the network edge (CDN level) for lower latency. It's a lightweight alternative to Node.js runtime.

Edge runtime characteristics:
- Faster cold starts
- Lower latency (closer to users)
- Limited API surface
- No Node.js APIs (fs, path, etc.)
- Size limits on code

Use cases:
- Authentication checks
- A/B testing
- Geolocation redirects
- Request/response transformations`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// Route Handler with Edge runtime
// app/api/location/route.ts
export const runtime = 'edge';

export async function GET(request: Request) {
  const { geo } = request;
  
  return Response.json({
    country: geo?.country,
    city: geo?.city,
    region: geo?.region
  });
}

// Middleware (always runs on Edge)
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const country = request.geo?.country;
  
  // Redirect based on country
  if (country === 'DE') {
    return NextResponse.redirect(new URL('/de', request.url));
  }
  
  return NextResponse.next();
}

// Page with Edge runtime
// app/fast-page/page.tsx
export const runtime = 'edge';

export default function FastPage() {
  return <div>This page renders on Edge</div>;
}

// Streaming from Edge
export const runtime = 'edge';

export async function GET() {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of data) {
        controller.enqueue(encoder.encode(chunk));
        await new Promise(r => setTimeout(r, 100));
      }
      controller.close();
    }
  });
  
  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain' }
  });
}`,
    tags: ['next.js', 'edge', 'runtime', 'performance'],
    timeEstimate: 5
  },
  {
    id: 'next-22',
    category: 'Next.js',
    question: 'How do you handle errors in Next.js App Router?',
    answer: `Next.js App Router provides multiple error handling mechanisms:

error.tsx:
- Catches errors in route segment
- Client Component (recoverable)
- Reset function to retry

global-error.tsx:
- Root layout error handling
- Must include html/body tags

not-found.tsx:
- 404 pages
- Can be per-segment

Additionally:
- Error boundaries in components
- try/catch in Server Actions`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// app/dashboard/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service
    logError(error);
  }, [error]);

  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

// app/global-error.tsx (root layout errors)
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}

// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}

// Triggering not-found
import { notFound } from 'next/navigation';

async function getPost(id: string) {
  const post = await db.post.findUnique({ where: { id } });
  if (!post) notFound();
  return post;
}

// Server Action error handling
async function createPost(formData: FormData) {
  'use server';
  
  try {
    await db.post.create({ data: { ... } });
    revalidatePath('/posts');
  } catch (error) {
    return { error: 'Failed to create post' };
  }
}`,
    tags: ['next.js', 'error-handling', 'error-boundary'],
    timeEstimate: 4
  },
  {
    id: 'next-23',
    category: 'Next.js',
    question: 'What is Partial Prerendering (PPR) in Next.js?',
    answer: `Partial Prerendering (PPR) is a Next.js rendering strategy that combines static and dynamic content in a single route.

How it works:
1. Static shell is prerendered at build time
2. Dynamic parts use streaming with Suspense
3. Static content serves instantly from CDN
4. Dynamic parts stream in progressively

Benefits:
- Best of static and dynamic
- Instant initial paint
- Dynamic personalization
- Optimal caching`,
    difficulty: 'expert',
    type: 'conceptual',
    codeExample: `// next.config.js
module.exports = {
  experimental: {
    ppr: true
  }
};

// app/products/page.tsx
import { Suspense } from 'react';

// This component is static
function ProductHeader() {
  return (
    <header>
      <h1>Our Products</h1>
      <nav>...</nav>
    </header>
  );
}

// This component is dynamic
async function PersonalizedProducts({ userId }) {
  const products = await getRecommendations(userId);
  return <ProductGrid products={products} />;
}

// Dynamic user cart
async function UserCart() {
  const cart = await getCart();
  return <CartWidget items={cart.items} />;
}

export default function ProductsPage() {
  return (
    <div>
      {/* Static - instant */}
      <ProductHeader />
      
      {/* Dynamic - streams in */}
      <Suspense fallback={<ProductsSkeleton />}>
        <PersonalizedProducts userId={userId} />
      </Suspense>
      
      {/* Dynamic - streams in */}
      <Suspense fallback={<CartSkeleton />}>
        <UserCart />
      </Suspense>
      
      {/* Static - instant */}
      <Footer />
    </div>
  );
}`,
    tags: ['next.js', 'ppr', 'rendering', 'performance'],
    timeEstimate: 5
  },
  {
    id: 'next-24',
    category: 'Next.js',
    question: 'How do you configure environment variables in Next.js?',
    answer: `Next.js supports multiple environment variable methods:

File-based:
- .env - All environments
- .env.local - Local overrides (gitignored)
- .env.development - Development only
- .env.production - Production only
- .env.test - Test environment

Access:
- Server: process.env.VAR_NAME
- Client: process.env.NEXT_PUBLIC_VAR_NAME

NEXT_PUBLIC_ prefix exposes variables to browser.`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// .env.local
DATABASE_URL=postgresql://localhost/mydb
API_SECRET=secret-key-never-expose

// Client-side accessible
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ANALYTICS_ID=UA-12345

// Server Component
async function ServerComponent() {
  // ✅ Works - server only
  const dbUrl = process.env.DATABASE_URL;
  const data = await fetch(dbUrl);
  return <div>{data}</div>;
}

// Client Component
'use client';

function ClientComponent() {
  // ❌ undefined - not exposed
  console.log(process.env.DATABASE_URL);
  
  // ✅ Works - NEXT_PUBLIC_ prefix
  console.log(process.env.NEXT_PUBLIC_API_URL);
}

// next.config.js for build-time variables
module.exports = {
  env: {
    CUSTOM_KEY: 'value', // Available everywhere
  },
};

// Runtime config (for SSR values)
// next.config.js
module.exports = {
  serverRuntimeConfig: {
    // Only available on server
    mySecret: process.env.MY_SECRET,
  },
  publicRuntimeConfig: {
    // Available on both
    staticFolder: '/static',
  },
};

// Validation with TypeScript
// env.ts
const envSchema = z.object({
  DATABASE_URL: z.string(),
  NEXT_PUBLIC_API_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);`,
    tags: ['next.js', 'environment', 'configuration', 'security'],
    timeEstimate: 4
  },
  {
    id: 'next-25',
    category: 'Next.js',
    question: 'What is the difference between redirect() and permanentRedirect()?',
    answer: `Both functions redirect users but with different HTTP status codes:

redirect():
- Status: 307 (Temporary Redirect)
- Browser may re-request original URL
- Use for: Login redirects, conditional redirects

permanentRedirect():
- Status: 308 (Permanent Redirect)
- Browser caches and always uses new URL
- Use for: URL migrations, slug changes

Both work in Server Components, Server Actions, and Route Handlers.`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `import { redirect, permanentRedirect } from 'next/navigation';

// Server Component - temporary redirect
async function ProtectedPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login'); // 307 - temporary
  }
  
  return <Dashboard />;
}

// URL migration - permanent redirect
async function OldBlogPost({ params }) {
  const newSlug = await getNewSlug(params.oldSlug);
  
  if (newSlug !== params.oldSlug) {
    permanentRedirect(\`/blog/\${newSlug}\`); // 308 - permanent
  }
  
  return <BlogPost slug={params.oldSlug} />;
}

// Server Action redirect
async function createPost(formData: FormData) {
  'use server';
  
  const post = await db.post.create({
    data: { title: formData.get('title') }
  });
  
  redirect(\`/posts/\${post.id}\`);
}

// Route Handler redirect
export async function GET(request: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.json({ user: session.user });
}

// next.config.js for static redirects
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/blog/:slug',
        permanent: true, // 308
      },
      {
        source: '/temp-page',
        destination: '/new-page',
        permanent: false, // 307
      },
    ];
  },
};`,
    tags: ['next.js', 'redirect', 'navigation', 'http'],
    timeEstimate: 3
  },
  {
    id: 'next-26',
    category: 'Next.js',
    question: 'How do you implement API rate limiting in Next.js?',
    answer: `Rate limiting protects APIs from abuse. Implementation approaches:

1. In-memory (single instance)
2. Redis-based (distributed)
3. Edge middleware
4. Third-party services (Upstash, etc.)

Considerations:
- Identify users (IP, API key, user ID)
- Window strategy (sliding, fixed)
- Response headers (X-RateLimit-*)
- Edge vs serverless tradeoffs`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// Using Upstash Redis rate limiting
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
  analytics: true,
});

// Middleware approach
// middleware.ts
export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);
  
  if (!success) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      },
    });
  }
  
  return NextResponse.next();
}

// Route Handler approach
export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success, remaining } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { 
        status: 429,
        headers: { 'X-RateLimit-Remaining': remaining.toString() }
      }
    );
  }
  
  // Process request...
  return NextResponse.json({ success: true });
}

// Simple in-memory rate limiter (single instance only)
const rateLimitMap = new Map();

function rateLimit(ip: string, limit = 10, window = 60000) {
  const now = Date.now();
  const windowStart = now - window;
  
  const requestTimestamps = rateLimitMap.get(ip) || [];
  const recentRequests = requestTimestamps.filter(t => t > windowStart);
  
  if (recentRequests.length >= limit) {
    return { success: false, remaining: 0 };
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  
  return { success: true, remaining: limit - recentRequests.length };
}`,
    tags: ['next.js', 'rate-limiting', 'api', 'security'],
    timeEstimate: 5
  },
  {
    id: 'next-27',
    category: 'Next.js',
    question: 'What are Route Groups in Next.js and how do you use them?',
    answer: `Route Groups organize routes without affecting URL structure. Created with parentheses: (groupName).

Use cases:
- Organize by feature (auth, marketing)
- Multiple root layouts
- Shared layouts for route subsets
- Opt routes into/out of layouts

Route groups don't create URL segments - the folder name is excluded from the path.`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Folder structure with route groups
app/
  (marketing)/
    about/
      page.tsx      // /about
    blog/
      page.tsx      // /blog
    layout.tsx      // Marketing layout
  (shop)/
    products/
      page.tsx      // /products
    cart/
      page.tsx      // /cart
    layout.tsx      // Shop layout (with cart sidebar)
  (auth)/
    login/
      page.tsx      // /login
    register/
      page.tsx      // /register
    layout.tsx      // Auth layout (centered)

// app/(marketing)/layout.tsx
export default function MarketingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <MarketingNav />
      {children}
      <MarketingFooter />
    </div>
  );
}

// app/(shop)/layout.tsx
export default function ShopLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <main>{children}</main>
      <CartSidebar />
    </div>
  );
}

// Multiple root layouts
app/
  (site)/
    layout.tsx      // Regular site layout
    page.tsx
  (admin)/
    layout.tsx      // Admin layout (different theme)
    dashboard/
      page.tsx`,
    tags: ['next.js', 'routing', 'route-groups', 'layouts'],
    timeEstimate: 4
  },
  {
    id: 'next-28',
    category: 'Next.js',
    question: 'How do you handle file uploads in Next.js?',
    answer: `File uploads in Next.js can be handled through:

1. Route Handlers with FormData
2. Server Actions with FormData
3. External services (S3, Cloudinary)
4. Third-party upload widgets

Considerations:
- Size limits (default 1MB, configurable)
- Streaming for large files
- Validation and security
- Storage destination`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// Server Action approach
// app/upload/actions.ts
'use server';

import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;
  
  if (!file) {
    return { error: 'No file provided' };
  }
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { error: 'Invalid file type' };
  }
  
  // Validate size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    return { error: 'File too large' };
  }
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const filename = \`\${Date.now()}-\${file.name}\`;
  const path = join(process.cwd(), 'public/uploads', filename);
  
  await writeFile(path, buffer);
  
  return { success: true, url: \`/uploads/\${filename}\` };
}

// Client Component
'use client';

export function UploadForm() {
  const [uploading, setUploading] = useState(false);
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await uploadFile(formData);
    
    setUploading(false);
    if (result.error) alert(result.error);
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="file" accept="image/*" />
      <button disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}

// Route Handler for more control
// app/api/upload/route.ts
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  // Upload to S3
  const { url } = await uploadToS3(file);
  
  return NextResponse.json({ url });
}

// next.config.js - increase body size limit
module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};`,
    tags: ['next.js', 'upload', 'files', 'forms'],
    timeEstimate: 5
  },
  {
    id: 'next-29',
    category: 'Next.js',
    question: 'What is the difference between Server Components and Client Components?',
    answer: `Server and Client Components have distinct capabilities and use cases:

Server Components:
- Default in App Router
- Render on server only
- Direct database/filesystem access
- No JavaScript sent to client
- Cannot use hooks or browser APIs
- Async functions allowed

Client Components:
- Marked with 'use client'
- Render on client (hydrated)
- Can use hooks, events, browser APIs
- Required for interactivity
- JavaScript included in bundle`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `// Server Component (default)
// Can fetch data directly
async function ServerComponent() {
  const data = await db.query('SELECT * FROM posts');
  
  return (
    <ul>
      {data.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}

// Client Component
'use client';

import { useState } from 'react';

function ClientComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}

// Composing Server and Client
// Server Component
async function PostPage({ id }) {
  const post = await getPost(id);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {/* Client component for interactivity */}
      <LikeButton postId={id} />
      <CommentForm postId={id} />
    </article>
  );
}

// Passing Server data to Client
async function ServerWrapper() {
  const data = await fetchData();
  
  return <ClientComponent initialData={data} />;
}

// What you CAN'T do
// ❌ Import Server Component into Client Component
'use client';
import ServerComponent from './ServerComponent'; // Error!

// ✅ Pass Server Component as children
function ClientWrapper({ children }) {
  return <div onClick={handle}>{children}</div>;
}

// In Server Component:
<ClientWrapper>
  <ServerComponent />
</ClientWrapper>`,
    tags: ['next.js', 'server-components', 'client-components', 'rsc'],
    timeEstimate: 5
  },
  {
    id: 'next-30',
    category: 'Next.js',
    question: 'How do you implement WebSockets or real-time features in Next.js?',
    answer: `Next.js serverless nature makes WebSockets challenging. Options:

1. External WebSocket service (Pusher, Ably, Socket.io)
2. Server-Sent Events (SSE) for one-way
3. Custom Node.js server
4. Polling as fallback

For production, external services are recommended due to serverless constraints.`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// Option 1: Server-Sent Events (Route Handler)
// app/api/events/route.ts
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      // Subscribe to updates
      const unsubscribe = subscribeToUpdates((data) => {
        controller.enqueue(
          encoder.encode(\`data: \${JSON.stringify(data)}\\n\\n\`)
        );
      });
      
      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        unsubscribe();
        controller.close();
      });
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Client usage
'use client';

function RealTimeUpdates() {
  const [updates, setUpdates] = useState([]);
  
  useEffect(() => {
    const eventSource = new EventSource('/api/events');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setUpdates(prev => [...prev, data]);
    };
    
    return () => eventSource.close();
  }, []);
  
  return <div>{/* render updates */}</div>;
}

// Option 2: Pusher integration
// lib/pusher.ts
import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Server
export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: 'us2',
});

// Server Action to trigger
async function sendMessage(formData: FormData) {
  'use server';
  
  const message = formData.get('message');
  await pusher.trigger('chat', 'message', { text: message });
}

// Client hook
function useChannel(channelName: string, eventName: string) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!);
    const channel = pusher.subscribe(channelName);
    
    channel.bind(eventName, setData);
    
    return () => {
      channel.unbind(eventName);
      pusher.unsubscribe(channelName);
    };
  }, [channelName, eventName]);
  
  return data;
}`,
    tags: ['next.js', 'websockets', 'real-time', 'sse'],
    timeEstimate: 6
  },
  {
    id: 'next-31',
    category: 'Next.js',
    question: 'What is next/dynamic and when should you use it?',
    answer: `next/dynamic enables dynamic imports with optional SSR disabling. It's the Next.js wrapper around React.lazy.

Use cases:
- Code splitting heavy components
- Loading client-only libraries
- Deferring non-critical components
- Conditional component loading

Options:
- ssr: false - Disable server rendering
- loading - Custom loading component
- Suspense integration`,
    difficulty: 'intermediate',
    type: 'conceptual',
    codeExample: `import dynamic from 'next/dynamic';

// Basic dynamic import
const HeavyComponent = dynamic(() => import('./HeavyComponent'));

// With loading state
const Chart = dynamic(() => import('./Chart'), {
  loading: () => <ChartSkeleton />,
});

// No SSR (client-only)
const Editor = dynamic(() => import('./Editor'), {
  ssr: false, // Only loads on client
});

// Named export
const ComponentA = dynamic(
  () => import('./Components').then(mod => mod.ComponentA)
);

// With suspense
const Modal = dynamic(() => import('./Modal'), {
  suspense: true,
});

function Page() {
  return (
    <Suspense fallback={<ModalSkeleton />}>
      <Modal />
    </Suspense>
  );
}

// Conditional loading
function Editor({ isMarkdown }) {
  const EditorComponent = dynamic(() =>
    isMarkdown
      ? import('./MarkdownEditor')
      : import('./RichTextEditor')
  );
  
  return <EditorComponent />;
}

// Client-only with window check
const MapComponent = dynamic(
  () => import('./Map'),
  { 
    ssr: false,
    loading: () => <div>Loading map...</div>
  }
);

// Preloading for better UX
const HeavyModal = dynamic(() => import('./HeavyModal'));

function Page() {
  const handleHover = () => {
    // Preload on hover
    const preload = () => import('./HeavyModal');
    preload();
  };
  
  return (
    <button onMouseEnter={handleHover} onClick={() => setShowModal(true)}>
      Open Modal
    </button>
  );
}`,
    tags: ['next.js', 'dynamic', 'code-splitting', 'lazy-loading'],
    timeEstimate: 4
  },
  {
    id: 'next-32',
    category: 'Next.js',
    question: 'How do you handle database connections in Next.js?',
    answer: `Database connections in serverless environments need special handling to avoid connection exhaustion.

Key considerations:
- Connection pooling essential
- Global singleton pattern
- Edge runtime limitations
- ORM choices (Prisma, Drizzle, etc.)

Best practices:
- Use connection pooler (PgBouncer, Prisma Accelerate)
- Cache connections in development
- Set appropriate pool sizes`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// lib/db.ts - Prisma singleton pattern
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

// Usage in Server Components
async function UsersPage() {
  const users = await prisma.user.findMany();
  return <UserList users={users} />;
}

// lib/db.ts - Drizzle with Neon
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

// Usage
const users = await db.select().from(usersTable);

// Connection pooling with Prisma Accelerate
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // For migrations
}

// Edge-compatible database (Turso/libSQL)
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client);

// Works in Edge runtime
export const runtime = 'edge';

export async function GET() {
  const users = await db.select().from(users);
  return Response.json(users);
}`,
    tags: ['next.js', 'database', 'prisma', 'connection-pooling'],
    timeEstimate: 5
  },
  {
    id: 'next-33',
    category: 'Next.js',
    question: 'How do you implement internationalization (i18n) in Next.js App Router?',
    answer: `i18n in App Router:

1. Subpath routing (/en, /de)
2. Domain routing
3. Middleware for detection
4. next-intl library

Key concepts:
- Locale detection
- Message files
- Date/number formatting
- Dynamic content translation`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'de', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});

export const config = {
  matcher: ['/((?!api|_next|.*\\\\..*).*)']
};

// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// messages/en.json
{
  "HomePage": {
    "title": "Welcome",
    "greeting": "Hello, {name}!"
  },
  "Common": {
    "loading": "Loading..."
  }
}

// Using translations in Server Components
import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('greeting', { name: 'User' })}</p>
    </div>
  );
}

// Using translations in Client Components
'use client';
import { useTranslations } from 'next-intl';

function ClientComponent() {
  const t = useTranslations('Common');
  return <span>{t('loading')}</span>;
}

// Language switcher
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <select value={locale} onChange={(e) => switchLocale(e.target.value)}>
      <option value="en">English</option>
      <option value="de">Deutsch</option>
      <option value="fr">Français</option>
    </select>
  );
}`,
    tags: ['next.js', 'i18n', 'internationalization', 'next-intl'],
    timeEstimate: 6
  },
  {
    id: 'next-34',
    category: 'Next.js',
    question: 'How do you implement authentication with NextAuth.js (Auth.js)?',
    answer: `NextAuth.js v5 (Auth.js) setup:

1. Multiple providers
2. Database adapter
3. Session management
4. Protected routes
5. Server/Client usage

Features:
- OAuth providers
- Credentials auth
- JWT or database sessions
- RBAC support`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// auth.ts
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { prisma } from './lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });
        
        if (!user || !user.password) return null;
        
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        
        if (!isValid) return null;
        
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
});

// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth';
export const { GET, POST } = handlers;

// middleware.ts - Protect routes
import { auth } from '@/auth';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard');
  
  if (isProtected && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.url));
  }
});

// Server Component - Get session
import { auth } from '@/auth';

async function Dashboard() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }
  
  return <div>Welcome {session.user.name}</div>;
}

// Client Component - Session hook
'use client';
import { useSession } from 'next-auth/react';

function UserButton() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <Spinner />;
  if (!session) return <LoginButton />;
  
  return <span>{session.user.name}</span>;
}

// Sign in/out
import { signIn, signOut } from '@/auth';

async function LoginForm() {
  return (
    <form action={async (formData) => {
      'use server';
      await signIn('credentials', formData);
    }}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      <button type="submit">Sign In</button>
    </form>
  );
}`,
    tags: ['next.js', 'authentication', 'nextauth', 'oauth'],
    timeEstimate: 6
  },
  {
    id: 'next-35',
    category: 'Next.js',
    question: 'How do you handle file uploads in Next.js?',
    answer: `File upload approaches:

1. Server Actions
2. API Routes
3. Third-party services (S3, Cloudinary)
4. Vercel Blob

Considerations:
- File size limits
- Type validation
- Secure storage
- Progress tracking`,
    difficulty: 'intermediate',
    type: 'coding',
    codeExample: `// Using Vercel Blob
// app/api/upload/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 });
  }
  
  // Validate file
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 });
  }
  
  const blob = await put(file.name, file, {
    access: 'public',
  });
  
  return NextResponse.json({ url: blob.url });
}

// Client component with progress
'use client';
import { useState } from 'react';

function FileUpload() {
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState('');
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    // XMLHttpRequest for progress
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    });
    
    xhr.onload = () => {
      const response = JSON.parse(xhr.responseText);
      setUrl(response.url);
    };
    
    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  };
  
  return (
    <div>
      <input type="file" onChange={handleUpload} />
      {progress > 0 && <progress value={progress} max={100} />}
      {url && <img src={url} alt="Uploaded" />}
    </div>
  );
}

// Server Action upload
'use server';
import { put } from '@vercel/blob';

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;
  
  const blob = await put(file.name, file, {
    access: 'public',
  });
  
  // Save to database
  await prisma.upload.create({
    data: {
      url: blob.url,
      filename: file.name,
      size: file.size,
    },
  });
  
  return { url: blob.url };
}

// Upload to S3
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function getUploadUrl(filename: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: \`uploads/\${Date.now()}-\${filename}\`,
    ContentType: contentType,
  });
  
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
}`,
    tags: ['next.js', 'file-upload', 'vercel-blob', 's3'],
    timeEstimate: 5
  },
  {
    id: 'next-36',
    category: 'Next.js',
    question: 'How do you implement real-time features in Next.js?',
    answer: `Real-time options in Next.js:

1. Server-Sent Events (SSE)
2. WebSockets
3. Third-party (Pusher, Ably)
4. Polling

Considerations:
- Edge compatibility
- Scaling
- State synchronization`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// Server-Sent Events (SSE)
// app/api/events/route.ts
export const dynamic = 'force-dynamic';

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      
      // Send initial data
      controller.enqueue(encoder.encode('data: connected\\n\\n'));
      
      // Subscribe to updates
      const unsubscribe = subscribe((data) => {
        controller.enqueue(
          encoder.encode(\`data: \${JSON.stringify(data)}\\n\\n\`)
        );
      });
      
      // Cleanup on close
      return () => unsubscribe();
    },
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Client hook for SSE
'use client';
function useEventSource(url: string) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const eventSource = new EventSource(url);
    
    eventSource.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };
    
    eventSource.onerror = () => {
      setError('Connection error');
      eventSource.close();
    };
    
    return () => eventSource.close();
  }, [url]);
  
  return { data, error };
}

// Using with Pusher
// lib/pusher.ts
import Pusher from 'pusher';
import PusherClient from 'pusher-js';

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER! }
);

// Server Action to trigger event
'use server';
export async function sendMessage(content: string) {
  const message = await prisma.message.create({
    data: { content },
  });
  
  await pusherServer.trigger('chat', 'new-message', message);
  
  return message;
}

// Client component
'use client';
function ChatRoom() {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const channel = pusherClient.subscribe('chat');
    
    channel.bind('new-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });
    
    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe('chat');
    };
  }, []);
  
  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>{m.content}</div>
      ))}
    </div>
  );
}`,
    tags: ['next.js', 'real-time', 'sse', 'websocket', 'pusher'],
    timeEstimate: 6
  },
  {
    id: 'next-37',
    category: 'Next.js',
    question: 'How do you implement a multi-tenant architecture in Next.js?',
    answer: `Multi-tenant approaches:

1. Subdomain routing
2. Path-based routing
3. Database isolation

Considerations:
- Tenant identification
- Data isolation
- Custom branding
- Billing per tenant`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// Subdomain-based multi-tenancy
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Extract subdomain
  const subdomain = hostname.split('.')[0];
  
  // Skip for main domain and localhost
  const isMainDomain = subdomain === 'www' || subdomain === 'app';
  const isLocalhost = hostname.includes('localhost');
  
  if (isMainDomain || (isLocalhost && !subdomain.includes('-'))) {
    return NextResponse.next();
  }
  
  // Rewrite to tenant route
  const url = request.nextUrl.clone();
  url.pathname = \`/\${subdomain}\${url.pathname}\`;
  
  return NextResponse.rewrite(url);
}

// app/[tenant]/page.tsx
import { getTenant } from '@/lib/tenant';

export default async function TenantHome({
  params,
}: {
  params: { tenant: string };
}) {
  const tenant = await getTenant(params.tenant);
  
  if (!tenant) {
    notFound();
  }
  
  return (
    <div style={{ 
      '--primary-color': tenant.primaryColor 
    } as React.CSSProperties}>
      <h1>{tenant.name}</h1>
    </div>
  );
}

// lib/tenant.ts
export async function getTenant(slug: string) {
  return prisma.tenant.findUnique({
    where: { slug },
    include: { settings: true },
  });
}

// Database isolation with Prisma
// Using row-level security
const prismaWithTenant = (tenantId: string) => {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, args, query }) {
          if (['findMany', 'findFirst', 'count'].includes(operation)) {
            args.where = { ...args.where, tenantId };
          }
          if (operation === 'create') {
            args.data = { ...args.data, tenantId };
          }
          return query(args);
        },
      },
    },
  });
};

// Usage in Server Component
async function TenantDashboard({ tenantId }: { tenantId: string }) {
  const db = prismaWithTenant(tenantId);
  const users = await db.user.findMany(); // Automatically filtered
  return <UserList users={users} />;
}

// Tenant context
'use client';
import { createContext, useContext } from 'react';

const TenantContext = createContext<Tenant | null>(null);

export function TenantProvider({ 
  tenant, 
  children 
}: { 
  tenant: Tenant; 
  children: React.ReactNode 
}) {
  return (
    <TenantContext.Provider value={tenant}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const tenant = useContext(TenantContext);
  if (!tenant) throw new Error('useTenant must be used within TenantProvider');
  return tenant;
}`,
    tags: ['next.js', 'multi-tenant', 'architecture', 'saas'],
    timeEstimate: 6
  },
  {
    id: 'next-38',
    category: 'Next.js',
    question: 'How do you implement background jobs in Next.js?',
    answer: `Background job options:

1. Vercel Cron Jobs
2. External services (Inngest, Trigger.dev)
3. Redis/BullMQ
4. Serverless functions

Considerations:
- Execution time limits
- Reliability
- Monitoring
- Retry logic`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// Vercel Cron Jobs
// vercel.json
{
  "crons": [{
    "path": "/api/cron/cleanup",
    "schedule": "0 0 * * *"
  }]
}

// app/api/cron/cleanup/route.ts
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Perform cleanup
  await prisma.session.deleteMany({
    where: { expiresAt: { lt: new Date() } }
  });
  
  return Response.json({ success: true });
}

// Using Inngest for complex workflows
// lib/inngest.ts
import { Inngest } from 'inngest';

export const inngest = new Inngest({ id: 'my-app' });

// Define a function
export const processOrder = inngest.createFunction(
  { id: 'process-order' },
  { event: 'order/created' },
  async ({ event, step }) => {
    // Step 1: Charge payment
    const payment = await step.run('charge-payment', async () => {
      return await stripe.charges.create({
        amount: event.data.amount,
        customer: event.data.customerId,
      });
    });
    
    // Step 2: Send confirmation (runs after payment succeeds)
    await step.run('send-confirmation', async () => {
      await sendEmail({
        to: event.data.email,
        subject: 'Order Confirmed',
        body: \`Payment ID: \${payment.id}\`,
      });
    });
    
    // Step 3: Wait for shipping
    await step.sleep('wait-for-processing', '1 day');
    
    // Step 4: Check shipping status
    await step.run('update-shipping', async () => {
      await updateShippingStatus(event.data.orderId);
    });
  }
);

// app/api/inngest/route.ts
import { serve } from 'inngest/next';
import { inngest, processOrder } from '@/lib/inngest';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processOrder],
});

// Trigger from Server Action
'use server';
export async function createOrder(data: OrderData) {
  const order = await prisma.order.create({ data });
  
  // Trigger background job
  await inngest.send({
    name: 'order/created',
    data: {
      orderId: order.id,
      amount: order.total,
      email: data.email,
    },
  });
  
  return order;
}

// Using Trigger.dev
import { client } from '@/trigger';

export const emailSequence = client.defineJob({
  id: 'email-sequence',
  name: 'Email Sequence',
  version: '1.0.0',
  trigger: eventTrigger({
    name: 'user.signed-up',
  }),
  run: async (payload, io) => {
    // Send welcome email
    await io.sendEmail('welcome', {
      to: payload.email,
      subject: 'Welcome!',
    });
    
    // Wait 3 days
    await io.wait('wait', 3 * 24 * 60 * 60);
    
    // Send follow-up
    await io.sendEmail('follow-up', {
      to: payload.email,
      subject: 'How are you finding our app?',
    });
  },
});`,
    tags: ['next.js', 'background-jobs', 'cron', 'inngest'],
    timeEstimate: 6
  },
  {
    id: 'next-39',
    category: 'Next.js',
    question: 'How do you handle errors gracefully in Next.js App Router?',
    answer: `Error handling in App Router:

1. error.tsx - Route segment errors
2. global-error.tsx - Root layout errors
3. not-found.tsx - 404 pages
4. Error boundaries

Features:
- Automatic error recovery
- Error logging
- User-friendly fallbacks`,
    difficulty: 'intermediate',
    type: 'coding',
    codeExample: `// app/error.tsx - Route error boundary
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error service
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}

// app/global-error.tsx - Root layout errors
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}

// app/not-found.tsx - 404 page
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="mt-2">Page not found</p>
      <Link href="/" className="mt-4 text-blue-500">
        Go home
      </Link>
    </div>
  );
}

// Triggering not-found
import { notFound } from 'next/navigation';

async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  
  if (!product) {
    notFound();
  }
  
  return <ProductDetails product={product} />;
}

// Custom error classes
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// API route error handling
export async function GET(request: Request) {
  try {
    const data = await fetchData();
    return Response.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }
    
    // Log unexpected errors
    console.error('Unexpected error:', error);
    
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Server Action error handling
'use server';
export async function createPost(formData: FormData) {
  try {
    const result = await prisma.post.create({
      data: {
        title: formData.get('title') as string,
      },
    });
    
    revalidatePath('/posts');
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to create post' };
  }
}`,
    tags: ['next.js', 'error-handling', 'error-boundary', 'not-found'],
    timeEstimate: 5
  },
  {
    id: 'next-40',
    category: 'Next.js',
    question: 'How do you implement dynamic OG images in Next.js?',
    answer: `Dynamic OG image generation:

1. ImageResponse API
2. @vercel/og package
3. Edge runtime
4. Caching

Use cases:
- Blog post previews
- Product cards
- User profiles
- Share cards`,
    difficulty: 'intermediate',
    type: 'coding',
    codeExample: `// app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'My App';
  
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%)',
          backgroundSize: '50px 50px',
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #fff, #888)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {title}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

// Using custom fonts
import { ImageResponse } from 'next/og';

export async function GET(request: Request) {
  const fontData = await fetch(
    new URL('./fonts/Inter-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());
  
  return new ImageResponse(
    (
      <div style={{ fontFamily: 'Inter' }}>
        Hello World
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}

// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Blog post';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = await getPost(params.slug);
  
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 60,
          backgroundColor: 'white',
          width: '100%',
          height: '100%',
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 'bold' }}>
          {post.title}
        </div>
        <div style={{ fontSize: 24, color: '#666', marginTop: 20 }}>
          {post.description}
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center' }}>
          <img 
            src={post.author.avatar} 
            width={50} 
            height={50} 
            style={{ borderRadius: 25 }}
          />
          <span style={{ marginLeft: 15 }}>{post.author.name}</span>
        </div>
      </div>
    ),
    size
  );
}

// Page with OG metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [\`/api/og?title=\${encodeURIComponent(post.title)}\`],
    },
  };
}`,
    tags: ['next.js', 'og-images', 'seo', 'edge'],
    timeEstimate: 5
  },
  {
    id: 'next-41',
    category: 'Next.js',
    question: 'How do you implement A/B testing in Next.js?',
    answer: `A/B testing approaches:

1. Middleware-based
2. Edge Config
3. Third-party (Vercel Flags, LaunchDarkly)
4. Server-side assignment

Considerations:
- Consistent assignment
- Performance
- Analytics integration`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// Middleware-based A/B testing
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'ab-variant';
const VARIANTS = ['control', 'variant-a', 'variant-b'];

function getVariant(request: NextRequest): string {
  // Check for existing assignment
  const existing = request.cookies.get(COOKIE_NAME)?.value;
  if (existing && VARIANTS.includes(existing)) {
    return existing;
  }
  
  // Random assignment
  const random = Math.random();
  if (random < 0.33) return 'control';
  if (random < 0.66) return 'variant-a';
  return 'variant-b';
}

export function middleware(request: NextRequest) {
  const variant = getVariant(request);
  
  // Set cookie for consistent experience
  const response = NextResponse.next();
  response.cookies.set(COOKIE_NAME, variant, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  
  // Add header for Server Components
  response.headers.set('x-ab-variant', variant);
  
  return response;
}

// Server Component using variant
import { cookies, headers } from 'next/headers';

async function LandingPage() {
  const variant = headers().get('x-ab-variant') ?? 'control';
  
  return (
    <div>
      {variant === 'control' && <ControlHero />}
      {variant === 'variant-a' && <HeroA />}
      {variant === 'variant-b' && <HeroB />}
    </div>
  );
}

// Using Vercel Edge Config
import { get } from '@vercel/edge-config';

export async function middleware(request: NextRequest) {
  const experiments = await get('experiments');
  
  const variant = experiments?.hero ?? 'control';
  
  // Percentage-based rollout
  const userId = request.cookies.get('userId')?.value;
  const hash = hashString(userId + 'hero-experiment');
  const percentage = experiments?.heroPercentage ?? 0;
  
  const isInExperiment = (hash % 100) < percentage;
  
  const response = NextResponse.next();
  response.headers.set('x-experiment', isInExperiment ? variant : 'control');
  
  return response;
}

// Track conversions
'use client';
import { useEffect } from 'react';

function ExperimentWrapper({ 
  variant, 
  experimentId,
  children 
}: {
  variant: string;
  experimentId: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Track impression
    analytics.track('experiment_impression', {
      experimentId,
      variant,
    });
  }, [experimentId, variant]);
  
  const trackConversion = (eventName: string) => {
    analytics.track('experiment_conversion', {
      experimentId,
      variant,
      eventName,
    });
  };
  
  return (
    <ExperimentContext.Provider value={{ variant, trackConversion }}>
      {children}
    </ExperimentContext.Provider>
  );
}

// Usage
function CTAButton() {
  const { variant, trackConversion } = useExperiment();
  
  return (
    <button onClick={() => trackConversion('cta_click')}>
      {variant === 'variant-a' ? 'Get Started Free' : 'Sign Up Now'}
    </button>
  );
}`,
    tags: ['next.js', 'ab-testing', 'feature-flags', 'experimentation'],
    timeEstimate: 6
  },
  {
    id: 'next-42',
    category: 'Next.js',
    question: 'How do you implement infinite scroll with Server Components?',
    answer: `Infinite scroll with RSC:

1. Server Actions for pagination
2. Client-side state management
3. Intersection Observer
4. Loading states

Approaches:
- Cursor-based pagination
- Load more button
- Auto-loading`,
    difficulty: 'intermediate',
    type: 'coding',
    codeExample: `// Server Action for fetching more
'use server';

export async function getMorePosts(cursor?: string) {
  const posts = await prisma.post.findMany({
    take: 10,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
  });
  
  const nextCursor = posts[posts.length - 1]?.id;
  
  return {
    posts,
    nextCursor,
    hasMore: posts.length === 10,
  };
}

// Client component for infinite scroll
'use client';
import { useEffect, useRef, useState, useTransition } from 'react';
import { getMorePosts } from './actions';

interface Post {
  id: string;
  title: string;
}

export function InfinitePostList({ 
  initialPosts,
  initialCursor,
}: { 
  initialPosts: Post[];
  initialCursor?: string;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [cursor, setCursor] = useState(initialCursor);
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();
  
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const loadMore = () => {
    if (isPending || !hasMore) return;
    
    startTransition(async () => {
      const result = await getMorePosts(cursor);
      setPosts((prev) => [...prev, ...result.posts]);
      setCursor(result.nextCursor);
      setHasMore(result.hasMore);
    });
  };
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '100px' }
    );
    
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    
    return () => observer.disconnect();
  }, [cursor, hasMore, isPending]);
  
  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      
      <div ref={loadMoreRef}>
        {isPending && <Spinner />}
        {!hasMore && <p>No more posts</p>}
      </div>
    </div>
  );
}

// Page component
import { getMorePosts } from './actions';
import { InfinitePostList } from './InfinitePostList';

export default async function PostsPage() {
  const { posts, nextCursor } = await getMorePosts();
  
  return (
    <InfinitePostList 
      initialPosts={posts}
      initialCursor={nextCursor}
    />
  );
}

// Alternative: Load More button
function LoadMoreButton({ loadMore, isPending, hasMore }) {
  if (!hasMore) return null;
  
  return (
    <button 
      onClick={loadMore} 
      disabled={isPending}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {isPending ? 'Loading...' : 'Load More'}
    </button>
  );
}

// With TanStack Query
'use client';
import { useInfiniteQuery } from '@tanstack/react-query';

function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => getMorePosts(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}`,
    tags: ['next.js', 'infinite-scroll', 'pagination', 'server-actions'],
    timeEstimate: 5
  },
  {
    id: 'next-43',
    category: 'Next.js',
    question: 'How do you implement optimistic updates with Server Actions?',
    answer: `Optimistic updates with Server Actions:

1. useOptimistic hook (React 19)
2. Immediate UI update
3. Server confirmation
4. Error rollback

Benefits:
- Instant feedback
- Better UX
- Graceful degradation`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// Using useOptimistic
'use client';
import { useOptimistic } from 'react';
import { likePost, unlikePost } from './actions';

interface Post {
  id: string;
  title: string;
  likes: number;
  isLiked: boolean;
}

function PostCard({ post }: { post: Post }) {
  const [optimisticPost, addOptimistic] = useOptimistic(
    post,
    (state, newLiked: boolean) => ({
      ...state,
      likes: newLiked ? state.likes + 1 : state.likes - 1,
      isLiked: newLiked,
    })
  );
  
  async function handleLike() {
    const newLiked = !optimisticPost.isLiked;
    
    // Optimistic update
    addOptimistic(newLiked);
    
    // Server action
    if (newLiked) {
      await likePost(post.id);
    } else {
      await unlikePost(post.id);
    }
  }
  
  return (
    <div>
      <h2>{post.title}</h2>
      <button onClick={handleLike}>
        {optimisticPost.isLiked ? '❤️' : '🤍'} {optimisticPost.likes}
      </button>
    </div>
  );
}

// Server Actions
'use server';
import { revalidatePath } from 'next/cache';

export async function likePost(postId: string) {
  await prisma.like.create({
    data: { postId, userId: getCurrentUserId() },
  });
  revalidatePath('/posts');
}

export async function unlikePost(postId: string) {
  await prisma.like.delete({
    where: {
      postId_userId: { postId, userId: getCurrentUserId() },
    },
  });
  revalidatePath('/posts');
}

// Optimistic list operations
function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, action: { type: string; todo?: Todo; id?: string }) => {
      switch (action.type) {
        case 'add':
          return [...state, { ...action.todo!, pending: true }];
        case 'delete':
          return state.filter((t) => t.id !== action.id);
        case 'toggle':
          return state.map((t) =>
            t.id === action.id ? { ...t, completed: !t.completed } : t
          );
        default:
          return state;
      }
    }
  );
  
  async function handleAdd(formData: FormData) {
    const text = formData.get('text') as string;
    const newTodo = { id: crypto.randomUUID(), text, completed: false };
    
    addOptimisticTodo({ type: 'add', todo: newTodo });
    
    await addTodo(text);
  }
  
  async function handleDelete(id: string) {
    addOptimisticTodo({ type: 'delete', id });
    await deleteTodo(id);
  }
  
  async function handleToggle(id: string) {
    addOptimisticTodo({ type: 'toggle', id });
    await toggleTodo(id);
  }
  
  return (
    <div>
      <form action={handleAdd}>
        <input name="text" />
        <button type="submit">Add</button>
      </form>
      
      <ul>
        {optimisticTodos.map((todo) => (
          <li 
            key={todo.id} 
            className={todo.pending ? 'opacity-50' : ''}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
            />
            {todo.text}
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    tags: ['next.js', 'optimistic-updates', 'server-actions', 'useOptimistic'],
    timeEstimate: 5
  },
  {
    id: 'next-44',
    category: 'Next.js',
    question: 'How do you test Next.js applications?',
    answer: `Testing strategies for Next.js:

1. Unit tests (Jest, Vitest)
2. Integration tests (Testing Library)
3. E2E tests (Playwright, Cypress)
4. API route testing

Considerations:
- Mocking Server Components
- Testing Server Actions
- Navigation testing`,
    difficulty: 'senior',
    type: 'coding',
    codeExample: `// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

module.exports = createJestConfig({
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
});

// jest.setup.ts
import '@testing-library/jest-dom';

// Testing a Client Component
import { render, screen, fireEvent } from '@testing-library/react';
import { Counter } from './Counter';

describe('Counter', () => {
  it('increments count', () => {
    render(<Counter initialCount={0} />);
    
    const button = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(button);
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});

// Testing Server Components
import { render } from '@testing-library/react';
import { ProductList } from './ProductList';
import { getProducts } from '@/lib/products';

jest.mock('@/lib/products');

describe('ProductList', () => {
  it('renders products', async () => {
    (getProducts as jest.Mock).mockResolvedValue([
      { id: '1', name: 'Product 1', price: 100 },
    ]);
    
    const { findByText } = render(await ProductList());
    
    expect(await findByText('Product 1')).toBeInTheDocument();
  });
});

// Testing Server Actions
import { createPost } from './actions';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma');

describe('createPost', () => {
  it('creates a post', async () => {
    const mockPost = { id: '1', title: 'Test' };
    (prisma.post.create as jest.Mock).mockResolvedValue(mockPost);
    
    const formData = new FormData();
    formData.set('title', 'Test');
    
    const result = await createPost(formData);
    
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockPost);
  });
});

// E2E with Playwright
// e2e/home.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('should navigate to posts', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=View Posts');
    
    await expect(page).toHaveURL('/posts');
    await expect(page.locator('h1')).toContainText('Posts');
  });
});

// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'mobile', use: devices['iPhone 13'] },
  ],
});

// API route testing
import { POST } from './route';

describe('POST /api/posts', () => {
  it('creates a post', async () => {
    const request = new Request('http://localhost:3000/api/posts', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test' }),
      headers: { 'Content-Type': 'application/json' },
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data.title).toBe('Test');
  });
});`,
    tags: ['next.js', 'testing', 'jest', 'playwright'],
    timeEstimate: 6
  },
  {
    id: 'next-45',
    category: 'Next.js',
    question: 'How do you deploy and optimize Next.js for production?',
    answer: `Production deployment best practices:

1. Build optimization
2. Caching strategies
3. Environment configuration
4. Monitoring

Platforms:
- Vercel (native)
- AWS/GCP
- Self-hosted
- Docker`,
    difficulty: 'senior',
    type: 'conceptual',
    codeExample: `// next.config.js - Production optimization
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output standalone for Docker
  output: 'standalone',
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.example.com' },
    ],
  },
  
  // Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      { source: '/old-page', destination: '/new-page', permanent: true },
    ];
  },
  
  // Webpack optimization
  webpack: (config, { isServer }) => {
    // Bundle analyzer
    if (process.env.ANALYZE) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(new BundleAnalyzerPlugin());
    }
    return config;
  },
};

module.exports = nextConfig;

// Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]

// GitHub Actions deployment
// .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      
      - name: Install
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}
      
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

// Monitoring with Sentry
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Health check endpoint
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database
    await prisma.$queryRaw\`SELECT 1\`;
    
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  } catch {
    return Response.json(
      { status: 'unhealthy' },
      { status: 500 }
    );
  }
}`,
    tags: ['next.js', 'deployment', 'production', 'docker'],
    timeEstimate: 6
  }
];

