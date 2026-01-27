# Next.js Fetch Patterns

## Basic Fetching

```tsx
// Server Component - direct fetch
async function UserProfile({ id }: { id: string }) {
  const user = await fetch(`https://api.example.com/users/${id}`);
  const data = await user.json();
  return <div>{data.name}</div>;
}

// With error handling
async function getData() {
  const res = await fetch('https://api.example.com/data');
  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  return res.json();
}
```

## Caching & Revalidation

```tsx
// Cache forever (default)
fetch('https://api.example.com/data');

// No cache
fetch('https://api.example.com/data', { cache: 'no-store' });

// Revalidate after 60 seconds
fetch('https://api.example.com/data', { next: { revalidate: 60 } });

// Revalidate on demand with tags
fetch('https://api.example.com/posts', { next: { tags: ['posts'] } });

// Trigger revalidation (Server Action or Route Handler)
import { revalidateTag, revalidatePath } from 'next/cache';
revalidateTag('posts');
revalidatePath('/blog');
```

## Page-Level Caching

```tsx
// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Force static rendering
export const dynamic = 'force-static';

// Revalidate every 60 seconds
export const revalidate = 60;

// Disable caching
export const revalidate = 0;
```

## Parallel Fetching

```tsx
// ✅ Good - parallel fetches
async function Dashboard() {
  const [user, posts, analytics] = await Promise.all([
    getUser(),
    getPosts(),
    getAnalytics(),
  ]);
  
  return (
    <div>
      <UserCard user={user} />
      <PostsList posts={posts} />
      <Analytics data={analytics} />
    </div>
  );
}

// ❌ Bad - sequential (waterfall)
async function Dashboard() {
  const user = await getUser();
  const posts = await getPosts();
  const analytics = await getAnalytics();
  // ...
}
```

## Request Deduplication

```tsx
import { cache } from 'react';

// Deduplicated across components in same request
export const getUser = cache(async (id: string) => {
  const res = await fetch(`https://api.example.com/users/${id}`);
  return res.json();
});

// Multiple components can call getUser(id)
// Only one request is made
async function UserName({ id }: { id: string }) {
  const user = await getUser(id);
  return <span>{user.name}</span>;
}

async function UserEmail({ id }: { id: string }) {
  const user = await getUser(id);
  return <span>{user.email}</span>;
}
```

## Database Queries

```tsx
import { unstable_cache } from 'next/cache';

// Cache database queries
const getCachedUser = unstable_cache(
  async (id: string) => {
    return db.user.findUnique({ where: { id } });
  },
  ['user-cache'],
  { revalidate: 3600, tags: ['users'] }
);

// Usage
async function UserProfile({ id }: { id: string }) {
  const user = await getCachedUser(id);
  return <Profile user={user} />;
}
```

## Streaming

```tsx
import { Suspense } from 'react';

// Stream slow data
async function Page() {
  // Fast data renders immediately
  const quickData = await getQuickData();
  
  return (
    <div>
      <h1>{quickData.title}</h1>
      
      {/* Slow data streams in */}
      <Suspense fallback={<Loading />}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}

async function SlowComponent() {
  const slowData = await getSlowData();
  return <div>{slowData.content}</div>;
}
```
