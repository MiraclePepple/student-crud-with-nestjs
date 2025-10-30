import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Course } from 'src/course/entities/course.entity';

@Entity()
export class Instructor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  specialization: string;

  @Column({ nullable: true, select: false })
  password: string;

  @OneToMany(() => Course, (course) => course.instructor)
  courses: Course[];
}
