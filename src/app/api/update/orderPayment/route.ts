import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET request สำหรับทดสอบ Cron Job หรือเรียกด้วย browser
export async function GET() {
  try {
    // หา Orders ที่มี Payment.status != PAID
    const ordersToUpdate = await prisma.orders.findMany({
      where: {
        payments: {
          some: {
            status: { not: "PAID" },
          },
        },
      },
      include: { payments: true },
    });

    if (ordersToUpdate.length === 0) {
      return NextResponse.json({ message: "No orders to update." });
    }

    // ใช้ Transaction เพื่อความปลอดภัย
    await prisma.$transaction(async (tx) => {
      for (const order of ordersToUpdate) {
        await tx.orders.update({
          where: { orderNo: order.orderNo },
          data: { serviceID: 4 },
        });

        await tx.payment.updateMany({
          where: {
            orderNo: order.orderNo,
            status: { not: "PAID" },
          },
          data: {
            status: "FAILED",
            methodID: 3,
          },
        });
      }
    });

    return NextResponse.json({ message: `Updated ${ordersToUpdate.length} orders.` });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed.", details: err }, { status: 500 });
  }
}
