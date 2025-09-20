import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/utils/date";

// GET: ดึงข้อมูลการชำระเงินทุกสถานะ
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const startDate = url.searchParams.get("start"); // YYYY-MM-DD
    const endDate = url.searchParams.get("end");     // YYYY-MM-DD

    // เงื่อนไขการกรอง
    const where: any = {}; // เอา status: "PAID" ออก
    if (startDate || endDate) {
      where.dateTime = {};
      if (startDate) where.dateTime.gte = new Date(startDate);
      if (endDate) where.dateTime.lte = new Date(endDate);
    }

    const payments = await prisma.payment.findMany({
      where,
      orderBy: { dateTime: "asc" },
      select: {
        paymentNo: true,
        orderNo: true,
        totalCost: true,
        dateTime: true,
        status: true,
        method: { select: { methodName: true } },
        staff: { select: { staffID: true, name: true } },
      },
    });

    const result = payments.map((p) => ({
      paymentNo: p.paymentNo,
      orderNo: p.orderNo,
      totalCost: Number(p.totalCost), // Prisma Decimal → number
      status: p.status,
      methodName: p.method.methodName,
      staff: p.staff ? { id: p.staff.staffID, name: p.staff.name } : null,
      dateTime: formatDateTime(p.dateTime, "th-TH", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ showPayment error:", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลการชำระเงินได้" },
      { status: 500 }
    );
  }
}
