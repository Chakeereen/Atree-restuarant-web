'use client'

import { useState } from "react";
import { SubmitButton } from "@/components/common/admin/Form/Button";
import FormInput from "@/components/common/admin/Form/FormInput";
import { LoginFormContainer } from "./LoginFormContainer";
import { loginAdminAction } from "@/utils/admin";



interface LoginProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: LoginProps) => {
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(true);

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="border p-8 rounded-md w-full max-w-md shadow-md bg-white">
        <h1 className="text-2xl font-semibold mb-8 text-center">Login</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {showForm && (
          <LoginFormContainer
            action={loginAdminAction}
            onSuccess={onSuccess}
            redirectTo="/admin" // redirect หลัง login
          >
            <FormInput name="email" label="Email" type="email" />
            <FormInput name="password" label="Password" type="password" />
            <SubmitButton text="Login" />
          </LoginFormContainer>
        )}
      </div>
    </section>
  );
};

export default LoginForm;
