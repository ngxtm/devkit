# Next.js Cache Strategies

## Cache Hierarchy

```
1. Request Memoization (React cache)
   - Same request deduped during render
   
2. Data Cache (Next.js)
   - Persisted across requests
   - Controlled by fetch options
   
3. Full Route Cache
   - Static HTML/RSC payload
   - Invalidated by revalidation
   
4. Router Cache (Client)
   - Prefetched routes
   - Session-based
```

## Data Cache Controls

```tsx
// Default - cached indefinitely
fetch('https://api.example.com/data');

// No caching
fetch('https://api.example.com/data', { cache: 'no-store' });

// Time-based revalidation
fetch('https://api.example.com/data', { 
  next: { revalidate: 3600 } // 1 hour
});

// Tag-based revalidation
fetch('https://api.example.com/posts', { 
  next: { tags: ['posts'] }
});

// Revalidate by tag
import { revalidateTag } from 'next/cache';
revalidateTag('posts');

// Revalidate by path
import { revalidatePath } from 'next/cache';
revalidatePath('/blog');
revalidatePath('/blog', 'layout'); // Include layouts
```

## Route Segment Config

```tsx
// app/page.tsx

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Force static (error if dynamic features used)
export const dynamic = 'force-static';

// Default - auto detect
export const dynamic = 'auto';

// Time-based revalidation for entire route
export const revalidate = 3600; // 1 hour

// Disable caching
export const revalidate = 0;

// Runtime
export const runtime = 'nodejs'; // or 'edge'
```

## Database Query Caching

```tsx
import { unstable_cache } from 'next/cache';

const getCachedPosts = unstable_cache(
  async () => {
    return db.post.findMany();
  },
  ['posts'], // cache key
  {
    revalidate: 3600,
    tags: ['posts'],
  }
);

// Usage
async function BlogPage() {
  const posts = await getCachedPosts();
  return <PostList posts={posts} />;
}

// Invalidate
'use server';
export async function createPost(data: PostData) {
  await db.post.create({ data });
  revalidateTag('posts');
}
```

## Request Memoization

```tsx
import { cache } from 'react';

// Deduped during single render pass
export const getUser = cache(async (id: string) => {
  return db.user.findUnique({ where: { id } });
});

// Both components share same request
async function UserName({ id }: { id: string }) {
  const user = await getUser(id);
  return <span>{user.name}</span>;
}

async function UserAvatar({ id }: { id: string }) {
  const user = await getUser(id);
  return <img src={user.avatar} />;
}
```

## Opting Out of Caching

```tsx
// Dynamic functions opt out automatically
import { cookies, headers } from 'next/headers';

async function Page() {
  const cookieStore = await cookies(); // Dynamic
  const headersList = await headers(); // Dynamic
  // Route becomes dynamic
}

// searchParams make page dynamic
async function Page({ 
  searchParams 
}: { 
  searchParams: Promise<{ q: string }> 
}) {
  const { q } = await searchParams; // Dynamic
}
```

## Cache Best Practices

```tsx
// ✅ Good - cache expensive operations
const getExpensiveData = unstable_cache(
  async () => heavyComputation(),
  ['expensive-data'],
  { revalidate: 3600 }
);

// ✅ Good - granular cache invalidation
fetch('/api/posts', { next: { tags: ['posts'] } });
fetch(`/api/posts/${id}`, { next: { tags: ['posts', `post-${id}`] } });

// After update
revalidateTag(`post-${id}`); // Only invalidates specific post

// ❌ Avoid - overly broad invalidation
revalidatePath('/'); // Invalidates everything
```
