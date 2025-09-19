import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/utils/date";

// GET: ดึงยอดขายทั้งหมดที่ status = 'PAID'
export async function GET(req: Request) {
  try {
    // query parameter สำหรับกรองช่วงเวลา (option)
    const url = new URL(req.url);
    const startDate = url.searchParams.get("start"); // YYYY-MM-DD
    const endDate = url.searchParams.get("end");     // YYYY-MM-DD

    // สร้างเงื่อนไขการกรอง
    const where: any = { status: "PAID" };
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
        method: { select: { methodName: true } },
      },
    });

    // แปลงวันเวลาให้คนอ่านง่าย + totalCost เป็น number
    const result = payments.map(p => ({
      ...p,
      totalCost: Number(p.totalCost), // แปลง string เป็น number
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
    console.error(error);
    return NextResponse.json({ error: "ไม่สามารถดึงยอดขายได้" }, { status: 500 });
  }
}
