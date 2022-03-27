import { createCipheriv, createDecipheriv } from 'crypto';

class Crypto {
	encrypt(data: string): string {
		const cipher = createCipheriv(process.env.ALGORITHM as string, process.env.KEY as string, process.env.IV as string);
		return ((cipher.update(data, 'utf-8', 'base64').concat(cipher.final('base64'))).replace('==', '').replace('=', ''));
	}
	decrypt(data: string): string  {
		const cipher = createDecipheriv(process.env.ALGORITHM as string, process.env.KEY as string, process.env.IV as string);
		return (cipher.update(data, 'base64', 'utf-8').concat(cipher.final('utf-8')));
	}
}

export default new Crypto();
