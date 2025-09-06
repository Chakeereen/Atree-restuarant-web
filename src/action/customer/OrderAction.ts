'use server';

import { prisma } from '@/lib/prisma';
import { MenuLists, OrderDetail } from '@/utils/type';



const baseUrl = process.env.API_URL as string;

export async function submitOrder(orderInfo: { orderNo: number; tableNo: number }, cart: OrderDetail[]) {

  console.log(cart);

  if (cart.length === 0) {
    console.log("EMPTY")
    return
  }
  // ตัวอย่าง: บันทึก Order ลง DB
  try {
    await prisma.orderDetail.createMany({
      data: cart.map(item => ({
        orderNo: orderInfo.orderNo,
        menuID: item.menuID,
        amount: item.amount,
        price: item.price,
        totalCost: item.totalCost,
        trackOrderID: item.trackOrderID,
        description: item.description || '',
        place: item.place,
      })),
    });
  } catch (err) {
    console.error("Error saving order:", err);
    throw new Error("Order submission failed");
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
  console.log(rawFormData)
  if(!rawFormData) {
    return  { message: 'safds', success: false };
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

