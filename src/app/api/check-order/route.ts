import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { destroyCookie } from "@/utils/destroyCookies";


export async function GET(req: NextRequest) {
  try {
    // ดึง orderNo จาก query parameter เช่น /api/check-order?orderNo=123
    const { searchParams } = new URL(req.url);
    const orderNo = searchParams.get("orderNo");

    if (!orderNo) {
      return NextResponse.json(
        { success: false, error: "orderNo is required" },
        { status: 400 }
      );
    }

    // หา Order จาก DB
    const order = await prisma.orders.findUnique({
      where: { orderNo: Number(orderNo) },
      select: { orderNo: true, serviceID: true },
    });

    // ถ้าไม่เจอ หรือ serviceID != 1 → ลบ cookie + redirect
    if (!order || order.serviceID !== 1) {
      await destroyCookie(); // 🔥 เรียกฟังก์ชันลบ cookie
      return NextResponse.redirect(new URL("/error", req.url));
    }

    // ✅ ถ้าเจอและ serviceID = 1 → ส่งข้อมูลกลับ
    return NextResponse.json({ success: true, data: order });
  } catch (err: any) {
    console.error("CheckOrder API error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
