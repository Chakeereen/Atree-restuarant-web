import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/utils/date";

// GET /api/login-log
export async function GET() {
  try {
    const logs = await prisma.loginLog.findMany({
      orderBy: { dateTime: "desc" },
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

    // ✅ แปลง dateTime ก่อนส่งออก
    const formattedLogs = logs.map((log) => ({
      ...log,
      dateTime: formatDateTime(log.dateTime),
    }));

    return NextResponse.json({ success: true, data: formattedLogs });
  } catch (error) {
    console.error("Error fetching login logs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch login logs" },
      { status: 500 }
    );
  }
}
