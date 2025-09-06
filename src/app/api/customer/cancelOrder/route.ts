// src/app/api/order/cancel/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



export async function GET(req: NextRequest) {
  try {
    const detailNo = req.nextUrl.searchParams.get('detailNo');

    if (!detailNo) {
      return NextResponse.json({ error: 'detailNo is required' }, { status: 400 });
    }

    const menus = await prisma.orderDetail.findMany({
      where: { detailNo: Number(detailNo) },
      select: { track: true }, // trackName ต้องตรงกับ column จริงใน DB
    });

    if (!menus.length) {
      return NextResponse.json({ error: 'ไม่พบเมนู' }, { status: 404 });
    }

    // ตรวจสอบ trackName ของ element แรก
    if (menus[0].track.trackStateName !== "ordering") {
      return NextResponse.json(false, { status: 200 });
    }

    return NextResponse.json(menus, { status: 200 });
  } catch (error) {
    console.error("Error fetching menus:", error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลเมนู' },
      { status: 500 }
    );
  }
}



export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { detailNo, orderNo, description, cancelBy } = body;

    if (!detailNo || !orderNo || !description || !cancelBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. update OrderDetail → trackOrderID = 5
    const updatedOrderDetail = await prisma.orderDetail.update({
      where: { detailNo },
      data: { trackOrderID: 5 },
    });

    // 2. create CancelOrderLog
    const cancelLog = await prisma.cancelOrderLog.create({
      data: {
        detailNo,
        orderNo,
        description,
        cancelBy,
      },
    });

    return NextResponse.json(
      { message: "Order canceled successfully", updatedOrderDetail, cancelLog },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cancel Order Error:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}
