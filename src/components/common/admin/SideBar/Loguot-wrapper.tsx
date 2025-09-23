"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutAdminAction } from "@/utils/admin";

export const useLogoutAdmin = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      const result = await logoutAdminAction(); // เรียก Server Action
      if (result.success) {
        toast.success(result.message);
        router.push("/login"); // redirect หลัง logout
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  return logout;
};
