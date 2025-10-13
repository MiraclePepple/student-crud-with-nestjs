import { Injectable, Search } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
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
      query.where('student.firstName LIKE :search OR student.lastName LIKE :search OR student.email LIKE :search', 
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
    return this.studentRepository.update(id, updateStudentDto);
  }

  remove(id: number) {
    return this.studentRepository.delete(id);
  }
}
