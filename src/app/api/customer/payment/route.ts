import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/utils/date";



export async function GET(req: NextRequest) {
    try {
        const orderNo = req.nextUrl.searchParams.get('orderNo');

        if (!orderNo) {
            return NextResponse.json({ error: 'orderNo is required' }, { status: 400 });
        }

        const bills = await prisma.orderDetail.findMany({
            where: {
                orderNo: Number(orderNo),
                AND: {
                    track: {
                        trackStateName: { not: "cancel" },
                    },
                },
            },
            include: {
                menu: {
                    select: {
                        name: true,
                        image: true,
                        type: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                order: {
                    select: {
                        orderNo: true,
                        tableNo: true,
                        dateTime: true,
                    }
                }
            },
        });

        if (!bills.length) {
            return NextResponse.json({ error: 'ไม่พบรายการที่สั่ง' }, { status: 404 });
        }

        // รวม object ตาม menuID
        const combined = bills.reduce((acc: any[], item) => {
            const existing = acc.find(i => i.menuID === item.menuID);
            if (existing) {
                // แปลง totalCost เป็น number ชั่วคราว
                const currentTotal = Number(existing.totalCost) + Number(item.totalCost);
                existing.amount += item.amount;
                existing.totalCost = currentTotal.toString(); // กลับเป็น string
            } else {
                acc.push({ ...item });
            }
            return acc;
        }, []);

        // ฟอร์แมตวันที่
        const result = combined.map((d) => ({
            ...d,
            order: {
                ...d.order,
                dateTime: formatDateTime(d.order.dateTime, "th-TH", {
                    dateStyle: "short",
                    timeStyle: "short",
                }),
            },
        }));

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error("Error fetching menus:", error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายการที่สั่ง' },
            { status: 500 }
        );
    }
}
