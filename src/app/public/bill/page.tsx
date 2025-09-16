import BillPage from "./BillPage";

export default function Page({
  searchParams,
}: {
  searchParams: { orderNo?: string; tableNo?: string; paymentMethod?: string };
}) {
  return <BillPage searchParams={searchParams} />;
}
