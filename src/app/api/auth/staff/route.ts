// src/app/api/auth/staff/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateAccessToken, generateRefreshToken } from "@/utils/่jwt";

export async function POST(req: NextRequest) {
  try {
    const { email, password, fcmToken } = await req.json();

    // หา staff จาก DB
    const staff = await prisma.staff.findUnique({ where: { email } });
    if (!staff) {
      // ❌ log ว่าล้มเหลว (ไม่พบ staff)
      await prisma.loginLog.create({
        data: {
          staffID: "UNKNOWN", // ถ้าไม่เจอ staff ก็เก็บเป็น UNKNOWN
          loginResult: "FAILED - Staff not found",
        },
      });

      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    // ตรวจสอบ password
    const validPassword = await bcrypt.compare(password, staff.password);
    if (!validPassword) {
      // ❌ log ว่าล้มเหลว (รหัสไม่ถูก)
      await prisma.loginLog.create({
        data: {
          staffID: staff.staffID,
          loginResult: "FAILED - Invalid password",
        },
      });

      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ✅ Login สำเร็จ
    const accessToken = generateAccessToken(staff.staffID, staff.role);
    const refreshToken = generateRefreshToken(staff.staffID);

    // บันทึก FCM Token
    if (fcmToken) {
      const existing = await prisma.fcmToken.findFirst({
        where: { staffID: staff.staffID, token: fcmToken },
      });

      if (!existing) {
        await prisma.fcmToken.create({
          data: {
            staffID: staff.staffID,
            token: fcmToken,
          },
        });
      }
    }

    // ✅ log ว่าสำเร็จ
    await prisma.loginLog.create({
      data: {
        staffID: staff.staffID,
        loginResult: "SUCCESS",
      },
    });

    // ส่ง response + refresh token
    const res = NextResponse.json({
      message: "Login successful",
      accessToken,
      staff: {
        staffID: staff.staffID,
        name: staff.name,
        email: staff.email,
        role: staff.role,
      },
    });

    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 วัน
    });

    return res;
  } catch (err: any) {
    
    console.error("Login error:", err);

    // log error (ระบบพัง)
    await prisma.loginLog.create({
      data: {
        staffID: "SYSTEM",
        loginResult: `ERROR - ${err.message}`,
      },
    });

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
