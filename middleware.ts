import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPath = request.nextUrl.pathname === "/admin/login";

  console.log('Middleware - Token:', token);
  console.log('Middleware - Path:', request.nextUrl.pathname);
  console.log('Middleware - Is Admin Path:', isAdminPath);
  console.log('Middleware - Is Login Path:', isLoginPath);

  if (isAdminPath) {
    // Se não tiver token e não estiver na página de login, redireciona para login
    if (!token && !isLoginPath) {
      console.log('Middleware - Sem token, redirecionando para login');
      const url = new URL("/admin/login", request.url);
      return NextResponse.redirect(url);
    }

    // Se tiver token mas não tiver role admin e não estiver na página de login
    if (token && token.role !== 'admin' && !isLoginPath) {
      console.log('Middleware - Token sem role admin, redirecionando para login');
      const url = new URL("/admin/login", request.url);
      return NextResponse.redirect(url);
    }

    // Se tiver token com role admin e estiver na página de login
    if (token && token.role === 'admin' && isLoginPath) {
      console.log('Middleware - Admin tentando acessar login, redirecionando para dashboard');
      const url = new URL("/admin/dashboard", request.url);
      return NextResponse.redirect(url);
    }
  }

  console.log('Middleware - Permitindo acesso');
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
}; 