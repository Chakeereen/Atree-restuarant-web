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
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "../ConfirmModal";
import { toast } from "sonner";
import { EditTableNo } from "./Edit/EditTableNo";

import CreateTableNo from "@/app/admin/table/create/page";
import { deleteTableNoAction, getTableNoAll } from "@/action/admin/TableNoAction";
import { TableNo } from "@/utils/type";

export default function MenuTypeTableCRUD() {
    const [loading, setLoading] = useState(true);
    const [editingTable, setEditingTable] = useState<TableNo | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // ฟังก์ชัน fetch menus
    const [tableNo, setTableNo] = useState<TableNo[]>([]);

    const fetchTable = async () => {
        setLoading(true);
        const result = await getTableNoAll(); // ฟังก์ชัน fetch categories
        if (result.success) {
            setTableNo(result.data);
        } else {
            console.error(result.error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTable();
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
            <Card className="shadow-lg rounded-2xl">
                <CardContent>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">📋 โต๊ะอาหาร</h2>
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
                                <TableHead>หมายเลขโต๊ะ</TableHead>
                                <TableHead>รายละเอียดโต๊ะ</TableHead>
                                <TableHead className="text-right">การจัดการ</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {tableNo.map((table) => (
                                <TableRow key={table.tableNo}>
                                    <TableCell>{table.tableNo}</TableCell>
                                    <TableCell>{table.locationDetail}</TableCell>
                                      <TableCell className="text-right">
                                        {/* ปุ่มแก้ไขเมนู */}
                                        <Button
                                            onClick={() => setEditingTable(table)}
                                            className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg px-4 py-2 shadow-md"
                                        >
                                            แก้ไข
                                        </Button>

                                        {/* ปุ่มลบเมนู */}
                                        <ConfirmModal
                                            title="ลบหมายเลขโต๊ะ"
                                            description={`คุณแน่ใจไหมว่าต้องการลบ "${table.tableNo}"?`}
                                            onConfirm={async () => {
                                                try {
                                                    const result = await deleteTableNoAction(table.tableNo)
                                                    if (result.success) {
                                                        toast.success(result.message)
                                                        fetchTable()
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
            {editingTable && (
                <Modal
                    isOpen={true}
                    onClose={() => {
                        setEditingTable(null);
                        //fetchTable(); // รีเฟรชเมนูหลังปิด modal
                    }}
                >
                    <EditTableNo
                        tableNo={editingTable}
                        onSuccess={() => {
                            setEditingTable(null);
                            fetchTable(); // รีเฟรชเมนูหลังแก้ไขสำเร็จ
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
                        //fetchTable(); // รีเฟรชเมนูหลังปิด modal
                    }}
                >
                    <h2 className="text-xl font-semibold mb-4">เพิ่มข้อมูลโต๊ะ</h2>
                    <p className="text-gray-600 mb-4">
                        คุณสามารถสร้างข้อมูลโต๊ะใหม่ได้ที่นี่
                    </p>
                    <CreateTableNo
                        onSuccess={() => {
                            setIsCreateModalOpen(false); // ปิด modal
                            fetchTable();                // รีเฟรชเมนูใหม่
                        }}
                    />
                </Modal>
            )}
        </>
    );
}
