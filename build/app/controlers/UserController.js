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
const typeorm_1 = require("typeorm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const Crypto_1 = __importDefault(require("../crypto/Crypto"));
class UserController {
    signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = (0, typeorm_1.getRepository)(User_1.default);
            const { username, password } = req.body;
            if (!username || !password)
                return res.status(401).json({ message: "incorrect username or password" });
            const user = yield repository.findOne({ where: { 'username': Crypto_1.default.encrypt(username) } });
            if (!user)
                return res.status(401).json({ message: "incorrect username or password" });
            if (!(yield bcryptjs_1.default.compare(password, Crypto_1.default.decrypt(user.password))))
                return res.status(401).json({ message: "incorrect username or password" });
            const token = Crypto_1.default.encrypt(jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }));
            return res.json({ token });
        });
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = (0, typeorm_1.getRepository)(User_1.default);
            const { nickname, username, email, password } = req.body;
            if (yield repository.findOne({ where: [
                    { 'nickname': Crypto_1.default.encrypt(nickname) },
                    { 'username': Crypto_1.default.encrypt(username) },
                    { 'email': Crypto_1.default.encrypt(email) }
                ] }))
                return res.sendStatus(409);
            yield repository.save(repository.create({ nickname, username, email, password }));
            return res.sendStatus(200);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = (0, typeorm_1.getRepository)(User_1.default);
            const { id } = req;
            const user = yield repository.findOne({ where: { id } });
            if (!user)
                return res.sendStatus(409);
            repository.merge(user, req.body);
            yield repository.save(user);
            return res.sendStatus(200);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = (0, typeorm_1.getRepository)(User_1.default);
            const { id } = req;
            const user = yield repository.findOne({ where: { id } });
            if (!user)
                return res.sendStatus(402);
            yield repository.delete(user);
            return res.sendStatus(200);
        });
    }
}
exports.default = new UserController();
