"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // import toaster

const baseUrl = process.env.API_URL as string;

export const useLogoutAdmin = () => {
  const router = useRouter();

  const logoutAdmin = async () => {
    try {
      // 1. เรียก API logout เพื่อลบ cookie
      const res = await fetch(`${baseUrl}/api/auth/admin/logout`, {
        method: "POST",
      });

      // 2. ลบข้อมูลใน localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }

      // 3. แสดง toast และ redirect
      if (res.ok) {
        toast.success("Logout สำเร็จ");
      } else {
        toast.error("เกิดข้อผิดพลาดในการ logout");
      }

      router.push("/login"); // redirect หลัง logout
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  return logoutAdmin;
};


export const loginAdminAction = async (prevState: any, formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await fetch(`${baseUrl}/api/auth/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.error || "Login ไม่สำเร็จ" };
    }
    console.log(data)
    // เก็บ token และ role ใน localStorage
    console.log(typeof(window))
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.token);         // token
      localStorage.setItem("role", data.user.role);      // role
    }

    return { success: true, message: data.message };
    
  } catch (error) {
    console.error(error);
    return { success: false, message: "เกิดข้อผิดพลาดในการ login" };
  }
};
