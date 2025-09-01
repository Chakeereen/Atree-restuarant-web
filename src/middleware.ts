// // src/middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtVerify } from "jose";

// // แปลง secret เป็น Uint8Array สำหรับ jose
// const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);

// export async function middleware(req: NextRequest) {
//   const url = req.nextUrl.clone();
//   console.log(JWT_SECRET)
//   // ตรวจทุก path /admin/*
//   if (url.pathname.startsWith("/admin")) {
//     const token = req.cookies.get("accessToken")?.value;

//     if (!token) {
//       // ไม่มี token → redirect ไป login
//       url.pathname = "/login";
//       return NextResponse.redirect(url);
//     }

//     try {
//       // ตรวจ token
//       const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

//       const { payload } = await jwtVerify(token, secret, {
//         algorithms: ["HS256"],
//       });
//       // ตรวจ role
//       if ((payload as any).role !== "admin") {
//         url.pathname = "/"; // role ไม่ใช่ admin → redirect หน้าอื่น
//         return NextResponse.redirect(url);
//       }
//     } catch (err) {
//       console.log(err)
//       // token ไม่ถูกต้อง → redirect login
//       url.pathname = "/login";
//       return NextResponse.redirect(url);
//     }
//   }

//   return NextResponse.next();
// }

// // ระบุ path ที่ middleware จะทำงาน
// export const config = {
//   matcher: ["/admin/:path*"],
// };

// file: middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtVerify } from "jose";

// const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET as string);
// const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // ตรวจสอบเฉพาะ path ของ customer
//   if (pathname.startsWith("/customer")) {
//     const token = req.cookies.get("auth_token")?.value;

//     if (!token) {
//       // ถ้าไม่มี token -> redirect ไปหน้า error
//       return NextResponse.redirect(new URL("/error?message=Unauthorized", req.url));
//     }

//     try {
//       const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET, {
//         algorithms: ["HS256"],
//       });

//       // ดึง orderId จาก path (ตัวท้ายสุด)
//       const orderIdFromPath = Number(pathname.split("/").pop());

//       if (typeof payload.orderId !== "number" || payload.orderId !== orderIdFromPath) {
//         throw new Error("Token does not match order ID");
//       }

//       // ถ้า token ถูกต้อง -> allow next
//       return NextResponse.next();
//     } catch (err) {
//       console.error("Invalid customer token:", err);
//       return NextResponse.redirect(new URL("/error?message=InvalidToken", req.url));
//     }
//   }


//   // ✅ ตรวจสอบ admin path
//   if (pathname.startsWith("/admin")) {
//     const token = req.cookies.get("accessToken")?.value;
//     const url = req.nextUrl.clone();

//     if (!token) {
//       url.pathname = "/login";
//       return NextResponse.redirect(url);
//     }

//     try {
//       const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET, {
//         algorithms: ["HS256"],
//       });

//       if ((payload as any).role !== "admin") {
//         url.pathname = "/";
//         return NextResponse.redirect(url);
//       }

//       return NextResponse.next();
//     } catch (err) {
//       console.error("Invalid admin token:", err);
//       url.pathname = "/login";
//       return NextResponse.redirect(url);
//     }
//   }

//   // ถ้าไม่ใช่ path ที่สนใจ → ปล่อยผ่าน
//   return NextResponse.next();
// }

// // ✅ matcher ครอบคลุมทั้ง customer และ admin
// export const config = {
//   matcher: ["/customer/:path*", "/admin/:path*"],
// };

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
