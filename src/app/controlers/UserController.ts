import { Request, Response}		from	'express';
import { getRepository } 		from 	'typeorm';

import bcrypt 					from 	'bcryptjs';
import jwt 						from 	'jsonwebtoken';

import User 					from 	'../models/User';
import Crypto 				from 	'../crypto/Crypto';

class UserController {
	async signIn(req: Request, res: Response) {

		const repository = getRepository(User);
		const { username, password } = req.body;

		if(!username || !password)
			return res.status(401).json({message: "incorrect username or password"});

		const user = await repository.findOne({ where: {'username': Crypto.encrypt(username)} });
		if (!user)
			return res.status(401).json({ message: "incorrect username or password" });
		if(!await bcrypt.compare(password, Crypto.decrypt(user.password)))
			return res.status(401).json({ message: "incorrect username or password" });
        const token = Crypto.encrypt(
            jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN as string })
        );
		return res.json({ token });
	}
	async signUp(req: Request, res: Response) {
		const repository = getRepository(User);
		const { nickname, username, email, password } = req.body;

		if (await repository.findOne({where:[
            {'nickname': Crypto.encrypt(nickname)},
            {'username': Crypto.encrypt(username)},
            {'email': Crypto.encrypt(email)}
        ]}))
			return res.sendStatus(409);
		await repository.save(repository.create({ nickname, username, email, password }));
		return res.sendStatus(200);
	}
	async update(req: Request, res: Response) {
		const repository = getRepository(User);
		const { id } = req;
		const user = await repository.findOne({ where: { id } });

		if (!user)
			return res.sendStatus(409);
		repository.merge(user, req.body);
		await repository.save(user);
		return res.sendStatus(200);
	}
	async delete(req: Request, res: Response) {
		const repository = getRepository(User);
		const { id } = req;
		const user = await repository.findOne({ where: { id } });

		if (!user)
			return res.sendStatus(402);

		await repository.delete(user);
		return res.sendStatus(200);
	}
}

export default new UserController();
