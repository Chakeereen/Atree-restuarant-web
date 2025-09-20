"use client";

import { useEffect, useState } from "react";

type MenuType = {
  typeID: number;
  name: string;
};

type OrderDetailResponse = {
  success: boolean;
  data: OrderDetail[];
};

type OrderDetail = {
  detailNo: number;
  orderNo: number;
  menu: {
    menuID: number;
    name: string;
    price: number;
    type: string; // ชื่อ menuType
  };
  trackOrderID: number;
  trackStatus: string;
  amount: number;
  place: string;
  price: number;
  totalCost: number;
  dateTime: string;
  updateAT: string;
  cancelLog: any;
};

type TimeRange = "1D" | "7D" | "30D" | "3M" | "ALL";
type SortOrder = "TOP" | "BOTTOM";

export default function PopularMenuReport() {
  const [menus, setMenus] = useState<OrderDetail[]>([]);
  const [categories, setCategories] = useState<MenuType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("ALL");
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>("TOP");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/menuType");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data: MenuType[] = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch("/api/admin/report/popularOrder");
        if (!res.ok) throw new Error("Failed to fetch order details");
        const result: OrderDetailResponse = await res.json();
        setMenus(result.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  useEffect(() => {
    const now = new Date();
    let startDate: Date;
    switch (timeRange) {
      case "1D": startDate = new Date(now.getTime() - 1*24*60*60*1000); break;
      case "7D": startDate = new Date(now.getTime() - 7*24*60*60*1000); break;
      case "30D": startDate = new Date(now.getTime() - 30*24*60*60*1000); break;
      case "3M": startDate = new Date(now); startDate.setMonth(now.getMonth() - 3); break;
      case "ALL":
      default: startDate = new Date(0); break;
    }
    setSelectedDateRange({ start: startDate, end: now });
  }, [timeRange]);

  const filteredMenusByCategory = selectedCategory
    ? menus.filter((menu) => menu.menu.type === categories.find(c => c.typeID === selectedCategory)?.name)
    : menus;

  const filteredMenus = filteredMenusByCategory.filter((menu) => {
    if (!selectedDateRange) return true;
    const menuDate = new Date(convertThaiDateToGregorian(menu.dateTime));
    return menuDate >= selectedDateRange.start && menuDate <= selectedDateRange.end;
  });

  const menuSummary = filteredMenus.reduce((acc, cur) => {
    const key = cur.menu.menuID;
    if (!acc[key]) acc[key] = { name: cur.menu.name, type: cur.menu.type, totalAmount: cur.amount, totalRevenue: cur.totalCost };
    else { acc[key].totalAmount += cur.amount; acc[key].totalRevenue += cur.totalCost; }
    return acc;
  }, {} as Record<number, { name: string; type: string; totalAmount: number; totalRevenue: number }>);

  const sortedMenuSummary = Object.values(menuSummary).sort((a, b) => sortOrder === "TOP" ? b.totalAmount - a.totalAmount : a.totalAmount - b.totalAmount);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">รายงานเมนูยอดนิยม</h2>

      {/* Filter */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <select
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
          value={selectedCategory ?? ""}
          onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">ทุกประเภท</option>
          {categories.map((cat) => <option key={cat.typeID} value={cat.typeID}>{cat.name}</option>)}
        </select>

        <select
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
        >
          <option value="1D">1 วัน</option>
          <option value="7D">7 วัน</option>
          <option value="30D">30 วัน</option>
          <option value="3M">3 เดือน</option>
          <option value="ALL">All Time</option>
        </select>

        <select
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrder)}
        >
          <option value="TOP">สั่งมากสุด</option>
          <option value="BOTTOM">สั่งน้อยสุด</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        {loading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : (
          <table className="w-full table-auto border-collapse text-left">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
              <tr>
                <th className="px-3 py-2">เมนู</th>
                <th className="px-3 py-2">ประเภท</th>
                <th className="px-3 py-2">จำนวนสั่ง</th>
                <th className="px-3 py-2">รายได้รวม</th>
              </tr>
            </thead>
            <tbody>
              {sortedMenuSummary.map((item, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${sortOrder === "TOP" && idx < 5 ? "bg-green-100 dark:bg-green-900/30" : ""}`}
                >
                  <td className="px-3 py-2">{item.name}</td>
                  <td className="px-3 py-2">{item.type}</td>
                  <td className="px-3 py-2">{item.totalAmount}</td>
                  <td className="px-3 py-2">{item.totalRevenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedDateRange && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          แสดงข้อมูลตั้งแต่ {selectedDateRange.start.toLocaleDateString()} ถึง {selectedDateRange.end.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

// แปลงวันที่ไทย -> Gregorian
function convertThaiDateToGregorian(thaiDateTime: string) {
  const [datePart, timePart] = thaiDateTime.split(" ");
  const [dd, mm, yyyy] = datePart.split("/").map(Number);
  const gregorianYear = yyyy - 543;
  const hhmmss = timePart || "00:00:00";
  return `${gregorianYear}-${String(mm).padStart(2,"0")}-${String(dd).padStart(2,"0")}T${hhmmss}`;
}
