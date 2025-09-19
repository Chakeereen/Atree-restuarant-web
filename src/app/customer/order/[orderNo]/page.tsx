'use client';
import { useEffect, useState } from 'react';
import { getOrderDetails } from '@/action/customer/OrderAction';
import { OrderDetail } from '@/utils/type';
import { useParams, useRouter } from 'next/navigation';
import Modal from '@/components/common/Modal';
import { CancelOrder } from '@/components/common/customer/CancelOrder/CancelOrder';
import { toast } from 'sonner';

export default function OrderDetailPage() {
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

  const handleGoToPayment = async () => {
    const latestDetails = await fetchDetails();
    const activeOrders = latestDetails.filter((item) => item.track?.trackStateName !== 'cancel');

    if (!activeOrders.length) {
      toast.warning("ไม่มีข้อมูลออเดอร์ที่ยังดำเนินการอยู่");
      return;
    }

    router.push(`/customer/payment/${orderNo}`);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 dark:text-gray-300 text-lg">กำลังโหลดข้อมูล...</p>
      </div>
    );

  if (orderDetails.length === 0)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 dark:text-gray-300 text-lg">ไม่มีรายการสั่งอาหาร</p>
      </div>
    );

  return (
    <>
      {/* Content Scrollable */}
      <div className="p-4 pb-32 space-y-6">
        <h1 className="text-2xl font-bold text-center mb-2 dark:text-white">
          รายละเอียดออเดอร์ #{orderNo}
        </h1>

        {/* เมนูที่กำลังดำเนินการ */}
        <div className="space-y-4">
          {orderDetails.filter((item) => item.track?.trackStateName !== 'cancel').length > 0 ? (
            orderDetails
              .filter((item) => item.track?.trackStateName !== 'cancel')
              .map((item) => (
                <div
                  key={item.detailNo}
                  className="flex flex-col sm:flex-row items-center sm:items-start justify-between bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 space-y-2 sm:space-y-0 sm:space-x-4 transition-colors"
                >
                  <img
                    src={item.menu?.image || '/images/placeholder.jpg'}
                    alt={item.menu?.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-lg dark:text-white">{item.menu?.name}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">จำนวน: x {item.amount}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">ราคา: ฿{Number(item.totalCost).toFixed(2)}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">สถานที่: {item.place}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">สถานะ: {item.track?.trackStateName}</p>
                  </div>
                  <div>
                    {item.track?.trackOrderID === 1 ? (
                      <button
                        onClick={() => setCancelOrder(item)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        ยกเลิก
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed transition-colors"
                      >
                        ยกเลิก
                      </button>
                    )}
                  </div>
                </div>
              ))
          ) : (
            <p className="text-gray-500 dark:text-gray-300 text-center">
              ยังไม่มีเมนูกำลังดำเนินการ
            </p>
          )}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-inner p-4 transition-colors">
        <button
          onClick={handleGoToPayment}
          className="w-full bg-green-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors"
        >
          ไปหน้าชำระเงิน
        </button>
      </div>

      {/* Modal สำหรับ Cancel */}
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
