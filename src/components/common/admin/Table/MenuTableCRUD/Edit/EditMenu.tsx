"use client";

import { SubmitButton } from "@/components/common/admin/Form/Button";
import FormInput from "@/components/common/admin/Form/FormInput";
import ImageInput from "@/components/common/admin/Form/ImageInput";
import { FormContainer } from "../../../Form/FormContainer";
import { useRouter } from "next/navigation";
import { MenuCategoryInput } from "../../../Form/MenuCategoryInput";
import { MenuLists } from "@/utils/type";
import { editMenuAction } from "@/action/admin/MenuAction";
import ImageUploader from "../../../Form/ImageUploader";


interface EditMenuProps {
  menu: MenuLists;
  onSuccess?: () => void; // optional callback หลังแก้ไขเสร็จ
}

export const EditMenu = ({ menu, onSuccess }: EditMenuProps) => {
  const router = useRouter();

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">edit menu</h1>
      <div className="border p-8 rounded-md max-w-lg">
        <FormContainer
          action={editMenuAction}
          onSuccess={() => {
            onSuccess?.();
            // ปิด modal หรือ callback อื่น ๆ
          }}
        >
          <input type="hidden" name="menuID" value={menu.menuID ?? ""} />
          <FormInput name="name" label="Menu Name" type="text" defaultValue={menu.name} />
          <FormInput name="price" label="Menu Price" type="number" defaultValue={menu.price?.toString() ?? ""} />
          <MenuCategoryInput defaultValue={menu.typeID} />
          <input type="hidden" name="oldFileID" value={menu.fileID ?? ""} />
          <input type="hidden" name="oldImage" value={menu.image ?? ""} />
          <ImageUploader />
          <SubmitButton text="update menu" />
        </FormContainer>
      </div>
    </section>
  );
};
