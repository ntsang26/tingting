import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevent XSS attacks cross-site scripting attack
    sameSite: "Strict", // prevent CSRF attacks
    secure: process.env.NODE_ENV !== "development", // enable HTTPS only in production
  });

  return token;
};
