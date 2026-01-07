import { Question } from '../types';

export const securityQuestions: Question[] = [
  {
    id: 'sec-1',
    category: 'Security',
    question: 'How does React prevent XSS (Cross-Site Scripting) attacks?',
    answer: `React provides built-in XSS protection through automatic escaping:

1. JSX automatically escapes values
   - All values are converted to strings before rendering
   - HTML entities are escaped (<, >, &, ", ')

2. dangerouslySetInnerHTML requires explicit opt-in
   - Named to discourage casual use
   - Must pass __html property

3. URL sanitization in modern browsers
   - javascript: URLs are blocked in React 16.9+

Best practices:
- Never use dangerouslySetInnerHTML with user input
- Sanitize HTML if you must render it (DOMPurify)
- Validate and sanitize all user inputs server-side`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// ✅ Safe - React escapes automatically
function Comment({ text }) {
  return <p>{text}</p>;  // <script> becomes &lt;script&gt;
}

// ⚠️ Dangerous - use only with trusted/sanitized content
import DOMPurify from 'dompurify';

function RichContent({ html }) {
  const sanitized = DOMPurify.sanitize(html);
  return (
    <div dangerouslySetInnerHTML={{ __html: sanitized }} />
  );
}

// ❌ XSS vulnerability
function UnsafeComponent({ userHtml }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: userHtml }} />
  );
}

// ✅ Safe URL handling
function SafeLink({ url, children }) {
  const isValidUrl = (url) => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  };
  
  if (!isValidUrl(url)) {
    return <span>{children}</span>;
  }
  
  return <a href={url}>{children}</a>;
}`,
    tags: ['security', 'xss', 'sanitization'],
    timeEstimate: 5
  },
  {
    id: 'sec-2',
    category: 'Security',
    question: 'What is CSRF and how do you prevent it in React applications?',
    answer: `CSRF (Cross-Site Request Forgery) tricks authenticated users into submitting malicious requests.

Prevention strategies:

1. CSRF Tokens
   - Server generates unique token per session
   - Include in forms/requests
   - Server validates on each request

2. SameSite Cookies
   - Set SameSite=Strict or SameSite=Lax
   - Prevents cookies from being sent cross-origin

3. Double Submit Cookie
   - Send token in both cookie and request body
   - Server compares them

4. Custom Request Headers
   - Add custom headers that can't be set cross-origin
   - X-Requested-With or custom token header`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Getting CSRF token from meta tag (Rails-style)
function getCSRFToken() {
  return document.querySelector('meta[name="csrf-token"]')?.content;
}

// Include in fetch requests
async function secureFetch(url, options = {}) {
  const csrfToken = getCSRFToken();
  
  return fetch(url, {
    ...options,
    credentials: 'include',  // Include cookies
    headers: {
      ...options.headers,
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
    },
  });
}

// Using with forms
function SecureForm() {
  const csrfToken = getCSRFToken();
  
  return (
    <form method="POST" action="/api/submit">
      <input type="hidden" name="_csrf" value={csrfToken} />
      {/* form fields */}
    </form>
  );
}

// Axios interceptor approach
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

// Next.js Server Action approach (built-in CSRF protection)
// Server Actions automatically include CSRF protection
async function submitForm(formData) {
  'use server';
  // Automatically protected
}`,
    tags: ['security', 'csrf', 'authentication'],
    timeEstimate: 5
  },
  {
    id: 'sec-3',
    category: 'Security',
    question: 'How do you securely store tokens and sensitive data in React?',
    answer: `Storage options and their security implications:

localStorage:
- Persists across sessions
- Accessible to JavaScript (XSS risk)
- Never for highly sensitive data

sessionStorage:
- Cleared when tab closes
- Same XSS vulnerability as localStorage

HTTP-only Cookies:
- Not accessible to JavaScript
- Best for authentication tokens
- Configure: HttpOnly, Secure, SameSite

Memory (state):
- Cleared on page refresh
- Safest from XSS
- Good for short-lived tokens

Best practice: Use HTTP-only cookies for auth tokens.`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// ❌ Bad - Token accessible to XSS attacks
localStorage.setItem('authToken', token);

// Retrieving (vulnerable to XSS)
const token = localStorage.getItem('authToken');

// ✅ Better - HTTP-only cookie (server-side)
// Express.js example
res.cookie('authToken', token, {
  httpOnly: true,      // Not accessible to JavaScript
  secure: true,        // HTTPS only
  sameSite: 'strict',  // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
});

// Next.js API route
import { cookies } from 'next/headers';

export async function POST(request) {
  const token = generateToken();
  
  cookies().set('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
  
  return Response.json({ success: true });
}

// ✅ For short-lived data, use memory + context
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  
  // Token only in memory, refresh token in HTTP-only cookie
  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}`,
    tags: ['security', 'tokens', 'storage', 'authentication'],
    timeEstimate: 5
  },
  {
    id: 'sec-4',
    category: 'Security',
    question: 'What is Content Security Policy and how do you implement it in a React app?',
    answer: `CSP (Content Security Policy) is a security header that helps prevent XSS, clickjacking, and other code injection attacks.

Key directives:
- default-src: Fallback for other directives
- script-src: Allowed script sources
- style-src: Allowed style sources
- img-src: Allowed image sources
- connect-src: Allowed fetch/XHR destinations
- frame-ancestors: Who can embed this page

Implementation:
- HTTP header (preferred)
- Meta tag (limited)

Challenges with React:
- Inline scripts need 'unsafe-inline' or nonces
- Style-in-JS libraries may need configuration`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Next.js - next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://api.example.com",
      "frame-ancestors 'none'",
    ].join('; ')
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

// Using nonces for stricter CSP (Next.js middleware)
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  const csp = [
    \`script-src 'self' 'nonce-\${nonce}'\`,
    "style-src 'self' 'unsafe-inline'",
    // ... other directives
  ].join('; ');
  
  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('x-nonce', nonce);
  
  return response;
}

// Meta tag approach (limited)
<Head>
  <meta 
    httpEquiv="Content-Security-Policy" 
    content="default-src 'self'; script-src 'self'" 
  />
</Head>`,
    tags: ['security', 'csp', 'headers', 'xss'],
    timeEstimate: 6
  },
  {
    id: 'sec-5',
    category: 'Security',
    question: 'How do you prevent clickjacking attacks in React applications?',
    answer: `Clickjacking tricks users into clicking on hidden elements by overlaying transparent iframes on legitimate UI.

Prevention methods:

1. X-Frame-Options header
   - DENY: Cannot be embedded anywhere
   - SAMEORIGIN: Only same origin can embed

2. CSP frame-ancestors directive (modern)
   - More flexible than X-Frame-Options
   - Supports multiple origins

3. JavaScript frame-busting (legacy fallback)
   - Can be bypassed, not recommended alone

Best practice: Use both X-Frame-Options and CSP.`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Next.js security headers
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',  // or 'SAMEORIGIN'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none'",  // or 'self'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

// Express.js with helmet
import helmet from 'helmet';

app.use(helmet.frameguard({ action: 'deny' }));
// or
app.use(helmet.contentSecurityPolicy({
  directives: {
    frameAncestors: ["'none'"],
  },
}));

// JavaScript frame-busting (legacy fallback)
// Not reliable alone - use headers
if (window.top !== window.self) {
  window.top.location = window.self.location;
}`,
    tags: ['security', 'clickjacking', 'headers', 'iframe'],
    timeEstimate: 4
  },
  {
    id: 'sec-6',
    category: 'Security',
    question: 'How do you handle authentication and authorization securely in React?',
    answer: `Authentication (who you are) and Authorization (what you can do):

Authentication best practices:
- Use established auth providers (Auth0, Clerk, NextAuth)
- Store tokens in HTTP-only cookies
- Implement token refresh strategies
- Use secure password hashing (server-side)

Authorization patterns:
- Role-Based Access Control (RBAC)
- Permission-based checks
- Route guards
- Server-side validation (ALWAYS)

Key principle: Never trust the client. Always validate on the server.`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Route protection in Next.js App Router
// middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const token = await getToken({ req: request });
  
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

// Server Component authorization
async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/unauthorized');
  }
  
  return <AdminDashboard />;
}

// RBAC hook for client components
function useAuthorization() {
  const { data: session } = useSession();
  
  const can = useCallback((permission) => {
    const userPermissions = session?.user?.permissions || [];
    return userPermissions.includes(permission);
  }, [session]);
  
  const hasRole = useCallback((role) => {
    return session?.user?.role === role;
  }, [session]);
  
  return { can, hasRole, isAuthenticated: !!session };
}

// Usage
function EditButton({ postId }) {
  const { can } = useAuthorization();
  
  if (!can('posts:edit')) return null;
  
  return <button onClick={() => editPost(postId)}>Edit</button>;
}`,
    tags: ['security', 'authentication', 'authorization', 'rbac'],
    timeEstimate: 6
  },
  {
    id: 'sec-7',
    category: 'Security',
    question: 'What are Server Actions security considerations in Next.js?',
    answer: `Server Actions run on the server but can be invoked from the client. Security considerations:

1. Always validate inputs
   - User can call actions directly with any payload
   - Use Zod or similar for validation

2. Check authentication/authorization
   - Actions don't automatically check auth
   - Verify user has permission

3. CSRF protection
   - Built-in in Next.js Server Actions
   - Uses same-origin validation

4. Rate limiting
   - Prevent abuse of actions
   - Implement server-side

5. Sensitive data exposure
   - Return only necessary data
   - Don't expose internal errors`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Secure Server Action
'use server';

import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

const createPostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(10000),
});

export async function createPost(formData: FormData) {
  // 1. Check authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  // 2. Validate inputs
  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
  };
  
  const result = createPostSchema.safeParse(rawData);
  if (!result.success) {
    return { error: 'Invalid input', details: result.error.flatten() };
  }
  
  const { title, content } = result.data;
  
  // 3. Check authorization
  const user = await db.user.findUnique({ where: { id: session.user.id }});
  if (!user.canCreatePosts) {
    throw new Error('Forbidden');
  }
  
  try {
    // 4. Perform action
    const post = await db.post.create({
      data: { title, content, authorId: session.user.id },
    });
    
    revalidatePath('/posts');
    
    // 5. Return only necessary data
    return { success: true, postId: post.id };
  } catch (error) {
    // 6. Don't expose internal errors
    console.error('Failed to create post:', error);
    return { error: 'Failed to create post' };
  }
}`,
    tags: ['security', 'server-actions', 'next.js', 'validation'],
    timeEstimate: 5
  },
  {
    id: 'sec-8',
    category: 'Security',
    question: 'How do you securely handle environment variables in React/Next.js?',
    answer: `Environment variable security rules:

1. Never expose secrets to the client
   - Only NEXT_PUBLIC_ vars are sent to browser
   - API keys, DB credentials stay server-side

2. Use .env.local for local secrets
   - Add to .gitignore
   - Never commit secrets to git

3. Validate environment at build/startup
   - Fail fast if required vars missing

4. Different configs per environment
   - .env.development, .env.production
   - Override with deployment platform

5. Rotate secrets regularly
   - Use secret management services for production`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// .env.local (never commit!)
DATABASE_URL=postgresql://...
API_SECRET_KEY=secret123
NEXT_PUBLIC_API_URL=https://api.example.com

// .gitignore
.env.local
.env*.local

// Environment validation with Zod
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_SECRET_KEY: z.string().min(10),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
});

// Validate at startup
export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  API_SECRET_KEY: process.env.API_SECRET_KEY,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV,
});

// ❌ Bad - exposes secret to client
export async function getItems() {
  const res = await fetch(url, {
    headers: { 'X-API-Key': process.env.API_SECRET_KEY } // Won't work in client!
  });
}

// ✅ Good - API route handles secret
// pages/api/items.ts
export default async function handler(req, res) {
  const items = await fetch(externalAPI, {
    headers: { 'X-API-Key': process.env.API_SECRET_KEY }
  });
  res.json(await items.json());
}`,
    tags: ['security', 'environment', 'secrets', 'next.js'],
    timeEstimate: 4
  },
  {
    id: 'sec-9',
    category: 'Security',
    question: 'What is SQL injection and how do you prevent it in a React + Node stack?',
    answer: `SQL injection occurs when untrusted data is inserted into SQL queries, allowing attackers to execute malicious SQL.

Prevention:

1. Parameterized queries / Prepared statements
   - Never concatenate user input into SQL
   - Use query parameters/placeholders

2. ORMs (Prisma, Drizzle, etc.)
   - Handle parameterization automatically
   - Still validate inputs

3. Input validation
   - Whitelist allowed values
   - Validate types and formats

4. Least privilege
   - DB user should have minimal permissions

5. Stored procedures
   - Pre-compiled queries`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// ❌ VULNERABLE - String concatenation
const query = \`SELECT * FROM users WHERE id = \${userId}\`;
// userId = "1; DROP TABLE users; --" → disaster!

// ✅ SAFE - Parameterized query (node-postgres)
const result = await pool.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

// ✅ SAFE - Prisma ORM
const user = await prisma.user.findUnique({
  where: { id: userId }  // Automatically parameterized
});

// ✅ SAFE - Drizzle ORM
const user = await db
  .select()
  .from(users)
  .where(eq(users.id, userId));

// Even with ORMs, validate input!
import { z } from 'zod';

const userIdSchema = z.string().uuid();

async function getUser(userId: string) {
  const validatedId = userIdSchema.parse(userId);
  return prisma.user.findUnique({ where: { id: validatedId } });
}

// ❌ VULNERABLE - Raw query with user input
const result = await prisma.$queryRaw\`
  SELECT * FROM users WHERE name = '\${name}'
\`;

// ✅ SAFE - Raw query with Prisma.sql
import { Prisma } from '@prisma/client';

const result = await prisma.$queryRaw(
  Prisma.sql\`SELECT * FROM users WHERE name = \${name}\`
);`,
    tags: ['security', 'sql-injection', 'database', 'validation'],
    timeEstimate: 5
  },
  {
    id: 'sec-10',
    category: 'Security',
    question: 'How do you implement rate limiting to protect your React application?',
    answer: `Rate limiting prevents abuse by limiting requests per client over time.

Implementation strategies:

1. API Gateway level (Vercel, Cloudflare)
   - Best for DDoS protection
   - No code changes needed

2. Middleware level (Express, Next.js)
   - Fine-grained control
   - Per-route limits

3. Database-backed (Redis)
   - Distributed systems
   - Persistent across restarts

Algorithms:
- Fixed window
- Sliding window
- Token bucket
- Leaky bucket`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Next.js with Upstash Redis rate limiting
// lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
  analytics: true,
});

// middleware.ts
import { NextResponse } from 'next/server';
import { ratelimit } from './lib/ratelimit';

export async function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const ip = request.ip ?? '127.0.0.1';
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        }
      );
    }
  }
  
  return NextResponse.next();
}

// Express rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Per-user rate limiting
const userLimiter = rateLimit({
  keyGenerator: (req) => req.user?.id || req.ip,
  max: 100,
});`,
    tags: ['security', 'rate-limiting', 'api', 'ddos'],
    timeEstimate: 5
  },
  {
    id: 'sec-11',
    category: 'Security',
    question: 'How do you implement secure file uploads in React/Next.js?',
    answer: `File uploads are a common attack vector. Security measures:

Validation:
- Verify file type (magic bytes, not just extension)
- Limit file size
- Sanitize filenames
- Scan for malware

Storage:
- Never store in public directories
- Use random filenames
- Store outside web root
- Consider cloud storage (S3) with signed URLs`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Server Action with validation
'use server';
import { randomUUID } from 'crypto';
import { fileTypeFromBuffer } from 'file-type';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;
  
  if (!file) {
    return { error: 'No file provided' };
  }
  
  // Size check
  if (file.size > MAX_SIZE) {
    return { error: 'File too large' };
  }
  
  // Get actual file type from magic bytes
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileType = await fileTypeFromBuffer(buffer);
  
  if (!fileType || !ALLOWED_TYPES.includes(fileType.mime)) {
    return { error: 'Invalid file type' };
  }
  
  // Generate random filename
  const filename = \`\${randomUUID()}.\${fileType.ext}\`;
  
  // Upload to S3 with private ACL
  await s3.upload({
    Bucket: process.env.S3_BUCKET,
    Key: \`uploads/\${filename}\`,
    Body: buffer,
    ContentType: fileType.mime,
    ACL: 'private'
  }).promise();
  
  // Store reference in database
  await db.file.create({
    data: { filename, userId: session.userId }
  });
  
  return { success: true, filename };
}

// Generate signed URL for download
export async function getFileUrl(filename: string) {
  // Verify user has access
  const file = await db.file.findFirst({
    where: { filename, userId: session.userId }
  });
  
  if (!file) {
    throw new Error('Access denied');
  }
  
  const url = await s3.getSignedUrlPromise('getObject', {
    Bucket: process.env.S3_BUCKET,
    Key: \`uploads/\${filename}\`,
    Expires: 60 // 1 minute
  });
  
  return url;
}`,
    tags: ['security', 'file-upload', 'validation', 's3'],
    timeEstimate: 5
  },
  {
    id: 'sec-12',
    category: 'Security',
    question: 'What is CORS and how do you configure it securely?',
    answer: `CORS (Cross-Origin Resource Sharing) controls which domains can access your API.

Security concerns:
- Avoid wildcard (*) for authenticated endpoints
- Whitelist specific origins
- Be careful with credentials: true
- Validate origin against allowlist

Misconfigurations can expose APIs to unauthorized access.`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Next.js API Route with CORS
// app/api/data/route.ts
const allowedOrigins = [
  'https://myapp.com',
  'https://admin.myapp.com',
  process.env.NODE_ENV === 'development' && 'http://localhost:3000'
].filter(Boolean);

export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  
  // Validate origin
  if (origin && !allowedOrigins.includes(origin)) {
    return new Response('Forbidden', { status: 403 });
  }
  
  const response = NextResponse.json({ data: 'secret' });
  
  // Set CORS headers
  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

// Preflight handler
export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  
  if (!origin || !allowedOrigins.includes(origin)) {
    return new Response(null, { status: 403 });
  }
  
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
}

// Express CORS configuration
import cors from 'cors';

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));`,
    tags: ['security', 'cors', 'api', 'http'],
    timeEstimate: 4
  },
  {
    id: 'sec-13',
    category: 'Security',
    question: 'How do you prevent SQL Injection in React applications?',
    answer: `SQL Injection occurs when user input is directly interpolated into SQL queries. Prevention:

1. Use parameterized queries (prepared statements)
2. Use ORMs (Prisma, Drizzle, TypeORM)
3. Input validation and sanitization
4. Principle of least privilege for DB users
5. Use stored procedures where appropriate

Never concatenate user input into SQL strings!`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// ❌ VULNERABLE - String interpolation
const userId = req.query.id;
const query = \`SELECT * FROM users WHERE id = '\${userId}'\`;
// Attacker: ?id=' OR '1'='1
// Result: SELECT * FROM users WHERE id = '' OR '1'='1'

// ✅ SAFE - Prisma (ORM)
const user = await prisma.user.findUnique({
  where: { id: userId }
});

// ✅ SAFE - Parameterized query
const result = await db.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

// ✅ SAFE - Drizzle ORM
const users = await db.select()
  .from(usersTable)
  .where(eq(usersTable.id, userId));

// Additional validation
import { z } from 'zod';

const UserIdSchema = z.string().uuid();

export async function getUser(rawId: string) {
  // Validate input format
  const result = UserIdSchema.safeParse(rawId);
  if (!result.success) {
    throw new Error('Invalid user ID');
  }
  
  const userId = result.data;
  
  return prisma.user.findUnique({
    where: { id: userId }
  });
}

// For raw queries, use sql tagged template (Prisma)
import { Prisma } from '@prisma/client';

const searchTerm = 'test';
const users = await prisma.$queryRaw\`
  SELECT * FROM users 
  WHERE name LIKE \${Prisma.sql\`%\${searchTerm}%\`}
\`;`,
    tags: ['security', 'sql-injection', 'database', 'orm'],
    timeEstimate: 4
  },
  {
    id: 'sec-14',
    category: 'Security',
    question: 'How do you implement secure session management?',
    answer: `Session security is critical for authentication. Best practices:

Session storage:
- Use httpOnly cookies (not localStorage)
- Set secure flag in production
- Use SameSite attribute
- Implement session rotation

Token management:
- Short expiration for access tokens
- Longer-lived refresh tokens
- Rotate refresh tokens on use
- Revocation mechanism`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Secure cookie settings
const sessionCookie = {
  name: 'session',
  options: {
    httpOnly: true,      // No JavaScript access
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',     // CSRF protection
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  }
};

// Next.js Server Action for login
export async function login(formData: FormData) {
  'use server';
  
  const { email, password } = Object.fromEntries(formData);
  const user = await validateCredentials(email, password);
  
  if (!user) {
    return { error: 'Invalid credentials' };
  }
  
  // Create session
  const sessionToken = crypto.randomUUID();
  await db.session.create({
    data: {
      token: sessionToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });
  
  // Set secure cookie
  cookies().set('session', sessionToken, sessionCookie.options);
  
  redirect('/dashboard');
}

// Session rotation on sensitive actions
export async function changePassword(formData: FormData) {
  'use server';
  
  const session = await getSession();
  await updatePassword(session.userId, formData.get('newPassword'));
  
  // Invalidate all other sessions
  await db.session.deleteMany({
    where: { 
      userId: session.userId,
      token: { not: session.token }
    }
  });
  
  // Create new session token
  const newToken = crypto.randomUUID();
  await db.session.update({
    where: { token: session.token },
    data: { token: newToken }
  });
  
  cookies().set('session', newToken, sessionCookie.options);
}

// Logout - invalidate session
export async function logout() {
  'use server';
  
  const sessionToken = cookies().get('session')?.value;
  
  if (sessionToken) {
    await db.session.delete({ where: { token: sessionToken } });
  }
  
  cookies().delete('session');
  redirect('/login');
}`,
    tags: ['security', 'sessions', 'cookies', 'authentication'],
    timeEstimate: 5
  },
  {
    id: 'sec-15',
    category: 'Security',
    question: 'What is Clickjacking and how do you prevent it?',
    answer: `Clickjacking tricks users into clicking hidden elements by overlaying transparent iframes on legitimate pages.

Prevention methods:
1. X-Frame-Options header
2. Content-Security-Policy frame-ancestors
3. JavaScript frame busting (legacy)

frame-ancestors is more flexible and recommended for modern browsers.`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Next.js security headers
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent framing (clickjacking protection)
          {
            key: 'X-Frame-Options',
            value: 'DENY' // or 'SAMEORIGIN'
          },
          // Modern alternative with more control
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none'" // No framing allowed
            // Or specific origins:
            // value: "frame-ancestors 'self' https://trusted.com"
          },
        ],
      },
    ];
  },
};

// Middleware approach
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Content-Security-Policy', "frame-ancestors 'none'");
  
  return response;
}

// For embedding in specific domains
const csp = [
  "frame-ancestors 'self' https://embed.myapp.com",
].join('; ');

// Legacy JavaScript frame buster (not reliable)
if (top !== self) {
  top.location = self.location;
}

// Allow specific pages to be framed (e.g., embed widgets)
// pages/embed/widget/page.tsx
export const metadata = {
  headers: {
    'Content-Security-Policy': "frame-ancestors 'self' https://partner.com"
  }
};`,
    tags: ['security', 'clickjacking', 'headers', 'csp'],
    timeEstimate: 3
  },
  {
    id: 'sec-16',
    category: 'Security',
    question: 'How do you handle sensitive data in React applications?',
    answer: `Sensitive data requires careful handling to prevent exposure:

Client-side:
- Never store secrets in frontend code
- Use environment variables (NEXT_PUBLIC_) carefully
- Clear sensitive state when not needed
- Don't log sensitive data

Server-side:
- Use environment variables for secrets
- Encrypt sensitive data at rest
- Use secure secret management (Vault, AWS Secrets Manager)
- Implement proper access controls`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// ❌ BAD - Secrets in client code
const API_KEY = 'sk-secret-key-12345';

// ❌ BAD - NEXT_PUBLIC_ exposes to client
NEXT_PUBLIC_API_SECRET=secret // Don't do this!

// ✅ GOOD - Server-only environment variable
// .env.local
API_SECRET=secret-key

// Server Component / Server Action
const apiSecret = process.env.API_SECRET;

// ✅ GOOD - Clear sensitive data when done
function PaymentForm() {
  const [cardNumber, setCardNumber] = useState('');
  
  const handleSubmit = async () => {
    await processPayment(cardNumber);
    setCardNumber(''); // Clear immediately after use
  };
}

// ✅ GOOD - Mask sensitive data in UI
function AccountNumber({ number }) {
  const masked = \`****\${number.slice(-4)}\`;
  return <span>{masked}</span>;
}

// ✅ GOOD - Exclude from logging
function logSanitized(data) {
  const sanitized = { ...data };
  delete sanitized.password;
  delete sanitized.token;
  delete sanitized.creditCard;
  console.log(sanitized);
}

// ✅ GOOD - Server-side API key proxy
// app/api/external/route.ts
export async function GET(request: NextRequest) {
  // Client never sees the API key
  const response = await fetch('https://api.external.com/data', {
    headers: {
      'Authorization': \`Bearer \${process.env.EXTERNAL_API_KEY}\`
    }
  });
  
  return NextResponse.json(await response.json());
}

// ✅ GOOD - Encrypt at rest
import { createCipheriv, createDecipheriv } from 'crypto';

function encrypt(text: string, key: Buffer) {
  const iv = crypto.randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { encrypted, iv, tag };
}`,
    tags: ['security', 'secrets', 'encryption', 'data-protection'],
    timeEstimate: 4
  },
  {
    id: 'sec-17',
    category: 'Security',
    question: 'What is prototype pollution and how do you prevent it?',
    answer: `Prototype pollution occurs when attackers modify Object.prototype, affecting all objects in the application.

Attack vectors:
- Deep merge utilities
- Query string parsing
- JSON parsing with unsafe keys
- Object.assign with user input

Prevention:
- Object.create(null) for dictionaries
- Validate object keys
- Use Map instead of objects
- Freeze prototypes in critical code`,
    difficulty: 'expert',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// ❌ VULNERABLE - Unsafe deep merge
function deepMerge(target, source) {
  for (const key in source) {
    if (typeof source[key] === 'object') {
      target[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Attacker input: { "__proto__": { "admin": true } }
deepMerge({}, userInput);
console.log({}.admin); // true - Polluted!

// ✅ SAFE - Check for dangerous keys
const FORBIDDEN_KEYS = ['__proto__', 'constructor', 'prototype'];

function safeDeepMerge(target, source) {
  for (const key in source) {
    if (FORBIDDEN_KEYS.includes(key)) continue;
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
    
    if (typeof source[key] === 'object' && source[key] !== null) {
      target[key] = safeDeepMerge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// ✅ SAFE - Use Object.create(null)
const safeDict = Object.create(null);
safeDict[userKey] = value; // No prototype chain

// ✅ SAFE - Use Map for user-controlled keys
const userSettings = new Map();
userSettings.set(userKey, value);

// ✅ SAFE - Freeze prototype (defensive)
Object.freeze(Object.prototype);

// ✅ SAFE - Validate keys with schema
import { z } from 'zod';

const SettingsSchema = z.object({
  theme: z.enum(['light', 'dark']),
  language: z.string()
}).strict(); // No extra properties

const settings = SettingsSchema.parse(userInput);`,
    tags: ['security', 'prototype-pollution', 'javascript', 'objects'],
    timeEstimate: 5
  },
  {
    id: 'sec-18',
    category: 'Security',
    question: 'How do you implement secure password handling?',
    answer: `Password security involves multiple layers:

Storage:
- Never store plain text passwords
- Use bcrypt, argon2, or scrypt
- Add unique salt per password
- Use high work factor

Validation:
- Enforce minimum length (12+ chars)
- Check against breached password lists
- Rate limit login attempts
- Implement account lockout`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `import bcrypt from 'bcrypt';
import { z } from 'zod';

// Password validation schema
const PasswordSchema = z.string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[a-z]/, 'Must contain lowercase letter')
  .regex(/[0-9]/, 'Must contain number')
  .regex(/[^A-Za-z0-9]/, 'Must contain special character');

// Hash password before storing
const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Registration with validation
export async function register(formData: FormData) {
  'use server';
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  // Validate password strength
  const passwordResult = PasswordSchema.safeParse(password);
  if (!passwordResult.success) {
    return { error: passwordResult.error.errors[0].message };
  }
  
  // Check breached passwords (using k-anonymity)
  const isBreached = await checkPwnedPassword(password);
  if (isBreached) {
    return { error: 'This password has been exposed in a data breach' };
  }
  
  // Hash and store
  const passwordHash = await hashPassword(password);
  
  await db.user.create({
    data: {
      email,
      passwordHash // Never store plain password!
    }
  });
}

// Check Have I Been Pwned API
async function checkPwnedPassword(password: string): Promise<boolean> {
  const hash = crypto.createHash('sha1')
    .update(password)
    .digest('hex')
    .toUpperCase();
  
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);
  
  const response = await fetch(
    \`https://api.pwnedpasswords.com/range/\${prefix}\`
  );
  const text = await response.text();
  
  return text.split('\\n').some(line => line.startsWith(suffix));
}

// Login with rate limiting
const loginAttempts = new Map();

export async function login(formData: FormData) {
  'use server';
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  // Check rate limit
  const attempts = loginAttempts.get(email) || 0;
  if (attempts >= 5) {
    return { error: 'Account locked. Try again later.' };
  }
  
  const user = await db.user.findUnique({ where: { email } });
  
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    loginAttempts.set(email, attempts + 1);
    return { error: 'Invalid credentials' };
  }
  
  // Reset attempts on success
  loginAttempts.delete(email);
  
  // Create session...
}`,
    tags: ['security', 'passwords', 'hashing', 'authentication'],
    timeEstimate: 5
  },
  {
    id: 'sec-19',
    category: 'Security',
    question: 'What is Server-Side Request Forgery (SSRF) and how do you prevent it?',
    answer: `SSRF occurs when an attacker makes the server request internal resources or external sites on their behalf.

Attack scenarios:
- Access internal APIs/services
- Scan internal network
- Read cloud metadata (AWS, GCP)
- Bypass firewalls

Prevention:
- Allowlist valid URLs/domains
- Block internal IP ranges
- Don't pass URLs directly from users
- Use URL parsing and validation`,
    difficulty: 'expert',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// ❌ VULNERABLE - Direct user URL
async function fetchUrl(request: Request) {
  const { url } = await request.json();
  const response = await fetch(url); // SSRF vulnerability!
  return response.text();
}
// Attacker: { "url": "http://169.254.169.254/latest/meta-data/" }
// AWS metadata exposed!

// ✅ SAFE - Validate and allowlist
const ALLOWED_DOMAINS = [
  'api.example.com',
  'cdn.example.com'
];

async function safeFetch(request: Request) {
  const { url } = await request.json();
  
  // Parse and validate URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return new Response('Invalid URL', { status: 400 });
  }
  
  // Check protocol
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return new Response('Invalid protocol', { status: 400 });
  }
  
  // Check against allowlist
  if (!ALLOWED_DOMAINS.includes(parsedUrl.hostname)) {
    return new Response('Domain not allowed', { status: 403 });
  }
  
  // Block internal IPs
  const resolved = await dns.lookup(parsedUrl.hostname);
  if (isInternalIP(resolved.address)) {
    return new Response('Internal IPs not allowed', { status: 403 });
  }
  
  const response = await fetch(url);
  return response.text();
}

function isInternalIP(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  
  // Block private ranges
  if (parts[0] === 10) return true; // 10.0.0.0/8
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true; // 172.16.0.0/12
  if (parts[0] === 192 && parts[1] === 168) return true; // 192.168.0.0/16
  if (parts[0] === 127) return true; // Loopback
  if (parts[0] === 169 && parts[1] === 254) return true; // Link-local (AWS metadata)
  
  return false;
}

// ✅ Better - Use IDs instead of URLs
async function fetchImage(imageId: string) {
  // Validate ID format
  if (!isValidUUID(imageId)) {
    throw new Error('Invalid image ID');
  }
  
  // Construct URL server-side
  const url = \`https://cdn.example.com/images/\${imageId}\`;
  return fetch(url);
}`,
    tags: ['security', 'ssrf', 'url-validation', 'server'],
    timeEstimate: 5
  },
  {
    id: 'sec-20',
    category: 'Security',
    question: 'How do you implement secure API key management?',
    answer: `API keys need protection at multiple levels:

Storage:
- Environment variables for server
- Secret managers for production
- Never commit to version control
- Rotate keys regularly

Usage:
- Server-side proxy for third-party APIs
- Scope keys to minimum permissions
- Monitor key usage
- Implement key expiration`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// ❌ BAD - Key in client code
const API_KEY = 'sk_live_12345';

// ❌ BAD - Key in repository
// .env (committed to git)
API_KEY=secret

// ✅ GOOD - .env.local (gitignored)
// .env.local
STRIPE_SECRET_KEY=sk_live_12345

// ✅ GOOD - Server-side proxy
// app/api/stripe/create-intent/route.ts
export async function POST(request: Request) {
  const { amount } = await request.json();
  
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd'
  });
  
  // Only return what client needs
  return NextResponse.json({
    clientSecret: paymentIntent.client_secret
  });
}

// ✅ GOOD - Use secret manager in production
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

const secretsManager = new SecretsManager({ region: 'us-east-1' });

async function getSecret(secretName: string) {
  const response = await secretsManager.getSecretValue({
    SecretId: secretName
  });
  return JSON.parse(response.SecretString || '{}');
}

// Initialize secrets at startup
let secrets: Record<string, string>;

async function initSecrets() {
  if (process.env.NODE_ENV === 'production') {
    secrets = await getSecret('myapp/production');
  } else {
    secrets = {
      stripeKey: process.env.STRIPE_SECRET_KEY!,
      dbPassword: process.env.DB_PASSWORD!
    };
  }
}

// ✅ GOOD - Key rotation
async function rotateApiKey(userId: string) {
  const newKey = crypto.randomBytes(32).toString('hex');
  const hashedKey = await bcrypt.hash(newKey, 10);
  
  await db.apiKey.update({
    where: { userId },
    data: {
      keyHash: hashedKey,
      rotatedAt: new Date()
    }
  });
  
  // Return unhashed key once - user must store it
  return newKey;
}`,
    tags: ['security', 'api-keys', 'secrets', 'environment'],
    timeEstimate: 4
  },
  {
    id: 'sec-21',
    category: 'Security',
    question: 'What are the security considerations for third-party dependencies?',
    answer: `Third-party packages can introduce vulnerabilities:

Risks:
- Known vulnerabilities (CVEs)
- Supply chain attacks
- Malicious packages
- Abandoned packages

Mitigation:
- Regular npm audit
- Lock file integrity
- Dependabot/Renovate for updates
- Review package before installing
- Use fewer dependencies`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Check for vulnerabilities
npm audit

// Auto-fix vulnerabilities
npm audit fix

// Force fix (may break things)
npm audit fix --force

// package.json - override vulnerable transitive deps
{
  "overrides": {
    "vulnerable-package": "^2.0.0"
  }
}

// Lock file integrity
// .npmrc
integrity-check=true
audit=true

// CI/CD security check
// .github/workflows/security.yml
name: Security Check
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm audit --audit-level=high

// Use specific versions (not ranges)
{
  "dependencies": {
    "lodash": "4.17.21", // Exact version
    "express": "^4.18.0" // Range - more risk
  }
}

// Review packages before installing
// Check npm stats, GitHub activity, maintainers
// Use https://snyk.io/advisor/

// Alternative: Reduce dependencies
// Instead of lodash for one function:
import debounce from 'lodash/debounce';

// Write it yourself:
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Subresource Integrity for CDN scripts
<script
  src="https://cdn.example.com/lib.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous"
></script>`,
    tags: ['security', 'dependencies', 'npm', 'supply-chain'],
    timeEstimate: 4
  },
  {
    id: 'sec-22',
    category: 'Security',
    question: 'How do you implement secure error handling?',
    answer: `Error handling affects security in multiple ways:

Risks:
- Information disclosure (stack traces)
- Missing error handling (crashes)
- Inconsistent error responses

Best practices:
- Generic user-facing messages
- Detailed logging (server-side only)
- Consistent error response format
- Don't expose internal details`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// ❌ BAD - Exposes internal details
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack, // Exposes code structure!
    query: req.query  // Exposes user input
  });
});

// ✅ GOOD - Generic response, detailed logging
app.use((err, req, res, next) => {
  // Log full error for debugging
  logger.error({
    error: err.message,
    stack: err.stack,
    path: req.path,
    userId: req.user?.id
  });
  
  // Generic response to client
  res.status(500).json({
    error: 'An unexpected error occurred',
    requestId: req.id // For support reference
  });
});

// Next.js error handling
// app/error.tsx
'use client';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log error (in production, send to monitoring)
  useEffect(() => {
    console.error(error);
  }, [error]);
  
  return (
    <div>
      <h2>Something went wrong</h2>
      {/* Don't show error.message in production */}
      {process.env.NODE_ENV === 'development' && (
        <pre>{error.message}</pre>
      )}
      <button onClick={reset}>Try again</button>
    </div>
  );
}

// API route error handling
export async function POST(request: Request) {
  try {
    const data = await processRequest(request);
    return NextResponse.json(data);
  } catch (error) {
    // Log detailed error
    console.error('API Error:', error);
    
    // Return appropriate status without details
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }
    
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Generic 500 for unexpected errors
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}`,
    tags: ['security', 'error-handling', 'logging', 'information-disclosure'],
    timeEstimate: 4
  },
  {
    id: 'sec-23',
    category: 'Security',
    question: 'What is Content Security Policy and how do you configure it?',
    answer: `CSP is an HTTP header that controls what resources can be loaded on your page. It prevents XSS and other injection attacks.

Directives:
- default-src: Fallback for other directives
- script-src: JavaScript sources
- style-src: CSS sources
- img-src: Image sources
- connect-src: XHR/fetch URLs
- frame-ancestors: Who can embed (clickjacking)`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// Next.js CSP configuration
// next.config.js
const ContentSecurityPolicy = \`
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob: https:;
  connect-src 'self' https://api.example.com wss://realtime.example.com;
  frame-ancestors 'none';
  form-action 'self';
  base-uri 'self';
  object-src 'none';
  upgrade-insecure-requests;
\`;

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\\n/g, '')
          }
        ]
      }
    ];
  }
};

// Stricter CSP with nonces (for inline scripts)
// middleware.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export function middleware(request: NextRequest) {
  const nonce = crypto.randomBytes(16).toString('base64');
  
  const csp = \`
    default-src 'self';
    script-src 'self' 'nonce-\${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
  \`.replace(/\\n/g, '');
  
  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('x-nonce', nonce);
  
  return response;
}

// Using nonce in components
// app/layout.tsx
import { headers } from 'next/headers';

export default function RootLayout({ children }) {
  const nonce = headers().get('x-nonce') || '';
  
  return (
    <html>
      <head>
        <script nonce={nonce}>
          {/* Inline script allowed by nonce */}
        </script>
      </head>
      <body>{children}</body>
    </html>
  );
}

// CSP report-uri for monitoring violations
Content-Security-Policy: default-src 'self'; report-uri /api/csp-report;`,
    tags: ['security', 'csp', 'headers', 'xss-prevention'],
    timeEstimate: 5
  },
  {
    id: 'sec-24',
    category: 'Security',
    question: 'How do you implement Two-Factor Authentication (2FA)?',
    answer: `2FA adds a second verification layer beyond passwords:

Methods:
- TOTP (Time-based One-Time Password) - Google Authenticator
- SMS codes (less secure)
- Email codes
- Hardware keys (WebAuthn/FIDO2)

Implementation:
- Generate secret during setup
- Store encrypted secret
- Verify codes during login
- Provide backup codes`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `import { authenticator } from 'otplib';
import QRCode from 'qrcode';

// Enable 2FA - Generate secret
export async function enable2FA() {
  'use server';
  
  const session = await getSession();
  const secret = authenticator.generateSecret();
  
  // Store secret temporarily (not enabled yet)
  await db.user.update({
    where: { id: session.userId },
    data: { totpSecret: encrypt(secret) }
  });
  
  // Generate QR code for authenticator app
  const otpauthUrl = authenticator.keyuri(
    session.email,
    'MyApp',
    secret
  );
  
  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
  
  return { qrCode: qrCodeDataUrl, secret };
}

// Verify and activate 2FA
export async function verify2FA(formData: FormData) {
  'use server';
  
  const token = formData.get('token') as string;
  const session = await getSession();
  
  const user = await db.user.findUnique({
    where: { id: session.userId }
  });
  
  const secret = decrypt(user.totpSecret);
  const isValid = authenticator.verify({ token, secret });
  
  if (!isValid) {
    return { error: 'Invalid code' };
  }
  
  // Generate backup codes
  const backupCodes = Array.from({ length: 10 }, () =>
    crypto.randomBytes(4).toString('hex')
  );
  
  await db.user.update({
    where: { id: session.userId },
    data: {
      totpEnabled: true,
      backupCodes: await hashBackupCodes(backupCodes)
    }
  });
  
  return { success: true, backupCodes };
}

// Login with 2FA
export async function login(formData: FormData) {
  'use server';
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const totpToken = formData.get('totp') as string;
  
  const user = await validateCredentials(email, password);
  if (!user) return { error: 'Invalid credentials' };
  
  if (user.totpEnabled) {
    if (!totpToken) {
      return { requires2FA: true };
    }
    
    const secret = decrypt(user.totpSecret);
    const isValid = authenticator.verify({
      token: totpToken,
      secret
    });
    
    if (!isValid) {
      // Check backup codes
      const isBackup = await verifyBackupCode(user.id, totpToken);
      if (!isBackup) {
        return { error: 'Invalid 2FA code' };
      }
    }
  }
  
  // Create session
  await createSession(user.id);
  redirect('/dashboard');
}`,
    tags: ['security', '2fa', 'totp', 'authentication'],
    timeEstimate: 6
  },
  {
    id: 'sec-25',
    category: 'Security',
    question: 'How do you prevent timing attacks in authentication?',
    answer: `Timing attacks exploit measurable differences in operation time to deduce secrets (e.g., password comparison).

Vulnerable operations:
- String comparison (exits early on mismatch)
- Database lookups (user exists vs doesn't)
- Password verification

Prevention:
- Constant-time comparison
- Same response time for all paths
- Rate limiting
- Generic error messages`,
    difficulty: 'expert',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `import crypto from 'crypto';

// ❌ VULNERABLE - Non-constant time comparison
function unsafeCompare(a: string, b: string): boolean {
  return a === b; // Exits early on first mismatch
}

// ✅ SAFE - Constant-time comparison
function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  
  if (bufA.length !== bufB.length) {
    // Still compare to maintain constant time
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  
  return crypto.timingSafeEqual(bufA, bufB);
}

// ❌ VULNERABLE - Different paths for existing/non-existing users
async function vulnerableLogin(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email } });
  
  if (!user) {
    return { error: 'Invalid credentials' }; // Fast return
  }
  
  const valid = await bcrypt.compare(password, user.passwordHash); // Slow
  if (!valid) {
    return { error: 'Invalid credentials' };
  }
  
  return { success: true };
}

// ✅ SAFE - Same execution path
async function safeLogin(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email } });
  
  // Always perform hash comparison
  const passwordHash = user?.passwordHash || 
    '$2b$10$invalidhashtocomparetiming'; // Dummy hash
  
  const valid = await bcrypt.compare(password, passwordHash);
  
  if (!user || !valid) {
    // Add small random delay to obscure timing
    await sleep(Math.random() * 100);
    return { error: 'Invalid credentials' };
  }
  
  return { success: true };
}

// Rate limiting also helps
const loginLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5 // 5 attempts per 15 minutes
});

// Safe token comparison
async function verifyApiKey(providedKey: string): Promise<User | null> {
  const hashedProvided = crypto
    .createHash('sha256')
    .update(providedKey)
    .digest();
  
  const keys = await db.apiKey.findMany();
  
  for (const key of keys) {
    const hashedStored = Buffer.from(key.hash, 'hex');
    
    if (crypto.timingSafeEqual(hashedProvided, hashedStored)) {
      return key.user;
    }
  }
  
  return null;
}`,
    tags: ['security', 'timing-attacks', 'authentication', 'cryptography'],
    timeEstimate: 5
  },
  {
    id: 'sec-26',
    category: 'Security',
    question: 'What is Mass Assignment vulnerability and how do you prevent it?',
    answer: `Mass Assignment occurs when an attacker includes extra fields in requests that get saved to the database.

Example: User sends {role: 'admin'} in profile update
Result: User becomes admin

Prevention:
- Allowlist accepted fields
- Use DTOs (Data Transfer Objects)
- Validate with schemas (Zod)
- Don't spread request body directly`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// ❌ VULNERABLE - Spreads entire body
export async function updateProfile(request: Request) {
  const body = await request.json();
  const session = await getSession();
  
  await db.user.update({
    where: { id: session.userId },
    data: body // Attacker can add { role: 'admin' }!
  });
}

// ✅ SAFE - Allowlist fields with Zod
import { z } from 'zod';

const UpdateProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  bio: z.string().max(500).optional()
  // role is NOT allowed
});

export async function updateProfile(request: Request) {
  const body = await request.json();
  const session = await getSession();
  
  // Only allowed fields are extracted
  const validated = UpdateProfileSchema.parse(body);
  
  await db.user.update({
    where: { id: session.userId },
    data: validated
  });
}

// ✅ SAFE - Explicit field selection
export async function updateProfile(formData: FormData) {
  'use server';
  
  const session = await getSession();
  
  // Explicitly pick allowed fields
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  
  await db.user.update({
    where: { id: session.userId },
    data: {
      name,
      email
      // role intentionally excluded
    }
  });
}

// ✅ SAFE - DTO pattern
interface UpdateUserDTO {
  name?: string;
  email?: string;
  bio?: string;
}

function toUpdateDTO(input: unknown): UpdateUserDTO {
  const { name, email, bio } = input as any;
  return {
    ...(name && { name: String(name) }),
    ...(email && { email: String(email) }),
    ...(bio && { bio: String(bio) })
  };
}

export async function updateProfile(request: Request) {
  const body = await request.json();
  const dto = toUpdateDTO(body);
  
  await db.user.update({
    where: { id: session.userId },
    data: dto
  });
}`,
    tags: ['security', 'mass-assignment', 'validation', 'authorization'],
    timeEstimate: 4
  },
  {
    id: 'sec-27',
    category: 'Security',
    question: 'How do you implement secure logout?',
    answer: `Secure logout requires multiple considerations:

Server-side:
- Invalidate session/token
- Clear refresh tokens
- Revoke all sessions option

Client-side:
- Clear cookies
- Clear localStorage/sessionStorage
- Clear application state
- Redirect to login`,
    difficulty: 'intermediate',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Server Action for logout
export async function logout() {
  'use server';
  
  const sessionToken = cookies().get('session')?.value;
  
  if (sessionToken) {
    // Invalidate session in database
    await db.session.delete({
      where: { token: sessionToken }
    });
  }
  
  // Clear all auth cookies
  cookies().delete('session');
  cookies().delete('refreshToken');
  
  redirect('/login');
}

// Logout from all devices
export async function logoutAllDevices() {
  'use server';
  
  const session = await getSession();
  
  // Delete all user sessions
  await db.session.deleteMany({
    where: { userId: session.userId }
  });
  
  cookies().delete('session');
  cookies().delete('refreshToken');
  
  redirect('/login');
}

// Client-side cleanup
'use client';

function LogoutButton() {
  const handleLogout = async () => {
    // Clear client-side storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear any cached data
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => caches.delete(name))
      );
    }
    
    // Call server logout
    await logout();
    
    // Force page reload to clear memory state
    window.location.href = '/login';
  };
  
  return <button onClick={handleLogout}>Logout</button>;
}

// JWT with blacklist (for stateless auth)
export async function logoutJWT() {
  'use server';
  
  const token = cookies().get('token')?.value;
  
  if (token) {
    const decoded = jwt.decode(token);
    
    // Add to blacklist until expiration
    await redis.set(
      \`blacklist:\${decoded.jti}\`,
      '1',
      'EX',
      decoded.exp - Math.floor(Date.now() / 1000)
    );
  }
  
  cookies().delete('token');
  redirect('/login');
}

// Middleware to check blacklist
async function isTokenBlacklisted(token: string): Promise<boolean> {
  const decoded = jwt.decode(token);
  const blacklisted = await redis.get(\`blacklist:\${decoded.jti}\`);
  return blacklisted === '1';
}`,
    tags: ['security', 'logout', 'sessions', 'authentication'],
    timeEstimate: 4
  },
  {
    id: 'sec-28',
    category: 'Security',
    question: 'What is Open Redirect vulnerability and how do you prevent it?',
    answer: `Open Redirect allows attackers to redirect users to malicious sites through your domain.

Attack: https://trusted.com/redirect?url=https://evil.com
User trusts trusted.com and clicks, ends up on evil.com

Prevention:
- Allowlist valid redirect URLs
- Use relative paths only
- Validate against trusted domains
- Avoid user-controlled redirects`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// ❌ VULNERABLE - Direct user-controlled redirect
export async function GET(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get('returnTo');
  return NextResponse.redirect(returnTo!); // Dangerous!
}

// ✅ SAFE - Validate against allowlist
const ALLOWED_REDIRECTS = [
  '/dashboard',
  '/profile',
  '/settings'
];

export async function GET(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get('returnTo') || '/';
  
  // Only allow relative paths from allowlist
  if (!ALLOWED_REDIRECTS.includes(returnTo)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.redirect(new URL(returnTo, request.url));
}

// ✅ SAFE - Validate same origin
function isSafeRedirect(url: string, baseUrl: string): boolean {
  try {
    const redirectUrl = new URL(url, baseUrl);
    const base = new URL(baseUrl);
    
    // Must be same origin
    return redirectUrl.origin === base.origin;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get('returnTo') || '/';
  const baseUrl = request.nextUrl.origin;
  
  if (!isSafeRedirect(returnTo, baseUrl)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.redirect(new URL(returnTo, baseUrl));
}

// ✅ SAFE - Use signed URLs
import { sign, verify } from 'jsonwebtoken';

function createRedirectToken(path: string): string {
  return sign({ path }, process.env.SECRET!, { expiresIn: '5m' });
}

function getRedirectPath(token: string): string | null {
  try {
    const decoded = verify(token, process.env.SECRET!) as { path: string };
    return decoded.path;
  } catch {
    return null;
  }
}

// Login page
<a href={\`/login?returnTo=\${createRedirectToken('/dashboard')}\`}>
  Login
</a>

// After login
const returnToken = searchParams.get('returnTo');
const returnPath = getRedirectPath(returnToken) || '/';
redirect(returnPath);`,
    tags: ['security', 'open-redirect', 'url-validation', 'phishing'],
    timeEstimate: 4
  },
  {
    id: 'sec-29',
    category: 'Security',
    question: 'How do you implement secure WebSocket connections?',
    answer: `WebSockets require security considerations beyond HTTP:

Authentication:
- Validate during handshake
- Use secure token/cookie
- Re-validate periodically

Protection:
- Use WSS (TLS) in production
- Validate/sanitize messages
- Rate limit connections
- Implement timeouts`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Server-side WebSocket with authentication
import { WebSocketServer } from 'ws';
import { verifyToken } from './auth';

const wss = new WebSocketServer({ noServer: true });

// Upgrade with authentication
server.on('upgrade', async (request, socket, head) => {
  try {
    // Extract token from cookie or header
    const cookies = parseCookies(request.headers.cookie);
    const token = cookies.session;
    
    if (!token) {
      socket.write('HTTP/1.1 401 Unauthorized\\r\\n\\r\\n');
      socket.destroy();
      return;
    }
    
    const user = await verifyToken(token);
    if (!user) {
      socket.write('HTTP/1.1 401 Unauthorized\\r\\n\\r\\n');
      socket.destroy();
      return;
    }
    
    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.user = user; // Attach user to connection
      wss.emit('connection', ws, request);
    });
  } catch (err) {
    socket.write('HTTP/1.1 500 Internal Server Error\\r\\n\\r\\n');
    socket.destroy();
  }
});

// Connection handling with validation
const connectionLimits = new Map();
const MAX_CONNECTIONS_PER_USER = 5;

wss.on('connection', (ws, request) => {
  const userId = ws.user.id;
  
  // Rate limit connections per user
  const userConnections = connectionLimits.get(userId) || 0;
  if (userConnections >= MAX_CONNECTIONS_PER_USER) {
    ws.close(1008, 'Too many connections');
    return;
  }
  connectionLimits.set(userId, userConnections + 1);
  
  // Set timeout for idle connections
  let timeout = setTimeout(() => ws.close(1000, 'Idle timeout'), 300000);
  
  ws.on('message', (data) => {
    // Reset timeout on activity
    clearTimeout(timeout);
    timeout = setTimeout(() => ws.close(1000, 'Idle timeout'), 300000);
    
    // Validate message
    try {
      const message = JSON.parse(data);
      
      // Validate message schema
      const validated = MessageSchema.parse(message);
      
      // Process message...
      handleMessage(ws, validated);
    } catch (err) {
      ws.send(JSON.stringify({ error: 'Invalid message' }));
    }
  });
  
  ws.on('close', () => {
    clearTimeout(timeout);
    connectionLimits.set(userId, connectionLimits.get(userId) - 1);
  });
});

// Client-side with reconnection
function useSecureWebSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  
  useEffect(() => {
    const connect = () => {
      // Use WSS in production
      const wsUrl = process.env.NODE_ENV === 'production'
        ? url.replace('http', 'wss')
        : url.replace('http', 'ws');
      
      const ws = new WebSocket(wsUrl);
      
      ws.onclose = (event) => {
        if (event.code !== 1000) {
          // Reconnect after delay
          setTimeout(connect, 5000);
        }
      };
      
      setSocket(ws);
    };
    
    connect();
    return () => socket?.close();
  }, [url]);
  
  return socket;
}`,
    tags: ['security', 'websockets', 'authentication', 'real-time'],
    timeEstimate: 6
  },
  {
    id: 'sec-30',
    category: 'Security',
    question: 'What security headers should every React app have?',
    answer: `Essential security headers protect against common attacks:

Required headers:
- Content-Security-Policy - XSS prevention
- X-Content-Type-Options - MIME sniffing
- X-Frame-Options - Clickjacking
- Strict-Transport-Security - Force HTTPS
- Referrer-Policy - Control referrer info
- Permissions-Policy - Feature control`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// next.config.js - Complete security headers
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent XSS
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://api.example.com",
              "frame-ancestors 'none'"
            ].join('; ')
          },
          // Prevent MIME sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Clickjacking protection
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // Force HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          // Control referrer
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Disable browser features
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'payment=()'
            ].join(', ')
          },
          // XSS protection (legacy browsers)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // DNS prefetch control
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ]
      }
    ];
  }
};

// Verify headers with curl
// curl -I https://yoursite.com

// Or use SecurityHeaders.com for audit

// Middleware for dynamic headers
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add nonce for inline scripts
  const nonce = crypto.randomBytes(16).toString('base64');
  response.headers.set('x-nonce', nonce);
  
  // Dynamic CSP with nonce
  response.headers.set(
    'Content-Security-Policy',
    \`script-src 'self' 'nonce-\${nonce}'\`
  );
  
  return response;
}`,
    tags: ['security', 'headers', 'csp', 'https'],
    timeEstimate: 4
  },
  {
    id: 'sec-32',
    category: 'Security',
    question: 'How do you securely implement OAuth 2.0 authentication?',
    answer: `OAuth 2.0 security best practices:

1. Use Authorization Code flow with PKCE
   - Never use implicit flow
   - PKCE for public clients

2. Token handling
   - Short-lived access tokens
   - Secure token storage
   - Refresh token rotation

3. State parameter
   - Prevent CSRF attacks
   - Validate on callback

4. Validate tokens
   - Check issuer, audience
   - Verify signature`,
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// NextAuth.js OAuth configuration
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Use authorization code flow (default)
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Store tokens securely in JWT
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      
      // Refresh expired tokens
      if (Date.now() < token.expiresAt * 1000) {
        return token;
      }
      
      return refreshAccessToken(token);
    },
  },
});

// PKCE implementation for custom OAuth
import crypto from 'crypto';

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier: string) {
  return crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url');
}

async function startOAuthFlow() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = crypto.randomBytes(16).toString('hex');
  
  // Store for verification
  await redis.set(\`oauth:\${state}\`, {
    codeVerifier,
    createdAt: Date.now(),
  }, { ex: 600 }); // 10 min expiry
  
  const authUrl = new URL('https://oauth.provider.com/authorize');
  authUrl.searchParams.set('client_id', process.env.CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', process.env.REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid profile email');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  
  return authUrl.toString();
}

// OAuth callback handler
async function handleCallback(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  
  // Validate state
  const storedData = await redis.get(\`oauth:\${state}\`);
  if (!storedData) {
    throw new Error('Invalid or expired state');
  }
  
  // Exchange code for tokens
  const tokenResponse = await fetch('https://oauth.provider.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.REDIRECT_URI,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code_verifier: storedData.codeVerifier,
    }),
  });
  
  const tokens = await tokenResponse.json();
  
  // Validate ID token
  await validateIdToken(tokens.id_token);
  
  // Clean up
  await redis.del(\`oauth:\${state}\`);
  
  return tokens;
}`,
    tags: ['security', 'oauth', 'authentication', 'pkce'],
    timeEstimate: 6
  },
  {
    id: 'sec-33',
    category: 'Security',
    question: 'How do you implement rate limiting in Next.js?',
    answer: `Rate limiting strategies:

1. Algorithm options
   - Fixed window
   - Sliding window
   - Token bucket
   - Leaky bucket

2. Storage options
   - In-memory (single server)
   - Redis (distributed)
   - Edge (Vercel/Cloudflare)

3. Identification
   - IP address
   - User ID
   - API key

4. Response
   - 429 status code
   - Retry-After header`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Upstash rate limiting
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  prefix: 'api-ratelimit',
});

// API route with rate limiting
export async function POST(request: Request) {
  // Identify requester
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }
  
  // Process request
  return NextResponse.json({ success: true });
}

// Middleware for global rate limiting
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Skip static assets
  if (request.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.next();
  }
  
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
  
  return NextResponse.next();
}

// Different limits for different endpoints
const limiters = {
  api: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100, '1 m'),
  }),
  auth: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '1 m'), // Stricter for auth
  }),
  upload: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, '1 h'),
  }),
};

async function rateLimitMiddleware(request: Request, type: keyof typeof limiters) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  return limiters[type].limit(ip);
}

// User-based rate limiting for authenticated users
async function authenticatedRateLimit(request: Request, userId: string) {
  const limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.tokenBucket(100, '1 m', 10), // 100/min, burst of 10
    prefix: 'user-limit',
  });
  
  return limiter.limit(userId);
}

// Rate limiting with graceful degradation
async function rateLimitWithFallback(identifier: string) {
  try {
    return await ratelimit.limit(identifier);
  } catch (error) {
    // Redis unavailable - allow request but log
    console.error('Rate limit service unavailable:', error);
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }
}`,
    tags: ['security', 'rate-limiting', 'api', 'redis'],
    timeEstimate: 5
  },
  {
    id: 'sec-34',
    category: 'Security',
    question: 'How do you secure file uploads in React/Next.js?',
    answer: `File upload security measures:

1. Validation
   - File type (MIME type + magic bytes)
   - File size limits
   - Filename sanitization

2. Storage
   - Outside web root
   - Use CDN with signed URLs
   - Virus scanning

3. Processing
   - Re-encode images
   - Strip metadata
   - Use worker processes`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Secure file upload API route
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Magic bytes for file type verification
const MAGIC_BYTES = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46],
};

async function verifyFileType(file: File): Promise<boolean> {
  const buffer = await file.slice(0, 4).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  
  const expectedBytes = MAGIC_BYTES[file.type as keyof typeof MAGIC_BYTES];
  if (!expectedBytes) return false;
  
  return expectedBytes.every((byte, i) => bytes[i] === byte);
}

function sanitizeFilename(filename: string): string {
  // Remove path traversal and special characters
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\\.+/g, '.')
    .substring(0, 100);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  
  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }
  
  // Validate file size
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 });
  }
  
  // Verify magic bytes
  const isValidType = await verifyFileType(file);
  if (!isValidType) {
    return NextResponse.json({ error: 'File type mismatch' }, { status: 400 });
  }
  
  // Generate safe filename
  const extension = file.name.split('.').pop() ?? 'bin';
  const safeFilename = \`\${nanoid()}-\${Date.now()}.\${extension}\`;
  
  // Upload to blob storage
  const blob = await put(safeFilename, file, {
    access: 'public',
    contentType: file.type,
  });
  
  return NextResponse.json({
    url: blob.url,
    filename: safeFilename,
  });
}

// Client-side validation
function FileUpload() {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Client-side validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Invalid file type');
      return;
    }
    
    if (file.size > MAX_SIZE) {
      alert('File too large (max 5MB)');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      alert(error.error);
      return;
    }
    
    const { url } = await response.json();
    console.log('Uploaded:', url);
  };
  
  return (
    <input
      type="file"
      accept="image/jpeg,image/png,image/webp"
      onChange={handleFileChange}
    />
  );
}

// Image processing with sharp
import sharp from 'sharp';

async function processImage(buffer: Buffer) {
  return sharp(buffer)
    // Strip metadata (EXIF, GPS data)
    .rotate() // Auto-rotate based on EXIF
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    // Re-encode to remove any malicious data
    .jpeg({ quality: 85 })
    .toBuffer();
}`,
    tags: ['security', 'file-upload', 'validation', 'storage'],
    timeEstimate: 6
  },
  {
    id: 'sec-35',
    category: 'Security',
    question: 'How do you implement secure logging practices?',
    answer: `Secure logging best practices:

1. Data sanitization
   - No PII in logs
   - Mask sensitive data
   - No credentials/tokens

2. Log levels
   - Appropriate severity
   - Production vs development

3. Storage
   - Secure log storage
   - Log rotation
   - Retention policies

4. Access control
   - Who can read logs
   - Audit log access`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Secure logger implementation
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  requestId?: string;
  userId?: string;
  action?: string;
  [key: string]: unknown;
}

// Patterns to redact
const SENSITIVE_PATTERNS = [
  /password["']?\s*[:=]\s*["']?[^"',\s]+/gi,
  /token["']?\s*[:=]\s*["']?[^"',\s]+/gi,
  /api[_-]?key["']?\s*[:=]\s*["']?[^"',\s]+/gi,
  /bearer\s+[^\s]+/gi,
  /\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/g, // Email
  /\\b\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}\\b/g, // Credit card
  /\\b\\d{3}[-.]?\\d{2}[-.]?\\d{4}\\b/g, // SSN
];

function sanitize(data: unknown): unknown {
  if (typeof data === 'string') {
    let sanitized = data;
    SENSITIVE_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });
    return sanitized;
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitize);
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      // Redact sensitive keys
      const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization'];
      if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitize(value);
      }
    }
    return sanitized;
  }
  
  return data;
}

class SecureLogger {
  private level: LogLevel;
  
  constructor(level: LogLevel = 'info') {
    this.level = level;
  }
  
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }
  
  private log(level: LogLevel, message: string, context?: LogContext) {
    if (!this.shouldLog(level)) return;
    
    const sanitizedContext = context ? sanitize(context) : {};
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...sanitizedContext,
      env: process.env.NODE_ENV,
    };
    
    // In production, send to log service
    if (process.env.NODE_ENV === 'production') {
      this.sendToLogService(logEntry);
    } else {
      console.log(JSON.stringify(logEntry, null, 2));
    }
  }
  
  private async sendToLogService(entry: object) {
    await fetch(process.env.LOG_SERVICE_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
  }
  
  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }
  
  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }
  
  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }
  
  error(message: string, error?: Error, context?: LogContext) {
    this.log('error', message, {
      ...context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      } : undefined,
    });
  }
}

export const logger = new SecureLogger(
  process.env.LOG_LEVEL as LogLevel ?? 'info'
);

// Usage
logger.info('User logged in', { userId: '123', action: 'login' });

// This will be sanitized:
logger.info('Auth attempt', { 
  email: 'user@example.com', // Will be redacted
  password: 'secret123', // Will be redacted
});`,
    tags: ['security', 'logging', 'pii', 'best-practices'],
    timeEstimate: 5
  },
  {
    id: 'sec-36',
    category: 'Security',
    question: 'How do you manage secrets and environment variables securely?',
    answer: `Secrets management best practices:

1. Never commit secrets
   - Use .env.local (gitignored)
   - Environment variables
   - Secrets manager

2. Access control
   - Principle of least privilege
   - Rotate regularly
   - Audit access

3. Runtime security
   - Don't expose to client
   - Validate at startup
   - Use secrets manager`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Environment validation with Zod
// lib/env.ts
import { z } from 'zod';

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  OPENAI_API_KEY: z.string().startsWith('sk-'),
});

const clientSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_STRIPE_KEY: z.string().startsWith('pk_'),
});

// Validate at build time
const serverEnv = serverSchema.safeParse(process.env);
const clientEnv = clientSchema.safeParse(process.env);

if (!serverEnv.success) {
  console.error('❌ Invalid server environment:');
  console.error(serverEnv.error.flatten().fieldErrors);
  throw new Error('Invalid server environment');
}

// Export validated env
export const env = {
  ...serverEnv.data,
  ...clientEnv.data,
};

// Secrets manager integration (AWS Secrets Manager)
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

const secretsManager = new SecretsManager({
  region: process.env.AWS_REGION,
});

async function getSecret(secretId: string) {
  const response = await secretsManager.getSecretValue({
    SecretId: secretId,
  });
  
  if (response.SecretString) {
    return JSON.parse(response.SecretString);
  }
  
  throw new Error(\`Secret \${secretId} not found\`);
}

// Cache secrets
const secretsCache = new Map<string, { value: unknown; expiresAt: number }>();

async function getCachedSecret(secretId: string, ttl = 3600000) {
  const cached = secretsCache.get(secretId);
  
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }
  
  const secret = await getSecret(secretId);
  secretsCache.set(secretId, {
    value: secret,
    expiresAt: Date.now() + ttl,
  });
  
  return secret;
}

// Vercel/Next.js - don't expose server secrets to client
// ❌ Bad - exposes to client
// NEXT_PUBLIC_DATABASE_URL=...

// ✅ Good - server only
// DATABASE_URL=...

// Check for exposed secrets
function checkForExposedSecrets() {
  const publicEnvVars = Object.keys(process.env)
    .filter(key => key.startsWith('NEXT_PUBLIC_'));
  
  const sensitivePatterns = ['SECRET', 'PASSWORD', 'KEY', 'TOKEN', 'DATABASE'];
  
  publicEnvVars.forEach(key => {
    if (sensitivePatterns.some(pattern => key.includes(pattern))) {
      console.warn(\`⚠️ Potentially sensitive env var exposed: \${key}\`);
    }
  });
}

// Run at startup
if (process.env.NODE_ENV === 'development') {
  checkForExposedSecrets();
}

// Rotate secrets
async function rotateApiKey() {
  // Generate new key
  const newKey = generateSecureKey();
  
  // Update in secrets manager
  await secretsManager.updateSecret({
    SecretId: 'api-key',
    SecretString: JSON.stringify({ key: newKey }),
  });
  
  // Invalidate cache
  secretsCache.delete('api-key');
  
  // Log rotation (without the actual key)
  logger.info('API key rotated', { rotatedAt: new Date().toISOString() });
  
  return newKey;
}`,
    tags: ['security', 'secrets', 'environment', 'configuration'],
    timeEstimate: 5
  },
  {
    id: 'sec-37',
    category: 'Security',
    question: 'How do you handle dependency vulnerabilities?',
    answer: `Dependency security practices:

1. Audit regularly
   - npm audit
   - Snyk, Dependabot
   - CI/CD integration

2. Update strategy
   - Automated updates
   - Breaking change review
   - Lock file integrity

3. Minimization
   - Fewer dependencies
   - Review before adding
   - Remove unused`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// package.json scripts for security
{
  "scripts": {
    "audit": "npm audit --audit-level=moderate",
    "audit:fix": "npm audit fix",
    "outdated": "npm outdated",
    "deps:check": "npx depcheck"
  }
}

// GitHub Actions workflow for dependency security
// .github/workflows/security.yml
name: Security Audit

on:
  push:
    branches: [main]
  pull_request:
  schedule:
    - cron: '0 0 * * *' # Daily

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install dependencies
        run: npm ci
        
      - name: Run npm audit
        run: npm audit --audit-level=moderate
        
      - name: Check for known vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: \${{ secrets.SNYK_TOKEN }}

// Dependabot configuration
// .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    groups:
      development-dependencies:
        dependency-type: "development"
      production-dependencies:
        dependency-type: "production"

// Lock file integrity
// Verify in CI
- name: Verify lockfile integrity
  run: npm ci --ignore-scripts

// Security policy for dependencies
// Before adding a dependency, check:
// 1. npm audit report
// 2. Last update date
// 3. GitHub stars/issues
// 4. Maintainer activity

function evaluateDependency(packageName: string) {
  const checks = {
    // Check npm for vulnerabilities
    hasVulnerabilities: async () => {
      const { execSync } = require('child_process');
      try {
        execSync(\`npm audit --package-lock-only --json | jq '.vulnerabilities["\${packageName}"]'\`);
        return false;
      } catch {
        return true;
      }
    },
    
    // Check if actively maintained
    isActive: async () => {
      const response = await fetch(\`https://registry.npmjs.org/\${packageName}\`);
      const data = await response.json();
      const lastPublish = new Date(data.time.modified);
      const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
      return lastPublish > sixMonthsAgo;
    },
    
    // Check weekly downloads
    hasGoodAdoption: async () => {
      const response = await fetch(
        \`https://api.npmjs.org/downloads/point/last-week/\${packageName}\`
      );
      const data = await response.json();
      return data.downloads > 1000;
    },
  };
  
  return checks;
}

// Subresource Integrity for CDN scripts
// If you must use CDN scripts, use SRI
<script
  src="https://cdn.example.com/lib.js"
  integrity="sha384-HASH_HERE"
  crossorigin="anonymous"
></script>`,
    tags: ['security', 'dependencies', 'vulnerabilities', 'npm'],
    timeEstimate: 5
  },
  {
    id: 'sec-38',
    category: 'Security',
    question: 'How do you secure WebSocket connections?',
    answer: `WebSocket security measures:

1. Authentication
   - Token-based auth
   - Validate on connection
   - Re-validate periodically

2. Authorization
   - Channel-level permissions
   - Message validation
   - Rate limiting

3. Encryption
   - Use WSS (TLS)
   - Message encryption

4. Protection
   - Origin validation
   - Message sanitization`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Secure WebSocket server
import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';

const wss = new WebSocketServer({ noServer: true });

// Authenticate on upgrade
server.on('upgrade', async (request, socket, head) => {
  try {
    // Extract token
    const url = new URL(request.url, \`http://\${request.headers.host}\`);
    const token = url.searchParams.get('token');
    
    if (!token) {
      socket.write('HTTP/1.1 401 Unauthorized\\r\\n\\r\\n');
      socket.destroy();
      return;
    }
    
    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    
    // Validate origin
    const origin = request.headers.origin;
    if (!isAllowedOrigin(origin)) {
      socket.write('HTTP/1.1 403 Forbidden\\r\\n\\r\\n');
      socket.destroy();
      return;
    }
    
    // Complete upgrade
    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.userId = payload.userId;
      ws.permissions = payload.permissions;
      wss.emit('connection', ws, request);
    });
  } catch (error) {
    socket.write('HTTP/1.1 401 Unauthorized\\r\\n\\r\\n');
    socket.destroy();
  }
});

// Message validation and rate limiting
const messageRateLimiter = new Map<string, { count: number; resetAt: number }>();

wss.on('connection', (ws: WebSocket & { userId: string; permissions: string[] }) => {
  ws.on('message', async (data) => {
    try {
      // Rate limiting
      const userLimit = messageRateLimiter.get(ws.userId);
      const now = Date.now();
      
      if (userLimit && userLimit.resetAt > now) {
        if (userLimit.count >= 100) {
          ws.send(JSON.stringify({ error: 'Rate limit exceeded' }));
          return;
        }
        userLimit.count++;
      } else {
        messageRateLimiter.set(ws.userId, { count: 1, resetAt: now + 60000 });
      }
      
      // Parse and validate message
      const message = JSON.parse(data.toString());
      
      if (!validateMessage(message)) {
        ws.send(JSON.stringify({ error: 'Invalid message format' }));
        return;
      }
      
      // Check permissions
      if (!hasPermission(ws.permissions, message.action)) {
        ws.send(JSON.stringify({ error: 'Unauthorized action' }));
        return;
      }
      
      // Process message
      await handleMessage(ws, message);
    } catch (error) {
      ws.send(JSON.stringify({ error: 'Processing error' }));
    }
  });
  
  // Re-authenticate periodically
  const authInterval = setInterval(async () => {
    const isValid = await verifySession(ws.userId);
    if (!isValid) {
      ws.close(4001, 'Session expired');
      clearInterval(authInterval);
    }
  }, 60000); // Every minute
  
  ws.on('close', () => {
    clearInterval(authInterval);
  });
});

// Message schema validation
import { z } from 'zod';

const messageSchema = z.object({
  action: z.enum(['subscribe', 'unsubscribe', 'publish']),
  channel: z.string().max(100),
  payload: z.unknown().optional(),
  timestamp: z.number(),
});

function validateMessage(data: unknown): boolean {
  const result = messageSchema.safeParse(data);
  return result.success;
}

// Client-side secure connection
function useSecureWebSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  
  useEffect(() => {
    const token = getAuthToken();
    
    // Always use wss:// in production
    const secureUrl = \`\${url}?token=\${token}\`;
    const ws = new WebSocket(secureUrl);
    
    ws.onopen = () => {
      console.log('Connected securely');
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    setSocket(ws);
    
    return () => ws.close();
  }, [url]);
  
  return socket;
}`,
    tags: ['security', 'websocket', 'authentication', 'real-time'],
    timeEstimate: 6
  },
  {
    id: 'sec-39',
    category: 'Security',
    question: 'How do you implement security headers in Next.js middleware?',
    answer: `Security headers middleware:

1. Core headers
   - CSP
   - HSTS
   - X-Frame-Options

2. Dynamic headers
   - Nonce generation
   - Request-based policies

3. Reporting
   - CSP violations
   - Security events

4. Testing
   - Header verification
   - Security scanners`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// middleware.ts - Security headers
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Generate nonce for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  // Build CSP
  const cspHeader = [
    "default-src 'self'",
    \`script-src 'self' 'nonce-\${nonce}' 'strict-dynamic'\`,
    "style-src 'self' 'unsafe-inline'", // Required for some CSS-in-JS
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://api.example.com wss://ws.example.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
    "report-uri /api/csp-report",
  ].join('; ');
  
  const response = NextResponse.next();
  
  // Security headers
  const securityHeaders = {
    'Content-Security-Policy': cspHeader,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-DNS-Prefetch-Control': 'on',
  };
  
  // Apply headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Pass nonce to page
  response.headers.set('x-nonce', nonce);
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

// CSP violation reporting endpoint
// app/api/csp-report/route.ts
export async function POST(request: Request) {
  const report = await request.json();
  
  // Log to monitoring service
  console.log('CSP Violation:', report);
  
  // Send to security monitoring
  await fetch(process.env.SECURITY_WEBHOOK!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'csp-violation',
      report,
      timestamp: new Date().toISOString(),
    }),
  });
  
  return new Response(null, { status: 204 });
}

// Use nonce in pages
// app/layout.tsx
import { headers } from 'next/headers';

export default function RootLayout({ children }) {
  const headersList = headers();
  const nonce = headersList.get('x-nonce') ?? '';
  
  return (
    <html>
      <head>
        <script nonce={nonce} src="/analytics.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}

// Security header verification script
async function verifySecurityHeaders(url: string) {
  const response = await fetch(url, { method: 'HEAD' });
  
  const requiredHeaders = [
    'Content-Security-Policy',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Strict-Transport-Security',
  ];
  
  const missing = requiredHeaders.filter(
    header => !response.headers.has(header)
  );
  
  if (missing.length > 0) {
    console.warn('Missing security headers:', missing);
  }
  
  return missing.length === 0;
}`,
    tags: ['security', 'middleware', 'headers', 'csp'],
    timeEstimate: 5
  },
  {
    id: 'sec-40',
    category: 'Security',
    question: 'How do you implement secure session management?',
    answer: `Session security best practices:

1. Session creation
   - Secure random ID
   - HTTPOnly cookies
   - Secure flag

2. Session validation
   - Server-side storage
   - Expiration
   - Binding to user

3. Session lifecycle
   - Regenerate on auth
   - Idle timeout
   - Absolute timeout`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Secure session configuration with NextAuth
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database', // Server-side sessions
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // Extend on activity (1 hour)
  },
  cookies: {
    sessionToken: {
      name: '__Secure-next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async session({ session, user }) {
      // Validate session is still valid
      const dbSession = await prisma.session.findFirst({
        where: { userId: user.id },
      });
      
      if (!dbSession) {
        throw new Error('Session not found');
      }
      
      // Check for session hijacking indicators
      // (Could check IP, user agent, etc.)
      
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.role,
        },
      };
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      // Regenerate session ID on login (prevent session fixation)
      // NextAuth handles this automatically
      
      // Log successful login
      await logSecurityEvent('login', { userId: user.id });
    },
    async signOut({ session, token }) {
      // Invalidate all sessions for user (optional)
      await prisma.session.deleteMany({
        where: { userId: token.sub },
      });
      
      await logSecurityEvent('logout', { userId: token.sub });
    },
  },
});

// Custom session management
import { cookies } from 'next/headers';
import { nanoid } from 'nanoid';
import { encrypt, decrypt } from '@/lib/crypto';

class SessionManager {
  private readonly cookieName = '__Secure-session';
  private readonly maxAge = 24 * 60 * 60; // 24 hours
  private readonly idleTimeout = 30 * 60; // 30 minutes
  
  async createSession(userId: string, metadata: object = {}) {
    const sessionId = nanoid(32);
    
    const sessionData = {
      id: sessionId,
      userId,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      metadata,
      // Bind to browser fingerprint (optional)
      userAgent: metadata.userAgent,
      ip: metadata.ip,
    };
    
    // Store in Redis
    await redis.set(
      \`session:\${sessionId}\`,
      JSON.stringify(sessionData),
      'EX',
      this.maxAge
    );
    
    // Encrypt session ID for cookie
    const encryptedId = await encrypt(sessionId);
    
    // Set secure cookie
    cookies().set(this.cookieName, encryptedId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: this.maxAge,
      path: '/',
    });
    
    return sessionId;
  }
  
  async validateSession() {
    const cookie = cookies().get(this.cookieName);
    if (!cookie) return null;
    
    try {
      const sessionId = await decrypt(cookie.value);
      const data = await redis.get(\`session:\${sessionId}\`);
      
      if (!data) return null;
      
      const session = JSON.parse(data);
      
      // Check idle timeout
      if (Date.now() - session.lastActivity > this.idleTimeout * 1000) {
        await this.destroySession(sessionId);
        return null;
      }
      
      // Update last activity
      session.lastActivity = Date.now();
      await redis.set(
        \`session:\${sessionId}\`,
        JSON.stringify(session),
        'EX',
        this.maxAge
      );
      
      return session;
    } catch {
      return null;
    }
  }
  
  async destroySession(sessionId?: string) {
    if (!sessionId) {
      const cookie = cookies().get(this.cookieName);
      if (!cookie) return;
      sessionId = await decrypt(cookie.value);
    }
    
    await redis.del(\`session:\${sessionId}\`);
    cookies().delete(this.cookieName);
  }
  
  async destroyAllUserSessions(userId: string) {
    const keys = await redis.keys(\`session:*\`);
    
    for (const key of keys) {
      const data = await redis.get(key);
      if (data) {
        const session = JSON.parse(data);
        if (session.userId === userId) {
          await redis.del(key);
        }
      }
    }
  }
}

export const sessionManager = new SessionManager();`,
    tags: ['security', 'sessions', 'authentication', 'cookies'],
    timeEstimate: 6
  },
  {
    id: 'sec-41',
    category: 'Security',
    question: 'How do you implement API security best practices?',
    answer: `API security measures:

1. Authentication
   - API keys
   - JWT tokens
   - OAuth 2.0

2. Authorization
   - Role-based access
   - Resource-level permissions
   - Scope validation

3. Input validation
   - Schema validation
   - Sanitization
   - Size limits

4. Protection
   - Rate limiting
   - CORS
   - Request signing`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Secure API route with middleware
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { z } from 'zod';
import { ratelimit } from '@/lib/ratelimit';

// Request schema validation
const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(50000),
  published: z.boolean().default(false),
});

// Permission check
function hasPermission(user: User, action: string, resource?: object) {
  const permissions = {
    'post:create': ['admin', 'editor'],
    'post:update': (user: User, post: Post) => 
      user.role === 'admin' || post.authorId === user.id,
    'post:delete': ['admin'],
  };
  
  const perm = permissions[action];
  
  if (Array.isArray(perm)) {
    return perm.includes(user.role);
  }
  
  if (typeof perm === 'function') {
    return perm(user, resource);
  }
  
  return false;
}

// Secure API handler
export async function POST(request: Request) {
  // 1. Rate limiting
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
  
  // 2. Authentication
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // 3. Authorization
  if (!hasPermission(session.user, 'post:create')) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }
  
  // 4. Input validation
  const body = await request.json();
  const result = createPostSchema.safeParse(body);
  
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: result.error.flatten() },
      { status: 400 }
    );
  }
  
  // 5. Sanitize input
  const sanitizedData = {
    ...result.data,
    title: sanitize(result.data.title),
    content: sanitize(result.data.content),
  };
  
  // 6. Process request
  try {
    const post = await prisma.post.create({
      data: {
        ...sanitizedData,
        authorId: session.user.id,
      },
    });
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// API key authentication
async function authenticateApiKey(request: Request) {
  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey) {
    return null;
  }
  
  // Hash the key for lookup
  const hashedKey = hashApiKey(apiKey);
  
  const keyRecord = await prisma.apiKey.findUnique({
    where: { hashedKey },
    include: { user: true },
  });
  
  if (!keyRecord || keyRecord.expiresAt < new Date()) {
    return null;
  }
  
  // Update last used
  await prisma.apiKey.update({
    where: { id: keyRecord.id },
    data: { lastUsedAt: new Date() },
  });
  
  return keyRecord.user;
}

// Request signing (HMAC)
function verifyRequestSignature(request: Request) {
  const signature = request.headers.get('x-signature');
  const timestamp = request.headers.get('x-timestamp');
  
  if (!signature || !timestamp) {
    return false;
  }
  
  // Check timestamp freshness (5 min window)
  const requestTime = parseInt(timestamp);
  if (Math.abs(Date.now() - requestTime) > 5 * 60 * 1000) {
    return false;
  }
  
  // Verify HMAC
  const payload = \`\${timestamp}.\${request.url}.\${request.body}\`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.API_SECRET!)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}`,
    tags: ['security', 'api', 'authentication', 'authorization'],
    timeEstimate: 6
  },
  {
    id: 'sec-42',
    category: 'Security',
    question: 'How do you prevent clickjacking attacks?',
    answer: `Clickjacking prevention:

1. X-Frame-Options header
   - DENY
   - SAMEORIGIN

2. Content Security Policy
   - frame-ancestors directive

3. JavaScript defenses
   - Frame busting (legacy)
   - SameSite cookies

4. Testing
   - Manual frame testing
   - Security scanners`,
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'essay',
    codeExample: `// next.config.js - X-Frame-Options
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // or 'SAMEORIGIN'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none'", // or 'self'
          },
        ],
      },
    ];
  },
};

// For pages that should be embeddable
// app/embed/[id]/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const allowedOrigin = searchParams.get('origin');
  
  // Validate origin against allowlist
  const allowedOrigins = ['https://trusted-partner.com'];
  
  if (!allowedOrigins.includes(allowedOrigin)) {
    return new Response('Forbidden', { status: 403 });
  }
  
  const response = new Response(/* embed content */);
  
  // Allow specific origin
  response.headers.set(
    'Content-Security-Policy',
    \`frame-ancestors 'self' \${allowedOrigin}\`
  );
  response.headers.set('X-Frame-Options', \`ALLOW-FROM \${allowedOrigin}\`);
  
  return response;
}

// JavaScript frame busting (legacy, not reliable)
// Use as defense-in-depth, not primary protection
if (typeof window !== 'undefined') {
  if (window.top !== window.self) {
    // Page is in a frame
    window.top.location = window.self.location;
  }
}

// More robust frame detection
function detectFrame() {
  try {
    return window.self !== window.top;
  } catch (e) {
    // Cross-origin frame, can't access top
    return true;
  }
}

if (detectFrame()) {
  document.body.innerHTML = '<h1>This page cannot be displayed in a frame</h1>';
}

// SameSite cookies prevent CSRF in framed contexts
// next.config.js
module.exports = {
  // NextAuth automatically sets SameSite=Lax
};

// Test for clickjacking vulnerability
async function testClickjacking(url: string) {
  const html = \`
    <!DOCTYPE html>
    <html>
    <body>
      <h1>Clickjacking Test</h1>
      <iframe 
        src="\${url}" 
        style="width: 100%; height: 500px; border: 2px solid red;"
      ></iframe>
      <p>If you can see the target page above, it's vulnerable to clickjacking.</p>
    </body>
    </html>
  \`;
  
  // Save as HTML file and open in browser
  return html;
}

// Middleware for dynamic frame protection
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Check if page should be embeddable
  const isEmbedRoute = request.nextUrl.pathname.startsWith('/embed');
  
  if (isEmbedRoute) {
    // Allow embedding with restrictions
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  } else {
    // Block all framing
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set(
      'Content-Security-Policy',
      "frame-ancestors 'none'"
    );
  }
  
  return response;
}`,
    tags: ['security', 'clickjacking', 'headers', 'frames'],
    timeEstimate: 4
  },
  {
    id: 'sec-43',
    category: 'Security',
    question: 'How do you implement secure password handling?',
    answer: `Password security best practices:

1. Storage
   - Never store plain text
   - Use bcrypt/Argon2
   - High work factor

2. Validation
   - Minimum length
   - Complexity requirements
   - Check compromised passwords

3. Reset flow
   - Secure tokens
   - Time-limited
   - Single use`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Password hashing with bcrypt
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // Adjust based on hardware

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(
  password: string, 
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Password validation with Zod
import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .max(128, 'Password is too long')
  .refine(
    (password) => /[A-Z]/.test(password),
    'Must contain an uppercase letter'
  )
  .refine(
    (password) => /[a-z]/.test(password),
    'Must contain a lowercase letter'
  )
  .refine(
    (password) => /[0-9]/.test(password),
    'Must contain a number'
  )
  .refine(
    (password) => /[^A-Za-z0-9]/.test(password),
    'Must contain a special character'
  );

// Check against HaveIBeenPwned API
async function isPasswordCompromised(password: string): Promise<boolean> {
  const hash = crypto
    .createHash('sha1')
    .update(password)
    .digest('hex')
    .toUpperCase();
  
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);
  
  const response = await fetch(
    \`https://api.pwnedpasswords.com/range/\${prefix}\`
  );
  const text = await response.text();
  
  return text.includes(suffix);
}

// Secure password reset
import { nanoid } from 'nanoid';

async function initiatePasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  
  // Don't reveal if user exists
  if (!user) {
    // Still send success response to prevent enumeration
    return { success: true };
  }
  
  // Generate secure token
  const token = nanoid(32);
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  // Store with expiration
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });
  
  // Invalidate previous tokens
  await prisma.passwordResetToken.deleteMany({
    where: {
      userId: user.id,
      createdAt: { lt: new Date(Date.now() - 1000) },
    },
  });
  
  // Send email with token (not hashed)
  await sendEmail({
    to: email,
    subject: 'Password Reset',
    html: \`
      <p>Click <a href="\${process.env.APP_URL}/reset-password?token=\${token}">here</a> to reset your password.</p>
      <p>This link expires in 1 hour.</p>
    \`,
  });
  
  return { success: true };
}

async function resetPassword(token: string, newPassword: string) {
  // Validate new password
  const validPassword = passwordSchema.safeParse(newPassword);
  if (!validPassword.success) {
    throw new Error(validPassword.error.issues[0].message);
  }
  
  // Check compromised
  if (await isPasswordCompromised(newPassword)) {
    throw new Error('This password has been compromised in a data breach');
  }
  
  // Find token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      token: hashedToken,
      expiresAt: { gt: new Date() },
      usedAt: null,
    },
  });
  
  if (!resetToken) {
    throw new Error('Invalid or expired token');
  }
  
  // Update password and mark token used
  const hashedPassword = await hashPassword(newPassword);
  
  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
    // Invalidate all sessions
    prisma.session.deleteMany({
      where: { userId: resetToken.userId },
    }),
  ]);
  
  return { success: true };
}`,
    tags: ['security', 'passwords', 'hashing', 'authentication'],
    timeEstimate: 6
  },
  {
    id: 'sec-44',
    category: 'Security',
    question: 'How do you implement Content Security Policy (CSP) effectively?',
    answer: `CSP implementation guide:

1. Start restrictive
   - default-src 'self'
   - Add exceptions as needed

2. Common directives
   - script-src, style-src
   - img-src, connect-src
   - frame-src, frame-ancestors

3. Nonce-based approach
   - Dynamic nonces for scripts
   - 'strict-dynamic' fallback

4. Reporting
   - report-uri/report-to
   - Monitor violations`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Comprehensive CSP configuration
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  // Build CSP directives
  const cspDirectives = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      \`'nonce-\${nonce}'\`,
      "'strict-dynamic'",
      // Required for Next.js dev mode
      process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : '',
    ].filter(Boolean),
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for styled-components/emotion
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https://images.example.com',
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
    ],
    'connect-src': [
      "'self'",
      'https://api.example.com',
      'wss://ws.example.com',
      process.env.NODE_ENV === 'development' ? 'ws://localhost:*' : '',
    ].filter(Boolean),
    'media-src': ["'self'"],
    'object-src': ["'none'"],
    'frame-src': ["'none'"],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'upgrade-insecure-requests': [],
    // Reporting
    'report-uri': ['/api/csp-report'],
    'report-to': ['csp-endpoint'],
  };
  
  // Build CSP string
  const csp = Object.entries(cspDirectives)
    .filter(([, values]) => values.length > 0 || values.length === 0)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return \`\${key} \${values.join(' ')}\`;
    })
    .join('; ');
  
  const response = NextResponse.next();
  
  // Set CSP header
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('x-nonce', nonce);
  
  // Report-To header for CSP reporting
  response.headers.set('Report-To', JSON.stringify({
    group: 'csp-endpoint',
    max_age: 10886400,
    endpoints: [{ url: '/api/csp-report' }],
  }));
  
  return response;
}

// CSP reporting endpoint
// app/api/csp-report/route.ts
export async function POST(request: Request) {
  const report = await request.json();
  
  // Log violation
  console.log('CSP Violation:', {
    blockedUri: report['blocked-uri'],
    violatedDirective: report['violated-directive'],
    originalPolicy: report['original-policy'],
    documentUri: report['document-uri'],
  });
  
  // Send to monitoring
  if (process.env.NODE_ENV === 'production') {
    await fetch(process.env.SECURITY_WEBHOOK!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'csp-violation',
        report,
        timestamp: new Date().toISOString(),
      }),
    });
  }
  
  return new Response(null, { status: 204 });
}

// Using nonce in pages
// app/layout.tsx
import { headers } from 'next/headers';
import Script from 'next/script';

export default function RootLayout({ children }) {
  const headersList = headers();
  const nonce = headersList.get('x-nonce') ?? '';
  
  return (
    <html>
      <head>
        {/* Nonce is required for inline scripts */}
        <Script nonce={nonce} id="gtm">
          {\`// GTM or other inline script\`}
        </Script>
      </head>
      <body nonce={nonce}>
        {children}
      </body>
    </html>
  );
}

// CSP meta tag fallback (not recommended, use headers)
<meta 
  httpEquiv="Content-Security-Policy" 
  content="default-src 'self'; script-src 'self'" 
/>

// Testing CSP
async function testCSP(url: string) {
  const response = await fetch(url);
  const csp = response.headers.get('Content-Security-Policy');
  
  console.log('CSP Header:', csp);
  
  // Check for common issues
  const issues = [];
  
  if (csp?.includes("'unsafe-inline'") && !csp?.includes('nonce-')) {
    issues.push('unsafe-inline without nonce detected');
  }
  
  if (csp?.includes("'unsafe-eval'")) {
    issues.push('unsafe-eval detected');
  }
  
  if (!csp?.includes("frame-ancestors")) {
    issues.push('Missing frame-ancestors directive');
  }
  
  return { csp, issues };
}`,
    tags: ['security', 'csp', 'headers', 'xss-prevention'],
    timeEstimate: 6
  },
  {
    id: 'sec-45',
    category: 'Security',
    question: 'How do you implement audit logging for security events?',
    answer: `Security audit logging:

1. What to log
   - Authentication events
   - Authorization failures
   - Data access
   - Configuration changes

2. What to include
   - Timestamp
   - User identity
   - Action performed
   - Resource affected

3. Security
   - Tamper-proof storage
   - Access control
   - Retention policies`,
    difficulty: 'senior',
    type: 'coding',
    answerFormat: 'essay',
    codeExample: `// Audit logging service
interface AuditEvent {
  timestamp: Date;
  eventType: string;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  action: string;
  resource: string;
  resourceId?: string;
  outcome: 'success' | 'failure';
  details?: Record<string, unknown>;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

class AuditLogger {
  private async log(event: AuditEvent) {
    // Store in database
    await prisma.auditLog.create({
      data: {
        ...event,
        details: event.details ? JSON.stringify(event.details) : null,
      },
    });
    
    // Alert on high-risk events
    if (event.riskLevel === 'high' || event.riskLevel === 'critical') {
      await this.sendAlert(event);
    }
    
    // Stream to SIEM
    if (process.env.SIEM_ENDPOINT) {
      await fetch(process.env.SIEM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    }
  }
  
  async logAuth(
    type: 'login' | 'logout' | 'login_failed' | 'password_change',
    request: Request,
    userId?: string,
    details?: Record<string, unknown>
  ) {
    await this.log({
      timestamp: new Date(),
      eventType: 'authentication',
      userId,
      ipAddress: this.getIP(request),
      userAgent: request.headers.get('user-agent') ?? 'unknown',
      action: type,
      resource: 'auth',
      outcome: type === 'login_failed' ? 'failure' : 'success',
      details,
      riskLevel: type === 'login_failed' ? 'medium' : 'low',
    });
  }
  
  async logAccess(
    action: 'read' | 'create' | 'update' | 'delete',
    resource: string,
    resourceId: string,
    request: Request,
    userId: string,
    outcome: 'success' | 'failure'
  ) {
    await this.log({
      timestamp: new Date(),
      eventType: 'data_access',
      userId,
      ipAddress: this.getIP(request),
      userAgent: request.headers.get('user-agent') ?? 'unknown',
      action,
      resource,
      resourceId,
      outcome,
      riskLevel: action === 'delete' ? 'high' : 'low',
    });
  }
  
  async logSecurity(
    event: string,
    request: Request,
    details: Record<string, unknown>
  ) {
    await this.log({
      timestamp: new Date(),
      eventType: 'security',
      ipAddress: this.getIP(request),
      userAgent: request.headers.get('user-agent') ?? 'unknown',
      action: event,
      resource: 'security',
      outcome: 'failure',
      details,
      riskLevel: 'high',
    });
  }
  
  private getIP(request: Request): string {
    return request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  }
  
  private async sendAlert(event: AuditEvent) {
    await fetch(process.env.ALERT_WEBHOOK!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        severity: event.riskLevel,
        title: \`Security Event: \${event.action}\`,
        description: JSON.stringify(event, null, 2),
      }),
    });
  }
}

export const auditLogger = new AuditLogger();

// Usage in API routes
export async function POST(request: Request) {
  const session = await auth();
  
  try {
    const result = await deleteUser(userId);
    
    await auditLogger.logAccess(
      'delete',
      'user',
      userId,
      request,
      session.user.id,
      'success'
    );
    
    return NextResponse.json(result);
  } catch (error) {
    await auditLogger.logAccess(
      'delete',
      'user',
      userId,
      request,
      session.user.id,
      'failure'
    );
    
    throw error;
  }
}

// Authentication event logging
export async function signIn(credentials) {
  try {
    const user = await authenticate(credentials);
    
    await auditLogger.logAuth('login', request, user.id, {
      method: 'credentials',
    });
    
    return user;
  } catch (error) {
    await auditLogger.logAuth('login_failed', request, undefined, {
      email: credentials.email,
      reason: error.message,
    });
    
    throw error;
  }
}

// Query audit logs
async function getAuditLogs(filters: {
  userId?: string;
  eventType?: string;
  startDate?: Date;
  endDate?: Date;
  riskLevel?: string;
}) {
  return prisma.auditLog.findMany({
    where: {
      userId: filters.userId,
      eventType: filters.eventType,
      riskLevel: filters.riskLevel,
      timestamp: {
        gte: filters.startDate,
        lte: filters.endDate,
      },
    },
    orderBy: { timestamp: 'desc' },
    take: 1000,
  });
}`,
    tags: ['security', 'audit-logging', 'monitoring', 'compliance'],
    timeEstimate: 6
  },
  
  // Multiple Choice Questions
  {
    id: 'sec-mcq-1',
    category: 'Security',
    question: 'What does XSS stand for?',
    answer: 'Cross-Site Scripting - A vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users.',
    difficulty: 'beginner',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Cross-Site Scripting', isCorrect: true },
      { id: 'b', text: 'Cross-Server Security', isCorrect: false },
      { id: 'c', text: 'Cross-Site Styling', isCorrect: false },
      { id: 'd', text: 'Cross-System Scripting', isCorrect: false }
    ],
    tags: ['security', 'xss'],
    timeEstimate: 1
  },
  {
    id: 'sec-mcq-2',
    category: 'Security',
    question: 'Which React feature helps prevent XSS attacks by default?',
    answer: 'JSX automatically escapes values before rendering them, preventing XSS attacks.',
    difficulty: 'beginner',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'React.memo()', isCorrect: false },
      { id: 'b', text: 'JSX automatic escaping', isCorrect: true },
      { id: 'c', text: 'useEffect cleanup', isCorrect: false },
      { id: 'd', text: 'Virtual DOM', isCorrect: false }
    ],
    tags: ['security', 'xss', 'jsx'],
    timeEstimate: 1
  },
  {
    id: 'sec-mcq-3',
    category: 'Security',
    question: 'What is CSRF?',
    answer: 'Cross-Site Request Forgery - An attack that forces users to execute unwanted actions on a web application where they are authenticated.',
    difficulty: 'beginner',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Cross-Site Request Forgery', isCorrect: true },
      { id: 'b', text: 'Client-Side Request Failure', isCorrect: false },
      { id: 'c', text: 'Cross-Server Resource Fetch', isCorrect: false },
      { id: 'd', text: 'Client-Server Request Format', isCorrect: false }
    ],
    tags: ['security', 'csrf'],
    timeEstimate: 1
  },
  {
    id: 'sec-mcq-4',
    category: 'Security',
    question: 'Which method should you use to render user-provided HTML safely?',
    answer: 'Sanitize the HTML with a library like DOMPurify before using dangerouslySetInnerHTML.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Use innerHTML directly', isCorrect: false },
      { id: 'b', text: 'Sanitize with DOMPurify before dangerouslySetInnerHTML', isCorrect: true },
      { id: 'c', text: 'Use eval() on the HTML', isCorrect: false },
      { id: 'd', text: 'Always trust user input', isCorrect: false }
    ],
    tags: ['security', 'xss', 'sanitization'],
    timeEstimate: 1
  },
  {
    id: 'sec-mcq-5',
    category: 'Security',
    question: 'Where should you store sensitive API keys in a React application?',
    answer: 'Server-side only - Never expose API keys in client-side code; use environment variables on the server.',
    difficulty: 'beginner',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'In the React component state', isCorrect: false },
      { id: 'b', text: 'In localStorage', isCorrect: false },
      { id: 'c', text: 'Server-side only, never in client code', isCorrect: true },
      { id: 'd', text: 'In a JavaScript constant', isCorrect: false }
    ],
    tags: ['security', 'api-keys', 'environment'],
    timeEstimate: 1
  },
  {
    id: 'sec-mcq-6',
    category: 'Security',
    question: 'What is the purpose of Content Security Policy (CSP)?',
    answer: 'To prevent XSS attacks by specifying which dynamic resources are allowed to load.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'To compress content for faster loading', isCorrect: false },
      { id: 'b', text: 'To prevent XSS by controlling resource loading', isCorrect: true },
      { id: 'c', text: 'To encrypt all data', isCorrect: false },
      { id: 'd', text: 'To cache content offline', isCorrect: false }
    ],
    tags: ['security', 'csp', 'xss'],
    timeEstimate: 1
  },
  {
    id: 'sec-mcq-7',
    category: 'Security',
    question: 'Which HTTP header helps prevent clickjacking attacks?',
    answer: 'X-Frame-Options or Content-Security-Policy frame-ancestors directive.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'X-Content-Type-Options', isCorrect: false },
      { id: 'b', text: 'X-Frame-Options', isCorrect: true },
      { id: 'c', text: 'X-XSS-Protection', isCorrect: false },
      { id: 'd', text: 'Cache-Control', isCorrect: false }
    ],
    tags: ['security', 'clickjacking', 'headers'],
    timeEstimate: 1
  },
  {
    id: 'sec-mcq-8',
    category: 'Security',
    question: 'What is the secure way to store authentication tokens in a browser?',
    answer: 'HttpOnly cookies - They cannot be accessed by JavaScript, reducing XSS risk.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'localStorage', isCorrect: false },
      { id: 'b', text: 'sessionStorage', isCorrect: false },
      { id: 'c', text: 'HttpOnly cookies', isCorrect: true },
      { id: 'd', text: 'In a global JavaScript variable', isCorrect: false }
    ],
    tags: ['security', 'authentication', 'cookies'],
    timeEstimate: 1
  },
  {
    id: 'sec-mcq-9',
    category: 'Security',
    question: 'What does the "SameSite" cookie attribute help prevent?',
    answer: 'CSRF attacks - It restricts how cookies are sent with cross-site requests.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'XSS attacks', isCorrect: false },
      { id: 'b', text: 'CSRF attacks', isCorrect: true },
      { id: 'c', text: 'SQL injection', isCorrect: false },
      { id: 'd', text: 'Man-in-the-middle attacks', isCorrect: false }
    ],
    tags: ['security', 'csrf', 'cookies'],
    timeEstimate: 1
  },
  {
    id: 'sec-mcq-10',
    category: 'Security',
    question: 'What is the recommended approach for handling user authentication in Next.js?',
    answer: 'Use NextAuth.js or similar authentication library with secure session management.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Store passwords in localStorage', isCorrect: false },
      { id: 'b', text: 'Use NextAuth.js or a secure auth library', isCorrect: true },
      { id: 'c', text: 'Implement custom password hashing in the frontend', isCorrect: false },
      { id: 'd', text: 'Use URL parameters for tokens', isCorrect: false }
    ],
    tags: ['security', 'authentication', 'next.js'],
    timeEstimate: 1
  },
  {
    id: 'sec-mcq-11',
    category: 'Security',
    question: 'Which hook can cause security issues if used with unsanitized user data?',
    answer: 'dangerouslySetInnerHTML - It bypasses React\'s built-in XSS protection.',
    difficulty: 'beginner',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'useState', isCorrect: false },
      { id: 'b', text: 'useEffect', isCorrect: false },
      { id: 'c', text: 'dangerouslySetInnerHTML', isCorrect: true },
      { id: 'd', text: 'useContext', isCorrect: false }
    ],
    tags: ['security', 'xss', 'react'],
    timeEstimate: 1
  },
  {
    id: 'sec-mcq-12',
    category: 'Security',
    question: 'What is input validation best performed?',
    answer: 'On both client-side and server-side, but server-side is essential.',
    difficulty: 'beginner',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Only on the client-side', isCorrect: false },
      { id: 'b', text: 'Only on the server-side', isCorrect: false },
      { id: 'c', text: 'On both client and server, but server is essential', isCorrect: true },
      { id: 'd', text: 'Input validation is not necessary', isCorrect: false }
    ],
    tags: ['security', 'validation'],
    timeEstimate: 1
  },
  {
    id: 'sec-mcq-13',
    category: 'Security',
    question: 'What is the purpose of HTTPS?',
    answer: 'To encrypt data in transit between the client and server.',
    difficulty: 'beginner',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'To make websites load faster', isCorrect: false },
      { id: 'b', text: 'To encrypt data in transit', isCorrect: true },
      { id: 'c', text: 'To store data securely', isCorrect: false },
      { id: 'd', text: 'To compress images', isCorrect: false }
    ],
    tags: ['security', 'https', 'encryption'],
    timeEstimate: 1
  },
  {
    id: 'sec-mcq-14',
    category: 'Security',
    question: 'What should you do with error messages in production?',
    answer: 'Show generic messages to users and log detailed errors server-side.',
    difficulty: 'intermediate',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Show full stack traces to help users debug', isCorrect: false },
      { id: 'b', text: 'Show generic messages to users, log details server-side', isCorrect: true },
      { id: 'c', text: 'Hide all errors completely', isCorrect: false },
      { id: 'd', text: 'Display database query errors', isCorrect: false }
    ],
    tags: ['security', 'error-handling'],
    timeEstimate: 1
  },
  {
    id: 'sec-mcq-15',
    category: 'Security',
    question: 'What is the OWASP Top 10?',
    answer: 'A list of the most critical web application security risks, updated periodically.',
    difficulty: 'beginner',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'The top 10 JavaScript frameworks', isCorrect: false },
      { id: 'b', text: 'A list of the most critical web security risks', isCorrect: true },
      { id: 'c', text: 'The top 10 React components', isCorrect: false },
      { id: 'd', text: 'A performance benchmark list', isCorrect: false }
    ],
    tags: ['security', 'owasp'],
    timeEstimate: 1
  },
  
  // Senior/Advanced Multiple Choice Questions
  {
    id: 'sec-mcq-16',
    category: 'Security',
    question: 'What is Subresource Integrity (SRI)?',
    answer: 'A security feature to verify fetched resources haven\'t been tampered with using hashes.',
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'A way to check resource size', isCorrect: false },
      { id: 'b', text: 'Verifying resources haven\'t been tampered with using hashes', isCorrect: true },
      { id: 'c', text: 'A React integrity check', isCorrect: false },
      { id: 'd', text: 'A database backup method', isCorrect: false }
    ],
    tags: ['sri', 'cdn', 'integrity'],
    timeEstimate: 2
  },
  {
    id: 'sec-mcq-17',
    category: 'Security',
    question: 'What is the purpose of nonce in Content Security Policy?',
    answer: 'A one-time token to whitelist specific inline scripts or styles.',
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'To encrypt data', isCorrect: false },
      { id: 'b', text: 'A one-time token to whitelist inline scripts/styles', isCorrect: true },
      { id: 'c', text: 'To generate random IDs', isCorrect: false },
      { id: 'd', text: 'To validate forms', isCorrect: false }
    ],
    tags: ['csp', 'nonce', 'inline-scripts'],
    timeEstimate: 2
  },
  {
    id: 'sec-mcq-18',
    category: 'Security',
    question: 'What is prototype pollution and how can it affect React apps?',
    answer: 'Modifying Object.prototype which can affect all objects and bypass security checks.',
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Memory pollution from too many objects', isCorrect: false },
      { id: 'b', text: 'Modifying Object.prototype affecting all objects', isCorrect: true },
      { id: 'c', text: 'Creating too many prototypes', isCorrect: false },
      { id: 'd', text: 'Pollution from third-party libraries', isCorrect: false }
    ],
    tags: ['prototype-pollution', 'object', 'security'],
    timeEstimate: 2
  },
  {
    id: 'sec-mcq-19',
    category: 'Security',
    question: 'What is the security risk of using target="_blank" without rel="noopener"?',
    answer: 'The new page can access window.opener and potentially redirect the parent page.',
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'The link won\'t work', isCorrect: false },
      { id: 'b', text: 'New page can access window.opener and redirect parent', isCorrect: true },
      { id: 'c', text: 'It causes memory leaks', isCorrect: false },
      { id: 'd', text: 'SEO penalty', isCorrect: false }
    ],
    tags: ['tabnabbing', 'noopener', 'links'],
    timeEstimate: 2
  },
  {
    id: 'sec-mcq-20',
    category: 'Security',
    question: 'How do Server Actions in Next.js protect against CSRF?',
    answer: 'Actions use POST, check Origin header, and generate unique action IDs.',
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'They use CAPTCHA', isCorrect: false },
      { id: 'b', text: 'POST method, Origin header check, unique action IDs', isCorrect: true },
      { id: 'c', text: 'They don\'t - CSRF protection is manual', isCorrect: false },
      { id: 'd', text: 'They require user re-authentication', isCorrect: false }
    ],
    tags: ['server-actions', 'csrf', 'next.js'],
    timeEstimate: 2
  },
  {
    id: 'sec-mcq-21',
    category: 'Security',
    question: 'What is the security concern with JSON.parse of untrusted data?',
    answer: 'Large or deeply nested JSON can cause DoS via stack overflow or memory exhaustion.',
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'JSON.parse is always safe', isCorrect: false },
      { id: 'b', text: 'Large/nested JSON can cause DoS via stack overflow', isCorrect: true },
      { id: 'c', text: 'It can execute code', isCorrect: false },
      { id: 'd', text: 'It exposes environment variables', isCorrect: false }
    ],
    tags: ['json', 'dos', 'parsing'],
    timeEstimate: 2
  },
  {
    id: 'sec-mcq-22',
    category: 'Security',
    question: 'What is the purpose of Trusted Types in web security?',
    answer: 'To prevent DOM XSS by requiring safe type wrappers for dangerous sink APIs.',
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'To verify TypeScript types at runtime', isCorrect: false },
      { id: 'b', text: 'Prevent DOM XSS by requiring safe wrappers for sink APIs', isCorrect: true },
      { id: 'c', text: 'To validate user input types', isCorrect: false },
      { id: 'd', text: 'To trust all data types', isCorrect: false }
    ],
    tags: ['trusted-types', 'xss', 'dom'],
    timeEstimate: 2
  },
  {
    id: 'sec-mcq-23',
    category: 'Security',
    question: 'What security headers should be set for React SPAs?',
    answer: 'CSP, X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security.',
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Only Cache-Control', isCorrect: false },
      { id: 'b', text: 'CSP, X-Frame-Options, X-Content-Type-Options, HSTS', isCorrect: true },
      { id: 'c', text: 'No headers needed for SPAs', isCorrect: false },
      { id: 'd', text: 'Only CORS headers', isCorrect: false }
    ],
    tags: ['security-headers', 'spa', 'best-practices'],
    timeEstimate: 2
  },
  {
    id: 'sec-mcq-24',
    category: 'Security',
    question: 'What is the risk of exposing stack traces in production error messages?',
    answer: 'Reveals internal code structure, file paths, and dependencies to attackers.',
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'No risk, it helps debugging', isCorrect: false },
      { id: 'b', text: 'Reveals code structure and paths to attackers', isCorrect: true },
      { id: 'c', text: 'Only affects performance', isCorrect: false },
      { id: 'd', text: 'Causes memory leaks', isCorrect: false }
    ],
    tags: ['error-handling', 'information-disclosure', 'production'],
    timeEstimate: 2
  },
  {
    id: 'sec-mcq-25',
    category: 'Security',
    question: 'What is "dependency confusion" attack?',
    answer: 'Tricking package managers into installing malicious public packages over private ones.',
    difficulty: 'senior',
    type: 'conceptual',
    answerFormat: 'multiple-choice',
    options: [
      { id: 'a', text: 'Having too many dependencies', isCorrect: false },
      { id: 'b', text: 'Tricking package managers to install malicious public packages', isCorrect: true },
      { id: 'c', text: 'Conflicting version numbers', isCorrect: false },
      { id: 'd', text: 'Circular dependencies', isCorrect: false }
    ],
    tags: ['dependency-confusion', 'npm', 'supply-chain'],
    timeEstimate: 2
  }
];

