import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAccessToken, generateCustomerAccess, generateRefreshToken } from "@/utils/่jwt";
// ตรวจสอบ path ให้ถูกต้อง

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const tableId = searchParams.get("tableId");
    const orderId = searchParams.get("orderId");

    if (!tableId || !orderId) {
        return NextResponse.redirect(new URL("/error?message=InvalidQR", request.url));
    }

    try {
        const order = await prisma.orders.findFirst({
            where: {
                orderNo: parseInt(orderId),
                tableNo: parseInt(tableId),
                service: {
                    serviceName: "ACTIVE",
                },
            },
            include: {
                service: true,
            },
        });

        if (!order || order.service?.serviceName !== "ACTIVE") {
            console.log(`Auth failed for Order: ${orderId}, Table: ${tableId}`);
            return NextResponse.redirect(new URL("/error?message=OrderNotFound", request.url));
        }

        // สร้าง JWT สำหรับ customer
        const refreshToken = generateRefreshToken(order.orderNo.toString());

        const response = NextResponse.redirect(new URL(`/customer`, request.url));

        // ตั้ง cookie ชื่อ accessToken ให้ตรงกับ middleware
        const accessToken = generateCustomerAccess(order.orderNo.toString(), order.tableNo.toString());
        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 3, // 3 ชั่วโมง
        });
        return response;

    } catch (error) {
        console.error("Scan auth error:", error);
        return NextResponse.redirect(new URL("/error?message=ServerError", request.url));
    }
}
