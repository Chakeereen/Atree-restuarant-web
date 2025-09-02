import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";



export async function GET() {
  try {
    const menus = await prisma.menuType.findMany({
      orderBy: { name: 'asc' },
      include: {
        menus: true, // ดึงข้อมูล MenuType ทั้งหมดของแต่ละเมนู
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
