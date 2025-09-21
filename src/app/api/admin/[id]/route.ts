// GET /api/admin/[id]
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // ดึง id จาก path
    const id = req.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing admin ID" },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { adminID: id },
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

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: admin });
  } catch (error) {
    console.error("Error fetching admin:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
