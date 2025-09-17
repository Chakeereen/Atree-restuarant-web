"use client";

import { useEffect, useState } from "react";
import { checkPaid, getPaymentDetails } from "@/action/customer/PaymentAction";

interface BillItem {
  detailNo: number;
  amount: number;
  price: string;
  totalCost: string;
  menu: {
    name: string;
  };
  order: {
    orderNo: number;
    tableNo: number;
    dateTime: string;
  };
}

export default function BillPage({ searchParams }: { searchParams: { orderNo: string | null; paymentMethod?: string } }) {
  const [items, setItems] = useState<BillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (!searchParams.orderNo) return;

    const orderNo = Number(searchParams.orderNo);

    // ฟังก์ชัน polling
    const interval = setInterval(async () => {
      const paid = await checkPaid(orderNo);
      if (paid) {
        clearInterval(interval);
        setIsPaid(true);

        // โหลดบิลหลังจากจ่ายแล้ว
        try {
          const res = await getPaymentDetails(orderNo);
          if (res.success) {
            setItems(res.data);
          } else {
            setError(res.error || "Failed to fetch payment details");
          }
        } catch (err: any) {
          setError(err.message || "Something went wrong");
        } finally {
          setLoading(false);
        }
      }
    }, 5000); // เช็คทุก 5 วินาที

    return () => clearInterval(interval);
  }, [searchParams.orderNo]);

  // ข้อความระหว่างรอ
  if (!isPaid) {
    return (
      <p className="text-center mt-10 text-lg font-semibold">
        กรุณารอพนักงานยืนยันการชำระเงินของคุณ...
      </p>
    );
  }

  if (loading) return <p className="text-center mt-10">Loading bill...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (items.length === 0) return <p className="text-center mt-10">No items found</p>;

  // ดึง info ของ order จาก item แรก
  const firstItem = items[0];
  const orderNo = firstItem.order.orderNo;
  const tableNo = firstItem.order.tableNo;
  const dateTime = firstItem.order.dateTime;
  const paymentMethod = searchParams.paymentMethod ?? "ไม่ระบุ";

  const grandTotal = items.reduce((sum, item) => sum + Number(item.totalCost), 0);

  return (
    <div className="max-w-md mx-auto p-6 bg-[#FDF6E3] rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold text-center mb-4">🍽️ บิลอาหาร ร้าน ATREE</h2>
      <div className="mb-4 text-sm space-y-1">
        <p><span className="font-semibold">Order No:</span> {orderNo}</p>
        <p><span className="font-semibold">Table No:</span> {tableNo}</p>
        <p><span className="font-semibold">Date:</span> {dateTime}</p>
        <p><span className="font-semibold">Payment Method:</span> {paymentMethod}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-t border-b border-gray-300">
          <thead>
            <tr className="bg-[#FAF0D7]">
              <th className="text-left py-2 px-2">เมนู</th>
              <th className="text-center py-2 px-2">จำนวน</th>
              <th className="text-right py-2 px-2">ราคา/ชิ้น</th>
              <th className="text-right py-2 px-2">รวม</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.detailNo} className="border-b border-gray-300">
                <td className="py-2 px-2">{item.menu.name}</td>
                <td className="text-center py-2 px-2">{item.amount}</td>
                <td className="text-right py-2 px-2">{item.price}</td>
                <td className="text-right py-2 px-2">{item.totalCost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-right">
        <p className="text-lg font-bold">รวมทั้งหมด: {grandTotal} บาท</p>
      </div>
      <div className="mt-6 text-center text-sm font-medium text-gray-700">
        ขอบคุณที่ใช้บริการ 🙏
      </div>
    </div>
  );
}