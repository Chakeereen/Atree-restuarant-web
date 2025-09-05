import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNoParam = searchParams.get("orderNo");
    if (!orderNoParam) {
      return NextResponse.json({ error: "Missing orderNo query parameter" }, { status: 400 });
    }

    const orderNo = Number(orderNoParam);
    if (isNaN(orderNo)) {
      return NextResponse.json({ error: "Invalid orderNo" }, { status: 400 });
    }

    const menus = await prisma.orderDetail.findMany({
      where: { orderNo },
      orderBy: { detailNo: 'asc' },
      include: {
        track: true,
        order: {
          select: { tableNo: true }
        },
        menu: {
          select: { name: true, image: true, type: true },
        },
      },
    });

    return NextResponse.json(menus, { status: 200 });
  } catch (error) {
    console.error("Error fetching menus:", error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายละเอียดการสั่ง' },
      { status: 500 }
    );
  }
}
