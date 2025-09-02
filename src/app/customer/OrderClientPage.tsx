'use client'; // 👈 คำสั่งสำคัญ! บอก Next.js ว่านี่คือ Client Component

import { useState, useMemo } from 'react';

import Image from 'next/image';
import { MenuLists, MenuType, OrderDetail } from '@/utils/type';

// Props ที่รับมาจาก Server Component
interface OrderPageProps {
  orderInfo: {
    orderNo: number;
    tableNo: number;
  };
  menuTypes: MenuType[];
}

// สร้าง Interface สำหรับตะกร้าสินค้า
interface CartItem extends OrderDetail {
  // เพิ่ม name และ image เพื่อให้แสดงผลในตะกร้าได้ง่าย
  name: string;
  image: string;
}

export default function OrderClientPage({ orderInfo, menuTypes }: OrderPageProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ฟังก์ชันเพิ่มสินค้าลงตะกร้า
  const handleAddItem = (menu: MenuLists) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.menuID === menu.menuID);
      if (existingItem) {
        // ถ้ามีอยู่แล้ว ให้เพิ่มจำนวน
        return prevCart.map(item =>
          item.menuID === menu.menuID
            ? { ...item, amount: item.amount + 1, totalCost: (item.amount + 1) * item.price }
            : item
        );
      } else {
        // ถ้ายังไม่มี ให้เพิ่มเข้าไปใหม่
        const newItem: CartItem = {
          detailNo: 0, // temp value
          orderNo: orderInfo.orderNo,
          menuID: menu.menuID,
          trackOrderID: 1, // default to 'cooking' or 'pending'
          amount: 1,
          price: menu.price,
          totalCost: menu.price,
          dateTime: new Date(),
          updateAT: new Date(),
          // ข้อมูลเสริมสำหรับ UI
          name: menu.name,
          image: menu.image,
        };
        return [...prevCart, newItem];
      }
    });
  };

  // ฟังก์ชันลดสินค้าจากตะกร้า
  const handleRemoveItem = (menuID: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.menuID === menuID);
      if (existingItem && existingItem.amount > 1) {
        // ถ้ามีมากกว่า 1 ชิ้น ให้ลดจำนวน
        return prevCart.map(item =>
          item.menuID === menuID
            ? { ...item, amount: item.amount - 1, totalCost: (item.amount - 1) * item.price }
            : item
        );
      } else {
        // ถ้ามี 1 ชิ้น หรือไม่เจอ ให้เอาออกจากตะกร้า
        return prevCart.filter(item => item.menuID !== menuID);
      }
    });
  };
  
  // คำนวณราคารวมและจำนวนชิ้นทั้งหมด (ใช้ useMemo เพื่อประสิทธิภาพ)
  const { totalCost, totalItems } = useMemo(() => {
    return cart.reduce(
      (acc, item) => {
        acc.totalCost += item.totalCost;
        acc.totalItems += item.amount;
        return acc;
      },
      { totalCost: 0, totalItems: 0 }
    );
  }, [cart]);

  // ฟังก์ชันยืนยันการสั่งซื้อ
  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      alert("กรุณาเลือกเมนูอาหาร");
      return;
    }
    setIsSubmitting(true);
    try {
      // ตรงนี้คือส่วนที่จะยิง API ไปยัง Backend เพื่อบันทึก Order
      console.log("Submitting Order:", {
        orderNo: orderInfo.orderNo,
        details: cart,
      });
      // สมมติว่า API call สำเร็จ
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      alert(`สั่งอาหารสำหรับโต๊ะ ${orderInfo.tableNo} สำเร็จ!`);
      setCart([]); // ล้างตะกร้าหลังสั่งสำเร็จ
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการสั่งอาหาร");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getItemAmountInCart = (menuID: number) => {
    return cart.find(item => item.menuID === menuID)?.amount || 0;
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* ใช้ max-w-md และ mx-auto เพื่อให้แสดงผลเหมือนมือถือบนจอใหญ่ */}
      <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen">
        {/* Header */}
        <header className="p-4 border-b sticky top-0 bg-white z-10">
          <h1 className="text-xl font-bold text-gray-800">โต๊ะ {orderInfo.tableNo}</h1>
          <p className="text-sm text-gray-500">Order #{orderInfo.orderNo}</p>
        </header>

        {/* Menu List */}
        <div className="pb-32"> {/* เพิ่ม padding-bottom เพื่อไม่ให้ content โดน footer บัง */}
          {menuTypes.map(type => (
            <section key={type.typeID} className="pt-4">
              <h2 className="font-bold text-lg px-4 mb-2 text-gray-700">{type.name}</h2>
              <div className="space-y-2">
                {type.menus?.map(menu => (
                  <div key={menu.menuID} className={`px-4 py-3 flex items-center gap-4 ${!menu.isAvailable ? 'opacity-40' : ''}`}>
                    <Image src={menu.image || '/images/placeholder.jpg'} alt={menu.name} width={80} height={80} className="rounded-md object-cover w-20 h-20 flex-shrink-0" />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800">{menu.name}</p>
                      <p className="text-sm text-gray-600">฿{menu.price.toFixed(2)}</p>
                       {!menu.isAvailable && <p className="text-xs text-red-500 font-bold">สินค้าหมด</p>}
                    </div>
                    {menu.isAvailable && (
                      <div className="flex items-center gap-2">
                        {getItemAmountInCart(menu.menuID) > 0 && (
                          <>
                            <button onClick={() => handleRemoveItem(menu.menuID)} className="bg-gray-200 text-gray-800 rounded-full w-7 h-7 font-bold text-lg flex items-center justify-center">-</button>
                            <span className="font-semibold w-5 text-center">{getItemAmountInCart(menu.menuID)}</span>
                          </>
                        )}
                        <button onClick={() => handleAddItem(menu)} className="bg-orange-500 text-white rounded-full w-7 h-7 font-bold text-lg flex items-center justify-center">+</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Order Summary Footer */}
        {totalItems > 0 && (
          <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t shadow-inner">
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">{totalItems} รายการ</span>
                <span className="font-bold text-xl text-gray-800">รวม ฿{totalCost.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleSubmitOrder} 
                disabled={isSubmitting}
                className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-300 transition-colors"
              >
                {isSubmitting ? 'กำลังส่ง...' : 'ยืนยันการสั่งซื้อ'}
              </button>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}