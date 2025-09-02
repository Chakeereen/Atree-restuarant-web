'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import { MenuLists, MenuType, OrderDetail } from '@/utils/type';
import MenuList from '@/components/common/customer/MenuList';
import CartFooter from '@/components/common/customer/CartFooter';
import { submitOrder } from '@/action/customer/OrderAction';
import { toast} from 'sonner'; // ✅ import sonner

interface OrderPageProps {
  orderInfo: { orderNo: number; tableNo: number };
  menuLists: MenuLists[];
  menuTypes: MenuType[];
}

interface CartItem extends OrderDetail {
  name: string;
  image: string;
}

export default function OrderClientPage({ orderInfo, menuLists, menuTypes }: OrderPageProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<number | null>(null);

  const tabsRef = useRef<HTMLDivElement>(null);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  // Update underline position on tab change
  useEffect(() => {
    const tabs = tabsRef.current?.children;
    if (!tabs) return;

    const activeIndex = Array.from(tabs).findIndex(
      (tab: any) => tab.dataset.id === String(selectedType ?? 'all')
    );
    if (activeIndex >= 0 && tabs[activeIndex] instanceof HTMLElement) {
      const tabEl = tabs[activeIndex] as HTMLElement;
      setUnderlineStyle({ left: tabEl.offsetLeft, width: tabEl.offsetWidth });
    }
  }, [selectedType]);

  const handleAddItem = (menu: MenuLists) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuID === menu.menuID);
      const price = Number(menu.price);
      if (existing) {
        return prev.map((i) =>
          i.menuID === menu.menuID
            ? { ...i, amount: i.amount + 1, totalCost: (i.amount + 1) * i.price }
            : i
        );
      }
      return [
        ...prev,
        {
          detailNo: 0,
          orderNo: orderInfo.orderNo,
          menuID: menu.menuID,
          trackOrderID: 1,
          amount: 1,
          price,
          totalCost: price,
          name: menu.name,
          image: menu.image,
        },
      ];
    });
  };

  const handleRemoveItem = (menuID: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuID === menuID);
      if (existing && existing.amount > 1) {
        return prev.map((i) =>
          i.menuID === menuID ? { ...i, amount: i.amount - 1, totalCost: (i.amount - 1) * i.price } : i
        );
      }
      return prev.filter((i) => i.menuID !== menuID);
    });
  };

  const { totalCost, totalItems } = useMemo(
    () =>
      cart.reduce(
        (acc, i) => {
          acc.totalCost += Number(i.totalCost);
          acc.totalItems += i.amount;
          return acc;
        },
        { totalCost: 0, totalItems: 0 }
      ),
    [cart]
  );

  // ✅ handle submit with sonner toast
  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      toast.warning('กรุณาเลือกเมนูอาหาร');
      return;
    }
    setIsSubmitting(true);
    try {
      await submitOrder(orderInfo, cart);
      toast.success(`สั่งอาหารสำหรับโต๊ะ ${orderInfo.tableNo} สำเร็จ!`);
      setCart([]);
    } catch (err) {
      console.error(err);
      toast.error('เกิดข้อผิดพลาดในการสั่งอาหาร');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabClick = (typeID: number | null) => {
    setSelectedType(typeID);
    const el = menuRefs.current[typeID ?? 'all'];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleSections.length > 0) {
          const topSection = visibleSections[0].target.getAttribute('data-id');
          setSelectedType(topSection === 'all' ? null : Number(topSection));
        }
      },
      { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    Object.entries(menuRefs.current).forEach(([key, el]) => {
      if (el) {
        el.setAttribute('data-id', key);
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
     

      <div
        className="mx-auto min-h-screen bg-white shadow-lg 
                   w-full sm:w-[400px] md:w-[700px] lg:w-[900px] xl:w-[1100px] 
                   transition-all duration-300 flex flex-col"
      >
        <header className="p-4 border-b sticky top-0 bg-white z-20">
          <h1 className="text-xl font-bold text-gray-800">โต๊ะ {orderInfo.tableNo}</h1>
          <p className="text-sm text-gray-500">Order #{orderInfo.orderNo}</p>
        </header>

        <div className="sticky top-[64px] z-10 bg-white border-b">
          <div ref={tabsRef} className="flex gap-2 overflow-x-auto p-3 scrollbar-hide relative">
            <button
              data-id="all"
              className={`px-3 py-3 rounded whitespace-nowrap ${selectedType === null ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
              onClick={() => handleTabClick(null)}
            >
              All
            </button>
            {menuTypes.map((type) => (
              <button
                key={type.typeID}
                data-id={type.typeID}
                className={`px-3 py-3 rounded whitespace-nowrap ${selectedType === type.typeID ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
                onClick={() => handleTabClick(type.typeID)}
              >
                {type.name}
              </button>
            ))}
            <div
              className="absolute bottom-0 h-1 bg-blue-500 transition-all duration-300"
              style={{ left: underlineStyle.left, width: underlineStyle.width }}
            />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4">
          <div ref={(el) => { menuRefs.current['all'] = el }} />

          {menuTypes.map((type) => {
            const menusOfType = menuLists.filter((menu) => menu.typeID === type.typeID);
            if (menusOfType.length === 0) return null;

            return (
              <div
                key={type.typeID}
                ref={(el) => { menuRefs.current[type.typeID] = el }}
                style={{ scrollMarginTop: '175px' }}
                className="bg-gray-50 rounded-lg p-4 mb-4" // ✅ เบา ๆ แยก section
              >
                <h2 className="text-lg font-semibold mb-3">{type.name}</h2>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  <MenuList
                    menus={menusOfType}
                    cart={cart}
                    onAdd={handleAddItem}
                    onRemove={handleRemoveItem}
                  />
                </div>
              </div>
            );
          })}
        </main>

        {totalItems > 0 && (
          <CartFooter
            totalItems={totalItems}
            totalCost={totalCost}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmitOrder}
          />
        )}
      </div>
    </div>
  );
}
