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

  const fetchDetails = async () => {
    setLoading(true);
    const result = await getOrderDetails(orderNo);
    if (result.success) {
      setOrderDetails(result.data);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleGoToPayment = () => {
    // ✅ ไม่มีออเดอร์เลย
    if (!orderDetails.length) {
      alert("ไม่มีข้อมูลออเดอร์");
      return;
    }


    // ✅ ถ้าผ่านทุกเงื่อนไข ให้ไปหน้าชำระเงิน
    router.push(`/customer/payment/${orderNo}`);
  };

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (orderDetails.length === 0) return <p>ไม่มีรายการสั่งอาหาร</p>;

  return (
    <>
      <div className="p-4 pb-20 space-y-4">
   

        <div className="p-4 space-y-6">
          {/* 🔹 เมนูที่กำลังดำเนินการ */}
          <div className="border rounded-lg shadow p-4 space-y-4">
            <h2 className="font-bold text-lg">เมนูที่กำลังดำเนินการ</h2>
            {orderDetails.filter((item) => item.track?.trackStateName !== 'cancel').length > 0 ? (
              orderDetails
                .filter((item) => item.track?.trackStateName !== 'cancel')
                .map((item) => (
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
                          onClick={() => setCancelOrder(item)}
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
                ))
            ) : (
              <p className="text-gray-500">ยังไม่มีเมนูกำลังดำเนินการ</p>
            )}
          </div>

          {/* 🔹 เส้นคั่น */}
          <hr className="border-t-2 border-gray-300 my-4" />

          {/* 🔹 เมนูที่ถูกยกเลิก */}
          <div className="border rounded-lg shadow p-4 space-y-4">
            <h2 className="font-bold text-lg">เมนูที่ถูกยกเลิก</h2>
            {orderDetails.filter((item) => item.track?.trackStateName === 'cancel').length > 0 ? (
              orderDetails
                .filter((item) => item.track?.trackStateName === 'cancel')
                .map((item) => (
                  <div
                    key={item.detailNo}
                    className="flex items-center justify-between border rounded p-2 shadow-sm bg-gray-100"
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
                        <p>ผู้ที่ยกเลิก: {item.cancelLog?.cancelBy}</p>
                        <p>สาเหตุ: {item.cancelLog?.description}</p>
                        <p className="text-red-600 font-medium">
                          สถานะ: {item.track?.trackStateName}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500">ยังไม่มีเมนูที่ถูกยกเลิก</p>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 Footer Button ไปหน้าชำระเงิน */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 shadow-lg">
        <button
          onClick={handleGoToPayment}
          className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700"
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
              fetchDetails(); // รีเฟรชหลังยกเลิกสำเร็จ
            }}
          />
        </Modal>
      )}
    </>
  );
}
