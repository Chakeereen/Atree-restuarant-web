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
    <div className={`px-4 py-3 flex items-center gap-4 ${!menu.isAvailable ? 'opacity-40' : ''}`}>
      <img
        src={menu.image || '/images/placeholder.jpg'}
        alt={menu.name}
        width={80}
        height={80}
        className="rounded-md object-cover w-20 h-20 flex-shrink-0"
      />
      <div className="flex-grow">
        <p className="font-semibold text-gray-800">{menu.name}</p>
        <p className="text-sm text-gray-600">฿{Number(menu.price).toFixed(2)}</p>
        {!menu.isAvailable && <p className="text-xs text-red-500 font-bold">สินค้าหมด</p>}
      </div>
      {menu.isAvailable && (
        <div className="flex items-center gap-2">
          {amount > 0 && (
            <>
              <button
                onClick={onRemove}
                className="bg-gray-200 text-gray-800 rounded-full w-7 h-7 font-bold text-lg flex items-center justify-center"
              >
                -
              </button>
              <span className="font-semibold w-5 text-center">{amount}</span>
            </>
          )}
          <button
            onClick={onAdd}
            className="bg-orange-500 text-white rounded-full w-7 h-7 font-bold text-lg flex items-center justify-center"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
