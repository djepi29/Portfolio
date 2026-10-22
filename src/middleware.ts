import { NextResponse, type NextRequest } from 'next/server'

/**
 * Pass the admin path into the layout so login/setup stay public
 * while /admin stays session-gated.
 */
export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-admin-pathname', request.nextUrl.pathname)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ['/admin/:path*'],
}
