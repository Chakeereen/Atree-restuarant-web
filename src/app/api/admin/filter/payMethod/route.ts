// app/api/admin/report/payMethods/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const methods = await prisma.payMethod.findMany({
      select: {
        methodID: true,
        methodName: true,
      },
    });
    return NextResponse.json(methods, { status: 200 });
  } catch (error) {
    console.error("❌ getPayMethods error:", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงรายการวิธีชำระเงินได้" },
      { status: 500 }
    );
  }
}
