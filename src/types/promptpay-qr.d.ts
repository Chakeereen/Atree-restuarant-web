declare module 'promptpay-qr' {
  interface PromptPayOptions {
    amount?: number;
  }
  export default function PromptPay(phone: string, options?: PromptPayOptions): string;
}
