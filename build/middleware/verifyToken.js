"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyToken = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        res.status(403).json({
            message: "token required",
        });
        return;
    }
    try {
        const decode = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        req.user = decode;
        console.log('decode', decode.id);
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Invalid Token" });
    }
    return next();
};
exports.verifyToken = verifyToken;
