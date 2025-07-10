import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class InitialSchema1752115969999 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create Users Table
        await queryRunner.createTable(
            new Table({
                name: 'Users',
                columns: [
                    {
                        name: 'user_id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'username',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'password_hash',
                        type: 'varchar',
                        length: '256',
                        isNullable: false,
                    },
                    {
                        name: 'full_name',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'role',
                        type: 'enum',
                        enum: ['admin', 'user'],
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        isNullable: true,
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: true,
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Create Locations Table
        await queryRunner.createTable(
            new Table({
                name: 'Locations',
                columns: [
                    {
                        name: 'location_id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'branch_name',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'floor',
                        type: 'varchar',
                        length: '10',
                        isNullable: true,
                        default: null,
                    },
                    {
                        name: 'shelf',
                        type: 'varchar',
                        length: '10',
                        isNullable: true,
                        default: null,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                        default: null,
                    },
                ],
            }),
            true,
        );

        // Create Books Table
        await queryRunner.createTable(
            new Table({
                name: 'Books',
                columns: [
                    {
                        name: 'book_id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'isbn',
                        type: 'varchar',
                        length: '20',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'author',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'publisher',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                        default: null,
                    },
                    {
                        name: 'publish_year',
                        type: 'integer',
                        isNullable: true,
                        default: null,
                    },
                    {
                        name: 'category',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                        default: null,
                    },
                    {
                        name: 'copies_total',
                        type: 'int',
                        isNullable: false,
                        default: '1',
                    },
                    {
                        name: 'location_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        isNullable: true,
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: true,
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Add index to Books table
        await queryRunner.createIndex(
            'Books',
            new TableIndex({
                name: 'books_category_author_index',
                columnNames: ['category', 'author'],
            }),
        );

        // Create BookCopies Table
        await queryRunner.createTable(
            new Table({
                name: 'BookCopies',
                columns: [
                    {
                        name: 'copy_id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'book_id',
                        type: 'bigint',
                        isNullable: false,
                    },
                    {
                        name: 'barcode',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['available', 'loaned', 'lost', 'damaged'],
                        isNullable: false,
                        default: "'available'",
                    },
                    {
                        name: 'acquisition_date',
                        type: 'date',
                        isNullable: true,
                        default: null,
                    },
                ],
            }),
            true,
        );

        // Create Loans Table
        await queryRunner.createTable(
            new Table({
                name: 'Loans',
                columns: [
                    {
                        name: 'loan_id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'copy_id',
                        type: 'bigint',
                        isNullable: false,
                    },
                    {
                        name: 'user_id',
                        type: 'bigint',
                        isNullable: false,
                    },
                    {
                        name: 'loan_date',
                        type: 'timestamp',
                        isNullable: false,
                    },
                    {
                        name: 'due_date',
                        type: 'timestamp',
                        isNullable: false,
                    },
                    {
                        name: 'return_date',
                        type: 'timestamp',
                        isNullable: true,
                        default: null,
                    },
                    {
                        name: 'fine_amount',
                        type: 'decimal',
                        precision: 7,
                        scale: 2,
                        isNullable: true,
                        default: '0',
                    },
                ],
            }),
            true,
        );

        // Add indexes to Loans table
        await queryRunner.createIndex(
            'Loans',
            new TableIndex({
                name: 'loans_user_id_copy_id_loan_date_return_date_index',
                columnNames: ['user_id', 'copy_id', 'loan_date', 'return_date'],
            }),
        );
        await queryRunner.createIndex(
            'Loans',
            new TableIndex({
                name: 'loans_return_date_index',
                columnNames: ['return_date'],
            }),
        );

        // Add Foreign Key Constraints
        await queryRunner.createForeignKey(
            'Books',
            new TableForeignKey({
                columnNames: ['location_id'],
                referencedColumnNames: ['location_id'],
                onDelete: 'RESTRICT', // Or 'CASCADE' / 'SET NULL' based on your requirements
                onUpdate: 'CASCADE',
                name: 'FK_books_location_id', // Recommended to give a name
                referencedTableName: 'Locations',
            }),
        );

        await queryRunner.createForeignKey(
            'BookCopies',
            new TableForeignKey({
                columnNames: ['book_id'],
                referencedColumnNames: ['book_id'],
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
                name: 'FK_bookcopies_book_id',
                referencedTableName: 'Books',
            }),
        );

        await queryRunner.createForeignKey(
            'Loans',
            new TableForeignKey({
                columnNames: ['copy_id'],
                referencedColumnNames: ['copy_id'],
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
                name: 'FK_loans_copy_id',
                referencedTableName: 'BookCopies',
            }),
        );

        await queryRunner.createForeignKey(
            'Loans',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['user_id'],
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
                name: 'FK_loans_user_id',
                referencedTableName: 'Users',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop Foreign Key Constraints in reverse order of creation (or dependency)
        await queryRunner.dropForeignKey('Loans', 'FK_loans_user_id');
        await queryRunner.dropForeignKey('Loans', 'FK_loans_copy_id');
        await queryRunner.dropForeignKey('BookCopies', 'FK_bookcopies_book_id');
        await queryRunner.dropForeignKey('Books', 'FK_books_location_id');

        // Drop Indexes
        await queryRunner.dropIndex('Loans', 'loans_return_date_index');
        await queryRunner.dropIndex('Loans', 'loans_user_id_copy_id_loan_date_return_date_index');
        await queryRunner.dropIndex('Books', 'books_category_author_index');

        // Drop Tables in reverse order of creation (or dependency)
        await queryRunner.dropTable('Loans');
        await queryRunner.dropTable('BookCopies');
        await queryRunner.dropTable('Books');
        await queryRunner.dropTable('Locations');
        await queryRunner.dropTable('Users');
    }
}
