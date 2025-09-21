import { cookies } from "next/headers";
import { getPayloadFromToken } from "@/utils/่jwt";
import Navbar from "@/components/common/Navbar/Navbar";
import { SidebarProvider } from "@/context/SidebarContext";
import Sidebar from "@/components/common/admin/SideBar/SideBar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // ดึง cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  // ดึง payload จาก JWT
  const payload = token ? getPayloadFromToken(token) : null;

  if (!payload || payload.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen bg-red-100">
        <h1 className="text-2xl text-red-700">Unauthorized Access</h1>
      </div>
    );
  }
   const AdminInfo = {
        adminID : payload.userId,
        role : payload.role,
        name : payload.name,
        surname : payload.surname,
        image : payload.image,
  }
 
  return (
    <>
      <Navbar />
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <Sidebar  adminInfo={AdminInfo} /> {/* ส่ง adminID ให้ Sidebar */}
          <main className="flex-1 p-6 overflow-auto bg-background">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </>
  );
}
