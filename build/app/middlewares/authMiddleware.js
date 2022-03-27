"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Crypto_1 = __importDefault(require("../crypto/Crypto"));
function authMiddleware(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization)
        return res.status(401).json({ message: "incorrect username or password" });
    const token = authorization.replace('Bearer', '').trim();
    try {
        const data = jsonwebtoken_1.default.verify(Crypto_1.default.decrypt(token), process.env.JWT_SECRET);
        req.id = data.id;
        next();
    }
    catch (_a) {
        return res.status(401).json({ message: "incorrect username or password" });
    }
}
exports.default = authMiddleware;
