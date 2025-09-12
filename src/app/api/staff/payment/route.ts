import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    // ดึงข้อมูล Payment ทั้งหมด พร้อม relations
    const payments = await prisma.payment.findMany({
        where : {status : "PENDING"},
      include: {
        order: true,
        method: true,
        staff: true,
      },
    });

    return NextResponse.json({ success: true, data: payments });
  } catch (err: any) {
    console.error("Payment GET error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}