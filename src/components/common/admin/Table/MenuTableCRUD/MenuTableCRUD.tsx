'use client';

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import Modal from "@/components/common/Modal";
import CreateMenu from "@/app/admin/menu/create/page";
import ToggleSwitch from "../../Switch/ToggleSwitch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MenuLists } from "@/utils/type";
import { deleteMenuAction, getMenuAll, updateMenuAvailability } from "@/action/admin/MenuAction";
import { ConfirmModal } from "../ConfirmModal";
import { EditMenu } from "./Edit/EditMenu";

export default function MenuTableCRUD() {
    const [menus, setMenus] = useState<MenuLists[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingMenu, setEditingMenu] = useState<MenuLists | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filterType, setFilterType] = useState<string>("All");
    // ฟังก์ชัน fetch menus
    const fetchMenus = async () => {
        setLoading(true);
        const result = await getMenuAll();
        if (result.success) {
            setMenus(result.data);
        } else {
            console.error(result.error);
        }
        setLoading(false);
    };

    useEffect(() => {
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
        <>
            {/* ตารางเมนู */}
            <Card className="shadow-lg rounded-2xl">
                <CardContent>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">📋 รายการเมนู</h2>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            เพิ่มข้อมูล
                        </button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ภาพ</TableHead>
                                <TableHead>ชื่อเมนู</TableHead>
                                <TableHead>ราคา</TableHead>
                                <TableHead>สถานะ</TableHead>
                                <TableHead>ประเภท</TableHead>
                                <TableHead className="text-right">การจัดการ</TableHead>
                                <TableHead>
                                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                        <option value="All">All</option>
                                        <option value="อาหาร">อาหาร</option>
                                        <option value="เครื่องดื่ม">เครื่องดื่ม</option>
                                    </select>

                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {menus.filter((menu) => {
                                if(filterType ==="All") return menu.type?.name;
                                else return menu.type?.name === filterType;
                            }).map((menu) => (
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
                                        {/* Toggle Switch สำหรับเปลี่ยน isAvailable */}
                                        <ToggleSwitch
                                            isOn={menu.isAvailable}
                                            label={menu.isAvailable ? "พร้อมขาย" : "หมด"}
                                            onToggle={async (newState) => {
                                                const res = await updateMenuAvailability(menu.menuID, newState);
                                                if (res.success) {
                                                    setMenus((prev) =>
                                                        prev.map((m) =>
                                                            m.menuID === menu.menuID ? { ...m, isAvailable: newState } : m
                                                        )
                                                    );
                                                } else {
                                                    alert(res.message);
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{menu.type?.name}</TableCell>
                                    <TableCell className="text-right">
                                        {/* ปุ่มแก้ไขเมนู */}
                                        <Button
                                            onClick={() => setEditingMenu(menu)}
                                            className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg px-4 py-2 shadow-md"
                                        >
                                            แก้ไข
                                        </Button>

                                        {/* ปุ่มลบเมนู */}
                                        <ConfirmModal
                                            title="ลบเมนู"
                                            description={`คุณแน่ใจไหมว่าต้องการลบ "${menu.name}"?`}
                                            onConfirm={async () => {
                                                try {
                                                    const result = await deleteMenuAction(menu.menuID, menu.fileID)
                                                    if (result.success) {
                                                        toast.success(result.message)
                                                        fetchMenus()
                                                    } else {
                                                        toast.error(result.message)
                                                    }
                                                } catch (err) {
                                                    toast.error("เกิดข้อผิดพลาด")
                                                }
                                            }}
                                            trigger={
                                                <Button className="ml-2 bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 shadow-md">
                                                    ลบ
                                                </Button>
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Modal สำหรับ Edit */}
            {editingMenu && (
                <Modal
                    isOpen={true}
                    onClose={() => {
                        setEditingMenu(null);
                        fetchMenus(); // รีเฟรชเมนูหลังปิด modal
                    }}
                >
                    <EditMenu
                        menu={editingMenu}
                        onSuccess={() => {
                            setEditingMenu(null);
                            fetchMenus(); // รีเฟรชเมนูหลังแก้ไขสำเร็จ
                        }}
                    />
                </Modal>
            )}

            {/* Modal สำหรับ Create */}
            {isCreateModalOpen && (
                <Modal
                    isOpen={true}
                    onClose={() => {
                        setIsCreateModalOpen(false);
                        fetchMenus(); // รีเฟรชเมนูหลังปิด modal
                    }}
                >
                    <h2 className="text-xl font-semibold mb-4">เพิ่มข้อมูลเมนู</h2>
                    <p className="text-gray-600 mb-4">
                        คุณสามารถสร้างเมนูใหม่ได้ที่นี่
                    </p>
                    <CreateMenu
                        onSuccess={() => {
                            setIsCreateModalOpen(false); // ปิด modal
                            fetchMenus();                // รีเฟรชเมนูใหม่
                        }}
                    />
                </Modal>
            )}
        </>
    );
}
