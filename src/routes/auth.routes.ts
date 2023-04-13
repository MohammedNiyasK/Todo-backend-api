import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyToken } from "../middleware/verifyToken";
dotenv.config();
verifyToken

const secret = process.env.TOKEN_SECRET!;

interface Register {
  userName: string;
  phone: number;
  password: string;
  id?: ObjectId;
}

interface Login {
  userName: string;
  password: string;
  id?: ObjectId;
}

// Register new user

export const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
    let { userName, password, phone } = req.body as Register;

    const hashPwd = bcrypt.hashSync(password, 10);

    const response = await collections.register?.findOne({ userName });
    console.log(response);

    if (!response) {
      const result = await collections.register?.insertOne({
        userName,
        hashPwd,
        phone,
      });

      result
        ? res.status(201).send(`succesfully created ${userName}`)
        : res.status(500).send("Failed to create");
    } else {
      res.status(409).send("Already exists go to login");
    }
  } catch (error: any) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { userName, password } = req.body as Login;

  if (!(userName && password)) {
    res.status(400).json({
      message: "fill the details",
    });
  }

  try {
    const user = await collections.register?.findOne({ userName });
    if (user && (await bcrypt.compare(password, user?.hashPwd))) {
      const token = jwt.sign(
        {
          id: user._id,
          userName
        },
        secret,
        { expiresIn: "1h" }
      );

      user.phone = undefined;
      user.token = token;

      //cookie

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res
        .status(200)
        .cookie("token", token, options)
        .json({ success: true, token,user:userName });

        console.log(req.cookies)
    } else {
      res.status(404).json({ message: "No user found" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(400).send(error.message);
  }
});


 