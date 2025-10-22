import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { InstructorService } from './instructor.service';

@Module({
  imports: [TypeOrmModule.forFeature([Instructor])],
  providers: [InstructorService],
  exports: [InstructorService],
})
export class InstructorModule {}
