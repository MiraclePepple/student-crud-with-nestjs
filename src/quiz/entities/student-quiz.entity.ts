import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Quiz } from './quiz.entity';
import { Student } from '../../student/entities/student.entity';

@Entity()
export class StudentQuiz {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Quiz, { eager: true, onDelete: 'CASCADE' })
  quiz: Quiz;

  @ManyToOne(() => Student, { eager: true, onDelete: 'CASCADE' })
  student: Student;

  @Column({ type: 'float', default: 0 })
  score: number;

  @Column({ default: false })
  isCompleted: boolean;
}
