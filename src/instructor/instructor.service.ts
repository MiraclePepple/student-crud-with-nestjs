import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instructor } from './entities/instructor.entity';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(Instructor)
    private readonly instructorRepository: Repository<Instructor>,
    private readonly mailerService: MailerService,
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
    //Generate a random temporary password
    const tempPassword = crypto.randomBytes(6).toString('hex');

    //Hash the password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    //Create and save the instructor
    const instructor = this.instructorRepository.create({
      ...createInstructorDto,
      password: hashedPassword,
    });
    await this.instructorRepository.save(instructor);

    //Send email with temporary password
    try {
      await this.mailerService.sendMail({
        to: createInstructorDto.email,
        subject: 'Welcome to LMS – Your Temporary Password',
        text: `Hi ${createInstructorDto.fullName},
        Your instructor account has been created.
        Temporary password: ${tempPassword}
        Please log in and change your password immediately.
        Best,
        LMS Team`,
      });
    } catch (error) {
      console.error('Email sending failed:', error);
    }

    return { message: 'Instructor created successfully, email sent.' };
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

  async findOneByEmailWithPassword(email: string) {
    return this.instructorRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'fullName', 'specialization'],
    });
  }

}
