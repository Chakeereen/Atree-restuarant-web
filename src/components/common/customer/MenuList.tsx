'use client';
import { CartItem, MenuLists } from '@/utils/type';
import MenuItem from './MenuItem';

interface MenuListProps {
  menus: MenuLists[];          // ส่งเป็น array ของเมนู
  cart: CartItem[];
  onAdd: (menu: MenuLists) => void;
  onRemove: (menuID: number) => void;
}

export default function MenuList({ menus, cart, onAdd, onRemove }: MenuListProps) {
  const getItemAmountInCart = (menuID: number) =>
    cart.find((item) => item.menuID === menuID)?.amount || 0;

  if (menus.length === 0) return <p className="text-gray-400 text-sm">ไม่มีเมนูในหมวดนี้</p>;

  return (
    <div className="space-y-2">
      {menus.map((menu) => (
        <MenuItem
          key={menu.menuID}
          menu={menu}
          amount={getItemAmountInCart(menu.menuID)}
          onAdd={() => onAdd(menu)}
          onRemove={() => onRemove(menu.menuID)}
        />
      ))}
    </div>
  );
}
