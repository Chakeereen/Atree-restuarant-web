import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";



export async function GET() {
    try {
        const menus = await prisma.orderDetail.findMany({
            orderBy: { detailNo: 'asc' },
            include: {
                track:true,
                order: {
                    select: {
                        tableNo: true,
                    }
                },
                menu: {
                    select: {
                        name: true,
                        image: true,
                        type: true,
                    },

                },

            }

        });

        return NextResponse.json(menus, { status: 200 });
    } catch (error) {
        console.error("Error fetching menus:", error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายละเอียดการสั่ง' },
            { status: 500 }
        );
    }
}
