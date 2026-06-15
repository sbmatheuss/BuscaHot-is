const nodemailer = require('nodemailer');

const createTransporter = () => {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) return null;

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT) || 587,
    secure: Number(EMAIL_PORT) === 465,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
};

const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const transporter = createTransporter();

  if (!transporter) {
    // Em desenvolvimento sem e-mail configurado, só loga o link
    console.log(`[DEV] Link de redefinição de senha para ${to}: ${resetUrl}`);
    return;
  }

  await transporter.sendMail({
    from: `"BuscaHotéis" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Redefinição de senha — BuscaHotéis',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Olá, ${name}!</h2>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta no <strong>BuscaHotéis</strong>.</p>
        <p>Clique no botão abaixo para criar uma nova senha. O link expira em <strong>1 hora</strong>.</p>
        <a href="${resetUrl}"
           style="display:inline-block;margin:16px 0;padding:12px 24px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">
          Redefinir senha
        </a>
        <p style="color:#888;font-size:13px">Se você não solicitou isso, ignore este e-mail.</p>
      </div>
    `,
  });
};

module.exports = { sendPasswordResetEmail };
