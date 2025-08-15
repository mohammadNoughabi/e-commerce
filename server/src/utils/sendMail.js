const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = async ({ receiver, title, htmlContent }) => {
  try {
    // Create reusable transporter object
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
      port: process.env.SMTP_PORT, // 465 for secure, 587 for non-secure
      secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // SMTP username
        pass: process.env.SMTP_PASS, // SMTP password
      },
    });

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"E-Commerce App : " <${process.env.SMTP_USER}>`, // sender address
      to: receiver, // list of receivers
      subject: title, // Subject line
      html: htmlContent, // HTML body
    });

    console.log("✅ Email sent: %s", info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error("❌ Email send failed:", error);
    return { success: false, error };
  }
};

module.exports = sendMail;
