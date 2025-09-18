// 📂 src/app/api/payment/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentNo = Number(params.id);
    if (isNaN(paymentNo)) {
      return NextResponse.json(
        { success: false, error: "Invalid payment id" },
        { status: 400 }
      );
    }

    const updatedPayment = await prisma.payment.update({
      where: { paymentNo: paymentNo },
      data: { status: "PAID" },
    });

    const getOrderNo = await prisma.payment.findUnique({
      where: { paymentNo: paymentNo },
      select: {
        orderNo: true,
      }
    });

    const orderNo = Number(getOrderNo?.orderNo);

    const updateOrder = await prisma.orders.update({
      where: { orderNo: orderNo },
      data: { serviceID: 3 }
    });

    return NextResponse.json({ success: true, data: updatedPayment, updateOrder });
  } catch (err: any) {
    console.error("Payment PATCH error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
