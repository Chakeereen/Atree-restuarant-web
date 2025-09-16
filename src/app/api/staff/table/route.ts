import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: ดึงข้อมูลโต๊ะทั้งหมด
export async function GET() {
  try {
    const tables = await prisma.table.findMany({
      orderBy: { tableNo: 'asc' },
    });
    return NextResponse.json(tables, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "ไม่สามารถดึงข้อมูลได้" }, { status: 500 });
  }
}
