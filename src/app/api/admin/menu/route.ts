// app/api/menu/route.ts

import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

// Interface สำหรับ Type-Checking Body ที่รับเข้ามา
interface RequestBody {
  name: string;
  price: number;
  image: string;
  fileID: string;  // ✅ เพิ่ม fileID
  typeID: number;
}

export async function GET() {
  try {
    const menus = await prisma.menuLists.findMany({
      orderBy: { name: 'asc' },
      include: {
        type: true, // ดึงข้อมูล MenuType ทั้งหมดของแต่ละเมนู
      },
    });

    return NextResponse.json(menus, { status: 200 });
  } catch (error) {
    console.error("Error fetching menus:", error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลเมนู' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: { menuID: number } = await request.json();
    const { menuID } = body;

    if (!menuID) {
      return NextResponse.json(
        { error: "กรุณาระบุ menuID" },
        { status: 400 }
      );
    }

    const newRecommended = await prisma.recommended.create({
      data: { menuID },
    });

    return NextResponse.json(newRecommended, { status: 201 });
  } catch (error: any) {
    console.error("Error creating recommended:", error);

    // เช็คว่าเป็น Unique constraint fail หรือไม่
    if (error.code === "P2002" && error.meta?.target?.includes("menuID")) {
      return NextResponse.json(
        { error: "รายการนี้ถูกเพิ่มใน Recommended แล้ว" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้าง Recommended" },
      { status: 500 }
    );
  }
}
