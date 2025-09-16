import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { staffID, fcmToken } = await req.json();

    if (!staffID || !fcmToken) {
      return NextResponse.json(
        { error: "staffID and fcmToken are required" },
        { status: 400 }
      );
    }

    // ลบ FCM token ของ user ออกจาก DB
    await prisma.fcmToken.deleteMany({
      where: {
        staffID,
        token: fcmToken,
      },
    });

    // ✅ บันทึก Log ว่า logout สำเร็จ
    await prisma.loginLog.create({
      data: {
        staffID,
        loginResult: "LOGOUT",
      },
    });

    // ลบ refreshToken cookie
    const res = NextResponse.json({ message: "Logout successful" });
    res.cookies.set({
      name: "refreshToken",
      value: "",
      path: "/",
      expires: new Date(0), // ทำให้หมดอายุ
    });

    return res;
  } catch (err: any) {
    console.error("Logout error:", err);

    // ✅ บันทึก Log ว่ามี error ตอน logout
    await prisma.loginLog.create({
      data: {
        staffID: "SYSTEM",
        loginResult: `LOGOUT ERROR - ${err.message}`,
      },
    });

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
