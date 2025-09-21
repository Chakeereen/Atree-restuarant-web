"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { MenuLists, MenuType } from "@/utils/type";
import { getMenuAll } from "@/action/admin/MenuAction";

export default function MenuTable() {
  const [menus, setMenus] = useState<MenuLists[]>([]);
  const [categories, setCategories] = useState<MenuType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const [loading, setLoading] = useState(true);

  // Fetch menus
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await getMenuAll();
        if (!res.success) throw new Error("Failed to fetch menus");
        setMenus(res.data);
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };

    fetchMenus();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/menuType");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data: MenuType[] = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter menu ตาม selected category
  const filteredMenus = selectedCategory
    ? menus.filter((menu) => menu.typeID === selectedCategory)
    : menus;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
        <span className="ml-2">กำลังโหลด...</span>
      </div>
    );
  }

  return (
    <Card className="shadow-lg rounded-2xl">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">📋 รายการเมนู</h2>

        {/* Select กรองประเภท */}
        {/* Select กรองประเภท */}
        <div className="mb-4">
          <label className="mr-2 font-medium text-gray-700 dark:text-gray-200">กรองตามประเภท:</label>
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value ? Number(e.target.value) : ""
              )
            }
            className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="">ทั้งหมด</option>
            {categories.map((cat) => (
              <option key={cat.typeID} value={cat.typeID}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>


        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ภาพ</TableHead>
              <TableHead>ชื่อเมนู</TableHead>
              <TableHead>ราคา</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead>ประเภท</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMenus.map((menu) => (
              <TableRow key={menu.menuID}>
                <TableCell>
                  <img
                    src={menu.image}
                    alt={menu.name}
                    className="h-12 w-12 object-cover rounded-md"
                  />
                </TableCell>
                <TableCell className="font-medium">{menu.name}</TableCell>
                <TableCell>{Number(menu.price).toFixed(2)} ฿</TableCell>
                <TableCell>
                  {menu.isAvailable ? (
                    <Badge className="bg-green-500">พร้อมขาย</Badge>
                  ) : (
                    <Badge variant="destructive">หมด</Badge>
                  )}
                </TableCell>
                <TableCell>{menu.type?.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
