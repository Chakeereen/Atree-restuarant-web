import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // ดึง orders ภายใน transaction
      const ordersWithoutService3or4 = await tx.orders.findMany({
        where: {
          NOT: [{ serviceID: 3 }, { serviceID: 4 }],
        },
        include: {
          payments: true,
          details: true,
        },
      });

      if (ordersWithoutService3or4.length === 0) {
        return {
          message: "All orders already have serviceID = 3 or 4.",
          orders: [],
        };
      }

      // loop orders ภายใน transaction
      for (const order of ordersWithoutService3or4) {
        const totalCost = order.details
          .filter((d) => d.trackOrderID !== 5)
          .reduce((sum, d) => sum + Number(d.totalCost), 0);

        // อัพเดต serviceID
        await tx.orders.update({
          where: { orderNo: order.orderNo },
          data: { serviceID: 4 },
        });

        if (!order.payments || order.payments.length === 0) {
          await tx.payment.create({
            data: {
              orderNo: order.orderNo,
              status: "FAILED",
              methodID: 3, // NONE_METHOD_ID
              totalCost,
            },
          });
        } else {
          await tx.payment.updateMany({
            where: { orderNo: order.orderNo },
            data: {
              status: "FAILED",
              totalCost,
            },
          });
        }
      }

      return {
        message: `Processed ${ordersWithoutService3or4.length} orders.`,
        orders: ordersWithoutService3or4.map((o) => o.orderNo),
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Update failed", details: err },
      { status: 500 }
    );
  }
}
