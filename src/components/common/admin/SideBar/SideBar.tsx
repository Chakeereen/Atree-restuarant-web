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
} from "lucide-react";
import Link from "next/link";
import { useLogoutAdmin } from "@/utils/admin";
import { useRouter } from "next/navigation";

interface SidebarProps {
  adminInfo: {
    adminID: string;
    role: string;
    name: string;
    surname: string;
    image: string;
  }; // รับ object แทน adminID
}

export default function Sidebar({ adminInfo }: SidebarProps) {
  const router = useRouter();
  const { open, toggle } = useSidebar();
  const [dropdowns, setDropdowns] = useState<{ [key: string]: boolean }>({});
  const logoutAdmin = useLogoutAdmin();

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
          <li>
            <Link
              href="/admin"
              className="flex items-center gap-3 p-3 hover:bg-sidebar-accent rounded-none"
            >
              <Home size={20} />
              {open && <span>Dashboard</span>}
            </Link>
          </li>

          <li>
            <Link
              href="/admin/staff"
              className="flex items-center gap-3 p-3 hover:bg-sidebar-accent rounded-none"
            >
              <Users size={20} />
              {open && <span>พนักงาน</span>}
            </Link>
          </li>

          {/* Menu Dropdown */}
          <li>
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
                  <SquareStar size={20} />
                  เมนูแนะนำ
                </Link>
              </li>
            </ul>
          </li>

          {/* Report Dropdown */}
          <li>
            <button
              onClick={() => toggleDropdown("report")}
              className="flex items-center gap-3 p-3 w-full hover:bg-sidebar-accent rounded-none"
            >
              <ChefHat size={20} />
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
                  <CookingPot size={20} />
                  รายงานการสั่งอาหาร
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/report/incomeChart"
                  className="flex items-center gap-2 p-2 hover:bg-sidebar-accent rounded"
                >
                  <HandPlatter size={20} />
                  กราฟ (Chart)
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/report/paymentTable"
                  className="flex items-center gap-2 p-2 hover:bg-sidebar-accent rounded"
                >
                  <Armchair size={20} />
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

          <li>
            <button
              onClick={logoutAdmin}
              className="flex items-center gap-3 p-3 hover:bg-sidebar-accent rounded-none"
            >
              <LogOut size={20} />
              {open && <span>ออกจากระบบ</span>}
            </button>
          </li>
        </ul>
      </nav>

      {/* Footer Sticky */}
      <div className="sticky bottom-0 p-3 border-t border-sidebar-border bg-sidebar text-sidebar-foreground">
        {adminInfo ? (
          open ? (
            <div className="flex items-center justify-between">
              {/* Left: Profile */}
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

              {/* Right: Actions */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => router.push(`/admin/profile/${adminInfo.adminID}`)}
                  className="flex items-center gap-1 text-xs hover:text-blue-500"
                  title="ปรับแต่ง"
                >
                  <Settings size={16} />
                  <span>ปรับแต่ง</span>
                </button>
                <button
                  onClick={logoutAdmin}
                  className="flex items-center gap-1 text-xs hover:text-red-500"
                  title="ออกจากระบบ"
                >
                  <LogOut size={16} />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            </div>
          ) : (
            // Sidebar ปิด: แสดงเฉพาะไอคอน
            <div className="flex flex-col items-center gap-2">
              <img
                src={adminInfo.image || "/default-avatar.png"}
                alt={adminInfo.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => router.push(`/admin/profile/${adminInfo.adminID}`)}
                  className="hover:text-blue-500"
                  title="ปรับแต่ง"
                >
                  <Settings size={16} />
                </button>
                <button
                  onClick={logoutAdmin}
                  className="hover:text-red-500"
                  title="ออกจากระบบ"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          )
        ) : (
          <span className="text-xs">Loading...</span>
        )}
      </div>



    </aside>
  );
}
