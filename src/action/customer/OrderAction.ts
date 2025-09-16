'use server';





const baseUrl = process.env.API_URL as string;


export async function submitOrder(
  orderInfo: { orderNo: number; tableNo: number },
  cart: {
    menuID: number;
    amount: number;
    price: number;
    totalCost: number;
    trackOrderID: number;
    description?: string;
    place: string;
  }[]
) {
  console.log(orderInfo)
  if (cart.length === 0) {
    console.log("EMPTY CART");
    return { success: false, error: "Cart is empty" };
  }
  console.log(cart);
  try {
    const res = await fetch(`${baseUrl}/api/customer/createOrder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderInfo, cart }),
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Error calling createOrder API:", err);
    return { success: false, error: err.message };
  }
}

export const getMenuAll = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/customer`, {
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

export const getMenuData = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/customer/menu`, {
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

export const getMenuType = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/customer/menuType`, {
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



export const getOrderDetails = async (orderNo: number) => {
  try {
    const res = await fetch(`${baseUrl}/api/customer/orderDetails?orderNo=${orderNo}`, {
      method: "GET",
      cache: "no-store", // ป้องกัน cache
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.error || "Failed to fetch order details");
    }

    const data = await res.json();
    return { success: true, data };
  } catch (err: any) {
    console.error("getOrderDetails error:", err);
    return { success: false, data: [], error: err.message };
  }
}

export const cancelOrder = async (prevState: any, formData: FormData) => {
  const descriptions = formData.getAll("description") as string[];
  const combineDescrib = descriptions.join(", ");

  
  const rawFormData = {
    detailNo: Number(formData.get("detailNo")),
    orderNo: Number(formData.get("orderNo")),
    description: combineDescrib || "",
    cancelBy: "ลูกค้า",
  }

  const checkCancel = rawFormData.detailNo;
  console.log(rawFormData)
  if(!rawFormData) {
    return  { message: 'safds', success: false };
    
  }
  const check = await fetch(`${baseUrl}/api/customer/cancelOrder?detailNo=${checkCancel}`);
  const checked = await check.json();
  if(!checked) {
     return { message: `ออร์เดอร์กำลังเตรียมการ ไม่สามารถยกเลิกได้ `, success: false };
  }

  
  try {
    
    const res = await fetch(`${baseUrl}/api/customer/cancelOrder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rawFormData),
    });

    const result = await res.json();
    if (!res.ok) {
      return { message: `Error: ${result.error}`, success: false };
    }
    return { message: "Menu Canceled successfully!", success: true };
  } catch (error: any) {
    console.error("Fetch error:", error);
    return { message: error.message || "Failed to connect to the server.", success: false };
  }
};

