import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Course } from '../course/entities/course.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  
  async findAll(page = 1, limit = 10, search = '') {
    const skip = (page - 1)*limit;
    const query = this.studentRepository
      .createQueryBuilder('student')
      .skip(skip)
      .take(limit);
    if (search) {
      query.where('student.firstName LIKE :search OR student.lastName LIKE :search', 
        { search: `%${search}%` }
      );
        
    }
    const [data, total] = await query.getManyAndCount();
    return { data, total, page, lastPage: Math.ceil(total/limit) };
   
  }

  async findOneByUserId(userId: number) {
  return this.studentRepository.findOne({
    where: { user: { id: userId } },
    relations: ['user'],
  });
 }

  async findOne(userId: number) {
  return this.studentRepository.findOne({
    where: { userId },
    relations: ['user'],
  });
 }


  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentRepository.findOne({ where: { userId: id } });
    if (!student) return null;

    Object.assign(student, updateStudentDto);
    return this.studentRepository.save(student);
 }


  remove(id: number) {
    return this.studentRepository.delete(id);
  }
  

  async updateProfilePicture(userId: number, filePath: string) {
    const student = await this.studentRepository.findOne({ where: { userId } });
    if (!student) throw new NotFoundException('Student not found');

    student.profilePicture = filePath;
    return this.studentRepository.save(student);
  }

  
  async getAllCourses() {
    return this.courseRepository.find();
  }

 //Get student's registered course
  async getStudentCourse(userId: number) {
    const student = await this.studentRepository.findOne({
      where: { userId },
      relations: ['courses'],
    });
    if (!student) throw new NotFoundException('Student not found');
    return student.courses;
  }

  //Register (enroll) a course
  async registerCourse(userId: number, courseId: number) {
    const student = await this.studentRepository.findOne({
      where: { userId },
      relations: ['courses'],
    });
    if (!student) throw new NotFoundException('Student not found');

    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');

    // check if already registered
    const alreadyRegistered = student.courses.some((c) => c.id === course.id);
    if (alreadyRegistered) {
      throw new BadRequestException('Already registered for this course');
    }

    student.courses.push(course);
    await this.studentRepository.save(student);
    return {
      message: `Successfully registered for ${course.title}`,
      student,
    };
  }

  async unregisterCourse(userId: number, courseId: number) {
    const student = await this.studentRepository.findOne({
      where: { userId },
      relations: ['courses'],
    });
    if (!student) throw new NotFoundException('Student not found');

    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    student.courses = student.courses.filter((c) => c.id !== courseId);
    await this.studentRepository.save(student);
    return {
      message: `Successfully unregistered from ${course.title}`,
      student,
    };
  }


}
