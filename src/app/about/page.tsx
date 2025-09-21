"use client";

import HeaderMain from "@/components/common/Header/header";
import Link from "next/link";

const AboutPage = () => {
    const developers = [
        {
            name: "นักศึกษา 1",
            role: "Mobile App Developer",
            email: "student1@example.com",
            bio: "มีความสนใจด้านการออกแบบ UI/UX และพัฒนาประสบการณ์ผู้ใช้บน Mobile App รวมถึงเว็บไซต์ด้วย React และ Next.js",
        },
        {
            name: "นักศึกษา 2",
            role: "Full-Stack Developer",
            email: "student2@example.com",
            bio: "เชี่ยวชาญการพัฒนาระบบทั้งฝั่ง Frontend และ Backend รวมถึงการออกแบบฐานข้อมูลและ API ด้วย Node.js, Prisma และ Next.js",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
          <HeaderMain/>

            {/* About Section */}
            <section className="max-w-5xl mx-auto py-16 px-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
                    เกี่ยวกับ ATREE
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-lg text-center mb-8">
                    ATREE เป็นร้านอาหาร Halal กลางเมืองเชียงใหม่ จำหน่ายอาหารหลากหลาย เช่น โจ๊ก, ข้าวหมก, โรตี, ชาชัก เรามุ่งมั่นในการนำเสนออาหารที่อร่อยและปลอดภัยสำหรับทุกคน
                </p>

                {/* Admin Button */}
                <div className="flex justify-center mb-12">
                    <Link
                        href="/admin"
                        className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
                    >
                        ไปหน้า Admin
                    </Link>
                </div>

                {/* Developers */}
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
                    เว็บไซต์จัดทำโดย
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {developers.map((dev) => (
                        <div key={dev.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl transition">
                            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{dev.name}</h4>
                            <p className="text-green-600 dark:text-green-400 font-semibold mb-2">{dev.role}</p>
                            <p className="text-gray-700 dark:text-gray-300 mb-2">{dev.email}</p>
                            <p className="text-gray-600 dark:text-gray-400">{dev.bio}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
