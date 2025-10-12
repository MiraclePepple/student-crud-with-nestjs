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

  create(createStudentDto: CreateStudentDto) {
    const student = this.studentRepository.create(createStudentDto);
    return this.studentRepository.save(student);
  }

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

  findOne(id: number) {
    return this.studentRepository.findOneBy({ id });
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return this.studentRepository.update(id, updateStudentDto);
  }

  remove(id: number) {
    return this.studentRepository.delete(id);
  }
}
