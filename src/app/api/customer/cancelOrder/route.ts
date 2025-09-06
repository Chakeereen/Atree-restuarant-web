// src/app/api/order/cancel/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
