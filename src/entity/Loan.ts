import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, Relation } from "typeorm";
import { BookCopy } from "./BookCopy";
import { User } from "./User";

@Entity({ name: 'Loans' })
@Index("loans_user_id_copy_id_loan_date_return_date_index", ["user", "copy", "loan_date", "return_date"])
@Index("loans_return_date_index", ["return_date"])
export class Loan {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    loan_id!: number;

    @ManyToOne(() => BookCopy, copy => copy.loans, { nullable: false })
    @JoinColumn({ name: 'copy_id' })
    copy!: Relation<BookCopy>;

    @ManyToOne(() => User, user => user.loans, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user!: Relation<User>;

    @Column({ type: 'timestamp', nullable: false })
    loan_date!: Date;

    @Column({ type: 'timestamp', nullable: false })
    due_date!: Date;

    @Column({ type: 'timestamp', nullable: true })
    return_date!: Date | null;

    @Column({ type: 'decimal', precision: 7, scale: 2, nullable: true, default: 0 })
    fine_amount!: number | null;
}