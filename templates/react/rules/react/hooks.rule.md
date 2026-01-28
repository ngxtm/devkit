---
id: react-hooks
version: 1.0.0
triggers: [hooks, useEffect, useState, custom hooks]
---

# React Hooks

Modern React with hooks and functional components.

## useState

```tsx
const [count, setCount] = useState(0);
const [user, setUser] = useState<User | null>(null);

// Functional updates for derived state
setCount(prev => prev + 1);
```

## useEffect

```tsx
// Run on mount only
useEffect(() => {
  fetchData();
}, []);

// Run when dependency changes
useEffect(() => {
  fetchUser(userId);
}, [userId]);

// Cleanup
useEffect(() => {
  const sub = subscribe();
  return () => sub.unsubscribe();
}, []);
```

## Custom Hooks

Extract reusable logic:

```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
```

## useMemo / useCallback

```tsx
// Memoize expensive computation
const sorted = useMemo(() => items.sort(compare), [items]);

// Stable callback reference
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

## useRef

```tsx
const inputRef = useRef<HTMLInputElement>(null);

// Focus on mount
useEffect(() => {
  inputRef.current?.focus();
}, []);
```
