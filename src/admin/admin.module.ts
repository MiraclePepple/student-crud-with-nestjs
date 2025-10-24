import { Module } from '@nestjs/common';
import { StudentModule } from '../student/student.module';
import { AdminStudentController } from './admin-student.controller';
import { AdminCourseController } from './admin-course.controller';
import { CourseModule } from '../course/course.module';
import { InstructorModule } from 'src/instructor/instructor.module';
import { AdminInstructorController } from './admin-instructor.controller';

@Module({
  imports: [StudentModule, CourseModule, InstructorModule,], // gain access to CourseService and StudentService
  controllers: [AdminStudentController, AdminCourseController, AdminInstructorController],
})
export class AdminModule {}
