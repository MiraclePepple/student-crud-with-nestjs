import { Injectable, UnauthorizedException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from './user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Student } from 'src/student/entities/student.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
  @InjectRepository(User) private userRepo: Repository<User>,
  @InjectRepository(Student) private studentRepo: Repository<Student>,
  private jwtService: JwtService,
  private configService: ConfigService,
 ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
      console.warn('ADMIN_EMAIL or ADMIN_PASSWORD not found in .env file');
      return;
    }

    const existingAdmin = await this.userRepo.findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const newAdmin = this.userRepo.create({
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
      });

      await this.userRepo.save(newAdmin);
      console.log(`Default admin created: ${adminEmail}`);
    } else {
      console.log(`Admin already exists: ${adminEmail}`);
    }
  }

  
  async signup(signupDto: SignupDto) {
    const { email, password, firstName, lastName } = signupDto;
    const existingUser = await this.userRepo.findOne({ where: { email }});
    if (existingUser) {
        throw new ConflictException('Email already registered!');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({
        email, 
        password: hashedPassword,
        role: UserRole.USER});
    await this.userRepo.save(user);

    const student = this.studentRepo.create({
        firstName,
        lastName,
        user,
    }); 
    
    await this.studentRepo.save(student);

    return { message: 'Signup successful!' };
  }

    async login(loginDto: LoginDto): Promise<{ id: number, accessToken: string, email: string; role: string }> {
        const { email, password } = loginDto;
        const user = await this.userRepo.findOne({ where: { email }});
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const payload = { id: user.id,email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        return {
            id: user.id,
            accessToken,
            email: user.email,
            role: user.role,
         };
    }
}