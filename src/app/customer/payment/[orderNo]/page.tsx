'use client'

import { endOrder } from "@/action/customer/OrderAction";
import { destroyCookie, getPaymentDetails } from "@/action/customer/PaymentAction";
import PaymentModal from "@/components/common/customer/Payments/PaymentsModal";
import { OrderDetail } from "@/utils/type";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
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
      toast("ไม่มีรายการที่ต้องชำระ");
      setPayments([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalPrice = payments.reduce((acc, item) => acc + Number(item.totalCost), 0);
  const orderInfo = payments[0]?.order;

  // ฟังก์ชัน handle
  const handleFinish = async () => {
    if (!orderNo) return;
    try {
      const result = await endOrder(orderNo); // เรียก API ปิดออเดอร์
      if (result.success) {
        toast.success("สิ้นสุดการทำรายการเรียบร้อยแล้ว");
        await destroyCookie();
        router.push("/");
      } else {
        toast.error(result.message || "ไม่สามารถสิ้นสุดรายการได้");
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการเรียก API");
    }
  };

  const handlePay = (method: "CASH" | "PROMPTPAY") => {
    setShowModal(false);
    if (method === "CASH") {
      //   toast.success(`ชำระเงินเรียบร้อยแล้ว ด้วยวิธี: เงินสด, จำนวนเงิน: ${totalPrice} บาท`);
      //   // TODO: เรียก API บันทึก Payment
    }
  };

  if (loading) return <p className="text-center mt-8 text-gray-600">กำลังโหลดข้อมูล...</p>;

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6">
      {payments.length === 0 ? (
        <div className="text-center space-y-4">
          <p className="text-gray-600 text-lg">ไม่มีรายการที่ต้องชำระ</p>
          <button
            onClick={handleFinish}
            className="w-full bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition"
          >
            สิ้นสุดการทำรายการ
          </button>

        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 p-4 flex flex-col gap-4">
          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold">ใบเสร็จร้านอาหาร ATREE</h1>
            <p>Order No: <span className="font-semibold">{orderInfo?.orderNo}</span></p>
            <p>โต๊ะ: <span className="font-semibold">{orderInfo?.tableNo}</span></p>
            <p>วันที่: <span className="font-semibold">{orderInfo?.dateTime}</span></p>
          </div>

          {/* รายการอาหาร */}
          <div className="space-y-4 border-t border-b py-4 max-h-96 overflow-y-auto">
            {payments.map((bill) => (
              <div key={bill.detailNo} className="flex items-center">
                <img
                  src={bill.menu?.image || ""}
                  alt={bill.menu?.name || ""}
                  className="w-16 h-16 object-cover rounded mr-4 border"
                />
                <div className="flex-1">
                  <h2 className="font-semibold">{bill.menu?.name}</h2>
                  <p className="text-sm text-gray-500">
                    {bill.amount} x {bill.price} บาท
                  </p>
                </div>
                <div className="font-semibold">{bill.totalCost} บาท</div>
              </div>
            ))}
          </div>

          {/* ราคารวม */}
          <div className="flex justify-between items-center font-bold text-lg border-t pt-4">
            <span>ราคารวมทั้งหมด</span>
            <span>{totalPrice} บาท</span>
          </div>

          {/* ปุ่มชำระเงิน */}
          <button
            className="mt-4 w-full bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition"
            onClick={() => setShowModal(true)}
          >
            ชำระเงิน
          </button>

          {/* Footer */}
          <div className="text-center text-gray-400 text-sm mt-2">
            ขอบคุณที่ใช้บริการ
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && payments.length > 0 && (
        <PaymentModal
          isOpen={showModal}
          totalPrice={totalPrice}
          orderNo={orderNo}
          tableNo={Number(orderInfo?.tableNo)}
          onClose={() => setShowModal(false)}
          onPay={handlePay}
        />
      )}
    </div>
  );
}
