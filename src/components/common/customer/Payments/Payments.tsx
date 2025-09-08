'use client';

import { useSearchParams } from "next/navigation";

export default function PaymentWaitingPage() {
    const searchParams = useSearchParams();
    const orderNo = searchParams.get("orderNo");
    const amount = searchParams.get("amount");
    const method = searchParams.get("method");

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md text-center">
                <h1 className="text-2xl font-bold mb-4">รอการชำระเงิน</h1>
                <p className="mb-2">หมายเลขออเดอร์: <span className="font-semibold">{orderNo}</span></p>
                <p className="mb-2">จำนวนเงิน: <span className="font-semibold">{amount} บาท</span></p>
                <p className="mb-4">วิธีการชำระ: <span className="font-semibold">{method}</span></p>

                <p className="text-gray-500">กรุณารอสักครู่ ระบบกำลังตรวจสอบการชำระเงิน...</p>
            </div>
        </div>
    );
}
