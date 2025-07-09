import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSPrisma from "@adminjs/prisma";
import { getModelsToDisplay } from "./lib/adminJsModels.js";
import express from "express";

AdminJS.registerAdapter({
  Database: AdminJSPrisma.Database,
  Resource: AdminJSPrisma.Resource,
});

const adminJs = new AdminJS({
  rootPath: "/admin",
  branding: {
    companyName: "Smarthse",
    logo: "/robot.svg",
    softwareBrothers: false,
  },
  resources: getModelsToDisplay(),
});

// const adminUiRouter = AdminJSExpress.buildRouter(adminJs);

const ADMIN = {
  email: "admin@smarthse.ai",
  password: "secret00",
};

const aiLoginHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Assist Smart Admin Login</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    body {
      background: linear-gradient(135deg, #7b5cff 0%, #4f8cff 100%);
      min-height: 100vh;
      margin: 0;
      font-family: 'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }
    .bubbles {
      position: absolute;
      width: 100vw;
      height: 100vh;
      top: 0; left: 0;
      z-index: 0;
      pointer-events: none;
    }
    .bubble {
      position: absolute;
      border-radius: 50%;
      opacity: 0.18;
      animation: float 12s infinite linear;
      background: linear-gradient(135deg, #fff 0%, #7b5cff 100%);
    }
    .bubble1 { width: 180px; height: 180px; left: 10vw; top: 20vh; animation-delay: 0s;}
    .bubble2 { width: 120px; height: 120px; left: 70vw; top: 10vh; animation-delay: 2s;}
    .bubble3 { width: 90px; height: 90px; left: 60vw; top: 60vh; animation-delay: 4s;}
    .bubble4 { width: 140px; height: 140px; left: 30vw; top: 70vh; animation-delay: 6s;}
    @keyframes float {
      0% { transform: translateY(0) scale(1);}
      50% { transform: translateY(-30px) scale(1.08);}
      100% { transform: translateY(0) scale(1);}
    }
    .login-container {
      position: relative;
      background: rgba(255,255,255,0.85);
      border-radius: 28px;
      box-shadow: 0 8px 32px 0 rgba(31,38,135,0.18);
      padding: 56px 36px 36px 36px;
      max-width: 410px;
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 1;
      backdrop-filter: blur(8px);
      border: 1.5px solid rgba(123,92,255,0.08);
    }
    .login-container img {
      width: 62px;
      margin-bottom: 18px;
      filter: drop-shadow(0 0 18px #7b5cff88);
      animation: glow 2s infinite alternate;
    }
    @keyframes glow {
      from { filter: drop-shadow(0 0 8px #7b5cff44);}
      to   { filter: drop-shadow(0 0 24px #4f8cffcc);}
    }
    .login-container h2 {
      margin: 0 0 18px 0;
      font-size: 2.1rem;
      font-weight: 700;
      color: #4f3cc9;
      letter-spacing: 1px;
      background: linear-gradient(90deg, #4f3cc9 60%, #7b5cff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .login-container .brand {
      font-size: 1.2rem;
      color: #7b5cff;
      margin-bottom: 24px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-shadow: 0 2px 8px #7b5cff22;
    }
    .login-container input {
      width: 100%;
      padding: 15px 12px;
      margin: 12px 0;
      border-radius: 12px;
      border: 1.5px solid #e5e5f7;
      font-size: 1rem;
      background: #f7f7fb;
      color: #222;
      outline: none;
      transition: border 0.2s, box-shadow 0.2s;
      box-shadow: 0 1px 4px #7b5cff11;
    }
    .login-container input:focus {
      border: 1.5px solid #7b5cff;
      box-shadow: 0 2px 8px #7b5cff22;
    }
    .login-container button {
      width: 100%;
      padding: 15px 0;
      background: linear-gradient(90deg, #7b5cff 0%, #4f8cff 100%);
      color: #fff;
      border: none;
      border-radius: 12px;
      font-weight: 700;
      font-size: 1.1rem;
      letter-spacing: 1.2px;
      margin-top: 22px;
      cursor: pointer;
      box-shadow: 0 2px 16px #7b5cff33;
      transition: background 0.2s, box-shadow 0.2s;
      position: relative;
      overflow: hidden;
    }
    .login-container button:hover {
      background: linear-gradient(90deg, #4f8cff 0%, #7b5cff 100%);
      box-shadow: 0 4px 24px #4f8cff44;
    }
    .login-container .error {
      color: #ff4d4f;
      margin-top: 10px;
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.2px;
    }
    .login-container .footer {
      margin-top: 32px;
      font-size: 0.98rem;
      color: #888;
      opacity: 0.85;
    }
    .login-container .footer span {
      color: #7b5cff;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="bubbles">
    <div class="bubble bubble1"></div>
    <div class="bubble bubble2"></div>
    <div class="bubble bubble3"></div>
    <div class="bubble bubble4"></div>
  </div>
  <form class="login-container" method="POST" action="/admin/login">
    <img src="/robot.svg" alt="AI Logo" />
    <div class="brand">Assist Smart</div>
    <h2>Sign in to your account</h2>
    <input type="email" name="email" placeholder="Email" required autocomplete="username" />
    <input type="password" name="password" placeholder="Password" required autocomplete="current-password" />
    <button type="submit">Sign In</button>
    {{#if errorMessage}}
      <div class="error">{{ errorMessage }}</div>
    {{/if}}
    <div class="footer">Powered by <span>Assist Smart</span></div>
  </form>
</body>
</html>`;

const customLoginMiddleware = (req, res, next) => {
  if (req.method === "GET" && req.path === "/login") {
    let errorMessage = req.query.error ? "Invalid credentials" : "";
    res.send(
      aiLoginHtml
        .replace("{{#if errorMessage}}", errorMessage ? "" : "<!--")
        .replace("{{/if}}", errorMessage ? "" : "-->")
        .replace("{{ errorMessage }}", errorMessage)
    );
  } else {
    next();
  }
};

const adminUiRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    if (email === ADMIN.email && password === ADMIN.password) {
      return ADMIN;
    }
    return null;
  },
  cookieName: "adminjs",
  cookiePassword: process.env.ADMIN_COOKIE_SECRET || "supersecret",
  loginPath: "/admin/login",
  logoutPath: "/admin/logout",
  rootPath: "/admin",
  loginView: aiLoginHtml,
});

const adminApp = express.Router();
adminApp.use(customLoginMiddleware);
adminApp.use(adminUiRouter);

export { adminJs, adminApp as adminUiRouter };
