import { sendMail } from "./mail";

export const generateOtp = async (email) => {
  if (!email) throw new Error("Email is required for OTP generation");

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
  const expiry = Math.floor(Date.now() / 1000) + 300; // 5 minutes from now

  await sendMail(email, "Verification OTP", `Your verification OTP is: ${otp}`);

  return { otp, expiry };
};

