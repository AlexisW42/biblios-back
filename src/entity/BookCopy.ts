import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Relation } from "typeorm";
import { Book } from "./Book";
import { Loan } from "./Loan";

@Entity({ name: 'BookCopies' })
export class BookCopy {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    copy_id!: number;

    @ManyToOne(() => Book, book => book.copies, { nullable: false })
    @JoinColumn({ name: 'book_id' })
    book!: Relation<Book>;

    @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
    barcode!: string;

    @Column({
        type: 'enum',
        enum: ['available', 'loaned', 'lost', 'damaged'],
        default: 'available',
        nullable: false
    })
    status!: 'available' | 'loaned' | 'lost' | 'damaged';

    @Column({ type: 'date', nullable: true })
    acquisition_date!: Date | null;

    @OneToMany(() => Loan, loan => loan.copy)
    loans!: Relation<Loan[]>;
}