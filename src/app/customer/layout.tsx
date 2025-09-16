import { cookies } from "next/headers";
import { getPayloadFromToken } from "@/utils/่jwt";
import OrderHeader from "@/components/common/customer/OrderHeader/OrderHeader";
import { OrderProvider } from "@/app/context/OrderContext";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const orderInfo = {
    orderNo: Number(payload.orderNo),
    tableNo: Number(payload.tableNo),
  };

  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <OrderHeader {...orderInfo} />

      {/* ✅ Provide orderInfo ให้ทุกหน้าใต้ /customer */}
      <OrderProvider orderInfo={orderInfo}>{children}</OrderProvider>
    </main>
  );
}
