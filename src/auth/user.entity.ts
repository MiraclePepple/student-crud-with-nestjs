import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    //STUDENT = "STUDENT",
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;
}