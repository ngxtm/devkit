---
id: typescript-patterns
version: 1.0.0
triggers: [typescript, types, patterns]
---

# TypeScript Patterns

Type-safe patterns for robust code.

## Discriminated Unions

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function handle(result: Result<User>) {
  if (result.ok) {
    console.log(result.value.name);
  } else {
    console.error(result.error.message);
  }
}
```

## Branded Types

```typescript
type UserId = string & { readonly __brand: 'UserId' };

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId) { /* ... */ }

// Prevents accidental mixing
const userId = createUserId('123');
const orderId = '456';

getUser(userId);  // OK
getUser(orderId); // Type error
```

## Exhaustive Checks

```typescript
type Status = 'pending' | 'active' | 'closed';

function assertNever(x: never): never {
  throw new Error(`Unexpected: ${x}`);
}

function getLabel(status: Status): string {
  switch (status) {
    case 'pending': return 'Pending';
    case 'active': return 'Active';
    case 'closed': return 'Closed';
    default: return assertNever(status);
  }
}
```

## Builder Pattern

```typescript
class QueryBuilder {
  private filters: string[] = [];

  where(field: string, value: unknown): this {
    this.filters.push(`${field} = ${value}`);
    return this;
  }

  build(): string {
    return this.filters.join(' AND ');
  }
}

new QueryBuilder()
  .where('status', 'active')
  .where('age', 18)
  .build();
```
