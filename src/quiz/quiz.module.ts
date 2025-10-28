import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Question } from './entities/question.entity';
import { StudentQuiz } from './entities/student-quiz.entity';
import { QuizService } from './quiz.service';
import { AdminQuizController } from '../admin/admin-quiz.controller';
import { InstructorQuizController } from '../instructor/instructor-quiz.controller';
import { StudentQuizController } from '../student/student-quiz.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Question, StudentQuiz])],
  providers: [QuizService],
  controllers: [
    AdminQuizController,
    InstructorQuizController,
    StudentQuizController,
  ],
  exports: [QuizService],
})
export class QuizModule {}
