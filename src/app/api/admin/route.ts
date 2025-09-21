import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// GET /api/admin
export async function GET(req: Request) {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        adminID: true,
        email: true,
        name: true,
        surname: true,
        image: true,
        role: true,
        dateTime: true,
        updateAt: true,
      },
    });

    return NextResponse.json({ success: true, data: admins }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/admin error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
