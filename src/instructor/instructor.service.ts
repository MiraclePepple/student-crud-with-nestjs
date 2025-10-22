import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instructor } from './entities/instructor.entity';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(Instructor)
    private readonly instructorRepository: Repository<Instructor>,
  ) {}

  async findAll() {
    return this.instructorRepository.find({ relations: ['courses'] });
  }

  async findOne(id: number) {
    const instructor = await this.instructorRepository.findOne({
      where: { id },
      relations: ['courses'],
    });
    if (!instructor) throw new NotFoundException('Instructor not found');
    return instructor;
  }

  async create(createInstructorDto: CreateInstructorDto) {
    const instructor = this.instructorRepository.create(createInstructorDto);
    return this.instructorRepository.save(instructor);
  }

  async update(id: number, updateInstructorDto: UpdateInstructorDto) {
    const instructor = await this.findOne(id);
    Object.assign(instructor, updateInstructorDto);
    return this.instructorRepository.save(instructor);
  }

  async remove(id: number) {
    const instructor = await this.findOne(id);
    return this.instructorRepository.remove(instructor);
  }
}
