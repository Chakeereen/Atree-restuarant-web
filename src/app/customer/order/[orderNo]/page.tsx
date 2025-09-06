'use client';
import { useEffect, useState } from 'react';
import { getOrderDetails } from '@/action/customer/OrderAction';
import { OrderDetail } from '@/utils/type';
import { useParams, useRouter } from 'next/navigation';
import Modal from '@/components/common/Modal';
import { CancelOrder } from '@/components/common/customer/CancelOrder/CancelOrder';

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
      console.error(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (orderDetails.length === 0) return <p>ไม่มีรายการสั่งอาหาร</p>;

  return (
    <>
      <div className="p-4 space-y-4">
        <header className="p-4 border-b sticky top-0 bg-white z-20 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-800">โต๊ะ {orderDetails.at(0)?.order?.tableNo}</h1>
            <p className="text-sm text-gray-500">Order #{orderNo}</p>
          </div>

          <div className="flex gap-2">
            {/* ปุ่มย้อนกลับ */}
            <button
              onClick={() => router.back()}
              className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300"
            >
              ⬅ ย้อนกลับ
            </button>

            {/* ปุ่มไปหน้า OrderDetail */}
           
          </div>
        </header>
        {/* ให้เพิ่ม card คล่ม map ด้านล่าง ใส่ชื่อว่า เมนที่กำลังดำเนินการ*/}
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
