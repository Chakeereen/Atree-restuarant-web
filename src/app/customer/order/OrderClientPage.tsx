'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import { MenuLists, MenuType, OrderDetail } from '@/utils/type';
import MenuList from '@/components/common/customer/MenuList';
import CartFooter from '@/components/common/customer/CartFooter';
import HoldOrderPage from '@/components/common/customer/ConfirmOrder';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { submitOrder } from '@/action/customer/OrderAction';

interface OrderPageProps {
  orderInfo: { orderNo: number; tableNo: number };
  menuLists: MenuLists[];
  menuTypes: MenuType[];
}

interface CartItem extends OrderDetail {
  name: string;
  image: string;
}

export default function OrderClientPage({
  orderInfo,
  menuLists,
  menuTypes,
}: OrderPageProps) {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<number | string | null>(null);
  const [isHold, setIsHold] = useState(false);

  const [recommendedMenus, setRecommendedMenus] = useState<MenuLists[]>([]); // ✅ State สำหรับ Recommended
  const tabsRef = useRef<HTMLDivElement>(null);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  // Fetch recommended menu จาก API
  useEffect(() => {
    fetch('/api/admin/menu/recommended')
      .then(res => res.json())
      .then(data => {
        const menus: MenuLists[] = data.data.map((item: any) => ({
          menuID: item.menu.menuID,
          name: item.menu.name,
          price: Number(item.menu.price),
          image: item.menu.image,
          typeID: item.menu.typeID,
          isAvailable: item.menu.isAvailable,
        }));
        setRecommendedMenus(menus);
      })
      .catch(err => console.error('Failed to fetch recommended menus:', err));
  }, []);

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
    setCart(prev => {
      const index = prev.findIndex(i => i.menuID === menu.menuID);
      const price = Number(menu.price);
      if (index >= 0) {
        const newCart = [...prev];
        newCart[index] = {
          ...newCart[index],
          amount: newCart[index].amount + 1,
          totalCost: (newCart[index].amount + 1) * newCart[index].price,
        };
        return newCart;
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
          place: 'กินที่ร้าน',
          description: '',
        },
      ];
    });
  };

  const handleRemoveItem = (menuID: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuID === menuID);
      if (existing && existing.amount > 1) {
        return prev.map(i =>
          i.menuID === menuID ? { ...i, amount: i.amount - 1, totalCost: (i.amount - 1) * i.price } : i
        );
      }
      return prev.filter(i => i.menuID !== menuID);
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

  const handleTabClick = (typeID: number | string | null) => {
    setSelectedType(typeID);
    const el = menuRefs.current[typeID ?? 'all'];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visibleSections = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleSections.length > 0) {
          const topSection = visibleSections[0].target.getAttribute('data-id');
          setSelectedType(topSection === 'all' ? null : topSection);
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
    <div className="bg-gray-50 dark:bg-gray-900 font-sans transition-colors">
      <div className="mx-auto bg-white dark:bg-gray-800 shadow-lg w-full transition-all duration-300 flex flex-col rounded-lg">
        {isHold ? (
          <HoldOrderPage
            cart={cart}
            setCart={setCart}
            totalCost={totalCost}
            isSubmitting={isSubmitting}
            onBack={() => setIsHold(false)}
            onConfirm={async () => {
              setIsSubmitting(true);
              try {
                if (cart.length === 0) {
                  toast.warning('กรุณาเลือกเมนูก่อน');
                  setIsHold(false);
                  return;
                }
                await submitOrder(orderInfo, cart);
                toast.success(`สั่งอาหารสำหรับโต๊ะ ${orderInfo.tableNo} สำเร็จ!`);
                setCart([]);
                setIsHold(false);
              } catch (err) {
                console.error(err);
                toast.error('เกิดข้อผิดพลาดในการสั่งอาหาร');
              } finally {
                setIsSubmitting(false);
              }
            }}
          />
        ) : (
          <>
            {/* Tabs */}
            <div className="sticky top-16 z-10 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
              <div
                ref={tabsRef}
                className="flex gap-2 overflow-x-auto p-3 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-gray-200 dark:scrollbar-track-gray-700 relative"
              >
                <button
                  data-id="recommended"
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    selectedType === 'recommended'
                      ? 'text-orange-600 dark:text-orange-400 font-semibold'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                  onClick={() => handleTabClick('recommended')}
                >
                  Recommended
                </button>
                <button
                  data-id="all"
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    selectedType === null
                      ? 'text-orange-600 dark:text-orange-400 font-semibold'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                  onClick={() => handleTabClick(null)}
                >
                  All
                </button>
                {menuTypes.map(type => (
                  <button
                    key={type.typeID}
                    data-id={type.typeID}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                      selectedType === type.typeID
                        ? 'text-orange-600 dark:text-orange-400 font-semibold'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                    onClick={() => handleTabClick(type.typeID)}
                  >
                    {type.name}
                  </button>
                ))}
                <div
                  className="absolute bottom-0 h-1 bg-orange-500 dark:bg-orange-400 rounded transition-all duration-300"
                  style={{ left: underlineStyle.left, width: underlineStyle.width }}
                />
              </div>
            </div>

            {/* Main content */}
            <main className="p-4">
              {/* Section Recommended */}
              {recommendedMenus.length > 0 && (
                <div
                  ref={el => {(menuRefs.current['recommended'] = el)}}
                  style={{ scrollMarginTop: '175px' }}
                  className="bg-yellow-50 dark:bg-yellow-900 rounded-xl p-4 mb-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold mb-3 text-yellow-800 dark:text-yellow-200">
                    เมนูแนะนำ
                  </h2>
                  <MenuList
                    menus={recommendedMenus}
                    cart={cart}
                    onAdd={handleAddItem}
                    onRemove={handleRemoveItem}
                  />
                </div>
              )}

              {/* Section All */}
              <div ref={el => {(menuRefs.current['all'] = el)}} />

              {menuTypes.map(type => {
                const menusOfType = menuLists.filter(menu => menu.typeID === type.typeID);
                if (menusOfType.length === 0) return null;

                return (
                  <div
                    key={type.typeID}
                    ref={el => {(menuRefs.current[type.typeID] = el)}}
                    style={{ scrollMarginTop: '175px' }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6 shadow-sm"
                  >
                    <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
                      {type.name}
                    </h2>
                    <MenuList
                      menus={menusOfType}
                      cart={cart}
                      onAdd={handleAddItem}
                      onRemove={handleRemoveItem}
                    />
                  </div>
                );
              })}
            </main>

            {totalItems > 0 && (
              <CartFooter
                totalItems={totalItems}
                totalCost={totalCost}
                isSubmitting={isSubmitting}
                onSubmit={() => setIsHold(true)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
