"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Modal from "@/components/common/Modal";
import { toast } from "sonner";
import { deleteAdminAction } from "@/action/admin/AdminAction";
import { EditAdmin } from "./Edit/Edit";
import { ConfirmModal } from "../Table/ConfirmModal";
import { Admin } from "@/utils/type";

interface AdminProfileProps {
  adminID: string;
}

const AdminProfile = ({ adminID }: AdminProfileProps) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  // ฟังก์ชัน fetch admin
  const fetchAdmin = async () => {
    try {
      const res = await fetch(`/api/admin/${adminID}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch admin");

      const json = await res.json();
      if (json.success && json.data) {
        setAdmin(json.data);
      } else {
        setAdmin(null);
      }
    } catch (error) {
      console.error(error);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, [adminID]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!admin) return <p className="text-center mt-10 text-red-500">Admin not found</p>;

  return (
    <section className="flex justify-center mt-10 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 max-w-sm w-full transition-colors duration-300">
        <div className="flex flex-col items-center">
          {admin.image ? (
            <img
              src={admin.image}
              alt={`${admin.name} ${admin.surname}`}
              width={120}
              height={120}
              className="rounded-full object-cover mb-4 border-2 border-gray-300 dark:border-gray-600"
            />
          ) : (
            <div className="w-28 h-28 mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300 text-xl">
              {admin.name}
            </div>
          )}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {admin.name} {admin.surname}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{admin.email}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Role: {admin.role}</p>
        </div>

        {/* ปุ่มจัดการ */}
        <div className="flex justify-center gap-3 mt-6">
          <Button
            onClick={() => setEditingAdmin(admin)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            แก้ไข
          </Button>

          <ConfirmModal
            title="ลบแอดมิน"
            description={`คุณแน่ใจหรือไม่ที่จะลบ "${admin.name} ${admin.surname}" ?`}
            onConfirm={async () => {
              try {
                const result = await deleteAdminAction(admin.adminID);
                if (result.success) {
                  toast.success(result.message);
                } else {
                  toast.error(result.message);
                }
              } catch (err) {
                toast.error("เกิดข้อผิดพลาด");
              }
            }}
            trigger={
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                ลบ
              </Button>
            }
          />
        </div>
      </div>

      {/* Modal Edit */}
      {editingAdmin && (
        <Modal
          isOpen={true}
          onClose={() => {
            setEditingAdmin(null);
            fetchAdmin();
          }}
        >
          <EditAdmin
            admin={editingAdmin}
            onSuccess={() => {
              setEditingAdmin(null);
              fetchAdmin();
            }}
          />
        </Modal>
      )}
    </section>
  );
};

export default AdminProfile;
