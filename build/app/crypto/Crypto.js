"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
class Crypto {
    encrypt(data) {
        const cipher = (0, crypto_1.createCipheriv)(process.env.ALGORITHM, process.env.KEY, process.env.IV);
        return ((cipher.update(data, 'utf-8', 'base64').concat(cipher.final('base64'))).replace('==', '').replace('=', ''));
    }
    decrypt(data) {
        const cipher = (0, crypto_1.createDecipheriv)(process.env.ALGORITHM, process.env.KEY, process.env.IV);
        return (cipher.update(data, 'base64', 'utf-8').concat(cipher.final('utf-8')));
    }
}
exports.default = new Crypto();
