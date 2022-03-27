"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("./app/middlewares/authMiddleware"));
const UserController_1 = __importDefault(require("./app/controlers/UserController"));
const router = (0, express_1.Router)();
router.get('/signIn', UserController_1.default.signIn);
router.post('/signUp', UserController_1.default.signUp);
router.put('/update', authMiddleware_1.default, UserController_1.default.update);
router.delete('/delete', authMiddleware_1.default, UserController_1.default.delete);
exports.default = router;
