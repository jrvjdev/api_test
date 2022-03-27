import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, JoinColumn} from 'typeorm';
import bcrypt from 'bcryptjs';
import Crypto from '../crypto/Crypto';

@Entity('users')
class User {

	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	username: string;

	@Column()
	nickname: string;

	@Column()
	email: string;

	@Column()
	password: string;

    @BeforeInsert()
    @BeforeUpdate()
    encrypto() {
        this.username = Crypto.encrypt(this.username);
        this.nickname = Crypto.encrypt(this.nickname);
        this.email = Crypto.encrypt(this.email);
        this.password = Crypto.encrypt(bcrypt.hashSync(this.password, 8));
    }
}

export default User;
