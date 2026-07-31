import nodemailer from "nodemailer";

export const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587, // Use 465 for SSL
      secure: false, // True for SSL
      auth: {
        user: process.env.EMAIL_USER, // Your business email
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
      tls: {
        rejectUnauthorized: false, // Bypass SSL errors (only if needed)
      },
    });


    // const transporter = nodemailer.createTransport({
    //   host: "mail.jobxity.com", // Your SMTP server
    //   port: 587, // Use 465 for SSL
    //   secure: false, // True for SSL
    //   auth: {
    //     user: process.env.EMAIL_USER, // Your business email
    //     pass: process.env.EMAIL_PASS, // Your email password or app password
    //   },
    //   tls: {
    //     rejectUnauthorized: false, // Bypass SSL errors (only if needed)
    //   },
    // });

    const mailOptions = {
      from: `"Jobxity" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};
