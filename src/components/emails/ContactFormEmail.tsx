import React from 'react';

interface ContactFormEmailProps {
  name: string;
  email: string;
  message: string;
}

export const ContactFormEmail: React.FC<Readonly<ContactFormEmailProps>> = ({ name, email, message }) => (
  <div>
    <h1>お問い合わせフォームからのメッセージ</h1>
    <p>
      <strong>{name}</strong>様 ({email}) からお問い合わせがありました。
    </p>
    <hr />
    <h2>メッセージ内容</h2>
    <p>{message}</p>
    <hr />
    <p>このメールはブログのお問い合わせフォームから送信されました。</p>
  </div>
);
