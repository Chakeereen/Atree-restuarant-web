'use client';
import { useEffect, useState } from 'react';
import { getOrderDetails } from '@/action/customer/OrderAction';
import { OrderDetail } from '@/utils/type';
import { useParams, useRouter } from 'next/navigation';
import Modal from '@/components/common/Modal';
import { CancelOrder } from '@/components/common/customer/CancelOrder/CancelOrder';
import { toast } from 'sonner';

export default function CancelledOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderNo = Number(params.orderNo);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelOrder, setCancelOrder] = useState<OrderDetail | null>(null);

  const fetchDetails = async (): Promise<OrderDetail[]> => {
    setLoading(true);
    const result = await getOrderDetails(orderNo);
    if (result.success) {
      setOrderDetails(result.data);
      setLoading(false);
      return result.data;
    } else {
      setLoading(false);
      toast.error(result.error);
      return [];
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">กำลังโหลดข้อมูล...</p>
      </div>
    );

  if (orderDetails.length === 0)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">ไม่มีรายการสั่งอาหาร</p>
      </div>
    );

  // กรองเฉพาะรายการถูกยกเลิก
  const cancelledItems = orderDetails.filter(
    (item) => item.track?.trackStateName === 'cancel'
  );

  return (
    <>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          รายการถูกยกเลิก #{orderNo}
        </h1>

        {cancelledItems.length > 0 ? (
          cancelledItems.map((item) => (
            <div
              key={item.detailNo}
              className="flex flex-col sm:flex-row items-center sm:items-start justify-between bg-gray-100 rounded-xl shadow-sm p-4 space-y-2 sm:space-y-0 sm:space-x-4"
            >
              <img
                src={item.menu?.image || '/images/placeholder.jpg'}
                alt={item.menu?.name}
                className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-semibold text-lg">{item.menu?.name}</p>
                <p className="text-gray-600 text-sm">จำนวน: x {item.amount}</p>
                <p className="text-gray-600 text-sm">
                  ราคา: ฿{Number(item.totalCost).toFixed(2)}
                </p>
                <p className="text-gray-600 text-sm">ผู้ที่ยกเลิก: {item.cancelLog?.cancelBy}</p>
                <p className="text-gray-600 text-sm">สาเหตุ: {item.cancelLog?.description}</p>
                <p className="text-red-600 font-medium">
                  สถานะ: {item.track?.trackStateName}
                </p>
              </div>
              <div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">ยังไม่มีเมนูที่ถูกยกเลิก</p>
        )}
      </div>

      {/* Modal สำหรับ Cancel (ยังคงไว้ เผื่ออนาคตต้องใช้) */}
      {cancelOrder && (
        <Modal
          isOpen={true}
          onClose={() => {
            setCancelOrder(null);
          }}
        >
          <CancelOrder
            CancelOrder={cancelOrder}
            onSuccess={() => {
              setCancelOrder(null);
              fetchDetails();
            }}
          />
        </Modal>
      )}
    </>
  );
}
