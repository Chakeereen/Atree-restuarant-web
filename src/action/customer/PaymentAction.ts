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


export const createPayment = async ({
  orderNo,
  totalPrice,
  methodID,
  slip, // File หรือ null
}: {
  orderNo: number;
  totalPrice: number;
  methodID: number;
  slip?: File | null;
}) => {
  try {
    let imageUrl: string | undefined = undefined;
    let fileId: string | undefined = undefined;

    // ถ้ามี slip ให้ upload ก่อน
    if (slip) {
      const uploadForm = new FormData();
      uploadForm.append("file", slip);

      const uploadRes = await fetch(`${baseUrl}/api/customer/payment/slipUpload`, {
        method: "POST",
        body: uploadForm,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Failed to upload slip");

      imageUrl = uploadData.url;
      fileId = uploadData.fileId;
    }

    // สร้าง Payment record
    const body = {
      orderNo,
      totalCost: totalPrice,
      methodID,
      ...(imageUrl && { image: imageUrl }), // ถ้ามี imageUrl
      ...(fileId && { fileID: fileId }),     // ถ้ามี fileId
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