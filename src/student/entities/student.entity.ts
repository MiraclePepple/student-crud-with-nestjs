import { User } from 'src/auth/user.entity';
import { Course } from 'src/course/course.entity';
import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn, JoinTable, ManyToMany } from 'typeorm';

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

  @ManyToMany(() => Course, (course) => course.students, { eager: true })
  @JoinTable()
  courses: Course[];


  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
  