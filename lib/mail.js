import nodemailer from 'nodemailer';
import { CustomError } from './customError.js';
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const aiOtpHtml = (otp) => `
  <div style="background: linear-gradient(135deg, #0f2027 0%, #2c5364 100%); min-height: 100vh; padding: 0; margin: 0; font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif; color: #fff;">
    <div style="max-width: 480px; margin: 48px auto; background: rgba(24,26,27,0.85); border-radius: 24px; box-shadow: 0 8px 32px 0 rgba(31,38,135,0.37); overflow: hidden; backdrop-filter: blur(8px); border: 1.5px solid rgba(255,255,255,0.12); position: relative;">
      <div style="background: linear-gradient(90deg, #00f2fe 0%, #4facfe 100%); padding: 36px 0 24px 0; text-align: center; position: relative;">
        <img src='https://cdn-icons-png.flaticon.com/512/4712/4712035.png' alt='AI Logo' width='72' style='margin-bottom: 14px; filter: drop-shadow(0 0 12px #00f2fe88);' />
        <h1 style="margin: 0; font-size: 2.2rem; letter-spacing: 1.5px; font-weight: 700; background: linear-gradient(90deg, #fff 60%, #00f2fe 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">AI Verification</h1>
        <p style="margin: 10px 0 0 0; font-size: 1.15rem; opacity: 0.92; font-weight: 500; letter-spacing: 0.5px;">Smarthse | Secure access powered by AI</p>
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
          <svg width='100%' height='100%' style='position:absolute;top:0;left:0;z-index:0;opacity:0.18;'><defs><radialGradient id='g1' cx='50%' cy='50%' r='80%'><stop offset='0%' stop-color='#00f2fe'/><stop offset='100%' stop-color='transparent'/></radialGradient></defs><ellipse cx='50%' cy='0%' rx='60%' ry='40%' fill='url(#g1)'/></svg>
        </div>
      </div>
      <div style="padding: 40px 28px 28px 28px; text-align: center; position: relative;">
        <h2 style="margin: 0 0 16px 0; font-size: 1.35rem; font-weight: 600; letter-spacing: 0.5px;">Your One-Time Passcode</h2>
        <div style="font-size: 2.8rem; font-weight: bold; letter-spacing: 10px; color: #00f2fe; background: rgba(44,83,100,0.25); border-radius: 12px; padding: 22px 0; margin: 22px 0; box-shadow: 0 0 16px #00f2fe55, 0 0 32px #4facfe33; border: 1.5px solid #00f2fe33; text-shadow: 0 0 8px #00f2fe99;">
          ${otp}
        </div>
        <p style="font-size: 1.05rem; color: #b0b3b8; margin-bottom: 0;">Enter this code in the app to verify your email.<br/>This code is valid for 10 minutes.</p>
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
          <svg width='100%' height='100%' style='position:absolute;bottom:0;left:0;z-index:0;opacity:0.12;'><defs><radialGradient id='g2' cx='50%' cy='100%' r='80%'><stop offset='0%' stop-color='#4facfe'/><stop offset='100%' stop-color='transparent'/></radialGradient></defs><ellipse cx='50%' cy='100%' rx='60%' ry='40%' fill='url(#g2)'/></svg>
        </div>
      </div>
      <div style="background: rgba(35,37,38,0.95); padding: 20px 0; text-align: center; font-size: 1rem; color: #b0b3b8; border-top: 1px solid #00f2fe22; letter-spacing: 0.2px;">
        <span>Need help? <a href="mailto:support@smarthse.com" style="color:#00f2fe;text-decoration:underline;">Contact our AI support team</a>.</span>
      </div>
    </div>
  </div>
`;

export const sendOtpToEmail = async (email, otp) => {
  const subject = "Your Smarthse Verification Code";
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject,
      html: aiOtpHtml(otp),
    }); 
  } catch (err) {
    throw new CustomError("Failed to send email", 500);
  }
};