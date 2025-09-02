import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET as string);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const url = req.nextUrl.clone();

  // path ของ customer หรือ admin
  if (pathname.startsWith("/customer") || pathname.startsWith("/admin")) {
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      // ถ้าไม่มี token -> redirect
      if (pathname.startsWith("/admin")) {
        url.pathname = "/login";
      } else {
        url.pathname = "/error";
        url.searchParams.set("message", "Unauthorized");
      }
      return NextResponse.redirect(url);
    }

    try {
      const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET, {
        algorithms: ["HS256"],
      });

      // ตรวจ role
      if (pathname.startsWith("/admin") && (payload as any).role !== "admin") {
        url.pathname = "/";
        return NextResponse.redirect(url);
      }

      if (pathname.startsWith("/customer") && (payload as any).role !== "customer") {
        url.pathname = "/error";
        url.searchParams.set("message", "Forbidden");
        return NextResponse.redirect(url);
      }

      // token ถูกต้อง -> allow next
      return NextResponse.next();
    } catch (err) {
      console.error("Invalid token:", err);
      if (pathname.startsWith("/admin")) {
        url.pathname = "/login";
      } else {
        url.pathname = "/error";
        url.searchParams.set("message", "InvalidToken");
      }
      return NextResponse.redirect(url);
    }
  }

  // path อื่น ๆ ปล่อยผ่าน
  return NextResponse.next();
}

export const config = {
  matcher: ["/customer/:path*", "/admin/:path*"],
};
