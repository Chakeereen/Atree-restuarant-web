// app/customer/OrderClientWrapper.tsx (Client Component)
"use client";

import { MenuLists, MenuType } from "@/utils/type";
import { useOrderInfo } from "@/app/context/OrderContext";
import OrderClientPage from "./order/OrderClientPage";

export default function OrderClientWrapper({
  menuLists,
  menuTypes,
}: {
  menuLists: MenuLists[];
  menuTypes: MenuType[];
}) {
  const orderInfo = useOrderInfo(); // ✅ ใช้ Hook ได้ที่นี่

  return (
    <OrderClientPage
      orderInfo={orderInfo}
      menuLists={menuLists}
      menuTypes={menuTypes}
    />
  );
}
