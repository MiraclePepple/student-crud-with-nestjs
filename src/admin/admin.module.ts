import { Module } from '@nestjs/common';
import { StudentModule } from '../student/student.module';
import { AdminStudentController } from './admin-student.controller';
import { AdminCourseController } from './admin-course.controller';
import { CourseService } from '../course/course.service';

@Module({
  imports: [StudentModule], //gain access to StudentService
  controllers: [AdminStudentController, AdminCourseController], //admin routes only
  providers: [CourseService],
})
export class AdminModule {}

