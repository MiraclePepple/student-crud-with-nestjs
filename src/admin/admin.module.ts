import { Module } from '@nestjs/common';
import { StudentModule } from '../student/student.module';
import { AdminStudentController } from './admin-student.controller';
import { AdminCourseController } from './admin-course.controller';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [StudentModule, CourseModule], // gain access to CourseService and StudentService
  controllers: [AdminStudentController, AdminCourseController],
})
export class AdminModule {}
