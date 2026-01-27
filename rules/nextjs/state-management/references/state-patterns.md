# Next.js State Management Patterns

## React Context (Simple Global State)

```typescript
// contexts/theme-context.tsx
'use client';

import { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

## Zustand (Complex Client State)

```typescript
// stores/cart-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);

// Usage in component
'use client';

export function Cart() {
  const { items, removeItem, total } = useCartStore();

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          {item.name} x{item.quantity}
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <p>Total: ${total()}</p>
    </div>
  );
}
```

## React Query (Server State)

```typescript
// providers/query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// hooks/use-products.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => fetch('/api/products').then((res) => res.json()),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) =>
      fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
```

## URL State (Shareable)

```typescript
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function useQueryState(key: string) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const value = searchParams.get(key);

  const setValue = useCallback(
    (newValue: string | null) => {
      const params = new URLSearchParams(searchParams);
      if (newValue === null) {
        params.delete(key);
      } else {
        params.set(key, newValue);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [key, pathname, router, searchParams]
  );

  return [value, setValue] as const;
}

// Usage
function ProductFilters() {
  const [category, setCategory] = useQueryState('category');
  const [sort, setSort] = useQueryState('sort');

  return (
    <div>
      <select value={category || ''} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All</option>
        <option value="electronics">Electronics</option>
      </select>
    </div>
  );
}
```

## Server State with RSC

```typescript
// Prefer server components for data that doesn't need client interactivity
// app/products/page.tsx
async function ProductsPage() {
  const products = await getProducts(); // Server fetch

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      <AddToCartButton /> {/* Client component for interaction */}
    </div>
  );
}
```
