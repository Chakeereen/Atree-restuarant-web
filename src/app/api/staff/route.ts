import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; // ปรับ path ให้ตรงกับโปรเจกต์ของคุณ

// POST /api/orders
export async function POST(req: NextRequest) {
  try {
    // ✅ อ่านค่าจาก body
    const body = await req.json();
    const tableNo = Number(body.tableNo);

    if (!tableNo) {
      return NextResponse.json(
        { error: "tableNo is required" },
        { status: 400 }
      );
    }

    // ✅ สร้าง Order ใหม่
    const newOrder = await prisma.orders.create({
      data: {
        tableNo,
        serviceID: 1, // ค่าเริ่มต้น ACTIVE
      },
    });

    // ✅ ส่งกลับ tableNo และ orderNo
    return NextResponse.json({
      tableNo: newOrder.tableNo,
      orderNo: newOrder.orderNo,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
