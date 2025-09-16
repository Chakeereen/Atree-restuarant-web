// components/common/customer/OrderHeader.tsx
'use client';
import { useRouter } from 'next/navigation';

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
        <p className="text-sm text-gray-500 dark:text-gray-300">Order #{orderNo}</p>
      </div>
      <button
        onClick={() => router.push(`/customer/order/${orderNo}`)}
        className="bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors"
      >
        รายละเอียด
      </button>
    </header>
  );
}
