import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MenuType } from "@/utils/type";
import { useEffect, useState } from "react";

const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;

interface MenuCategoryProps {
  defaultValue?: number; // ใช้ typeID เดิม
  onChange?: (value: number) => void;
}

export const MenuCategoryInput = ({ defaultValue, onChange }: MenuCategoryProps) => {
  const name = "menuType";
  const [menuTypes, setMenuTypes] = useState<MenuType[]>([]);
  const [selected, setSelected] = useState<number | undefined>(defaultValue);

  useEffect(() => {
    const fetchMenuTypes = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/admin/menuType`);
        const data: MenuType[] = await res.json();
        setMenuTypes(data);

        // ตั้ง default ถ้ายังไม่มี selected
        if (selected === undefined && data.length > 0) {
          setSelected(data[0].typeID);
        }
      } catch (error) {
        console.error("Failed to fetch menu types:", error);
      }
    };

    fetchMenuTypes();
  }, []);

  const handleChange = (value: string) => {
    const id = parseInt(value);
    setSelected(id);
    if (onChange) onChange(id);
  };

  const selectedName = menuTypes.find((t) => t.typeID === selected)?.name || "";

  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        {name}
      </Label>
      <Select
        value={selected?.toString() || ""}
        onValueChange={handleChange}
        name={name}
        required
      >
        <SelectTrigger>
          <SelectValue>{selectedName}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {menuTypes.map((type) => (
            <SelectItem key={type.typeID} value={type.typeID.toString()}>
              <span className="capitalize flex items-center gap-4">{type.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
