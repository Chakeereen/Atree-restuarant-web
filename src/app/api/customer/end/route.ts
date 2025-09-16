import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma"; // หรือ path ของ Prisma client ของคุณ
import { destroyCookie } from "@/action/customer/PaymentAction";

export async function POST(req: Request) {
  try {
    const { orderNo } = await req.json();

    if (!orderNo) {
      return NextResponse.json({ message: "orderNo ไม่ถูกต้อง" }, { status: 400 });
    }

    // 1️⃣ Destroy cookie
    await destroyCookie();


    // 2️⃣ Update database (ตัวอย่างเปลี่ยน status ของ order)
    const order = await prisma.orders.update({
      where: { orderNo },
      data: { serviceID: 2 },
    });

    return NextResponse.json({ message: "ปิดออเดอร์เรียบร้อย", order });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในการปิดออเดอร์" }, { status: 500 });
  }
}
