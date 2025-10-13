import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student } from './entities/student.entity';
import { User } from 'src/auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, User])],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [TypeOrmModule],
})
export class StudentModule {}
