import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ContactFormEmail } from '@/components/emails/ContactFormEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // 注: Resendの仕様上、テスト用の固定アドレスを使用します
      to: [process.env.EMAIL_RECIPIENT || ''],
      subject: `ブログの問い合わせフォームから新しいメッセージ: ${name}`,
      react: ContactFormEmail({ name, email, message }),
    });

    if (data.error) {
      console.error('Error sending email:', data.error);
      return NextResponse.json({ success: false, message: 'Error sending email.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Form submitted successfully.' });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ success: false, message: 'An error occurred.' }, { status: 500 });
  }
}
