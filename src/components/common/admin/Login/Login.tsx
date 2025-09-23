"use client";
import { SubmitButton } from "@/components/common/admin/Form/Button";
import FormInput from "@/components/common/admin/Form/FormInput";
import { LoginFormContainer } from "./LoginFormContainer";
import { loginAdminAction } from "@/utils/admin";

interface LoginProps {
  onSuccess?: () => void;
}


const LoginForm = ({ onSuccess }: LoginProps) => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Login
        </h1>

        <LoginFormContainer
          action={loginAdminAction}
          onSuccess={onSuccess}
          refreshOnSuccess={false}
        >
          <div className="space-y-4">
            <FormInput name="email" label="Email" type="email" />
            <FormInput name="password" label="Password" type="password" />
          </div>
          <div className="mt-6">
            <SubmitButton text="Login" />
          </div>
        </LoginFormContainer>
      </div>
    </section>
  );
}

export default LoginForm;