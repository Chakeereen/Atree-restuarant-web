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

  try {
    const updated = await prisma.recommended.update({
      where: { id },
      data: { menuID },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
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
