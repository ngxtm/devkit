# Next.js Rendering Modes

## Static Rendering (Default)

```tsx
// Rendered at build time
async function BlogPage() {
  const posts = await getPosts(); // Cached
  return <PostList posts={posts} />;
}

// Generate static pages for dynamic routes
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// With revalidation (ISR)
export const revalidate = 3600; // Regenerate every hour
```

## Dynamic Rendering

```tsx
// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Automatic dynamic - using dynamic functions
import { cookies, headers } from 'next/headers';

async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  // Now renders dynamically
  return <Dashboard token={token} />;
}

// Dynamic with searchParams
async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q: string }> 
}) {
  const { q } = await searchParams;
  const results = await search(q);
  return <Results data={results} />;
}
```

## Streaming

```tsx
import { Suspense } from 'react';

// Progressive rendering with streaming
async function Page() {
  return (
    <div>
      {/* Renders immediately */}
      <Header />
      
      {/* Streams when ready */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations />
      </Suspense>
      
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews />
      </Suspense>
    </div>
  );
}

// loading.tsx provides route-level streaming
// app/dashboard/loading.tsx
export default function Loading() {
  return <DashboardSkeleton />;
}
```

## Partial Prerendering (PPR)

```tsx
// next.config.js
module.exports = {
  experimental: {
    ppr: true,
  },
};

// Static shell with dynamic holes
async function Page() {
  return (
    <div>
      {/* Static - prerendered */}
      <Header />
      <Hero />
      
      {/* Dynamic - streamed */}
      <Suspense fallback={<CartSkeleton />}>
        <Cart /> {/* Uses cookies */}
      </Suspense>
      
      {/* Static */}
      <Footer />
    </div>
  );
}
```

## Edge Runtime

```tsx
// Run at the edge for lower latency
export const runtime = 'edge';

async function Page() {
  // Limited Node.js APIs
  // Fast cold starts
  return <Content />;
}

// Middleware always runs on edge
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  return NextResponse.next();
}
```

## Rendering Decision Tree

```
Is data static?
├── Yes → Static Rendering (SSG)
│   └── Need periodic updates? → ISR (revalidate)
└── No → Dynamic Rendering
    ├── Per-request data (cookies, headers) → Server
    ├── Real-time data → Client + SWR/React Query
    └── Mix of static + dynamic → PPR + Suspense
```

## Client-Side Rendering

```tsx
'use client';

import useSWR from 'swr';

// Real-time or frequently changing data
function StockPrice({ symbol }: { symbol: string }) {
  const { data, error, isLoading } = useSWR(
    `/api/stocks/${symbol}`,
    fetcher,
    { refreshInterval: 1000 }
  );

  if (isLoading) return <Skeleton />;
  if (error) return <Error />;
  return <Price value={data.price} />;
}
```
