import HeaderMain from "@/components/common/Header/header";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode; // รับ content ที่อยู่ภายใน layout
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <HeaderMain/>

      <main className="p-4">
        {children} {/* แสดงเนื้อหาที่ถูก wrap ด้วย layout */}
      </main>

     
    </div>
  );
};

export default Layout;
