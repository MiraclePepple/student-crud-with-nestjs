import { Student } from 'src/student/entities/student.entity';
import { Entity, Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  duration: number;

  @ManyToMany(() => Student, (student) => student.courses)
  students: Student[];

}
