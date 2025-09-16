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
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
  
  <!-- Main Container -->
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
    
    <!-- Email Card -->
    <div style="background: rgba(255, 255, 255, 0.95); border-radius: 20px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 0 8px 25px rgba(0, 0, 0, 0.05); overflow: hidden; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); width: 100%;">
      
      <!-- Header Section -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
        
        <!-- Animated Background Elements -->
        <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); animation: pulse 4s ease-in-out infinite;"></div>
        
        <!-- AI Icon -->
        <div style="position: relative; z-index: 2;">
          <div style="width: 80px; height: 80px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); border: 2px solid rgba(255, 255, 255, 0.3);">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="white"/>
              <path d="M19 15L19.5 17.5L22 18L19.5 18.5L19 21L18.5 18.5L16 18L18.5 17.5L19 15Z" fill="white" opacity="0.7"/>
              <path d="M5 15L5.5 17.5L8 18L5.5 18.5L5 21L4.5 18.5L2 18L4.5 17.5L5 15Z" fill="white" opacity="0.5"/>
            </svg>
          </div>
          
          <!-- Title -->
          <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: white; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            AI Verification
          </h1>
          
          <!-- Subtitle -->
          <p style="margin: 8px 0 0 0; font-size: 16px; color: rgba(255, 255, 255, 0.9); font-weight: 400; letter-spacing: 0.3px;">
            SmartHSE • Secure AI-Powered Access
          </p>
        </div>
      </div>
      
      <!-- Content Section -->
      <div style="padding: 40px 30px; text-align: center;">
        
        <!-- Main Heading -->
        <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 600; color: #2d3748; letter-spacing: -0.3px;">
          Your Verification Code
        </h2>
        
        <!-- Description -->
        <p style="margin: 0 0 30px 0; font-size: 16px; color: #718096; line-height: 1.5;">
          Please use the following code to complete your verification:
        </p>
        
        <!-- OTP Code Container -->
        <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 2px solid #e2e8f0; border-radius: 16px; padding: 30px 20px; margin: 30px 0; position: relative; overflow: hidden;">
          
          <!-- Code Display -->
          <div style="font-size: 36px; font-weight: 700; color: #667eea; letter-spacing: 8px; font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace; text-shadow: 0 2px 4px rgba(102, 126, 234, 0.1);">
            ${otp}
          </div>
          
          <!-- Decorative Elements -->
          <div style="position: absolute; top: -10px; right: -10px; width: 20px; height: 20px; background: linear-gradient(45deg, #667eea, #764ba2); border-radius: 50%; opacity: 0.3;"></div>
          <div style="position: absolute; bottom: -5px; left: -5px; width: 15px; height: 15px; background: linear-gradient(45deg, #764ba2, #667eea); border-radius: 50%; opacity: 0.2;"></div>
        </div>
        
        <!-- Instructions -->
        <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea;">
          <p style="margin: 0; font-size: 14px; color: #4a5568; line-height: 1.6;">
            <strong>Instructions:</strong><br>
            • Enter this code in the SmartHSE app<br>
            • Code expires in <strong>10 minutes</strong><br>
            • Do not share this code with anyone
          </p>
        </div>
        
        <!-- Security Notice -->
        <div style="margin: 30px 0 0 0; padding: 15px; background: rgba(102, 126, 234, 0.05); border-radius: 8px; border: 1px solid rgba(102, 126, 234, 0.1);">
          <p style="margin: 0; font-size: 13px; color: #718096; line-height: 1.4;">
            🔒 This is an automated message from our AI security system. If you didn't request this code, please ignore this email.
          </p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #718096;">
          Need assistance?
        </p>
        <a href="mailto:support@smarthse.com" style="color: #667eea; text-decoration: none; font-weight: 500; font-size: 14px; padding: 8px 16px; background: rgba(102, 126, 234, 0.1); border-radius: 6px; display: inline-block; transition: all 0.2s ease;">
          Contact AI Support
        </a>
        <p style="margin: 15px 0 0 0; font-size: 12px; color: #a0aec0;">
          © 2024 SmartHSE. Powered by AI Technology.
        </p>
      </div>
    </div>
  </div>
  
  <!-- CSS Animations -->
  <style>
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }
    
    @media (max-width: 600px) {
      .email-container { padding: 10px !important; }
      .email-card { border-radius: 16px !important; }
      .header-section { padding: 30px 20px !important; }
      .content-section { padding: 30px 20px !important; }
      .footer-section { padding: 20px !important; }
    }
  </style>
</body>
</html>
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