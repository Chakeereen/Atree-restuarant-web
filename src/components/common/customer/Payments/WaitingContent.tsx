'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { createPayment, destroyCookie } from "@/action/customer/PaymentAction";
import SlipImageUploader from "../SlipImageUploader";

export default function WaitingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderNo = Number(searchParams.get("orderNo"));
  const totalPrice = Number(searchParams.get("amount"));
  const tableNo = Number(searchParams.get("tableNo"));
  const method = searchParams.get("method");

  const [slipImageUrl, setSlipImageUrl] = useState<string | null>(null);
  const [slipFileId, setSlipFileId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const methodID = method === "PROMPTPAY" ? 2 : 1;

      const result = await createPayment({
        orderNo,
        totalPrice,
        methodID,
        image: slipImageUrl ?? undefined,
        fileId: slipFileId ?? undefined,
      });

      if (result.success) {
        setSubmitted(true);
        await destroyCookie();
        router.push(
          `/public/bill/?totalCost=${totalPrice}&tableNo=${tableNo}&paymentMethod=${method}&orderNo=${orderNo}`
        );
      } else {
        alert("เกิดข้อผิดพลาด: " + result.error);
      }
    } catch (err: any) {
      console.error(err);
      alert("เกิดข้อผิดพลาดไม่คาดคิด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 relative">
      {loading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm text-center relative z-0">
        <h1 className="text-2xl font-bold mb-4">รอการชำระเงิน</h1>
        <p className="mb-2">หมายเลขออเดอร์: <span className="font-semibold">{orderNo}</span></p>
        <p className="mb-2">จำนวนเงิน: <span className="font-semibold">{totalPrice} บาท</span></p>
        <p className="mb-4">วิธีการชำระ: <span className="font-semibold">{method}</span></p>

        {method === "PROMPTPAY" && !submitted && (
          <div className="flex flex-col items-center gap-4">
            <SlipImageUploader
              onUpload={(file, fileId, url) => {
                setSlipImageUrl(url);   // เก็บ URL
                setSlipFileId(fileId);  // เก็บ fileId
              }}
            />

            <button
              onClick={handleSubmit}
              disabled={loading || !slipImageUrl || !slipFileId}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "กำลังส่ง..." : "ยืนยันสลิป"}
            </button>
          </div>
        )}

        {method === "PROMPTPAY" && submitted && (
          <p className="text-green-600 font-semibold mt-4">
            ส่งสลิปแล้ว กำลังตรวจสอบ...
          </p>
        )}

        {method === "CASH" && !submitted && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "กำลังส่ง..." : "แจ้งชำระเงิน"}
          </button>
        )}

        {method === "CASH" && submitted && (
          <p className="text-gray-500 mt-2">
            กรุณารอพนักงานมาเก็บเงินที่โต๊ะของคุณ
          </p>
        )}
      </div>
    </div>
  );
}
