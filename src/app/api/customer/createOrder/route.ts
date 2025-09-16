// src/app/api/customer/order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { admin } from "@/lib/firebaseAdmin"; // import firebase admin instance

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderInfo, cart } = body as {
      orderInfo: { orderNo: number; tableNo: number };
      cart: {
        menuID: number;
        amount: number;
        price: number;
        totalCost: number;
        trackOrderID: number;
        description?: string;
        place: string;
      }[];
    };

    if (!orderInfo || !cart || cart.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid order data" },
        { status: 400 }
      );
    }
    //console.log(cart)

    // บันทึก orderDetail ลง DB
    await prisma.orderDetail.createMany({
      data: cart.map((item) => ({
        orderNo: orderInfo.orderNo,
        menuID: item.menuID,
        amount: item.amount,
        price: item.price,
        totalCost: item.totalCost,
        trackOrderID: item.trackOrderID,
        description: item.description || "",
        place: item.place,
      })),
    });

    // 📌 ดึง fcmToken จาก DB (สมมติว่า staff ทุกคนต้องได้รับแจ้ง)
    const tokens = await prisma.fcmToken.findMany({
      select: { token: true },
    });

    if (tokens.length > 0) {
      const tokenList = tokens.map((t) => t.token);

      // ส่ง Notification
      const message = {
        notification: {
          title: "📢 มีออเดอร์ใหม่",
          body: `โต๊ะ ${orderInfo.tableNo} มีออเดอร์ #${orderInfo.orderNo}`,
        },
        data: {
          orderNo: orderInfo.orderNo.toString(),
          tableNo: orderInfo.tableNo.toString(),
        },
        tokens: tokenList,
      };

      // multicast แจ้งไปหลาย token พร้อมกัน
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log("FCM success:", response.successCount, "FCM failed:", response.failureCount);
    }

    return NextResponse.json({
      success: true,
      message: "Order created successfully and notification sent",
    });
  } catch (err: any) {
    console.error("Error creating order:", err);
    return NextResponse.json(
      { success: false, error: "Order submission failed" },
      { status: 500 }
    );
  }
}
