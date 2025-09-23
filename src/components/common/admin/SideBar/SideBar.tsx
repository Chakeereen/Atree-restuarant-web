"use client";

import { useState } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  Menu,
  HandPlatter,
  ChefHat,
  CookingPot,
  Armchair,
  LogOut,
  SquareStar,
  Settings,
  Logs,
  ClipboardMinus,
  ListOrdered,
  ChartColumnStacked,
  CircleDollarSign,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogoutAdmin } from "./Loguot-wrapper";


interface SidebarProps {
  adminInfo: {
    adminID: string;
    role: string;
    name: string;
    surname: string;
    image: string;
  };
}

export default function Sidebar({ adminInfo }: SidebarProps) {
  const { open, toggle } = useSidebar();
  const [dropdowns, setDropdowns] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();
  const logoutAdmin = useLogoutAdmin(); // hook logout

  const toggleDropdown = (key: string) => {
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 flex flex-col",
        open ? "sidebar-open" : "sidebar-closed"
      )}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-between">
        {open && <span className="font-bold text-lg px-4 py-3">Admin</span>}
        <button onClick={toggle} className="p-3 hover:bg-sidebar-accent">
          <Menu size={20} />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="m-0 p-0">
          {/* Dashboard */}
          <li className="mb-2 border-b border-sidebar-border">
            <Link
              href="/admin"
              className="flex items-center gap-3 p-3 hover:bg-sidebar-accent rounded-none"
            >
              <Home size={20} />
              {open && <span>Dashboard</span>}
            </Link>
          </li>

          {/* Staff */}
          <li className="mb-2 border-b border-sidebar-border">
            <button
              onClick={() => toggleDropdown("staff")}
              className="flex items-center gap-3 p-3 w-full hover:bg-sidebar-accent rounded-none"
            >
              <Users size={20} />
              {open && <span>พนักงาน</span>}
            </button>

            <ul
              className={cn(
                "pl-6 overflow-hidden transition-[max-height] duration-300 ease-in-out",
                dropdowns["staff"] && open ? "max-h-96" : "max-h-0"
              )}
            >
              <li>
                <Link
                  href="/admin/staff"
                  className="flex items-center gap-2 p-2 hover:bg-sidebar-accent rounded"
                >
                  <Users size={20} />
                  รายการพนักงาน
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/staff/loginLog"
                  className="flex items-center gap-2 p-2 hover:bg-sidebar-accent rounded"
                >
                  <Logs size={20} />
                  LOG การเข้าใช้งาน
                </Link>
              </li>
            </ul>
          </li>

          {/* Menu Management */}
          <li className="mb-2 border-b border-sidebar-border">
            <button
              onClick={() => toggleDropdown("menu")}
              className="flex items-center gap-3 p-3 w-full hover:bg-sidebar-accent rounded-none"
            >
              <ChefHat size={20} />
              {open && <span>จัดการภายในร้าน</span>}
            </button>

            <ul
              className={cn(
                "pl-6 overflow-hidden transition-[max-height] duration-300 ease-in-out",
                dropdowns["menu"] && open ? "max-h-96" : "max-h-0"
              )}
            >
              <li>
                <Link
                  href="/admin/menu"
                  className="flex items-center gap-2 p-2 hover:bg-sidebar-accent rounded"
                >
                  <CookingPot size={20} />
                  รายการอาหาร
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/menu/menuType"
                  className="flex items-center gap-2 p-2 hover:bg-sidebar-accent rounded"
                >
                  <HandPlatter size={20} />
                  ประเภทเมนู
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/table"
                  className="flex items-center gap-2 p-2 hover:bg-sidebar-accent rounded"
                >
                  <Armchair size={20} />
                  โต๊ะ
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/menu/recommended"
                  className="flex items-center gap-2 p-2 hover:bg-sidebar-accent rounded"
                >
                  <ThumbsUp size={20} />
                  เมนูแนะนำ
                </Link>
              </li>
            </ul>
          </li>

          {/* Report */}
          <li className="mb-2 border-b border-sidebar-border">
            <button
              onClick={() => toggleDropdown("report")}
              className="flex items-center gap-3 p-3 w-full hover:bg-sidebar-accent rounded-none"
            >
              <ClipboardMinus size={20} />
              {open && <span>รายงาน</span>}
            </button>

            <ul
              className={cn(
                "pl-6 overflow-hidden transition-[max-height] duration-300 ease-in-out",
                dropdowns["report"] && open ? "max-h-96" : "max-h-0"
              )}
            >
              <li>
                <Link
                  href="/admin/report"
                  className="flex items-center gap-2 p-2 hover:bg-sidebar-accent rounded"
                >
                  <ListOrdered size={20} />
                  รายงานการสั่งอาหาร
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/report/incomeChart"
                  className="flex items-center gap-2 p-2 hover:bg-sidebar-accent rounded"
                >
                  <ChartColumnStacked size={20} />
                  กราฟ (Chart)
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/report/paymentTable"
                  className="flex items-center gap-2 p-2 hover:bg-sidebar-accent rounded"
                >
                  <CircleDollarSign size={20} />
                  การชำระเงิน
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/report/popularOrder"
                  className="flex items-center gap-2 p-2 hover:bg-sidebar-accent rounded"
                >
                  <SquareStar size={20} />
                  เมนูยอดนิยม
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      {/* Footer Sticky */}
      <div className="sticky bottom-0 p-3 border-t border-sidebar-border bg-sidebar text-sidebar-foreground">
        {adminInfo ? (
          open ? (
            <div className="flex flex-col gap-2">
              {/* Profile */}
              <div className="flex items-center gap-2">
                <img
                  src={adminInfo.image || "/default-avatar.png"}
                  alt={`${adminInfo.name} ${adminInfo.surname}`}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-medium">{adminInfo.name} {adminInfo.surname}</span>
                  <span className="text-xs">{adminInfo.role}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push(`/admin/profile/${adminInfo.adminID}`)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-blue-50 hover:text-blue-600 transition"
                  title="ปรับแต่ง"
                >
                  <Settings size={18} />
                  <span>Profile</span>
                </button>
                <button
                  onClick={logoutAdmin} // logout server action ผ่าน hook
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-red-50 hover:text-red-600 transition"
                  title="ออกจากระบบ"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <img
                src={adminInfo.image || "/default-avatar.png"}
                alt={adminInfo.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <button
                onClick={logoutAdmin}
                className="hover:text-red-500"
                title="ออกจากระบบ"
              >
                <LogOut size={16} />
              </button>
            </div>
          )
        ) : (
          <span className="text-xs">Loading...</span>
        )}
      </div>
    </aside>
  );
}
