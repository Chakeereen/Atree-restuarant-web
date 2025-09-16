'use client';
import Image from 'next/image';
import { MenuLists } from '@/utils/type';

interface MenuItemProps {
  menu: MenuLists;
  amount: number;
  onAdd: () => void;
  onRemove: () => void;
}

export default function MenuItem({ menu, amount, onAdd, onRemove }: MenuItemProps) {
  return (
    <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition transform hover:scale-[1.02] w-full">
      <div className="flex items-center gap-3">
        <img src={menu.image} alt={menu.name} className="w-20 h-20 rounded-md object-cover flex-shrink-0" />
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-100">{menu.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">฿{menu.price}</p>
        </div>
      </div>
      {menu.isAvailable && (
        <div className="flex items-center gap-2">
          {amount > 0 && (
            <>
              <button onClick={onRemove} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition">
                -
              </button>
              <span className="w-5 text-center text-gray-800 dark:text-gray-100">{amount}</span>
            </>
          )}
          <button onClick={onAdd} className="bg-orange-500 dark:bg-orange-400 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-orange-600 dark:hover:bg-orange-500 transition">
            +
          </button>
        </div>
      )}
    </div>

  );
}
