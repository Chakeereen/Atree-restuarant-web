
import OrderClientPage from './order/OrderClientPage';
import { cookies } from "next/headers";
import { getPayloadFromToken } from "@/utils/่jwt";
import { getMenuData, getMenuType } from "@/action/customer/OrderAction";
import { MenuLists, MenuType } from "@/utils/type";
import OrderHeader from '@/components/common/customer/OrderHeader/OrderHeader';

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

  const menuRes = await getMenuData();
  const menuLists: MenuLists[] = menuRes.success ? (menuRes.data as MenuLists[]) : [];

  const typeRes = await getMenuType();
  const menuTypes: MenuType[] = typeRes.success ? (typeRes.data as MenuType[]) : [];

  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header แสดงทุกหน้า */}
      <OrderHeader orderNo={Number(payload.orderNo)} tableNo={Number(payload.tableNo)} />

      {/* หน้าเมนู */}
      <OrderClientPage
        orderInfo={{ orderNo: Number(payload.orderNo), tableNo: Number(payload.tableNo) }}
        menuLists={menuLists}
        menuTypes={menuTypes}
      />
    </main>
  );
}
