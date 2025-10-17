import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student } from './entities/student.entity';
import { User } from 'src/auth/user.entity';
import { Course } from 'src/course/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, User, Course])],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [TypeOrmModule],
})
export class StudentModule {}
