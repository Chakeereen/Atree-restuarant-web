import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {  } from "@/utils/่jwt";


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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
