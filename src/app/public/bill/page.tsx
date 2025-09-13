'use client';

import { getPaymentDetails, checkPaid } from "@/action/customer/PaymentAction";
import { OrderDetail } from "@/utils/type";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const params = useSearchParams();
  const orderNo = Number(params.get("orderNo"));
  const totalPrice = Number(params.get("totalCost"));
  const tableNo = params.get("tableNo");
  const method = params.get("paymentMethod");

  const [bills, setBills] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);

  // ฟังก์ชันดึง bill
  const fetchBill = async () => {
    if (!orderNo) return;
    setLoading(true);
    try {
      const result = await getPaymentDetails(orderNo);
      if (result.success) {
        setBills(result.data);
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการโหลดบิล");
    } finally {
      setLoading(false);
    }
  };

  // Polling checkPaid
  useEffect(() => {
    if (!orderNo) return;

    let interval: NodeJS.Timeout;

    const pollPaid = async () => {
      try {
        const paid = await checkPaid(orderNo);
        if (paid) {
          clearInterval(interval); // หยุด polling
          setIsPaid(true);
          fetchBill(); // โหลด bill หลังจากจ่ายแล้ว
        }
      } catch (err) {
        console.error("checkPaid error:", err);
      }
    };

    pollPaid(); // check ครั้งแรกทันที
    interval = setInterval(pollPaid, 5000); // check ทุก 5 วิ

    return () => clearInterval(interval);
  }, [orderNo]);

  // แสดงข้อความตามสถานะ
  if (!isPaid) {
    return <p className="text-center mt-4">กรุณารอพนักงานยืนยันการชำระเงินสักครู่...</p>;
    
  }

  if (loading) {
    return <p className="text-center mt-4">กำลังโหลดข้อมูลบิล...</p>;
  }

  if (bills.length === 0) {
    return <p className="text-center mt-4">ไม่มีรายการสั่งอาหาร</p>;
  }

  return (
    <div>
      <h1>orderNo {orderNo}</h1>
      <h1>totalCost {totalPrice}</h1>
      <h1>table NO {tableNo}</h1>
      <h1>method {method}</h1>
      <div className="space-y-4 border-t border-b py-4">
        {bills.map((bill) => (
          <div key={bill.detailNo}>
            <p>
              {bill.menu?.name} {bill.price} x {bill.amount} ฿{bill.totalCost}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
