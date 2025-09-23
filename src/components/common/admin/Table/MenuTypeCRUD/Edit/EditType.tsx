"use client";

import { SubmitButton } from "@/components/common/admin/Form/Button";

import FormInput from "@/components/common/admin/Form/FormInput";

import { FormContainer } from "../../../Form/FormContainer";
import { useRouter } from "next/navigation";
import { editMenuTypeAction } from "@/action/admin/MenuTypeAction";
import { MenuType } from "@prisma/client";

interface EditMenuTypeProps {
  menuType: MenuType;
  onSuccess?: () => void; // optional callback หลังแก้ไขเสร็จ
}

export const EditType = ({ menuType, onSuccess }: EditMenuTypeProps) => {
  const router = useRouter();

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">edit menu</h1>
      <div className="border p-8 rounded-md max-w-lg">
        <FormContainer
          action={editMenuTypeAction}
          onSuccess={() => {
            onSuccess?.();
              // ปิด modal หรือ callback อื่น ๆ
          }}
        >
          <input type="hidden" name="TypeID" value={menuType.typeID ?? ""} />
          <FormInput name="name" label="Menu Type Name" type="text" defaultValue={menuType.name} />       
          <SubmitButton text="update" />
        </FormContainer>
      </div>
    </section>
  );
};
