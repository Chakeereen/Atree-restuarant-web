import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // ดึง 5 เมนูยอดนิยม
    const popularMenus = await prisma.orderDetail.groupBy({
      by: ["menuID"],
      _sum: {
        amount: true, // รวมจำนวนที่สั่ง
      },
      orderBy: {
        _sum: {
          amount: "desc", // เรียงจากยอดสูงสุด
        },
      },
      take: 5,
    });

    // นำ menuID ไปดึงข้อมูลเมนูจริง
    const formatted = await Promise.all(
      popularMenus.map(async (pm) => {
        const menu = await prisma.menuLists.findUnique({
          where: { menuID: pm.menuID },
          include: { type: true },
        });

        if (!menu) return null;

        return {
          menuID: menu.menuID,
          name: menu.name,
          type: menu.type.name,
          price: Number(menu.price),
          totalOrdered: pm._sum.amount || 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: formatted.filter((m) => m !== null),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch popular menus" },
      { status: 500 }
    );
  }
}
