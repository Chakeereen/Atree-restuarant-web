import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: ดึง Recommended พร้อมข้อมูล menu
export async function GET() {
  try {
    const recommended = await prisma.recommended.findMany({
      include: {
        menu: true, // join กับ menuList
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, data: recommended });
  } catch (error) {
    console.error("GET Recommended error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch recommended" }, { status: 500 });
  }
}

// POST: เพิ่ม Recommended ใหม่
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { menuID } = body;

    if (!menuID) {
      return NextResponse.json({ success: false, message: "menuID is required" }, { status: 400 });
    }

    const newRecommended = await prisma.recommended.create({
      data: {
        menuID,
      },
      include: {
        menu: true,
      },
    });

    return NextResponse.json({ success: true, data: newRecommended });
  } catch (error) {
    console.error("POST Recommended error:", error);
    return NextResponse.json({ success: false, message: "Failed to create recommended" }, { status: 500 });
  }
}
