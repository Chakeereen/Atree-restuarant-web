"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Darkmode } from "@/components/common/Navbar/DarkMode";
import HeaderMain from "@/components/common/Header/header";
import { useRouter } from "next/navigation"; // ✅ เพิ่มเข้ามา

const HomePage = () => {
  const router = useRouter(); // ✅ ใช้งาน router

  const featuredDishes = [
    {
      name: "โจ๊ก",
      description: "โจ๊กร้อนๆ สไตล์เหนือ พร้อมเครื่องเคียงครบ",
      image: "/image/homePage/joke.jpg",
    },
    {
      name: "ข้าวหมก",
      description: "ข้าวหมกไก่ halal หอมเครื่องเทศ สูตรต้นตำรับ",
      image: "/image/homePage/khao-mok.jpg",
    },
    {
      name: "โรตี",
      description: "โรตีกรอบนอกนุ่มใน ทานคู่กับน้ำจิ้มหลากรส",
      image: "/image/homePage/roti.jpg",
    },
    {
      name: "ชาชัก",
      description: "ชาชักหอมเข้มข้น ทานคู่กับขนมไทย",
      image: "/image/homePage/tea.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header / Navbar */}
      <HeaderMain />

      {/* Hero Section */}
      <section className="bg-green-50 dark:bg-green-900 py-16">
        <div className="max-w-7xl mx-auto text-center px-4">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
            ยินดีต้อนรับสู่ ATREE
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            ร้านอาหาร Halal กลางเมืองเชียงใหม่ จำหน่ายอาหารอร่อยหลากหลาย เช่น โจ๊ก, ข้าวหมก, โรตี, ชาชัก
          </p>
          {/* ✅ ปุ่มสั่งอาหารไปหน้า /customer */}
          <Button
            onClick={() => router.push("/customer")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
          >
            สั่งอาหารตอนนี้
          </Button>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="max-w-7xl mx-auto py-16 px-4">
        <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
          เมนูเด่นของเรา
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDishes.map((dish) => (
            <div
              key={dish.name}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">
                  {dish.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {dish.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            เรื่องราวของเรา
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            ATREE อยุ่ประตูช้างเผือก กลางเมืองเชียงใหม่ โดยมีเป้าหมายในการนำเสนออาหาร halal คุณภาพดี รสชาติอร่อย และเป็นมิตรต่อทุกคน
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
