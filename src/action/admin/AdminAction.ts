'use server'

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const baseUrl = process.env.API_URL as string;


export const createAdminAction = async (prevState: any, formData: FormData) => {
  try {
    console.log(formData);

    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;
    const confirmPassword = formData.get("confirmPassword") as string | null;
    const name = formData.get("name") as string | "";
    const surname = formData.get("surname") as string | "";

    // ดึงค่าจาก ImageUploader
    let imageUrl = formData.get("image") as string | null;
    let fileId = formData.get("fileID") as string | "";

    // validate input
    if (!email || !password || !confirmPassword) {
      if (fileId) {
        try {
          await fetch(`${baseUrl}/api/admin/staff/image`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileId: fileId }),
          });
        } catch (err) {
          console.warn("Failed to delete  image:", err);
        }
      }
      return { success: false, message: "กรุณากรอกข้อมูลให้ครบ" };
    }

    if (password !== confirmPassword) {
      if (fileId) {
        try {
          await fetch(`${baseUrl}/api/admin/staff/image`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileId: fileId }),
          });
        } catch (err) {
          console.warn("Failed to delete  image:", err);
        }
      }
      return { success: false, message: "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน" };
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ถ้าไม่มีรูปใหม่ ให้ใช้ default
    if (!imageUrl) {
      imageUrl = "/profile.jpg";
      fileId = "";
    }

    await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
        surname,
        image: imageUrl,
        fileID: fileId,
        role: "admin",
      },
    });

    return { success: true, message: "สร้าง Admin สำเร็จ" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "ไม่สามารถสร้าง Admin ได้" };
  }
};


// ===================== Edit Admin =====================
export const editAdminAction = async (prevState: any, formData: FormData) => {
  console.log(formData)
  try {
    const adminID = formData.get("adminID") as string | "";
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;
    const confirmPassword = formData.get("confirmPassword") as string | null;
    const name = formData.get("name") as string | "";
    const surname = formData.get("surname") as string | "";

    let imageUrl = formData.get("image") as string | null;
    let fileId = formData.get("fileID") as string | "";

    if (!email) {
      if (fileId) {
        try {
          await fetch(`${baseUrl}/api/admin/staff/image`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileId: fileId }),
          });
        } catch (err) {
          console.warn("Failed to delete image:", err);
        }
      }
      return { success: false, message: "กรุณากรอกอีเมล" };
    }

    // ถ้ามีการเปลี่ยนรหัสผ่าน
    let hashedPassword: string | undefined = undefined;
    if (password) {
      if (password !== confirmPassword) {
        if (fileId) {
          try {
            await fetch(`${baseUrl}/api/admin/staff/image`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fileId: fileId }),
            });
          } catch (err) {
            console.warn("Failed to delete image:", err);
          }
        }
        return { success: false, message: "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน" };
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }
    // ถ้าไม่มีรูปใหม่ ให้คงรูปเดิม
    const existingAdmin = await prisma.admin.findUnique({ where: { adminID } });
    if (!existingAdmin) {
      return { success: false, message: "ไม่พบ Admin" };
    }
    if (!imageUrl) {
      imageUrl = existingAdmin.image;
      fileId = existingAdmin.fileID;
    }

    await prisma.admin.update({
      where: { adminID },
      data: {
        email,
        password: hashedPassword || existingAdmin.password,
        name,
        surname,
        image: imageUrl,
        fileID: fileId,
      },
    });

    return { success: true, message: "แก้ไข Admin สำเร็จ" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "ไม่สามารถแก้ไข Admin ได้" };
  }
};

// ===================== Delete Admin =====================
export const deleteAdminAction = async (adminID: string) => {
  try {
    const existingAdmin = await prisma.admin.findUnique({ where: { adminID } });
    if (!existingAdmin) {
      return { success: false, message: "ไม่พบ Admin" };
    }

    // ลบรูปภาพจาก server ถ้ามี
    if (existingAdmin.fileID) {
      try {
        await fetch(`${baseUrl}/api/admin/staff/image`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileId: existingAdmin.fileID }),
        });
      } catch (err) {
        console.warn("Failed to delete image:", err);
      }
    }

    await prisma.admin.delete({ where: { adminID } });

    return { success: true, message: "ลบ Admin สำเร็จ" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "ไม่สามารถลบ Admin ได้" };
  }
};
