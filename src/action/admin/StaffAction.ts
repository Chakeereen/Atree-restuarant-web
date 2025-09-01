'use server'
import bcrypt from "bcryptjs";

const baseUrl = process.env.API_URL as string;


export const createStaffAction = async (prevState: any, formData: FormData) => {
    try {
        const file = formData.get("image") as File | null;
        let imageUrl: string | undefined;
        let fileId: string | undefined;

        const name = formData.get("name") as string | null;
        const surname = formData.get("surname") as string | null;
        const telNo = formData.get("telNo") as string | null;
        const email = formData.get("email") as string | null;
        const password = formData.get("password") as string | null;
        const confirmPassword = formData.get("confirmPassword") as string | null;

        if (!name || !surname || !telNo || !email || !password || !confirmPassword) {
            return { message: "กรอกข้อมูลไม่สมบูรณ์", success: false };
        }

        if (password !== confirmPassword) {
            return { message: "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน", success: false };
        }
        if (file && file.size > 0) {
            const uploadForm = new FormData();
            uploadForm.append("file", file);

            const uploadRes = await fetch(`${baseUrl}/api/admin/staff/image`, {
                method: "POST",
                body: uploadForm,
            });

            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) {
                return { message: uploadData.error || "Image upload failed", success: false };
            }

            imageUrl = uploadData.url;
            fileId = uploadData.fileId;
        } else {
            // ไม่มีไฟล์ → ข้าม upload
            imageUrl = undefined;
            fileId = undefined;
        }
        // hash password ก่อนส่งไป API
        const hashedPassword = await bcrypt.hash(password, 10);

        const rawFormData = {
            name,
            surname,
            telNo,
            email,
            password: hashedPassword,
            image: imageUrl,
            fileID: fileId,
        };

        const response = await fetch(`${baseUrl}/api/admin/staff`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rawFormData),
        });

        const result = await response.json();

        if (!response.ok) {
            return { message: result.error || "Failed to create staff", success: false };
        }

        return { message: "Staff created successfully!", success: true };
    } catch (error: any) {
        console.error("Fetch error:", error);
        return { message: error.message || "Failed to connect to the server.", success: false };
    }
};

export const editStaffAction = async (prevState: any, formData: FormData) => {

    const menuID = formData.get("menuID");
    const oldImage = formData.get("oldImage") as string | null;
    const oldFileId = formData.get("oldFileID") as string | null;


    const file = formData.get("image") as File | null;
    let imageUrl = oldImage;
    let fileId = oldFileId;

    if (file && file.size > 0) {
        // ลบไฟล์เก่า (ถ้ามี)
        if (oldFileId) {
            await fetch(`${baseUrl}/api/admin/image`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileId: oldFileId }),
            });
        }
    }
    try {
        const staffID = formData.get("staffID") as string | null;
        if (!staffID) return { message: "staffID is required", success: false };

        const name = formData.get("name") as string | null;
        const surname = formData.get("surname") as string | null;
        const telNo = formData.get("telNo") as string | null;
        const email = formData.get("email") as string | null;
        const password = formData.get("password") as string | null;
        const confirmPassword = formData.get("confirmPassword") as string | null;

        if (password && password !== confirmPassword) {
            return { message: "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน", success: false };
        }
        const rawFormData: any = {
            name,
            surname,
            telNo,
            email,
            password,
            image: imageUrl,
            fileID: fileId,
        };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            rawFormData.password = hashedPassword;
        }

        const response = await fetch(`${baseUrl}/api/admin/staff/${staffID}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rawFormData),
        });

        const result = await response.json();
        if (!response.ok) {
            return { message: result.error || "Failed to update staff", success: false };
        }

        return { message: "Staff updated successfully!", success: true };
    } catch (error: any) {
        console.error("Fetch error:", error);
        return { message: error.message || "Failed to connect to the server.", success: false };
    }
};

export const deleteStaffAction = async (staffID: string, fileId: string) => {

    if (fileId) {
        const deleteImageRes = await fetch(`${baseUrl}/api/admin/staff/image`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileId }),
        });

        const deleteImageData = await deleteImageRes.json();
        if (!deleteImageRes.ok) {
            console.warn("Failed to delete image:", deleteImageData.error);
        }
    }
    try {
        const response = await fetch(`${baseUrl}/api/admin/staff/${staffID}`, {
            method: "DELETE",
        });

        const result = await response.json();
        if (!response.ok) {
            return { message: result.error || "Failed to delete staff", success: false };
        }

        return { message: "Staff deleted successfully!", success: true };
    } catch (error: any) {
        console.error("Fetch error:", error);
        return { message: error.message || "Failed to connect to the server.", success: false };
    }
};

export const getStaffAll = async () => {
    try {
        const res = await fetch(`${baseUrl}/api/admin/staff`, {
            cache: "no-store",
        });

        const json = await res.json(); // { success: true, data: [...] }

        return {
            success: true,
            data: Array.isArray(json.data) ? json.data : [], // <-- ต้องแน่ใจว่าเป็น array
            error: null,
        };
    } catch (error: any) {
        return {
            success: false,
            data: [],               // fallback เป็น array ว่าง
            error: error.message || "เกิดข้อผิดพลาด",
        };
    }
};

