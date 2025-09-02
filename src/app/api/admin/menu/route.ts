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
    const body: RequestBody = await request.json();
    const { name, price, image, fileID, typeID } = body; // ✅ เพิ่ม fileID

    // ตรวจสอบข้อมูล
    if (!name || !price || !image || !typeID || !fileID) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ครบถ้วน: กรุณากรอก name, price, image, fileID, และ typeID' },
        { status: 400 }
      );
    }

    // สร้างข้อมูลใหม่
    const newMenu = await prisma.menuLists.create({
      data: {
        name,
        price,
        image,
        fileID,       // ✅ เก็บ fileID ด้วย
        typeID,
        // isAvailable มี default เป็น true
      },
    });

    return NextResponse.json(newMenu, { status: 201 });
  } catch (error) {
    console.error("Error creating menu:", error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างเมนู' },
      { status: 500 }
    );
  }
}
