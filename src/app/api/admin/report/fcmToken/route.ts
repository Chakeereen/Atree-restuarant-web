import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ GET /api/fcm-token -> ดึง token ทั้งหมด
export async function GET() {
  try {
    const tokens = await prisma.fcmToken.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        staff: {
          select: {
            staffID: true,
            name: true,
            surname: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: tokens });
  } catch (error) {
    console.error("Error fetching FCM tokens:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch FCM tokens" },
      { status: 500 }
    );
  }
}

