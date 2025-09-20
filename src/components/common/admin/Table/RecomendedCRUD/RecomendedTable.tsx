"use client";

import { useEffect, useState } from "react";

interface Menu { menuID: number; name: string; }
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Recommended Manager</h2>
      <div className="mb-4 flex gap-2">
        <select value={selectedMenuID ?? ""} onChange={e => setSelectedMenuID(Number(e.target.value))} className="border p-2">
          <option value="">Select Menu</option>
          {menus.map(menu => (<option key={menu.menuID} value={menu.menuID}>{menu.name}</option>))}
        </select>
        <button onClick={addRecommended} className="bg-blue-500 text-white px-4 py-2 rounded">Add Recommended</button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Menu</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {recommended.length > 0 ? recommended.map(rec => (
            <tr key={rec.id}>
              <td className="border px-2 py-1">{rec.id}</td>
              <td className="border px-2 py-1">
                {editId === rec.id ? (
                  <select value={editMenuID ?? rec.menuID} onChange={e => setEditMenuID(Number(e.target.value))} className="border p-1">
                    {menus.map(menu => (<option key={menu.menuID} value={menu.menuID}>{menu.name}</option>))}
                  </select>
                ) : rec.menu.name}
              </td>
              <td className="border px-2 py-1 flex gap-2">
                {editId === rec.id ? (
                  <>
                    <button onClick={saveEdit} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                    <button onClick={cancelEdit} className="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(rec)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                    <button onClick={() => deleteRecommended(rec.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                  </>
                )}
              </td>
            </tr>
          )) : (
            <tr><td colSpan={3} className="text-center p-2">No recommended menus</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
