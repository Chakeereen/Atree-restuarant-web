"use client";

import { useEffect, useState } from "react";

type Menu = {
  menuID: number;
  name: string;
  price: number;
  type: string;
};

type CancelLog = {
  reason: number;
  cancelAt: string;
};

type OrderDetail = {
  detailNo: number;
  orderNo: number;
  tableNo: number;
  menu: Menu;
  trackOrderID: number;
  trackStatus: string;
  amount: number;
  description: string;
  place: string;
  price: number;
  totalCost: number;
  dateTime: string;
  updateAT: string;
  cancelLog: CancelLog | null;
};

type TrackFilter = {
  trackOrderID: number;
  trackStateName: string;
};

const trackStateMap: Record<string, string> = {
  ordering: "กำลังสั่งอาหาร",
  preparing: "กำลังเตรียมอาหาร",
  serving: "กำลังเสิร์ฟ",
  served: "เสิร์ฟแล้ว",
  cancel: "ยกเลิก",
};

// แปลงวันที่ไทย พ.ศ. -> Date object
function parseThaiDateTime(thaiDateStr: string): Date {
  const [datePart, timePart] = thaiDateStr.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);
  const gregorianYear = year - 543;
  const [hours, minutes, seconds] = (timePart || "0:0:0").split(":").map(Number);
  return new Date(gregorianYear, month - 1, day, hours, minutes, seconds);
}

// แปลง Date/DateTime -> "dd/MM/yyyy HH:mm:ss" พ.ศ.
function formatThaiDateTime(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear() + 543;
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [filters, setFilters] = useState<TrackFilter[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    fetch("/api/admin/order")
      .then((res) => res.json())
      .then((data) => setOrders(data.data))
      .catch(console.error);

    fetch("/api/admin/filter/trackName")
      .then((res) => res.json())
      .then((data) => setFilters(data.data))
      .catch(console.error);
  }, []);

  const filterByDate = (order: OrderDetail) => {
    if (!startDate && !endDate) return true;
    const orderTime = parseThaiDateTime(order.dateTime).getTime();
    const start = startDate ? startDate.getTime() : -Infinity;
    const end = endDate ? endDate.getTime() + 24 * 60 * 60 * 1000 - 1 : Infinity;
    return orderTime >= start && orderTime <= end;
  };

  const filteredOrders = orders
    .filter((o) =>
      selectedFilter === "all"
        ? true
        : trackStateMap[o.trackStatus] === selectedFilter
    )
    .filter(filterByDate);

  const totalIncome = filteredOrders
    .filter((o) => o.trackStatus !== "cancel")
    .reduce((sum, o) => sum + o.totalCost, 0);

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        รายการออเดอร์
      </h2>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          ยอดขายรวม: <span className="text-green-500">{totalIncome.toLocaleString()} บาท</span>
        </p>

        {/* Filter */}
        <select
          value={selectedFilter}
          onChange={(e) => {
            setSelectedFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm hover:border-gray-400 dark:hover:border-gray-500 transition"
        >
          <option value="all">ทั้งหมด</option>
          {filters.map((f) => (
            <option
              key={f.trackOrderID}
              value={trackStateMap[f.trackStateName] || f.trackStateName}
            >
              {trackStateMap[f.trackStateName] || f.trackStateName}
            </option>
          ))}
        </select>

        {/* Date picker */}
        <input
          type="date"
          value={startDate ? startDate.toISOString().split("T")[0] : ""}
          onChange={(e) => {
            setStartDate(e.target.value ? new Date(e.target.value) : null);
            setCurrentPage(1);
          }}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm hover:border-gray-400 dark:hover:border-gray-500 transition"
        />
        <span className="text-gray-700 dark:text-gray-300 font-medium">ถึง</span>
        <input
          type="date"
          value={endDate ? endDate.toISOString().split("T")[0] : ""}
          onChange={(e) => {
            setEndDate(e.target.value ? new Date(e.target.value) : null);
            setCurrentPage(1);
          }}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm hover:border-gray-400 dark:hover:border-gray-500 transition"
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full table-auto border-collapse text-left">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <tr>
              <th className="px-3 py-2">No</th>
              <th className="px-3 py-2">Order No</th>
              <th className="px-3 py-2">Table No</th>
              <th className="px-3 py-2">Menu</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Date / Time</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((o, index) => (
              <tr
                key={o.detailNo}
                className="border-b border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <td className="px-3 py-2">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                <td className="px-3 py-2">{o.orderNo}</td>
                <td className="px-3 py-2">{o.tableNo}</td>
                <td className="px-3 py-2">{o.menu.name}</td>
                <td className="px-3 py-2">{o.amount}</td>
                <td className="px-3 py-2">{o.totalCost.toLocaleString()}</td>
                <td className="px-3 py-2">{formatThaiDateTime(parseThaiDateTime(o.dateTime))}</td>
                <td className="px-3 py-2">
                  {o.trackStatus === "cancel" ? (
                    <span className="text-red-500 font-semibold">ยกเลิก</span>
                  ) : (
                    <span className="text-green-500 font-semibold">
                      {trackStateMap[o.trackStatus] || o.trackStatus}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-1 rounded-lg bg-gray-300 dark:bg-gray-600 disabled:opacity-50 hover:bg-gray-400 dark:hover:bg-gray-500 transition"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-gray-700 dark:text-gray-300">
            หน้า {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-1 rounded-lg bg-gray-300 dark:bg-gray-600 disabled:opacity-50 hover:bg-gray-400 dark:hover:bg-gray-500 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
