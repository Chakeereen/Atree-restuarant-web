// สมมติว่า path นี้ถูกต้อง
import { cookies } from "next/headers";
import { getMenuData } from "@/lib/data";
import OrderClientPage from "./OrderClientPage"; // Import Client Component
import { getPayloadFromToken } from "@/utils/่jwt";

export default async function CustomerPage() {
  const cookieStore = cookies();
  const token =   (await cookieStore).get("accessToken")?.value;

  const payload = token ? getPayloadFromToken(token) : null;

  if (!payload) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-100">
        <h1 className="text-2xl text-red-700">Unauthorized Access</h1>
      </div>
    );
  }

  // ✅ ดึงข้อมูลเมนูทั้งหมดบน Server
  const menuTypes = await getMenuData();

  return (
    <main>
      {/* ส่งข้อมูลที่จำเป็น (payload และ menuTypes) ไปให้ Client Component */}
      <OrderClientPage 
        orderInfo={{ orderNo: Number(payload.orderNo) , tableNo: Number(payload.tableNo) }} 
        menuTypes={menuTypes} 
      />
    </main>
  );
}