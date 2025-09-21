'use client'

import { SubmitButton } from "@/components/common/admin/Form/Button";
import FormInput from "@/components/common/admin/Form/FormInput";
import { FormContainer } from "@/components/common/admin/Form/FormContainer";
import { createAdminAction } from "@/action/admin/AdminAction";
import ImageStaffUploader from "../Staff/ImageStaffUploader";

interface CreateAdminProps {
  onSuccess?: () => void;
}

const CreateAdmin = ({ onSuccess }: CreateAdminProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <section className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Create Admin User
        </h1>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-8 space-y-6">
          <FormContainer
            action={createAdminAction}
            onSuccess={onSuccess}
            refreshOnSuccess={false}
          >
            <div className="space-y-4">
              <FormInput name="email" label="Email" type="email" />
              <FormInput name="password" label="Password" type="password" />
              <FormInput name="confirmPassword" label="Confirm Password" type="password" />
              <FormInput name="name" label="Name" type="text" />
              <FormInput name="surname" label="Surname" type="text" />
              <ImageStaffUploader />
            </div>
            <div className="mt-6">
              <SubmitButton text="Create Admin" />
            </div>
          </FormContainer>
        </div>
      </section>
    </div>
  );
};

export default CreateAdmin;
