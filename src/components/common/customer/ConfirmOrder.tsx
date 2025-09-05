import { CartItem } from "@/utils/type";
import { useState } from "react";

interface HoldOrderPageProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  totalCost: number;
  isSubmitting: boolean;
  onBack: () => void;
  onConfirm: () => Promise<void>;


}

export default function HoldOrderPage({ cart, setCart, totalCost, isSubmitting, onBack, onConfirm }: HoldOrderPageProps) {
  const [modalOpen, setModalOpen] = useState<number | null>(null);


  return (
    <div className="p-4 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">ตรวจสอบคำสั่งซื้อ</h2>
      <ul className="flex-1 overflow-y-auto space-y-3">
        {cart.map((item) => (
          <li key={item.menuID} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
            {/* ซ้าย: รูป + ชื่อ + place + modal */}
            <span className="flex items-center gap-3">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium">{item.name}</span>

                {/* Dropdown place */}
                <select
                  value={item.place}
                  onChange={(e) =>
                    setCart((prev) =>
                      prev.map((c) => (c.menuID === item.menuID ? { ...c, place: e.target.value } : c))
                    )
                  }
                  className="border border-gray-300 rounded-md px-2 py-1 mt-1 text-sm"
                >
                  <option value="กินที่ร้าน">กินที่ร้าน</option>
                  <option value="สั่งกลับบ้าน">สั่งกลับบ้าน</option>
                </select>

                {/* ปุ่มเปิด modal สำหรับคำขอเพิ่มเติม */}
                <button onClick={() => setModalOpen(item.menuID)} className="mt-1 text-sm text-blue-500 hover:underline">
                  เพิ่มคำขอพิเศษ
                </button>
              </div>
            </span>

            {/* ขวา: total cost + ปุ่ม +/- อยู่ด้านล่าง */}
            <div className="flex flex-col items-center gap-2">
              <span className="font-semibold">฿{item.totalCost.toFixed(2)}</span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                  onClick={() =>
                    setCart((prev) =>
                      prev
                        .map((c) =>
                          c.menuID === item.menuID
                            ? { ...c, amount: c.amount - 1, totalCost: (c.amount - 1) * c.price }
                            : c
                        )
                        .filter((c) => c.amount > 0) // ลบ item ถ้า amount = 0
                    )
                  }
                >
                  -
                </button>
                <span className="px-2">{item.amount}</span>
                <button
                  className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                  onClick={() =>
                    setCart((prev) =>
                      prev.map((c) =>
                        c.menuID === item.menuID
                          ? { ...c, amount: c.amount + 1, totalCost: (c.amount + 1) * c.price }
                          : c
                      )
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
          </li>

        ))}
      </ul>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center">
        <button onClick={onBack} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300" disabled={isSubmitting}>
          กลับ
        </button>
        <button onClick={onConfirm} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" disabled={isSubmitting}>
          {isSubmitting ? 'กำลังส่ง...' : `ยืนยันสั่ง (฿${totalCost.toFixed(2)})`}
        </button>
      </div>

      {/* Modal */}
      {/* Modal */}
      {modalOpen !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          {/* Overlay โปร่งใสมาก */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm pointer-events-auto"></div>

          {/* Modal Box */}
          <div className="relative bg-white rounded-xl shadow-xl w-96 max-w-[90%] p-6 animate-fadeIn pointer-events-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">คำขอเพิ่มเติม</h3>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              placeholder="ใส่คำขอเพิ่มเติมที่นี่..."
              value={cart.find(c => c.menuID === modalOpen)?.description || ''}
              onChange={(e) =>
                setCart((prev) =>
                  prev.map((c) => (c.menuID === modalOpen ? { ...c, description: e.target.value } : c))
                )
              }
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                onClick={() => setModalOpen(null)}
              >
                ยกเลิก
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                onClick={() => setModalOpen(null)}
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
