import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course } from './entities/course.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Instructor])],
  providers: [CourseService],
  controllers: [CourseController],
  exports: [CourseService], 
})
export class CourseModule {}
