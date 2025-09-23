'use client'
import { SubmitButton } from "@/components/common/admin/Form/Button";
import FormInput from "@/components/common/admin/Form/FormInput"
import { FormContainer } from "@/components/common/admin/Form/FormContainer";
import { createTableNoAction } from "@/action/admin/TableNoAction";


interface CreateTableProps {
  onSuccess?: () => void
}

const CreateTableNo = ({ onSuccess }: CreateTableProps) => {
    return (
        <section>
            <h1 className="text-2xl font-semibold mb-8 capitalize">new menu</h1>
            <div className="border p-8 rounded-md max-w-lg">
                <FormContainer 
                    action={createTableNoAction} 
                    onSuccess={onSuccess} // ✅ เรียก callback หลังสร้างเมนูสำเร็จ
                    refreshOnSuccess={false} // ไม่ต้อง refresh ในนี้ เพราะเราจะทำใน onSuccess ของ Page
                >
                    <FormInput name="locationDetail" label="location Detail" type="text" />
                    <SubmitButton text="create" />
                </FormContainer>
            </div>
        </section>
    )
}
export default CreateTableNo
