'use client';
import { useEffect, useState } from 'react';

export default function TestAPI() {
  const [qr, setQr] = useState<string>('');

  useEffect(() => {
    fetch('/api/customer/payment/promptPay?amount=150&phone=0988174150')
      .then(res => res.json())
      .then(data => setQr(data.qrCodeDataURL))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {qr ? <img src={qr} alt="QR Code" /> : <p>Loading...</p>}
    </div>
  );
}
