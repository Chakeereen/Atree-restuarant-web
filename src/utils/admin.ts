"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;

export async function loginAdminAction(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { success: false, message: "กรุณากรอก email และ password" };
  }

  try {
    const res = await fetch(`${baseUrl}/api/auth/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) return { success: false, message: data.error || "Login ไม่สำเร็จ" };

    return { success: true, message: data.message };
  } catch (err) {
    console.error(err);
    return { success: false, message: "เกิดข้อผิดพลาดในการ login" };
  }
}

export async function logoutAdminAction() {
  try {
    await fetch(`${baseUrl}/api/auth/admin/logout`, { method: "POST" });
    return { success: true, message: "Logout สำเร็จ" };
  } catch (err) {
    console.error(err);
    return { success: false, message: "เกิดข้อผิดพลาดในการ logout" };
  }
}
