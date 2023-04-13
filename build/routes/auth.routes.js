"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_service_1 = require("../services/database.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const verifyToken_1 = require("../middleware/verifyToken");
dotenv_1.default.config();
verifyToken_1.verifyToken;
const secret = process.env.TOKEN_SECRET;
// Register new user
exports.authRouter = express_1.default.Router();
exports.authRouter.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let { userName, password, phone } = req.body;
        const hashPwd = bcrypt_1.default.hashSync(password, 10);
        const response = yield ((_a = database_service_1.collections.register) === null || _a === void 0 ? void 0 : _a.findOne({ userName }));
        console.log(response);
        if (!response) {
            const result = yield ((_b = database_service_1.collections.register) === null || _b === void 0 ? void 0 : _b.insertOne({
                userName,
                hashPwd,
                phone,
            }));
            result
                ? res.status(201).send(`succesfully created ${userName}`)
                : res.status(500).send("Failed to create");
        }
        else {
            res.status(409).send("Already exists go to login");
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
}));
exports.authRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { userName, password } = req.body;
    if (!(userName && password)) {
        res.status(400).json({
            message: "fill the details",
        });
    }
    try {
        const user = yield ((_c = database_service_1.collections.register) === null || _c === void 0 ? void 0 : _c.findOne({ userName }));
        if (user && (yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.hashPwd))) {
            const token = jsonwebtoken_1.default.sign({
                id: user._id,
                userName
            }, secret, { expiresIn: "1h" });
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
                .json({ success: true, token });
            console.log(req.cookies);
        }
        else {
            res.status(404).json({ message: "No user found" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
}));
