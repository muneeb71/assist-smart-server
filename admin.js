import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSPrisma from "@adminjs/prisma";
import { getModelsToDisplay } from "./lib/adminJsModels.js";

AdminJS.registerAdapter({
  Database: AdminJSPrisma.Database,
  Resource: AdminJSPrisma.Resource,
});

const adminJs = new AdminJS({
  rootPath: "/admin-panel",
  branding: {
    companyName: "Smarthse",
    logo: false,
    softwareBrothers: false,
  },
  resources: getModelsToDisplay()
});

const ADMIN = {
  email: process.env.ADMIN_EMAIL || "admin@example.com",
  password: process.env.ADMIN_PASSWORD || "securepassword",
};

// const adminUiRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
//   authenticate: async (email, password) => {
//     if (email === ADMIN.email && password === ADMIN.password) {
//       return ADMIN;
//     }
//     return null;
//   },
//   cookieName: "adminjs",
//   cookiePassword: process.env.ADMIN_COOKIE_SECRET || "supersecret",
// });

const adminUiRouter = AdminJSExpress.buildRouter(adminJs);

export { adminJs, adminUiRouter };
