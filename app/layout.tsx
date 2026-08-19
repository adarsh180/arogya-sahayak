import './globals.css'
import './micro-interactions.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'
import RouteLoader from '@/components/RouteLoader'
import ThemeSwitcher from '@/components/ThemeSwitcher'

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

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'Arogya Sahayak — Health clarity, in your language',
    template: '%s · Arogya Sahayak',
  },
  description: 'An evidence-aware health information, tracking, and medical-learning companion designed for India.',
  applicationName: 'Arogya Sahayak',
  icons: { icon: '/arogya-mark.png', apple: '/arogya-mark.png' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className="font-sans antialiased">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Providers>
          <RouteLoader />
          {children}
          <ThemeSwitcher />
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'as-toast',
              style: {
                background: '#173c34',
                color: '#fffdf7',
                border: '1px solid rgba(255,255,255,0.12)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
