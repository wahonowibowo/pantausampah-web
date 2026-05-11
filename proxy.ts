import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('user_session')?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isAdminRoute = pathname.startsWith('/admin');
  const isUserRoute = pathname.startsWith('/profile') || pathname.startsWith('/langganan');

  // Jika tidak ada cookie, arahkan rute yang dilindungi ke /login
  if (!sessionCookie && (isAdminRoute || isUserRoute)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (sessionCookie) {
    try {
      const user = JSON.parse(sessionCookie);

      // Jika user sudah login mencoba ke halaman login/register
      if (isLoginPage) {
        if (user.role === 'admin' || user.role === 'petugas') {
          return NextResponse.redirect(new URL('/admin', request.url));
        } else {
          return NextResponse.redirect(new URL('/profile', request.url));
        }
      }

      // Proteksi rute Admin
      if (isAdminRoute && user.role !== 'admin' && user.role !== 'petugas') {
        return NextResponse.redirect(new URL('/profile', request.url));
      }

      // Proteksi rute User
      if (isUserRoute && user.role !== 'user') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    } catch (e) {
      // Sesi tidak valid (format JSON rusak) — hapus cookie dari browser
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.set('user_session', '', { maxAge: 0, path: '/' });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/langganan/:path*', '/login', '/register'],
};