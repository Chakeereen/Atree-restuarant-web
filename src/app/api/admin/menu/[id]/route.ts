// 
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/menu/[id]
export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    }

    const menu = await prisma.menuLists.findUnique({
      where: { menuID: Number(id) },
    });

    if (!menu) {
      return NextResponse.json({ success: false, error: "Menu not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: menu });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch menu" }, { status: 500 });
  }
}

// PATCH /api/admin/menu/[id]

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing menu ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, price, isAvailable, image, fileID, typeID } = body;

    const updatedMenu = await prisma.menuLists.update({
      where: { menuID: Number(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price: Number(price) }),
        ...(isAvailable !== undefined && { isAvailable }),
        ...(image !== undefined && { image }),
        ...(fileID !== undefined && { fileID }),
        ...(typeID !== undefined && { typeID }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Menu updated successfully",
      data: updatedMenu,
    });
  } catch (error: any) {
    console.error(error);

    // Prisma unique constraint error
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Menu name must be unique" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update menu" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/menu/[id]
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });

    await prisma.menuLists.delete({ where: { menuID: Number(id) } });

    return NextResponse.json({ success: true, message: "Menu deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to delete menu" }, { status: 500 });
  }
}
