'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getPaymentDetails, checkPaid } from "@/action/customer/PaymentAction";
import { OrderDetail } from "@/utils/type";

export default function BillPage() {
  const params = useSearchParams();
  const orderNo = Number(params.get("orderNo"));
  const tableNo = params.get("tableNo");
  let method = params.get("paymentMethod");
  if (method === "CASH") method = "เงินสด";
  else if (method === "PROMPTPAY") method = "พร้อมเพย์";

  const [bills, setBills] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);

  const fetchBill = async () => {
    if (!orderNo) return;
    setLoading(true);
    try {
      const result = await getPaymentDetails(orderNo);
      if (result.success) setBills(result.data);
      else toast.error(result.error);
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการโหลดบิล");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orderNo) return;
    let interval: NodeJS.Timeout;

    const pollPaid = async () => {
      try {
        const paid = await checkPaid(orderNo);
        if (paid) {
          clearInterval(interval);
          setIsPaid(true);
          fetchBill();
        }
      } catch (err) {
        console.error("checkPaid error:", err);
      }
    };

    pollPaid();
    interval = setInterval(pollPaid, 5000);
    return () => clearInterval(interval);
  }, [orderNo]);

  if (!isPaid) return <p className="text-center mt-4 text-gray-600">กรุณารอพนักงานยืนยันการชำระเงิน...</p>;
  if (loading) return <p className="text-center mt-4 text-gray-600">กำลังโหลดข้อมูลบิล...</p>;
  if (!bills.length) return <p className="text-center mt-4 text-gray-600">ไม่มีรายการสั่งอาหาร</p>;

  return (
    <div className="max-w-md mx-auto mt-6">
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6 text-gray-800">
        <h1 className="text-2xl font-bold text-center">ร้านอาหาร ATREE</h1>
        <p className="mt-2">Order No: {orderNo}</p>
        <p>โต๊ะ: {tableNo}</p>
        <p>วิธีชำระ: {method}</p>

        <div className="border-t border-b py-4 mt-4">
          {bills.map(b => (
            <div key={b.detailNo} className="flex justify-between text-sm">
              <span>{b.menu?.name} ({b.amount} x {b.price})</span>
              <span>{b.totalCost} บาท</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between font-bold text-lg mt-4">
          <span>ราคารวมทั้งหมด</span>
          <span>{bills.reduce((acc, b) => acc + Number(b.totalCost), 0)} บาท</span>
        </div>

        <div className="text-center text-gray-400 text-sm mt-4">ขอบคุณที่ใช้บริการ</div>
      </div>
    </div>
  );
}
