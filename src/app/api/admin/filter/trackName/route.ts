// file: src/app/api/admin/orderTrack/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // ดึงเฉพาะ trackOrderID และ trackStateName
    const tracks = await prisma.orderTrack.findMany({
      select: {
        trackOrderID: true,
        trackStateName: true,
      },
      orderBy: {
        trackOrderID: "asc", // เรียงลำดับเพิ่ม
      },
    });

    return NextResponse.json({
      success: true,
      data: tracks,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch order tracks",
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
