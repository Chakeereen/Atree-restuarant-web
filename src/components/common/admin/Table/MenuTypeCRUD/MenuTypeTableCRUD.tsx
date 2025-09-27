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


import CreateMenuType from "@/app/admin/menu/menuType/create/page";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { MenuType } from "@/utils/type";
import { deleteMenuTypeAction, getMenuTypeAll } from "@/action/admin/MenuTypeAction";
import { ConfirmModal } from "../ConfirmModal";
import { EditType } from "./Edit/EditType";

export default function MenuTypeTableCRUD() {
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState<MenuType | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // ฟังก์ชัน fetch menus
    const [categories, setCategories] = useState<MenuType[]>([]);

    const fetchCategories = async () => {
        setLoading(true);
        const result = await getMenuTypeAll(); // ฟังก์ชัน fetch categories
        if (result.success) {
            setCategories(result.data);
        } else {
            console.error(result.error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
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
                        <h2 className="text-xl font-semibold">📋 ประเภทเมนูอาหาร</h2>
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
                                <TableHead>รหัสประเภท</TableHead>
                                <TableHead>ชื่อประเภท</TableHead>
                                <TableHead className="text-right">การจัดการ</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.typeID}>
                                    <TableCell>{category.typeID}</TableCell>
                                    <TableCell>{category.name}</TableCell>
                                      <TableCell className="text-right">
                                        {/* ปุ่มแก้ไขเมนู */}
                                        <Button
                                            onClick={() => setEditingCategory(category)}
                                            className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg px-4 py-2 shadow-md"
                                        >
                                            แก้ไข
                                        </Button>

                                        {/* ปุ่มลบเมนู */}
                                        <ConfirmModal
                                            title="ลบประเภทเมนู"
                                            description={`คุณแน่ใจไหมว่าต้องการลบ "${category.name}"?`}
                                            onConfirm={async () => {
                                                try {
                                                    const result = await deleteMenuTypeAction(category.typeID)
                                                    if (result.success) {
                                                        toast.success(result.message)
                                                        fetchCategories()
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
            {editingCategory && (
                <Modal
                    isOpen={true}
                    onClose={() => {
                        setEditingCategory(null);
                        //fetchCategories(); // รีเฟรชเมนูหลังปิด modal
                    }}
                >
                    <EditType
                        menuType={editingCategory}
                        onSuccess={() => {
                            setEditingCategory(null);
                            fetchCategories(); // รีเฟรชเมนูหลังแก้ไขสำเร็จ
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
                        //fetchCategories(); // รีเฟรชเมนูหลังปิด modal
                    }}
                >
                    <h2 className="text-xl font-semibold mb-4">เพิ่มข้อมูลประเภทเมนู</h2>
                    <p className="text-gray-600 mb-4">
                        คุณสามารถสร้างประเภทเมนูใหม่ได้ที่นี่
                    </p>
                    <CreateMenuType
                        onSuccess={() => {
                            setIsCreateModalOpen(false); // ปิด modal
                            fetchCategories();                // รีเฟรชเมนูใหม่
                        }}
                    />
                </Modal>
            )}
        </>
    );
}
