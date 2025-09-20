// file: src/app/api/cron/updateTrackOrder/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // หา OrderDetail ทั้งหมดที่ trackOrderID = 3
    const orderDetailsToUpdate = await prisma.orderDetail.findMany({
      where: { trackOrderID: 3 },
    });

    if (orderDetailsToUpdate.length === 0) {
      return NextResponse.json({
        message: "No orderDetails found with trackOrderID = 3.",
      });
    }

    // อัพเดตทั้งหมดให้เป็น trackOrderID = 4
    const updated = await prisma.orderDetail.updateMany({
      where: { trackOrderID: 3 },
      data: { trackOrderID: 4 },
    });

    return NextResponse.json({
      message: `Updated ${updated.count} orderDetails from trackOrderID 3 → 4.`,
      updatedCount: updated.count,
    });
  } catch (err) {
    console.error("Cron update failed:", err);
    return NextResponse.json(
      { error: "Update failed", details: err },
      { status: 500 }
    );
  }
}
