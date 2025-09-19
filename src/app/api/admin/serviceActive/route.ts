// file: src/app/api/admin/service/activeCount/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // นับจำนวน Orders ที่ serviceName = "ACTIVE"
    const activeCount = await prisma.orders.count({
      where: {
        service: {
          serviceName: "ACTIVE",
        },
      },
    });

    return NextResponse.json({
      success: true,
      activeCount,
    });
  } catch (error) {
    console.error("Error fetching active orders count:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
