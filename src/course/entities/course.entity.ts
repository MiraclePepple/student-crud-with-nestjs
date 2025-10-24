import { Student } from 'src/student/entities/student.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Entity, Column, ManyToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

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
  
  @ManyToOne(() => Instructor, (instructor) => instructor.courses, { nullable: true, onDelete: 'SET NULL' })
  instructor: Instructor;


}
