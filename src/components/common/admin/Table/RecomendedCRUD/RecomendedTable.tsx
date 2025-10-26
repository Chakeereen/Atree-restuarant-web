"use client";

import { useEffect, useState } from "react";

interface Menu { menuID: number; name: string; image?: string; }
interface Recommended { id: number; menuID: number; menu: Menu; }

export default function RecommendedManager() {
  const [recommended, setRecommended] = useState<Recommended[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenuID, setSelectedMenuID] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editMenuID, setEditMenuID] = useState<number | null>(null);

  const fetchData = async () => {
    const recRes = await fetch("/api/admin/menu/recommended").then(r => r.json());
    setRecommended(Array.isArray(recRes.data) ? recRes.data : []);
    const menuRes = await fetch("/api/admin/menu").then(r => r.json());
    setMenus(Array.isArray(menuRes) ? menuRes : []);
  };

  useEffect(() => { fetchData(); }, []);

  const addRecommended = async () => {
    if (!selectedMenuID) return;
    await fetch("/api/admin/menu/recommended", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuID: selectedMenuID }),
    });
    setSelectedMenuID(null); fetchData();
  };

  const deleteRecommended = async (id: number) => {
    await fetch(`/api/admin/menu/recommended/${id}`, { method: "DELETE" });
    fetchData();
  };

  const startEdit = (rec: Recommended) => { setEditId(rec.id); setEditMenuID(rec.menuID); };
  const cancelEdit = () => { setEditId(null); setEditMenuID(null); };
  const saveEdit = async () => {
    if (!editId || !editMenuID) return;
    await fetch(`/api/admin/menu/recommended/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuID: editMenuID }),
    });
    cancelEdit(); fetchData();
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">จัดการข้อมูลเมนูแนะนำ</h2>

      {/* Add New Recommended */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <select
          value={selectedMenuID ?? ""}
          onChange={e => setSelectedMenuID(Number(e.target.value))}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
        >
          <option value="">เลือกเมนู</option>
          {menus.map(menu => (
            <option key={menu.menuID} value={menu.menuID}>{menu.name}</option>
          ))}
        </select>

        <button
          onClick={addRecommended}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          เพิ่มเมนูแนะนำ
        </button>
      </div>

      {/* Recommended Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recommended.length > 0 ? recommended.map(rec => (
          <div key={rec.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col justify-between hover:shadow-lg transition">
            {/* Menu Image */}
            {rec.menu.image && (
              <img
                src={rec.menu.image}
                alt={rec.menu.name}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            )}

            {/* Menu Info */}
            <div className="mb-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">ID: {rec.id}</p>
              {editId === rec.id ? (
                <select
                  value={editMenuID ?? rec.menuID}
                  onChange={e => setEditMenuID(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm"
                >
                  {menus.map(menu => (
                    <option key={menu.menuID} value={menu.menuID}>{menu.name}</option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-800 dark:text-gray-100 font-medium mt-2">{rec.menu.name}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              {editId === rec.id ? (
                <>
                  <button onClick={saveEdit} className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition">บันทึก</button>
                  <button onClick={cancelEdit} className="bg-gray-400 text-white px-3 py-1 rounded-lg hover:bg-gray-500 transition">ยกเลิก</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(rec)} className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition">แก้ไข</button>
                  <button onClick={() => deleteRecommended(rec.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition">ลบ</button>
                </>
              )}
            </div>
          </div>
        )) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">No recommended menus</p>
        )}
      </div>
    </div>
  );
}
