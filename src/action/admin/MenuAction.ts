'use server';


const baseUrl = process.env.API_URL as string;


export const createMenuAction = async (prevState: any, formData: FormData) => {
  try {
    const file = formData.get("image") as File | null;
    let imageUrl: string | null = null;
    let fileId: string | null = null;
    const name = formData.get("name");
    const price = Number(formData.get("price"));
    const typeID = Number(formData.get("menuType"))
    if (!file || !name || !price || !typeID) {
      return { message: "กรอกข้อมูลไม่สมบูรณ์", success: false };
    }


    if (file) {
      const uploadForm = new FormData();
      uploadForm.append("file", file);

      const uploadRes = await fetch(`${baseUrl}/api/admin/menu/image`, {
        method: "POST",
        body: uploadForm, // ไม่ต้อง set headers
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.success) {
        return { message: uploadData.error || "Image upload failed", success: false };
      }

      imageUrl = uploadData.url;
      fileId = uploadData.fileId;
    }


    const rawFormData = {
      name: formData.get("name"),
      price: Number(formData.get("price")),
      image: imageUrl,
      fileID: fileId,
      typeID: Number(formData.get("menuType")),
    };

    const response = await fetch(`${baseUrl}/api/admin/menu`, {
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




// ✅ ฟังก์ชันแก้ไขเมนู
export const editMenuAction = async (prevState: any, formData: FormData) => {
  try {
    const menuID = formData.get("menuID");
    const oldImage = formData.get("oldImage") as string | null;
    const oldFileId = formData.get("oldFileID") as string | null;

    const file = formData.get("image") as File | null;
    let imageUrl = oldImage;
    let fileId = oldFileId;

    if (file && file.size > 0) {
      // ลบไฟล์เก่า (ถ้ามี)
      if (oldFileId) {
        await fetch(`${baseUrl}/api/admin/menu/image`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileId: oldFileId }),
        });
      }

      // อัปโหลดไฟล์ใหม่
      const uploadForm = new FormData();
      uploadForm.append("file", file);

      const uploadRes = await fetch(`${baseUrl}/api/admin/menu/image`, {
        method: "POST",
        body: uploadForm,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Image upload failed");
      }

      imageUrl = uploadData.url;
      fileId = uploadData.fileId;
    }

    const rawFormData = {
      name: formData.get("name"),
      price: Number(formData.get("price")),
      image: imageUrl,
      fileID: fileId,  // 👈 update fileID ด้วย
      typeID: Number(formData.get("menuType")),
    };

    const response = await fetch(`${baseUrl}/api/admin/menu/${menuID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rawFormData),
    });

    const result = await response.json();
    if (!response.ok) {
      return { message: `Error: ${result.error}`, success: false };
    }

    return { message: "Menu updated successfully!", success: true };
  } catch (error: any) {
    console.error("Fetch error:", error);
    return { message: error.message || "Failed to connect to the server.", success: false };
  }
};


export const deleteMenuAction = async (menuID: number, fileId?: string) => {
  try {
    // ลบรูปใน ImageKit ก่อน
    if (fileId) {
      const deleteImageRes = await fetch(`${baseUrl}/api/admin/image`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });

      const deleteImageData = await deleteImageRes.json();
      if (!deleteImageRes.ok) {
        console.warn("Failed to delete image:", deleteImageData.error);
      }
    }

    // ลบข้อมูลเมนูใน DB
    const response = await fetch(`${baseUrl}/api/admin/menu/${menuID}`, {
      method: "DELETE",
    });

    const result = await response.json();
    if (!response.ok) {
      return { message: `Error: ${result.error}`, success: false };
    }

    return { message: "Menu deleted successfully!", success: true };
  } catch (error: any) {
    console.error("Fetch error:", error);
    return { message: error.message || "Failed to connect to the server.", success: false };
  }
};

export const getMenuAll = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/admin/menu`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch menus");

    const data = await res.json();
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching menus:", error);
    return { success: false, data: [], error: error.message };
  }
};


export const updateMenuAvailability = async (menuID: number, isAvailable: boolean) => {
  try {
    const response = await fetch(`${baseUrl}/api/admin/menu/${menuID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { message: result.error || "Failed to update availability", success: false };
    }

    return { message: "Menu availability updated successfully!", success: true };
  } catch (error: any) {
    console.error("Fetch error:", error);
    return { message: error.message || "Failed to connect to the server.", success: false };
  }
};
