"use client";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

const initialState = {
  message: '',
  success: false
}

type ActionFunction = (
  prevState: any,
  formData: FormData
) => Promise<{ message: string; success: boolean }>

interface LoginContainerProps {
  action: ActionFunction
  children: React.ReactNode
  onSuccess?: () => void
  refreshOnSuccess?: boolean
}

export const LoginFormContainer = ({ action, children, onSuccess,  refreshOnSuccess }: LoginContainerProps) => {
   const [state, formAction] = useActionState(action, initialState)
   const router = useRouter()
 
   useEffect(() => {
     if (state.message) {
       if(!state.success) {
         toast.error(state.message)
       }
       else {
         toast.success(state.message)
         setTimeout(() => router.push("/admin"), 170);
       }
     
       onSuccess?.()
        // redirect หลัง toast
     }
   }, [state.message, state.success, onSuccess, refreshOnSuccess, router])
 
   return (
     <form action={formAction}>
       {children}
     </form>
   )
}

// setTimeout(() => router.push("/admin"), 100); // redirect หลัง toast