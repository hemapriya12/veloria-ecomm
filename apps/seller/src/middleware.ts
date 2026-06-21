import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const publicRoutes = ["/sign-in", "/sign-up", "/unauthorized", "/api/auth"];

function middleware(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = (req as any).nextauth?.token;
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (pathname.startsWith("/dashboard") && token.role !== "seller") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export default withAuth(middleware, {
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;
      if (publicRoutes.some((route) => pathname.startsWith(route))) return true;
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
