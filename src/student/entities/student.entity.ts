import { User } from 'src/auth/user.entity';
import { Course } from 'src/course/course.entity';
import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn, ManyToOne } from 'typeorm';

@Entity()
export class Student {
  // Use the user's ID as the student ID
  @PrimaryColumn()
  userId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  age: number;

 @Column({ nullable: true })
  course?: string;

  @Column({ nullable: true })
  profilePicture?: string;


  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
