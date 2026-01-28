# Next.js Server Component Patterns

## Server vs Client Components

```tsx
// Server Component (default) - runs on server only
async function UserList() {
  const users = await db.users.findMany(); // Direct DB access
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}

// Client Component - runs on client
'use client';

import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## When to Use Client Components

```tsx
'use client';

// Use 'use client' when you need:
// - useState, useEffect, useReducer
// - Event listeners (onClick, onChange)
// - Browser APIs (window, document)
// - Custom hooks with state
// - Class components

function InteractiveForm() {
  const [value, setValue] = useState('');
  
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

## Composition Pattern

```tsx
// Server Component with Client Component children
async function Dashboard() {
  const data = await fetchDashboardData();
  
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Server-rendered data passed to client component */}
      <InteractiveChart data={data.chartData} />
      {/* Server Component */}
      <StaticStats stats={data.stats} />
    </div>
  );
}

// Client Component receives serializable props
'use client';

function InteractiveChart({ data }: { data: ChartData[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  return <Chart data={data} onSelect={setSelected} />;
}
```

## Streaming with Suspense

```tsx
import { Suspense } from 'react';

async function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Streams independently */}
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>
      
      <Suspense fallback={<ChartSkeleton />}>
        <Chart />
      </Suspense>
      
      <Suspense fallback={<TableSkeleton />}>
        <DataTable />
      </Suspense>
    </div>
  );
}

// Each component fetches its own data
async function Stats() {
  const stats = await getStats(); // Slow query
  return <StatsDisplay stats={stats} />;
}
```

## Passing Server Data to Client

```tsx
// Server Component fetches, Client Component interacts
async function ProductPage({ id }: { id: string }) {
  const product = await getProduct(id);
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      {/* Pass serializable data to client */}
      <AddToCartButton productId={product.id} price={product.price} />
    </div>
  );
}

'use client';

function AddToCartButton({ productId, price }: { productId: string; price: number }) {
  const [adding, setAdding] = useState(false);
  
  async function handleClick() {
    setAdding(true);
    await addToCart(productId);
    setAdding(false);
  }
  
  return (
    <button onClick={handleClick} disabled={adding}>
      Add to Cart - ${price}
    </button>
  );
}
```

## Avoid Client Component Wrappers

```tsx
// ❌ Bad - makes everything client
'use client';
export default function Layout({ children }) {
  const [theme, setTheme] = useState('light');
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

// ✅ Good - minimal client boundary
// ThemeProvider.tsx
'use client';
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

// layout.tsx (Server Component)
export default function Layout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```
