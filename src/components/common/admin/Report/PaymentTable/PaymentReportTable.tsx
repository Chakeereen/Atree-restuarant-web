"use client";

import { useEffect, useState } from "react";

type Payment = {
  paymentNo: number;
  orderNo: number;
  totalCost: number;
  dateTime: string;
  status: PaymentStatus;
  methodName: string;
  staff?: { id: string; name: string } | null;
};

type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

const statusMap: Record<PaymentStatus, string> = {
  PENDING: "รอดำเนินการ",
  PAID: "ชำระแล้ว",
  FAILED: "ล้มเหลว",
  REFUNDED: "คืนเงิน",
};

// แปลงวันที่ไทย -> Gregorian
function parseThaiDateTime(thaiDateStr: string): Date {
  const [datePart, timePart = "00:00:00"] = thaiDateStr.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);
  const gregorianYear = year - 543;
  const [hours = 0, minutes = 0, seconds = 0] = timePart.split(":").map(Number);
  return new Date(gregorianYear, month - 1, day, hours, minutes, seconds);
}

export default function PaymentReportTable() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [methods, setMethods] = useState<string[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | "all">("all");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  useEffect(() => {
    // Fetch payments
    fetch("/api/admin/report/showPayment")
      .then((res) => res.json())
      .then((data) =>
        setPayments(data.map((p: Payment) => ({ ...p, totalCost: Number(p.totalCost) })))
      )
      .catch(console.error);

    // Fetch method list
    fetch("/api/admin/filter/payMethod")
      .then((res) => res.json())
      .then((data) => setMethods(data.map((m: { methodName: string }) => m.methodName)))
      .catch(console.error);
  }, []);

  const filteredPayments = payments
    .filter((p) => selectedMethod === "all" || p.methodName === selectedMethod)
    .filter((p) => selectedStatus === "all" || p.status === selectedStatus)
    .filter((p) => {
      if (!startDate && !endDate) return true;
      const payTime = parseThaiDateTime(p.dateTime).getTime();
      const start = startDate
        ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0).getTime()
        : -Infinity;
      const end = endDate
        ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999).getTime()
        : Infinity;
      return payTime >= start && payTime <= end;
    });

  // คำนวณรายได้รวม: PAID บวก, FAILED ลบ
  const totalIncome = filteredPayments.reduce((sum, p) => {
    if (p.status === "PAID") return sum + p.totalCost;
    if (p.status === "FAILED") return sum - p.totalCost;
    return sum;
  }, 0);

  const incomeColor = totalIncome < 0 ? "text-red-500" : "text-green-500";

  const totalPages = Math.ceil(filteredPayments.length / rowsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        รายงานการชำระเงิน
      </h2>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          รายได้รวม: <span className={incomeColor}>{totalIncome.toLocaleString()} บาท</span>
        </p>
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          จำนวนการชำระเงิน: <span className="text-blue-500">{filteredPayments.length.toLocaleString()} รายการ</span>
        </p>

        {/* Filter Method */}
        <select
          value={selectedMethod}
          onChange={(e) => { setSelectedMethod(e.target.value); setCurrentPage(1); }}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
        >
          <option value="all">ทุกวิธีการชำระ</option>
          {methods.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        {/* Filter Status */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as PaymentStatus | "all")}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
        >
          <option value="all">ทุกสถานะ</option>
          {Object.entries(statusMap).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        {/* Date picker */}
        <input
          type="date"
          value={startDate ? startDate.toISOString().split("T")[0] : ""}
          onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
        />
        <span className="text-gray-700 dark:text-gray-300">ถึง</span>
        <input
          type="date"
          value={endDate ? endDate.toISOString().split("T")[0] : ""}
          onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full table-auto border-collapse text-left">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <tr>
              <th className="px-3 py-2">No</th>
              <th className="px-3 py-2">Order No</th>
              <th className="px-3 py-2">Method</th>
              <th className="px-3 py-2">Cost</th>
              <th className="px-3 py-2">Date / Time</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Staff</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPayments.map((p, idx) => (
              <tr key={p.paymentNo} className="border-b border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <td className="px-3 py-2">{(currentPage-1)*rowsPerPage + idx + 1}</td>
                <td className="px-3 py-2">{p.orderNo}</td>
                <td className="px-3 py-2">{p.methodName}</td>
                <td className="px-3 py-2">
                  <span className={p.status === "FAILED" ? "text-red-500 font-semibold" : ""}>
                    {p.status === "FAILED" ? `-${p.totalCost.toLocaleString()}` : p.totalCost.toLocaleString()}
                  </span>
                </td>
                <td className="px-3 py-2">{p.dateTime}</td>
                <td className="px-3 py-2">
                  <span
                    className={
                      p.status === "PAID" ? "text-green-500 font-semibold"
                      : p.status === "FAILED" ? "text-red-500 font-semibold"
                      : p.status === "REFUNDED" ? "text-blue-500 font-semibold"
                      : "text-yellow-500 font-semibold"
                    }
                  >
                    {statusMap[p.status]}
                  </span>
                </td>
                <td className="px-3 py-2">{p.staff ? p.staff.name : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center gap-3">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p-1))} disabled={currentPage === 1} className="px-4 py-1 bg-gray-300 dark:bg-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-400 dark:hover:bg-gray-500 transition">Previous</button>
          <span className="px-3 py-1 text-gray-700 dark:text-gray-300">หน้า {currentPage} / {totalPages}</span>
          <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="px-4 py-1 bg-gray-300 dark:bg-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-400 dark:hover:bg-gray-500 transition">Next</button>
        </div>
      )}
    </div>
  );
}
