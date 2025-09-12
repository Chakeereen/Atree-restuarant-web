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

    return NextResponse.json({ success: true, data: updatedPayment });
  } catch (err: any) {
    console.error("Payment PATCH error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
