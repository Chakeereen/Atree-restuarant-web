import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    // ✅ รับข้อมูลจาก request body
    const { id, trackId } = await req.json();

    // ✅ ใช้ transaction แม้ update table เดียว
    const [updatedDetail] = await prisma.$transaction([
      prisma.orderDetail.update({
        where: { detailNo: id },
        data: { trackOrderID: trackId },
      }),
    ]);

    return NextResponse.json(updatedDetail, { status: 200 });
  } catch (error) {
    console.error("Error updating order detail:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" },
      { status: 500 }
    );
  }
}
