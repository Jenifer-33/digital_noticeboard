import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        // Adding a type for options to replace 'any'
        set(
          name: string,
          value: string,
          options: { path?: string; expires?: Date; httpOnly?: boolean }
        ) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(
          name: string,
          options: { path?: string; expires?: Date; httpOnly?: boolean }
        ) {
          req.cookies.set({
            name,
            value: "",
            ...options,
          });
          res.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    console.log("Middleware - Dashboard route accessed:", req.nextUrl.pathname);
    console.log("Middleware - Session exists:", !!session);

    if (!session) {
      console.log("Middleware - No session, redirecting to home");
      return NextResponse.redirect(new URL("/", req.url));
    }

    console.log("Middleware - Session user ID:", session.user.id);

    // Check if user is admin
    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    console.log("Middleware - User role check:", {
      userId: session.user.id,
      userRole: user?.role,
    });

    if (!user || user.role !== "admin") {
      console.log("Middleware - Redirecting to home, user not admin");
      return NextResponse.redirect(new URL("/", req.url));
    }

    console.log("Middleware - User is admin, allowing access");
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
