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

// POST: เพิ่มโต๊ะใหม่
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { locationDetail } = body;

    if (!locationDetail) {
      return NextResponse.json({ error: "กรุณากรอก locationDetail" }, { status: 400 });
    }

    const newTable = await prisma.table.create({
      data: { locationDetail },
    });

    return NextResponse.json(newTable, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "ไม่สามารถเพิ่มข้อมูลได้" }, { status: 500 });
  }
}
