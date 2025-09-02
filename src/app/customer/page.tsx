import { cookies } from "next/headers";

import { getMenuAll } from "@/action/admin/MenuAction";
import { getPayloadFromToken } from "@/utils/่jwt";
import OrderClientPage from "./order/OrderClientPage";
import { MenuLists, MenuType } from "@/utils/type";
import { getMenuData, getMenuType } from "@/action/customer/OrderAction";

export default async function CustomerPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("accessToken")?.value;

  const payload = token ? getPayloadFromToken(token) : null;

  if (!payload) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-100">
        <h1 className="text-2xl text-red-700">Unauthorized Access</h1>
      </div>
    );
  }

  



  // ดึง menuLists
  const menuRes = await getMenuData();
  const menuLists: MenuLists[] = menuRes.success ? (menuRes.data as MenuLists[]) : [];

  // ดึง menuTypes
  const typeRes = await getMenuType();
  const menuTypes: MenuType[] = typeRes.success ? (typeRes.data as MenuType[]) : [];
  console.log(menuTypes)

  return (
    <main>
      <OrderClientPage
        orderInfo={{ orderNo: Number(payload.orderNo), tableNo: Number(payload.tableNo) }}
        menuLists={menuLists}
        menuTypes={menuTypes}
      />
    </main>
  );
}
