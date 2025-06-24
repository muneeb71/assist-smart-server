import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
export const generateToken = (profile) => {
  return jwt.sign(
    { userId: profile.User.id, role: profile.User.role.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};
