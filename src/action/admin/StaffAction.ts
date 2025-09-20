'use server'
import bcrypt from "bcryptjs";

const baseUrl = process.env.API_URL as string;


export const createStaffAction = async (prevState: any, formData: FormData) => {
    try {
        console.log(formData);

        const name = formData.get("name") as string | null;
        const surname = formData.get("surname") as string | null;
        const telNo = formData.get("telNo") as string | null;
        const email = formData.get("email") as string | null;
        const password = formData.get("password") as string | null;
        const confirmPassword = formData.get("confirmPassword") as string | null;

        // ดึงค่าจาก ImageUploader
        const imageUrl = formData.get("image") as string | null;
        const fileId = formData.get("fileID") as string | null;

        // validate input
        if (!name || !surname || !telNo || !email || !password || !confirmPassword) {
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
            return { message: "กรอกข้อมูลไม่สมบูรณ์", success: false };
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
            return { message: "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน", success: false };
        }

        // hash password
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
    try {
        console.log(formData);

        const staffID = formData.get("staffID") as string | null;
        const name = formData.get("name") as string | null;
        const surname = formData.get("surname") as string | null;
        const telNo = formData.get("telNo") as string | null;
        const email = formData.get("email") as string | null;
        const password = formData.get("password") as string | null;
        const confirmPassword = formData.get("confirmPassword") as string | null;

        // ดึงค่า image + fileID ใหม่จาก ImageUploader
        let imageUrl = formData.get("image") as string | null;
        let fileId = formData.get("fileID") as string | null;

        // ดึงค่า oldFileID และ oldImage (รูปเก่า)
        const oldFileId = formData.get("oldFileID") as string | null;
        const oldImage = formData.get("oldImage") as string | null;

        if (!staffID || !name || !surname || !telNo || !email) {
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
            return { message: "กรอกข้อมูลไม่สมบูรณ์", success: false };
        }

        // เช็ก password + confirmPassword
        if (password && password !== confirmPassword) {
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
            return { message: "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน", success: false };
        }

        // ลบรูปเก่า (ถ้ามีการอัปโหลดใหม่)
        if (fileId !== null) {
            try {
                await fetch(`${baseUrl}/api/admin/staff/image`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fileId: oldFileId }),
                });
            } catch (err) {
                console.warn("Failed to delete old image:", err);
            }
        }

        // ถ้าไม่ได้อัปโหลดรูปใหม่ → ใช้รูปเดิม
        if (fileId === null) {
            imageUrl = oldImage as string;
            fileId = oldFileId as string;
        }

        const rawFormData: any = {
            name,
            surname,
            telNo,
            email,
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

