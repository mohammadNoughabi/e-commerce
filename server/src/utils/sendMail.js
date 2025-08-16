const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = async ({ receiver, title, htmlContent }) => {
  try {
    // Validate input
    if (!receiver || !title || !htmlContent) {
      throw new Error("Receiver, title and htmlContent are required");
    }

    // Create transporter with improved configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    await transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP connection error:", error);
        throw new Error("Failed to connect to SMTP server");
      }
      console.log("SMTP server is ready to take our messages");
    });

    // Prepare email options
    const mailOptions = {
      from: {
        name: "E-commerce App",
        address: process.env.SMTP_USER
      },
      to: receiver,
      subject: title,
      html: htmlContent,
      // Optional text version for non-HTML clients
      text: htmlContent.replace(/<[^>]*>/g, ""),
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully to", receiver);
    return { 
      success: true, 
      messageId: info.messageId,
      receiver,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Email send error:", error);
    return { 
      success: false, 
      error: error.message,
      receiver,
      timestamp: new Date().toISOString()
    };
  }
};

module.exports = sendMail;