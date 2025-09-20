"use client";

import { useState, useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import { Home, Settings, Users, Menu, HandPlatter, ChefHat, CookingPot, Armchair, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogoutAdmin } from "@/utils/admin";

export default function Sidebar() {
  const { open, toggle } = useSidebar();
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const router = useRouter();

  const logoutAdmin = useLogoutAdmin();

  // ปิด dropdown อัตโนมัติเมื่อ sidebar ปิด
  useEffect(() => {
    if (!open) {
      setMenuDropdownOpen(false);
    }
  }, [open]);

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
      <nav className="flex-1">
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
              onClick={() => {
                setMenuDropdownOpen(!menuDropdownOpen);
                router.push("/admin/menu");
              }}
              className="flex items-center gap-3 p-3 w-full hover:bg-sidebar-accent rounded-none"
            >
              <ChefHat size={20} />
              {open && <span>จัดการภายในร้าน</span>}
            </button>

            {/* Dropdown แบบ smooth + fade-in/out */}
            <ul
              className={cn(
                "pl-6 overflow-hidden transition-[max-height] duration-300 ease-in-out",
                menuDropdownOpen && open ? "max-h-96" : "max-h-0"
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
    </aside>
  );
}
