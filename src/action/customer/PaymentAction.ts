'use server'
const baseUrl = process.env.API_URL as string;
const phone = process.env.NEXT_PUBLIC_PHONE;

export const getPaymentDetails = async (orderNo: number) => {
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