// app/public/bill/page.tsx
import BillPage from "./BillPage";

export default function Page({
  searchParams,
}: {
  searchParams: {
    orderNo?: string;
    tableNo?: string;
    paymentMethod: string;
    totalCost?: string;
  };
}) {
  const parsed = {
    orderNo: searchParams.orderNo ?? null,
    tableNo: searchParams.tableNo ?? null,
    paymentMethod: searchParams.paymentMethod ?? null,
    totalCost: searchParams.totalCost ?? null,
  };

  console.log("parsed params:", parsed); // ✅ จะ log ที่ server terminal

  return <BillPage searchParams={parsed} />;
}
