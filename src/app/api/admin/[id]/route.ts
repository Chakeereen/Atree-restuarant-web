// GET /api/admin/:id
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { adminID: params.id },
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
      return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: admin }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/admin/:id error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
