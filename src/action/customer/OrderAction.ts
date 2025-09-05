'use server';

import { prisma } from '@/lib/prisma';
import { MenuLists, OrderDetail } from '@/utils/type';



const baseUrl = process.env.API_URL as string;

export async function submitOrder(orderInfo: { orderNo: number; tableNo: number }, cart: OrderDetail[]) {

    console.log(cart);

    if(cart.length === 0) {
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
                description : item.description || '',
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

export async function getOrderDetails(orderNo: number): Promise<OrderDetail[]> {

  console.log(orderNo)
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
    return data;
  } catch (err: any) {
    console.error("getOrderDetails error:", err);
    return [];
  }
}