import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

// GET /api/recommended/:id
export async function GET(req: Request, { params }: Params) {
  const id = Number(params.id);
  const recommended = await prisma.recommended.findUnique({
    where: { id },
    include: { menu: true },
  });

  if (!recommended) {
    return NextResponse.json({ error: "Recommended not found" }, { status: 404 });
  }

  return NextResponse.json(recommended);
}

// PUT /api/recommended/:id


export async function PUT(req: Request, { params }: Params) {
  const id = Number(params.id);
  const { menuID } = await req.json();

  if (!menuID) {
    return NextResponse.json(
      { error: "กรุณาระบุ menuID" },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.recommended.update({
      where: { id },
      data: { menuID },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error("Error updating recommended:", error);

    // ดัก Unique constraint failed
    if (error.code === "P2002" && error.meta?.target?.includes("menuID")) {
      return NextResponse.json(
        { error: "ไม่สามารถอัปเดตรายการนี้: menuID ถูกใช้งานแล้ว" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}

// DELETE /api/recommended/:id
export async function DELETE(req: Request, { params }: Params) {
  const id = Number(params.id);

  try {
    await prisma.recommended.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
