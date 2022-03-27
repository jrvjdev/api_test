import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import CryptoData from '../crypto/Crypto';

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {

	const { authorization } = req.headers;

	if(!authorization)
        return res.status(401).json({ message: "incorrect username or password" });

	const token = authorization.replace('Bearer', '').trim();

	try {
		const data = jwt.verify(CryptoData.decrypt(token), process.env.JWT_SECRET as string);
		req.id =  (data as TokenPayload).id;
		next();
	} catch {
		return res.status(401).json({ message: "incorrect username or password" });
	}
}
