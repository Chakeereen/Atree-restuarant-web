"use client"; // บังคับให้ component นี้เป็น client-side

import ActiveServiceCounter from "@/components/common/admin/Report/ActiveService/ActiveServiceCounter";
import BangkokClock from "@/components/common/admin/Report/Time/BangkokTime";
import TodayIncomeCard from "@/components/common/admin/Report/TodayIncome/TodayIncome";
import MenuTable from "@/components/common/admin/Table/MenuTable";

const Page = () => {
  return (
    <div className="container mx-auto h-screen p-6 grid grid-rows-[2fr_2fr_6fr] gap-4">
      {/* Row 1 */}
      <div className="w-full h-full">
        <BangkokClock />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <TodayIncomeCard />
        <ActiveServiceCounter />
      </div>

      {/* Row 3 */}
      <div className="w-full h-full">
        <MenuTable  />
      </div>
    </div>
  );
};

export default Page;
