import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { admin } from "@/lib/firebaseAdmin";

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

    const tableNO = await prisma.orders.findUnique({
      where: { orderNo: orderNo },
      select: {
        orderNo: true,
        tableNo: true,
      }
    })

    const tokens = await prisma.fcmToken.findMany({
      select: { token: true },
    });

    if (tokens.length > 0) {
      const tokenList = tokens.map((t) => t.token);

      const m_orderNo = tableNO?.orderNo.toString() ?? "";
      const m_tableNo = tableNO?.tableNo.toString() ?? "";

      // ส่ง Notification
      const message = {
        notification: {
          title: "📢 มีออเดอร์ใหม่",
          body: `โต๊ะ ${tableNO?.orderNo} มีออเดอร์ #${tableNO?.tableNo}`,
        },
        data: {
          orderNo: m_orderNo,
          tableNo: m_tableNo,
          type: "payment",
        },
        tokens: tokenList,
      };

      // multicast แจ้งไปหลาย token พร้อมกัน
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log("FCM success:", response.successCount, "FCM failed:", response.failureCount);
    }


    return NextResponse.json({ success: true, data: payment });
  } catch (err: any) {
    console.error("Payment API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

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