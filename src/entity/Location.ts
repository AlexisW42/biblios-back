import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation } from "typeorm";
import { Book } from "./Book";

@Entity({ name: 'Locations' })
export class Location {
    @PrimaryGeneratedColumn({ type: 'int' })
    location_id!: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    branch_name!: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    floor!: string | null;

    @Column({ type: 'varchar', length: 10, nullable: true })
    shelf!: string | null;

    @Column({ type: 'text', nullable: true })
    description!: string | null;

    @OneToMany(() => Book, book => book.location)
    books!: Relation<Book[]>;
}