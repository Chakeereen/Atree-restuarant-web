"use client";

import { useEffect, useState } from "react";

type Staff = {
  staffID: string;
  name: string;
  surname: string;
};

type LoginLog = {
  logNo: number;
  staffID: string;
  loginResult: string;
  dateTime: string; // แปลงมาแล้วจาก API
  staff: Staff;
};

export default function LoginLogTable() {
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/admin/report/loginLog");
        const data = await res.json();
        if (data.success) {
          setLogs(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch login logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">กำลังโหลด...</p>;
  }

  const totalPages = Math.ceil(logs.length / rowsPerPage);
  const paginatedLogs = logs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        ประวัติการเข้าสู่ระบบ
      </h2>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full table-auto border-collapse text-left">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <tr>
              <th className="px-3 py-2">ลำดับ</th>
              <th className="px-3 py-2">ชื่อพนักงาน</th>
              <th className="px-3 py-2">Staff ID</th>
              <th className="px-3 py-2">ผลการล็อกอิน</th>
              <th className="px-3 py-2">เวลา</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map((log, idx) => (
              <tr
                key={log.logNo}
                className="border-b border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <td className="px-3 py-2">
                  {(currentPage - 1) * rowsPerPage + idx + 1}
                </td>
                <td className="px-3 py-2">{log.staff?.name|| "-"} {log.staff?.surname||"-"}</td>
                <td className="px-3 py-2">{log.staffID}</td>
                <td
                  className={`px-3 py-2 font-semibold ${
                    log.loginResult === "SUCCESS"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {log.loginResult}
                </td>
                <td className="px-3 py-2">{log.dateTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-1 bg-gray-300 dark:bg-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-400 dark:hover:bg-gray-500 transition"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-gray-700 dark:text-gray-300">
            หน้า {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-1 bg-gray-300 dark:bg-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-400 dark:hover:bg-gray-500 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
