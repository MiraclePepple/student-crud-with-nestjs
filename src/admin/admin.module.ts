import { Module } from '@nestjs/common';
import { StudentModule } from '../student/student.module';
import { AdminStudentController } from './admin-student.controller';

@Module({
  imports: [StudentModule], //gain access to StudentService
  controllers: [AdminStudentController], //admin routes only
})
export class AdminModule {}

