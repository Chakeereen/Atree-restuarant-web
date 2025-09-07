import { NextRequest, NextResponse } from 'next/server';
import PromptPay from 'promptpay-qr';
import qrcode from 'qrcode';

export async function GET(req: NextRequest) {
  const amount = req.nextUrl.searchParams.get('amount');
  const phone = req.nextUrl.searchParams.get('phone');

  if (!amount || !phone) {
    return NextResponse.json({ error: 'amount and phone are required' }, { status: 400 });
  }

  try {
    const cleanPhone = String(phone).trim().replace(/\D/g, '');

    const qrPayload = PromptPay(cleanPhone, { amount: parseFloat(amount) });

    const qrCodeDataURL = await qrcode.toDataURL(qrPayload);

    return NextResponse.json({ qrCodeDataURL });
  } catch (err) {
    console.error('QR API Error:', err);
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}
