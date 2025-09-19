"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Payment } from "@/utils/type"; // ปรับ path ตามจริง

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export default function SalesBarChart() {
    const [chartData, setChartData] = useState<any>(null);
    const [dailyTotals, setDailyTotals] = useState<Record<string, number>>({});
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    useEffect(() => {
        const fetchPayments = async () => {
            const res = await fetch("/api/admin/payment");
            if (!res.ok) {
                console.error("Fetch failed:", res.status, res.statusText);
                return;
            }
            const data: Payment[] = await res.json();

            const formatDate = (dateStr: string) => {
                const [day, month, yearAndTime] = dateStr.split("/");
                const [year] = yearAndTime.split(" ");
                const yearCE = Number(year) - 543;
                return `${day}/${month}/${yearCE}`;
            };

            const tempChart: Record<string, Record<string, number>> = {};
            const totals: Record<string, number> = {};

            data.forEach((p) => {
                const date = formatDate(p.dateTime as unknown as string);
                const method = p.method?.methodName || "UNKNOWN";
                const total = Number(p.totalCost);

                if (!tempChart[date]) tempChart[date] = {};
                tempChart[date][method] = (tempChart[date][method] || 0) + total;

                totals[date] = (totals[date] || 0) + total;
            });

            const labels = Object.keys(tempChart).sort((a, b) => {
                const [dayA, monthA, yearA] = a.split("/").map(Number);
                const [dayB, monthB, yearB] = b.split("/").map(Number);
                return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
            });

            const methods = Array.from(new Set(data.map((p) => p.method?.methodName || "UNKNOWN")));
            const colors = ["rgb(75, 192, 192)", "rgb(255, 99, 132)", "rgb(255, 205, 86)", "rgb(54, 162, 235)"];

            const datasets = methods.map((method, index) => ({
                label: method,
                data: labels.map((date) => tempChart[date][method] || 0),
                backgroundColor: colors[index % colors.length],
                datalabels: {
                    anchor: "center",
                    align: "center",
                    formatter: (value: number) => (value > 0 ? `${value} ฿` : ""),
                    color: "#fff",
                    font: { weight: "bold" },
                },
            }));

            setChartData({ labels, datasets });
            setDailyTotals(totals);
        };

        fetchPayments();
    }, []);

    if (!chartData) return <p>Loading...</p>;

    // ✅ สร้าง labels ใหม่ที่มี "(ยอดรวม)" ต่อท้าย
    const labelsWithTotals = chartData.labels.map(
        (date: string) => `${date}  (${dailyTotals[date] || 0} บาท)`
    );

    const displayedData = selectedDate
        ? {
              labels: [selectedDate + ` (${dailyTotals[selectedDate] || 0})`],
              datasets: chartData.datasets.map((ds: any) => ({
                  ...ds,
                  data: [ds.data[chartData.labels.indexOf(selectedDate)]],
              })),
          }
        : {
              ...chartData,
              labels: labelsWithTotals,
          };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">
                ยอดขายรายวันแยกตามวิธีชำระเงิน (Drilldown)
            </h2>
            <Bar
                data={displayedData}
                options={{
                    responsive: true,
                    onClick: (evt, elements) => {
                        if (elements.length > 0) {
                            const index = elements[0].index;
                            const date = chartData.labels[index];
                            setSelectedDate(date === selectedDate ? null : date);
                        }
                    },
                    plugins: {
                        legend: { position: "top" },
                        tooltip: {
                            callbacks: {
                                label: function (context: any) {
                                    return `${context.dataset.label}: ${context.raw} บาท`;
                                },
                            },
                        },
                        datalabels: {
                            color: "#fff",
                            font: { weight: "bold" },
                        },
                    },
                    scales: {
                        x: {
                            stacked: true,
                            title: { display: true, text: "วันที่ (ค.ศ.) (ยอดรวม)" },
                        },
                        y: {
                            stacked: true,
                            beginAtZero: true,
                            title: { display: true, text: "ยอดขาย (บาท)" },
                        },
                    },
                }}
                plugins={[ChartDataLabels]}
            />
            {selectedDate && (
                <p className="mt-2 text-sm text-gray-600">
                    กำลังดูรายละเอียดของวันที่ {selectedDate}. คลิก bar อีกครั้งเพื่อย้อนกลับ.
                </p>
            )}
        </div>
    );
}
