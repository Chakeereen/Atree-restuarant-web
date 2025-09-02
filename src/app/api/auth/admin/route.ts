// src/app/api/auth/admin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "@/utils/่jwt";


export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "กรุณากรอก email และ password" }, { status: 400 });
    }

    // หา admin จาก DB
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: "Admin ไม่พบ" }, { status: 404 });
    }

    // ตรวจสอบ password
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return NextResponse.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    // สร้าง tokens
    const accessToken = generateAccessToken(admin.adminID, admin.role);
    const refreshToken = generateRefreshToken(admin.adminID);

    
    // สร้าง response
    const res = NextResponse.json({
      message: "Login successful",
      token:accessToken,
      user: {
        id: admin.adminID,
        name: admin.name,
        surname: admin.surname,
        email: admin.email,
        role: admin.role,
      },
    });

    // เก็บ accessToken ใน cookie
    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60, // 1 ชั่วโมง
    });

    // เก็บ refreshToken ใน cookie
    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 วัน
    });

    return res;
  } catch (err) {
    console.error("Admin Login Error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
