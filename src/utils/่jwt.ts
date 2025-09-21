import jwt, { JwtPayload } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

interface CustomerPayload extends JwtPayload {
  orderNo: string;
  tableNo: string;
  role: "customer" | "admin";
}

// สร้าง Access Token (อายุสั้น) พร้อม role
export const generateAccessToken = (userId: string, role: string, name: string, surname: string, image: string) => {
  return jwt.sign({ userId, role, name, surname, image }, ACCESS_TOKEN_SECRET, {
    expiresIn: "6h",
  });
};

export const generateCustomerAccess = (
  orderNo: string,
  tableNo: string,
  role: "customer" = "customer"
) => {
  return jwt.sign(
    { orderNo, tableNo, role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "3h" } // customer token นานกว่า admin
  );
};

// สร้าง Refresh Token (อายุยาว)
export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

// ตรวจสอบ Access Token
export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

// ตรวจสอบ Refresh Token
export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}

export const getPayloadFromToken = (token: string): CustomerPayload | null => {
  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as CustomerPayload;
    return payload;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};