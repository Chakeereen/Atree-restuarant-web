import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderNo, totalCost, methodID, staffID, image, fileID } = body;

    if (!orderNo || !totalCost || !methodID) {
      return NextResponse.json(
        { error: "orderNo, totalCost, methodID are required" },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.create({
      data: {
        orderNo,
        totalCost: new Prisma.Decimal(totalCost),
        methodID,
        staffID: staffID || null,
        image: image || null,
        fileID: fileID || null, // แก้ชื่อ field ให้ตรงกับ Prisma Model
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, data: payment });
  } catch (err: any) {
    console.error("Payment API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// export async function GET(req: NextRequest) {
//   try {
//     const orderNo = req.nextUrl.searchParams.get("orderNo");
//     const paymentNo = req.nextUrl.searchParams.get("paymentNo");

//     let payment;

//     if (paymentNo) {
//       payment = await prisma.payment.findUnique({
//         where: { paymentNo: Number(paymentNo) },
//         include: { order: true, method: true, staff: true },
//       });
//     } else if (orderNo) {
//       payment = await prisma.payment.findMany({
//         where: { orderNo: Number(orderNo) },
//         include: { order: true, method: true, staff: true },
//       });
//     } else {
//       payment = await prisma.payment.findMany({
//         include: { order: true, method: true, staff: true },
//       });
//     }

//     return NextResponse.json({ success: true, data: payment });
//   } catch (err: any) {
//     console.error("Payment GET error:", err);
//     return NextResponse.json({ success: false, error: err.message }, { status: 500 });
//   }
// }

export async function GET(req: NextRequest) {
  try {
    // ดึงข้อมูล Payment ทั้งหมด พร้อม relations
    const payments = await prisma.payment.findMany({
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