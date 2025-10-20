import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async findAll() {
    return this.courseRepository.find({ relations: ['students'] });
  }

  async findOne(id: number) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['students'],
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async create(createCourseDto: { title: string; description: string; duration: number }) {
    const course = this.courseRepository.create(createCourseDto);
    return this.courseRepository.save(course);
  }

  async update(
    id: number,
    updateCourseDto: { title?: string; description?: string; duration?: number },
  ) {
    const course = await this.findOne(id);
    Object.assign(course, updateCourseDto);
    return this.courseRepository.save(course);
  }

  async remove(id: number) {
    const course = await this.findOne(id);
    return this.courseRepository.remove(course);
  }
}
