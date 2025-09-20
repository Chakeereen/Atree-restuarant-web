'use server';


// ใช้ relative path ถ้า server action อยู่บนโปรเจกต์เดียวกัน
const API_BASE = process.env.API_URL || "";

export const createMenuAction = async (prevState: any, formData: FormData) => {
  try {
    // ดึงค่า image + fileID จาก hidden input
    const imageUrl = formData.get("image") as string | null;
    const fileId = formData.get("fileID") as string | null;

    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const typeID = Number(formData.get("menuType"));

    if (!name || !price || !typeID) {
      return { message: "กรอกข้อมูลไม่สมบูรณ์", success: false };
    }

    // สร้าง menu
    const rawFormData = { name, price, image: imageUrl, fileID: fileId, typeID };

    const response = await fetch(`${API_BASE}/api/admin/menu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rawFormData),
    });

    const result = await response.json();
    if (!response.ok) {
      return { message: result.error || "Failed to create menu", success: false };
    }

    return { message: "Menu created successfully!", success: true };
  } catch (error: any) {
    console.error("Fetch error:", error);
    return { message: error.message || "Failed to connect to the server.", success: false };
  }
};


// แก้ไขเมนู

export const editMenuAction = async (prevState: any, formData: FormData) => {
  try {
    console.log(formData)
    const menuID = formData.get("menuID") as string;
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const typeID = Number(formData.get("menuType"));

    // ดึงค่า image + fileID ใหม่จาก ImageUploader
    let imageUrl = formData.get("image") as string | null;
    let fileId = formData.get("fileID") as string | null;


    // ดึงค่า oldFileID (รูปเก่า) เพื่อลบก่อน
    const oldFileId = formData.get("oldFileID") as string | null;
    const oldImage = formData.get("oldImage") as string | null;


    if (!name || !price || !typeID) {
      return { message: "กรอกข้อมูลไม่สมบูรณ์", success: false };
    }

    // ลบรูปเก่า (ถ้ามี)
    if (fileId !== null) {
      try {
        await fetch(`${API_BASE}/api/admin/menu/image`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileId: oldFileId }),
        });
      } catch (err) {
        console.warn("Failed to delete old image:", err);
      }
    }

    if (fileId === null) {
      imageUrl = oldImage as string;
      fileId = oldFileId as string;
    }



    const rawFormData = {
      name,
      price,
      image: imageUrl,
      fileID: fileId,
      typeID,
    };

    const response = await fetch(`${API_BASE}/api/admin/menu/${menuID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rawFormData),
    });

    const result = await response.json();
    if (!response.ok) return { message: result.error || "Failed to update menu", success: false };

    return { message: "Menu updated successfully!", success: true };
  } catch (error: any) {
    console.error("Fetch error:", error);
    return { message: error.message || "Failed to connect to the server.", success: false };
  }
};

// ลบเมนู
export const deleteMenuAction = async (menuID: number, fileId?: string) => {
  try {
    // ลบรูปก่อน
    if (fileId) {
      const deleteImageRes = await fetch(`${API_BASE}/api/admin/menu/image`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });
      const deleteImageData = await deleteImageRes.json();
      if (!deleteImageRes.ok) console.warn("Failed to delete image:", deleteImageData.error);
    }

    // ลบข้อมูลเมนู
    const response = await fetch(`${API_BASE}/api/admin/menu/${menuID}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) return { message: result.error || "Failed to delete menu", success: false };

    return { message: "Menu deleted successfully!", success: true };
  } catch (error: any) {
    console.error("Fetch error:", error);
    return { message: error.message || "Failed to connect to the server.", success: false };
  }
};

// ดึงเมนูทั้งหมด
export const getMenuAll = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/menu`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch menus");
    const data = await res.json();
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching menus:", error);
    return { success: false, data: [], error: error.message };
  }
};

// อัปเดตสถานะ availability
export const updateMenuAvailability = async (menuID: number, isAvailable: boolean) => {
  try {
    const response = await fetch(`${API_BASE}/api/admin/menu/${menuID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable }),
    });
    const result = await response.json();
    if (!response.ok) return { message: result.error || "Failed to update availability", success: false };
    return { message: "Menu availability updated successfully!", success: true };
  } catch (error: any) {
    console.error("Fetch error:", error);
    return { message: error.message || "Failed to connect to the server.", success: false };
  }
};
