// app/customer/page.tsx (Server Component)

import { getMenuData, getMenuType } from "@/action/customer/OrderAction";
import { MenuLists, MenuType } from "@/utils/type";
import OrderClientWrapper from "./OrderClientWrapper";

export default async function CustomerPage() {
  const menuRes = await getMenuData();
  const menuLists: MenuLists[] = menuRes.success
    ? (menuRes.data as MenuLists[])
    : [];

  const typeRes = await getMenuType();
  const menuTypes: MenuType[] = typeRes.success
    ? (typeRes.data as MenuType[])
    : [];

  return (
    <OrderClientWrapper menuLists={menuLists} menuTypes={menuTypes} />
  );
}
