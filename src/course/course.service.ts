import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { Instructor } from '../instructor/entities/instructor.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Instructor)
    private readonly instructorRepository: Repository<Instructor>,
  ) {}

  async findAll() {
    return this.courseRepository.find({ relations: ['students', 'instructor'] });
  }

  async findOne(id: number) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['students', 'instructor'],
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async create(createCourseDto: CreateCourseDto) {
    const { instructorId, ...rest } = createCourseDto;
    const course = this.courseRepository.create(rest);

    if (instructorId) {
      const instructor = await this.instructorRepository.findOne({ where: { id: instructorId } });
      if (!instructor) throw new NotFoundException('Instructor not found');
      course.instructor = instructor;
    }

    return this.courseRepository.save(course);
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const { instructorId, ...rest } = updateCourseDto;
    const course = await this.findOne(id);

    Object.assign(course, rest);

    if (instructorId) {
      const instructor = await this.instructorRepository.findOne({ where: { id: instructorId } });
      if (!instructor) throw new NotFoundException('Instructor not found');
      course.instructor = instructor;
    }

    return this.courseRepository.save(course);
  }

  async remove(id: number) {
    const course = await this.findOne(id);
    return this.courseRepository.remove(course);
  }
}
