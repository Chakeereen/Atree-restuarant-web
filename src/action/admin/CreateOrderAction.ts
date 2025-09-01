// file: app/actions/createOrderAction.ts
"use server";
import { prisma } from "@/lib/prisma";
// ตั้งค่า Prisma Client instance ไว้ที่นี่
import { revalidatePath } from "next/cache";

const baseUrl = process.env.API_URL as string;

// ฟังก์ชันนี้จะถูกเรียกจากฝั่ง Client (UI ของพนักงาน)
export const generateOrderForTable = async (prevState: any, formData: FormData) => {
  const tableNo = Number(formData.get("table"));

  try {
    // 1. สร้าง Order ใหม่ในฐานข้อมูล
    const newOrder = await prisma.orders.create({
      data: {
        tableNo: tableNo,
        serviceID: 1, // สถานะเริ่มต้นคือ ACTIVE
      },
    });

    // 2. เตรียมข้อมูลสำหรับสร้าง QR Code
    const orderId = newOrder.orderNo;
    const qrData = {
      tableNo,
      orderId,
    };

    console.log(`Order created: ${orderId} for table: ${tableNo}`);

    // 3. ส่งข้อมูลกลับไปให้ UI ของพนักงาน
    // UI จะนำ URL นี้ไปสร้างเป็น QR Code ต่อไป
    const authUrl = `${baseUrl}/api/auth/customer?tableId=${tableNo}&orderId=${orderId}`;

    revalidatePath("/admin"); // สั่งให้หน้า dashboard โหลดข้อมูลใหม่ (ถ้ามี)
    console.log(authUrl)
    return {
      success: true,
      message: "สร้าง QR code สำเร็จ",
      data: {
        orderId: orderId,
        authUrl: authUrl, // URL สำหรับ QR Code
      },
    };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false, message: "ไม่สามารถสร้างออร์เดอร์ได้" };
  }
}