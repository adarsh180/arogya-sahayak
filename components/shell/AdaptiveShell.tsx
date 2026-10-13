'use client'

import { useSession } from 'next-auth/react'
import AppShell from './AppShell'
import { PublicPage } from './SiteChrome'
import { BrandLoader } from '@/components/ui/kit'

/** Public pages keep the workspace navigation when the visitor is signed in. */
export default function AdaptiveShell({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  if (status === 'loading') return <BrandLoader screen label="" />
  if (status === 'authenticated') return <AppShell>{children}</AppShell>
  return <PublicPage>{children}</PublicPage>
}
