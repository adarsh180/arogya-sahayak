export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/dashboard/:path*', '/chat/:path*', '/student/:path*', '/profile/:path*',
    '/onboarding/:path*', '/health-tracker/:path*', '/health-records/:path*',
    '/medicine-reminder/:path*', '/appointments/:path*', '/vaccinations/:path*',
    '/family-members/:path*', '/emergency/:path*', '/medical-dictionary/:path*',
    '/mock-tests/:path*', '/study-planner/:path*', '/analytics/:path*', '/resources/:path*'
  ]
}
