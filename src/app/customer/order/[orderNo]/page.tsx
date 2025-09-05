'use client';
import { useEffect, useState } from 'react';
import { getOrderDetails } from '@/action/customer/OrderAction';
import { OrderDetail } from '@/utils/type';
import { useParams } from 'next/navigation';

// interface OrderDetailPageProps {
//   orderNo: number;
// }

export default function OrderDetailPage() {
  const params = useParams();
  const orderNo = Number(params.orderNo);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      const data = await getOrderDetails(orderNo);
      setOrderDetails(data);
      setLoading(false);
    }

    fetchDetails();
  }, [orderNo]);

  const handleCancel = (detailNo: number) => {
    // ตัวอย่างฟังก์ชันยกเลิก
    alert(`ยกเลิกรายการ ${detailNo}`);
    // TODO: เรียก API ยกเลิกจริง ๆ
  };

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (orderDetails.length === 0) return <p>ไม่มีรายการสั่งอาหาร</p>;

  return (
    <div className="space-y-4 p-4">
      {orderDetails.map((item) => (
        <div
          key={item.detailNo}
          className="flex items-center justify-between border rounded p-2 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <img
              src={item.menu?.image || '/images/placeholder.jpg'}
              alt={item.menu?.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <p className="font-semibold">{item.menu?.name}</p>
              <p>จำนวน: x {item.amount}</p>
              <p>ราคา: ฿{Number(item.totalCost).toFixed(2)}</p>
              <p>สถานที่: {item.place}</p>
              <p>สถานะ: {item.track?.trackStateName}</p>
            </div>
          </div>

          <div>
            {item.track?.trackOrderID === 1 ? (
              <button
                onClick={() => handleCancel(item.detailNo)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                ยกเลิก
              </button>
            ) : (
              <button
                disabled
                className="bg-gray-300 text-gray-500 px-3 py-1 rounded cursor-not-allowed"
              >
                ยกเลิก
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
