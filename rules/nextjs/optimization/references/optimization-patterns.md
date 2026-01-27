# Next.js Optimization Patterns

## Image Optimization

```typescript
import Image from 'next/image';

// Basic responsive image
<Image
  src="/hero.jpg"
  alt="Hero"
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
    sizes="100vw"
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

// Blur placeholder
<Image
  src="/photo.jpg"
  alt="Photo"
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

## Font Optimization

```typescript
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

// Local fonts
import localFont from 'next/font/local';

const myFont = localFont({
  src: './fonts/MyFont.woff2',
  display: 'swap',
});
```

## Script Optimization

```typescript
import Script from 'next/script';

// After page interactive (default)
<Script src="https://example.com/analytics.js" />

// Before page hydration
<Script src="https://polyfill.io/v3/polyfill.min.js" strategy="beforeInteractive" />

// After page load
<Script src="https://example.com/chat-widget.js" strategy="lazyOnload" />

// With onLoad callback
<Script
  src="https://maps.googleapis.com/maps/api/js"
  onLoad={() => console.log('Google Maps loaded')}
/>

// Inline script
<Script id="schema-org" type="application/ld+json">
  {JSON.stringify(structuredData)}
</Script>
```

## Dynamic Imports

```typescript
import dynamic from 'next/dynamic';

// Lazy load component
const DynamicChart = dynamic(() => import('../components/Chart'), {
  loading: () => <p>Loading chart...</p>,
});

// Disable SSR for client-only components
const DynamicMap = dynamic(() => import('../components/Map'), {
  ssr: false,
});

// Named export
const DynamicModal = dynamic(
  () => import('../components/Modal').then((mod) => mod.Modal)
);
```

## Bundle Analysis

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // config
});

// Run: ANALYZE=true npm run build
```

## Metadata Optimization

```typescript
// app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | My App',
    default: 'My App',
  },
  description: 'My app description',
  openGraph: {
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.id);
  return {
    title: product.name,
    description: product.description,
  };
}
```

## Route Segment Config

```typescript
// Static generation with revalidation
export const revalidate = 3600; // Revalidate every hour

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Force static rendering
export const dynamic = 'force-static';

// Runtime selection
export const runtime = 'edge'; // or 'nodejs'
```
