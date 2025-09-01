import { getPayloadFromToken } from "@/utils/่jwt";
import { cookies } from "next/headers";


export default async function CustomerPage() {
  // ✅ ต้อง await เพราะ cookies() เป็น Promise
  const cookieStore = cookies();
  const token = (await cookieStore).get("accessToken")?.value;

  const payload = token ? getPayloadFromToken(token) : null;

  if (!payload) return <div>Unauthorized</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome Customer</h1>
      <p>Order No: {payload.orderNo}</p>
      <p>Table No: {payload.tableNo}</p>
      <p>Role: {payload.role}</p>
    </div>
  );
}
