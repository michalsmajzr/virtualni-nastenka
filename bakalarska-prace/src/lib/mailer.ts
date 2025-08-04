import nodemailer from "nodemailer";

export function mailer(email: string) {
  const token = crypto.randomUUID();
  const link = `${process.env.NEXTAUTH_URL}reset-password?token=${token}`;

  /* https://ethereal.email/create */
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "abigale98@ethereal.email",
      pass: "ZYBgUPE2w8NzHNfbYK",
    },
  });

  (async () => {
    await transporter.sendMail({
      from: '"Virtualni nastenka" <teacher@virtualninastenka.online>',
      to: email,
      subject: "Nastavení hesla",
      text: `Zde si nastavte heslo: ${link}`,
      html: `Zde si nastavte heslo: <a href="${link}">${link}</a>`,
    });
  })();

  return token;
}
