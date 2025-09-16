'use client';
import { useRouter } from 'next/navigation';
import Dropdown from './Dropdown/Dropdown';

interface OrderHeaderProps {
  orderNo: number;
  tableNo: number;
}

export default function OrderHeader({ orderNo, tableNo }: OrderHeaderProps) {
  const router = useRouter();

  return (
    <header className="p-4 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-20 flex justify-between items-center shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">โต๊ะ {tableNo}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-300">ออร์เดอร์ : {orderNo}</p>
      </div>
      <div className="flex items-center gap-2">
        {/* ปุ่มสั่งอาหาร */}
        <button
          onClick={() => router.push('/customer')}
          className="bg-orange-300 dark:bg-orange-700 hover:bg-orange-400 dark:hover:bg-orange-800 text-orange-800 dark:text-gray-100 px-4 py-2 rounded-lg transition-colors h-10 flex items-center justify-center"
        >
          สั่งอาหาร
        </button>


        {/* ปุ่ม dropdown */}
        <Dropdown orderNo={orderNo} />
      </div>

    </header>
  );
}
