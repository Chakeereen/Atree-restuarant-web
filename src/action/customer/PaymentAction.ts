'use server'
const baseUrl = process.env.API_URL as string;

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