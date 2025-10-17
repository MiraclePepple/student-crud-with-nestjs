import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
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

  async updateCourse(userId: number, course: string) {
    const student = await this.studentRepository.findOne({ where: { userId } });
    if (!student) throw new NotFoundException('Student not found');

    student.course = course;
    return this.studentRepository.save(student);
  }
}
