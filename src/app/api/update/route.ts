import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // ดึง orders ที่ serviceID != 3 และ != 4
    const ordersWithoutService3or4 = await prisma.orders.findMany({
      where: {
        NOT: [
          { serviceID: 3 },
          { serviceID: 4 },
        ],
      },
      include: {
        payments: true,
      },
    });

    if (ordersWithoutService3or4.length === 0) {
      return NextResponse.json({ message: "All orders already have serviceID = 3 or 4." });
    }

    // ประมวลผลเหมือนเดิม
    await prisma.$transaction(async (tx) => {
      for (const order of ordersWithoutService3or4) {
        // อัพเดต Orders.serviceID = 4 (ถ้าต้องการ)
        await tx.orders.update({
          where: { orderNo: order.orderNo },
          data: { serviceID: 4 },
        });

        if (!order.payments || order.payments.length === 0) {
          // ไม่มี Payment → สร้างใหม่
          await tx.payment.create({
            data: {
              orderNo: order.orderNo,
              status: "FAILED",
              methodID: 3, // NONE_METHOD_ID
              totalCost: 0,
            },
          });
        } else {
          // มี Payment → อัพเดตทุก Payment
          await tx.payment.updateMany({
            where: { orderNo: order.orderNo },
            data: { status: "FAILED", methodID: 3 },
          });
        }
      }
    });

    return NextResponse.json({
      message: `Processed ${ordersWithoutService3or4.length} orders.`,
      orders: ordersWithoutService3or4.map(o => o.orderNo),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed", details: err }, { status: 500 });
  }
}
