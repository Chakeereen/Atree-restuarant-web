// file: src/app/api/admin/orderDetails/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/utils/date";

export async function GET() {
  try {
    const orderDetails = await prisma.orderDetail.findMany({
      include: {
        order: {
          include: {
            table: true, // สามารถเอาข้อมูล table เพิ่มเติมได้ถ้าต้องการ
          },
        },
        menu: {
          include: {
            type: true, // รวม MenuType
          },
        },
        track: true,       // ข้อมูล trackOrder
        cancelLog: true,   // ข้อมูล cancelLog (nullable)
      },
      orderBy: {
        dateTime: "desc",
      },
    });

    // แปลง decimal เป็น number และ format วันที่
    const formatted = orderDetails.map((od) => ({
      detailNo: od.detailNo,
      orderNo: od.orderNo,
      tableNo: od.order.tableNo,  // <-- เพิ่ม tableNo
      menu: {
        menuID: od.menu.menuID,
        name: od.menu.name,
        price: Number(od.menu.price),
        type: od.menu.type.name,
      },
      trackOrderID: od.trackOrderID,
      trackStatus: od.track.trackStateName, // สมมติ track มี field status
      amount: od.amount,
      description: od.description,
      place: od.place,
      price: Number(od.price),
      totalCost: Number(od.totalCost),
      dateTime: formatDateTime(od.dateTime),
      updateAT: formatDateTime(od.updateAT),
      cancelLog: od.cancelLog
        ? {
            reason: od.cancelLog.detailNo,
            cancelAt: formatDateTime(od.cancelLog.createAt),
          }
        : null,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
