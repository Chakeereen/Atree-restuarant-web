'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { createPayment, destroyCookie } from "@/action/customer/PaymentAction";

export default function WaitingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const orderNo = Number(searchParams.get("orderNo"));
    const totalPrice = Number(searchParams.get("amount"));
    const tableNo = Number(searchParams.get("tableNo"));
    const method = searchParams.get("method");

    const [slip, setSlip] = useState<File | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSlip(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        setLoading(true); // ปิดทั้งหน้าระหว่าง process
        try {
            let methodID = 1;
            if (method === "PROMPTPAY") methodID = 2;

            const result = await createPayment({
                orderNo,
                totalPrice,
                methodID,
                slip,
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
        } catch (error: any) {
            console.error(error);
            alert("เกิดข้อผิดพลาดไม่คาดคิด");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 relative">
            {/* overlay และ spinner */}
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

                {method === "PROMPTPAY" && (
                    <div>
                        {!submitted ? (
                            <div className="flex flex-col items-center gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                                />
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !slip}
                                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "กำลังส่ง..." : "ยืนยันสลิป"}
                                </button>
                            </div>
                        ) : (
                            <p className="text-green-600 font-semibold">
                                ส่งสลิปแล้ว กำลังตรวจสอบ...
                            </p>
                        )}
                    </div>
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
