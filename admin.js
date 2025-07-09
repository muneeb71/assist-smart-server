import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSPrisma, { Database, Resource } from "@adminjs/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

AdminJS.registerAdapter({
  Database,
  Resource,
});

const adminJs = new AdminJS({
  databases: [prisma],
  rootPath: "/admin-panel",
  branding: {
    companyName: "Smarthse",
    logo: false,
    softwareBrothers: false,
  },
});

const ADMIN = {
  email: process.env.ADMIN_EMAIL || "admin@example.com",
  password: process.env.ADMIN_PASSWORD || "securepassword",
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
});

export { adminJs, adminUiRouter };
