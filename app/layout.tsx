import './globals.css'
import './styles/ui.css'
import './styles/shell.css'
import './styles/pages.css'
import './styles/chat.css'
import './styles/care.css'
import './styles/learn.css'
import './styles/public.css'
import './styles/content.css'
import './styles/dial.css'
import './styles/clay.css'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'
import RouteLoader from '@/components/RouteLoader'

const themeScript = `
  (() => {
    try {
      const saved = localStorage.getItem('arogya-theme') || localStorage.getItem('theme') || 'system';
      const dark = saved === 'dark' || (saved === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
      const root = document.documentElement;
      root.classList.toggle('dark', dark);
      root.dataset.theme = dark ? 'dark' : 'light';
      root.style.colorScheme = dark ? 'dark' : 'light';
    } catch (_) {}
  })();
`

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap', axes: ['SOFT', 'opsz'] })

export const metadata: Metadata = {
  title: {
    default: 'Arogya Sahayak — Health clarity, in your language',
    template: '%s · Arogya Sahayak',
  },
  description: 'An evidence-aware health information, tracking, and medical-learning companion designed for India.',
  applicationName: 'Arogya Sahayak',
  icons: { icon: '/arogya-mark.png', apple: '/arogya-mark.png' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f1e8' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1311' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Providers>
          <RouteLoader />
          {children}
          <Toaster position="top-center" toastOptions={{ className: 'ui-toast', duration: 4200 }} />
        </Providers>
      </body>
    </html>
  )
}
