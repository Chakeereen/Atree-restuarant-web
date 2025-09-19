'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Dropdown from './Dropdown/Dropdown';
import { RotateCcw } from 'lucide-react';

interface OrderHeaderProps {
  orderNo: number;
  tableNo: number;
}

export default function OrderHeader({ orderNo, tableNo }: OrderHeaderProps) {
  const router = useRouter();
  const pathname = usePathname(); // path ปัจจุบัน
  const [isLoading, setIsLoading] = useState(false);

  const handleOrderClick = async () => {
    // ถ้า path === '/customer' → ไม่ทำอะไร
    // ถ้า path !== '/customer' หรือ path.startsWith('/customer/') → ไป /customer
    if (pathname === '/customer') return;

    setIsLoading(true);
    try {
      await router.push('/customer');
    } catch (err) {
      console.error(err);
      setIsLoading(false); // reset ถ้า navigation fail
    }
  };

  useEffect(() => {
    if (pathname === '/customer') {
      setIsLoading(false); // ถ้าอยู่หน้า /customer แล้ว ให้หยุด loading
    }
  }, [pathname]);

  return (
    <header className="p-4 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-20 flex justify-between items-center shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">โต๊ะ {tableNo}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-300">ออร์เดอร์ : {orderNo}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleOrderClick}
          disabled={isLoading || pathname === '/customer'} // disable ถ้าอยู่หน้าแล้ว
          className={`px-4 py-2 rounded-lg h-10 flex items-center justify-center transition-colors ${isLoading
              ? 'bg-gray-400 dark:bg-gray-700 text-gray-200 cursor-not-allowed'
              : 'bg-orange-300 dark:bg-orange-700 hover:bg-orange-400 dark:hover:bg-orange-800 text-orange-800 dark:text-gray-100'
            }`}
        >
          {isLoading ? <RotateCcw className="animate-spin w-5 h-5" /> : 'สั่งอาหาร'}
        </button>

        <Dropdown orderNo={orderNo} />
      </div>
    </header>
  );
}
