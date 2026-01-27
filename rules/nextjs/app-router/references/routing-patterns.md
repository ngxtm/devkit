# Next.js App Router Patterns

## File Conventions

```
app/
├── layout.tsx          # Root layout (required)
├── page.tsx            # Home page (/)
├── loading.tsx         # Loading UI
├── error.tsx           # Error boundary
├── not-found.tsx       # 404 page
├── users/
│   ├── page.tsx        # /users
│   ├── [id]/
│   │   └── page.tsx    # /users/:id
│   └── [...slug]/
│       └── page.tsx    # /users/* (catch-all)
├── (marketing)/        # Route group (no URL impact)
│   ├── about/
│   └── contact/
└── @modal/             # Parallel route
    └── login/
```

## Layouts

```tsx
// app/layout.tsx - Root layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx - Nested layout
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content">{children}</div>
    </div>
  );
}
```

## Dynamic Routes

```tsx
// app/users/[id]/page.tsx
export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser(id);
  return <UserProfile user={user} />;
}

// Generate static params
export async function generateStaticParams() {
  const users = await getUsers();
  return users.map((user) => ({ id: user.id }));
}

// Catch-all routes
// app/docs/[...slug]/page.tsx
export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  // slug = ['getting-started', 'installation']
  // for /docs/getting-started/installation
}
```

## Loading & Error States

```tsx
// app/users/loading.tsx
export default function Loading() {
  return <UsersSkeleton />;
}

// app/users/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

// app/users/not-found.tsx
export default function NotFound() {
  return <div>User not found</div>;
}
```

## Route Groups

```
app/
├── (auth)/
│   ├── layout.tsx      # Auth layout (no header)
│   ├── login/
│   └── register/
├── (main)/
│   ├── layout.tsx      # Main layout (with header)
│   ├── dashboard/
│   └── settings/
```

## Parallel Routes

```tsx
// app/layout.tsx
export default function Layout({
  children,
  modal,
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
}

// app/@modal/login/page.tsx
export default function LoginModal() {
  return <Modal><LoginForm /></Modal>;
}

// app/@modal/default.tsx
export default function Default() {
  return null;
}
```

## Intercepting Routes

```
app/
├── feed/
│   └── page.tsx
├── photo/
│   └── [id]/
│       └── page.tsx      # Full page view
├── @modal/
│   └── (.)photo/
│       └── [id]/
│           └── page.tsx  # Intercepted modal view
```
