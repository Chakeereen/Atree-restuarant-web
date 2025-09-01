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

import { toast } from "sonner";


import CreateStaff from "@/app/admin/staff/create/page";
import { deleteStaffAction, getStaffAll } from "@/action/admin/StaffAction";
import { Staff } from "@/utils/type";
import { EditStaff } from "./Edit/EditStaff";
import { ConfirmModal } from "../ConfirmModal";



export default function StaffTableCRUD() {
    const [staffs, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchStaffs = async () => {
        setLoading(true);
        const result = await getStaffAll();

        if (result.success) {
            setStaff(result.data); // staffs เป็น array → map ได้เลย
        } else {
            console.error(result.error); // ตอนนี้ result.error จะไม่ undefined
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchStaffs();
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
                                <TableHead>รูป</TableHead>
                                <TableHead>รหัสพนักงาน</TableHead>
                                <TableHead>ชื่อ</TableHead>
                                <TableHead>นามสกุล</TableHead>
                                <TableHead>เบอร์โทร</TableHead>
                                <TableHead>อีเมล</TableHead>
                                <TableHead className="text-right">การจัดการ</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {staffs.map((staff) => (
                                <TableRow key={staff.staffID}>
                                    <TableCell>
                                        <img
                                            src={staff.image ? staff.image : "/profile.jpg"}
                                            alt={staff.name}
                                            className="h-12 w-12 object-cover rounded-md"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{staff.staffID}</TableCell>
                                    <TableCell className="font-medium">{staff.name}</TableCell>
                                    <TableCell className="font-medium">{staff.surname}</TableCell>
                                    <TableCell className="font-medium">{staff.telNo}</TableCell>
                                    <TableCell className="font-medium">{staff.email}</TableCell>
                                    <TableCell className="text-right">
                                        {/* ปุ่มแก้ไขเมนู */}
                                        <Button
                                            onClick={() => setEditingStaff(staff)}
                                            className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg px-4 py-2 shadow-md"
                                        >
                                            แก้ไข
                                        </Button>

                                        {/* ปุ่มลบเมนู */}
                                        <ConfirmModal
                                            title="ลบเมนู"
                                            description={`คุณแน่ใจไหมว่าต้องการลบ "${staff.name}"?`}
                                            onConfirm={async () => {
                                                try {
                                                    const result = await deleteStaffAction(staff.staffID, staff.fileID ?? "")
                                                    if (result.success) {
                                                        toast.success(result.message)
                                                        fetchStaffs()
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
            {editingStaff && (
                <Modal
                    isOpen={true}
                    onClose={() => {
                        setEditingStaff(null);
                        fetchStaffs(); // รีเฟรชเมนูหลังปิด modal
                    }}
                >
                    <EditStaff
                        staff={editingStaff}
                        onSuccess={() => {
                            setEditingStaff(null);
                            fetchStaffs(); // รีเฟรชเมนูหลังแก้ไขสำเร็จ
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
                        fetchStaffs(); // รีเฟรชเมนูหลังปิด modal
                    }}
                >
                    <h2 className="text-xl font-semibold mb-4">เพิ่มข้อมูลเมนู</h2>
                    <p className="text-gray-600 mb-4">
                        คุณสามารถสร้างเมนูใหม่ได้ที่นี่
                    </p>
                    <CreateStaff
                        onSuccess={() => {
                            setIsCreateModalOpen(false); // ปิด modal
                            fetchStaffs();                // รีเฟรชเมนูใหม่
                        }}
                    />
                </Modal>
            )}
        </>
    );
}
