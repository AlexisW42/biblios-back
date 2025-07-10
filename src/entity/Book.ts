import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Index, Relation } from "typeorm";
import { Location } from "./Location";
import { BookCopy } from "./BookCopy";

@Entity({ name: 'Books' })
@Index("books_category_author_index", ["category", "author"])
export class Book {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    book_id!: number;

    @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
    isbn!: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    title!: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    author!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    publisher!: string | null;

    @Column({ type: 'integer', nullable: true })
    publish_year!: number | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    category!: string | null;

    @Column({ type: 'int', nullable: false, default: 1 })
    copies_total!: number;

    @ManyToOne(() => Location, location => location.books, { nullable: false })
    @JoinColumn({ name: 'location_id' })
    location!: Relation<Location>;

    @OneToMany(() => BookCopy, copy => copy.book)
    copies!: Relation<BookCopy[]>;

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at!: Date;
}