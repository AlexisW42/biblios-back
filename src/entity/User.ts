import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Relation } from "typeorm";
import { Loan } from "./Loan";

@Entity({ name: 'Users' })
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    user_id!: number;

    @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
    username!: string;

    @Column({ type: 'varchar', length: 256, nullable: false, select: false })
    password_hash!: string;

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

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at!: Date;

    @OneToMany(() => Loan, loan => loan.user)
    loans!: Relation<Loan[]>;
}