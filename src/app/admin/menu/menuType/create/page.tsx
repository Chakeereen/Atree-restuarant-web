'use client'
import { SubmitButton } from "@/components/common/admin/Form/Button";
import FormInput from "@/components/common/admin/Form/FormInput"
import { FormContainer } from "@/components/common/admin/Form/FormContainer";
import { createMenuTypeAction } from "@/action/admin/MenuTypeAction";

interface CreateMenuTypeProps {
  onSuccess?: () => void
}

const CreateMenuType = ({ onSuccess }: CreateMenuTypeProps) => {
    return (
        <section>
            <h1 className="text-2xl font-semibold mb-8 capitalize">New Menu Category</h1>
            <div className="border p-8 rounded-md max-w-lg">
                <FormContainer 
                    action={createMenuTypeAction} 
                    onSuccess={onSuccess} // ✅ เรียก callback หลังสร้างเมนูสำเร็จ
                    refreshOnSuccess={false} // ไม่ต้อง refresh ในนี้ เพราะเราจะทำใน onSuccess ของ Page
                >
                    <FormInput name="name" label="Menu Type Name" type="text" />
                    <SubmitButton text="create" />
                </FormContainer>
            </div>
        </section>
    )
}
export default CreateMenuType
