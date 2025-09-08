'use client'

import { getPaymentDetails } from "@/action/customer/PaymentAction";
import PaymentModal from "@/components/common/customer/Payments/PaymentsModal";
import { OrderDetail } from "@/utils/type";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PaymentPage() {
    const params = useParams();
    const orderNo = Number(params.orderNo);

    const [payments, setPayments] = useState<OrderDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchPayments = async () => {
        if (!orderNo) return;
        setLoading(true);
        const result = await getPaymentDetails(orderNo);
        if (result.success) {
            setPayments(result.data);
        } else {
            toast.error(result.error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const totalPrice = payments.reduce((acc, item) => acc + Number(item.totalCost), 0);
    const orderInfo = payments[0]?.order;

    const handlePay = (method: "CASH" | "PROMPTPAY") => {
        setShowModal(false);
        if (method === "CASH") {
            toast.success(`ชำระเงินเรียบร้อยแล้ว ด้วยวิธี: เงินสด, จำนวนเงิน: ${totalPrice} บาท`);
            // TODO: เรียก API บันทึก Payment
        }
    };

    if (loading) return <p className="text-center mt-4">กำลังโหลดข้อมูล...</p>;
    if (payments.length === 0) return <p className="text-center mt-4">ไม่มีรายการสั่งอาหาร</p>;

    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">ใบเสร็จร้านอาหาร ATREE</h1>
                <p>Order No: <span className="font-semibold">{orderInfo?.orderNo}</span></p>
                <p>โต๊ะ: <span className="font-semibold">{orderInfo?.tableNo}</span></p>
                <p>วันที่: <span className="font-semibold">{orderInfo?.dateTime}</span></p>
            </div>

            {/* รายการอาหาร */}
            <div className="space-y-4 border-t border-b py-4">
                {payments.map((bill) => (
                    <div key={bill.detailNo} className="flex items-center">
                        <img
                            src={bill.menu?.image || ""}
                            alt={bill.menu?.name || ""}
                            className="w-16 h-16 object-cover rounded mr-4 border"
                        />
                        <div className="flex-1">
                            <h2 className="font-semibold">{bill.menu?.name}</h2>
                            <p className="text-sm text-gray-600">
                                {bill.amount} x {bill.price} บาท
                            </p>
                        </div>
                        <div className="font-semibold">{bill.totalCost} บาท</div>
                    </div>
                ))}
            </div>

            {/* ราคารวม */}
            <div className="mt-4 flex justify-between items-center font-bold text-lg border-t pt-4">
                <span>ราคารวมทั้งหมด</span>
                <span>{totalPrice} บาท</span>
            </div>

            {/* ปุ่มชำระเงิน */}
            <button
                className="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                onClick={() => setShowModal(true)}
            >
                ชำระเงิน
            </button>

            {/* Footer */}
            <div className="text-center text-gray-400 text-sm mt-4">
                ขอบคุณที่ใช้บริการ
            </div>

            {/* Modal */}
            {showModal && (
                <PaymentModal
                    isOpen={showModal}
                    totalPrice={totalPrice}
                    orderNo={orderNo}
                    onClose={() => setShowModal(false)}
                    onPay={handlePay}
                />
            )}
        </div>
    );
}
