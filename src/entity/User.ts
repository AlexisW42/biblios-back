import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Relation, BeforeInsert } from "typeorm";
import { Loan } from "./Loan";
import bcrypt from 'bcryptjs';

@Entity({ name: 'Users' })
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    user_id!: number;

    @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
    username!: string;

    @Column({ type: 'varchar', length: 256, nullable: false, select: false, name: 'password_hash' })
    password_hash!: string;

    password!: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    full_name!: string;

    @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
    email!: string;

    @Column({
        type: 'enum',
        enum: ['admin', 'user'],
        nullable: false,
    })
    role!: 'admin' | 'user';

    @BeforeInsert()
    async hashPassword() {
        // Si se proporcionó una contraseña en la propiedad virtual...
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            // ...la hasheamos y la guardamos en la propiedad que va a la base de datos.
            this.password_hash = await bcrypt.hash(this.password, salt);
        }
    }

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at!: Date;

    @OneToMany(() => Loan, loan => loan.user)
    loans!: Relation<Loan[]>;
}