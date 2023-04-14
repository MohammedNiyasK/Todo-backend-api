import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //const { token } = req.cookies;

  const token = req.headers.authorization

  if (!token) {
    res.status(403).json({
      message: "token required",
    });
    return;
  }

  try {
    const decode = jwt.verify(token, process.env.TOKEN_SECRET!);
    (req as any).user  = decode
    console.log('decode',(decode as any).id);
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid Token" });
  }
  return next();
};
