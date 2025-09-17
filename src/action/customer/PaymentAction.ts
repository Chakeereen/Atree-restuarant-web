'use server'

import { cookies } from "next/headers";

const baseUrl = process.env.API_URL as string;
const phone = process.env.NEXT_PUBLIC_PHONE;



export const getPaymentDetails = async (orderNo: number) => {
  console.log(orderNo)
  try {
    const res = await fetch(`${baseUrl}/api/customer/payment?orderNo=${orderNo}`, {
      method: "GET",
      cache: "no-store", // ป้องกัน cache เก็บค่าเก่า
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.error || "Failed to fetch payment details");
    }

    const data = await res.json();
    return { success: true, data };
  } catch (err: any) {
    console.error("getPaymentDetails error:", err);
    return { success: false, data: [], error: err.message };
  }
};

export const getPromptPayQRCode = async (amount: number) => {
  try {
    const res = await fetch(`${baseUrl}/api/customer/payment/promptPay?amount=${amount}&phone=${phone}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.error || "Failed to fetch PromptPay QR");
    }

    const data = await res.json();
    return { success: true, data }; // data.qrCodeDataURL จะเป็น Base64 image
  } catch (err: any) {
    console.error("getPromptPayQRCode error:", err);
    return { success: false, data: null, error: err.message };
  }
};


export const createPayment = async ({
  orderNo,
  totalPrice,
  methodID,
  image,   // URL ของรูปจาก uploader
  fileId,  // fileId จาก uploader
}: {
  orderNo: number;
  totalPrice: number;
  methodID: number;
  image?: string;
  fileId?: string;
}) => {
  try {
    // สร้าง Payment record
    const body = {
      orderNo,
      totalCost: totalPrice,
      methodID,
      ...(image && { image }),   // ถ้ามี image
      ...(fileId && { fileID: fileId }), // ถ้ามี fileId
    };

    const res = await fetch(`${baseUrl}/api/customer/payment/createPayment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("createPayment error:", err);
    return { success: false, error: err.message };
  }
};

export async function destroyCookie(){
   (await cookies()).set("accessToken", "", {
    expires: new Date(0), // ทำให้หมดอายุทันที
    path: "/",            // ต้องกำหนด path เดียวกับตอนที่สร้าง
  });
}

export async function checkPaid(orderNo: number) {
  try {
    const res = await fetch(`${baseUrl}/api/customer/payment/paymentDetail?orderNo=${orderNo}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) return false;

    const data = await res.json(); // [{"status":"PAID"}] หรือ [{"status":"PENDING"}]

    // เช็ค status ของบิล
    if (Array.isArray(data) && data[0]?.status === "PAID") {
      return true;
    }

    return false; // ยังไม่จ่าย
  } catch (error) {
    console.error("checkPaid error:", error);
    return false;
  }
}
