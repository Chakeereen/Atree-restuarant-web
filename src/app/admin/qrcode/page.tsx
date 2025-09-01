'use client'
import { SubmitButton } from "@/components/common/admin/Form/Button";
import FormInput from "@/components/common/admin/Form/FormInput"
import ImageInput from "@/components/common/admin/Form/ImageInput";
import { FormContainer } from "@/components/common/admin/Form/FormContainer";
import { MenuCategoryInput } from "@/components/common/admin/Form/MenuCategoryInput";
import { generateOrderForTable } from "@/action/admin/CreateOrderAction";




interface CreateMenuProps {
  onSuccess?: () => void
}

const CreateMenu = ({ onSuccess }: CreateMenuProps) => {
    return (
        <section>
            <h1 className="text-2xl font-semibold mb-8 capitalize">new menu</h1>
            <div className="border p-8 rounded-md max-w-lg">
                <FormContainer 
                    action={generateOrderForTable} 
                    onSuccess={onSuccess} // ✅ เรียก callback หลังสร้างเมนูสำเร็จ
                    refreshOnSuccess={false} // ไม่ต้อง refresh ในนี้ เพราะเราจะทำใน onSuccess ของ Page
                >
                    <FormInput name="table" label="table" type="number" />
                    <SubmitButton text="create menu" />
                </FormContainer>
            </div>
        </section>
    )
}
export default CreateMenu
