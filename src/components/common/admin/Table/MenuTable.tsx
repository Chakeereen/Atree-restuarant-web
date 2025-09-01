"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { MenuLists } from "@/utils/type";
import { getMenuAll } from "@/action/admin/MenuAction";



export default function MenuTable() {
  const [menus, setMenus] = useState<MenuLists[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await getMenuAll();
        if (!res.success) throw new Error("Failed to fetch menus");
        if (res.success) {
          setMenus(res.data);
        }
      } catch (error) {
        console.error("Error fetching menus:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

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
            {menus.map((menu) => (
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