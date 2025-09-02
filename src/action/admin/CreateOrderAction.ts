// file: app/actions/createOrderAction.ts
"use server";
import { prisma } from "@/lib/prisma";
// ตั้งค่า Prisma Client instance ไว้ที่นี่
import { revalidatePath } from "next/cache";

const baseUrl = process.env.API_URL as string;

// ฟังก์ชันนี้จะถูกเรียกจากฝั่ง Client (UI ของพนักงาน)
export const generateOrderForTable = async (prevState: any, formData: FormData) => {
  const tableNo = Number(formData.get("table"));

  let table: number | null = null;
  let order: number | null = null;

  try {

    if (tableNo) {
      const response = await fetch(`${baseUrl}/api/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNo }), // ✅ ต้องส่งเป็น object
      });

      if (!response.ok) {
        return { success: false, message: "ไม่สามารถสร้างออร์เดอร์ได้" };
      }

      const result = await response.json();

      // ✅ ใช้ค่าที่ API ส่งกลับ
      table = result.tableNo;
      order = result.orderNo;
    }



    console.log(`Order created: ${order} for table: ${table}`);

    // 3. ส่งข้อมูลกลับไปให้ UI ของพนักงาน
    // UI จะนำ URL นี้ไปสร้างเป็น QR Code ต่อไป
    const authUrl = `${baseUrl}/api/auth/customer?tableId=${table}&orderId=${order}`;

    revalidatePath("/admin"); // สั่งให้หน้า dashboard โหลดข้อมูลใหม่ (ถ้ามี)
    console.log(authUrl)
    return {
      success: true,
      message: "สร้าง QR code สำเร็จ",
      data: {
        orderId: order,
        authUrl: authUrl, // URL สำหรับ QR Code
      },
    };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false, message: "ไม่สามารถสร้างออร์เดอร์ได้" };
  }
}