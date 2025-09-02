// lib/data.ts

import { MenuType } from "@/utils/type";


// สร้างข้อมูลเมนูจำลอง
const MOCK_MENUS: MenuType[] = [
  {
    typeID: 1,
    name: "อาหารทานเล่น",
    menus: [
      { menuID: 101, name: "ไก่ทอด", price: 80, typeID: 1, image: "/images/fried-chicken.jpg", fileID: "f1", isAvailable: true },
      { menuID: 102, name: "เฟรนช์ฟรายส์", price: 60, typeID: 1, image: "/images/french-fries.jpg", fileID: "f2", isAvailable: true },
    ],
  },
  {
    typeID: 2,
    name: "อาหารจานหลัก",
    menus: [
      { menuID: 201, name: "สเต็กเนื้อ", price: 350, typeID: 2, image: "/images/steak.jpg", fileID: "s1", isAvailable: true },
      { menuID: 202, name: "สปาเก็ตตี้คาโบนาร่า", price: 180, typeID: 2, image: "/images/carbonara.jpg", fileID: "s2", isAvailable: true },
      { menuID: 203, name: "ข้าวผัดกุ้ง", price: 120, typeID: 2, image: "/images/fried-rice.jpg", fileID: "s3", isAvailable: false },
    ],
  },
  {
    typeID: 3,
    name: "เครื่องดื่ม",
    menus: [
      { menuID: 301, name: "โค้ก", price: 30, typeID: 3, image: "/images/coke.jpg", fileID: "d1", isAvailable: true },
      { menuID: 302, name: "น้ำเปล่า", price: 20, typeID: 3, image: "/images/water.jpg", fileID: "d2", isAvailable: true },
    ],
  },
];

// ฟังก์ชันจำลองการดึงข้อมูลจาก API หรือ Database
export const getMenuData = async (): Promise<MenuType[]> => {
  console.log("Fetching menu data on the server...");
  // จำลอง delay ของ network
  await new Promise(resolve => setTimeout(resolve, 500)); 
  return MOCK_MENUS;
};