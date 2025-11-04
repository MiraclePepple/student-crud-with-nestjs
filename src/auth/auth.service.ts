import { Injectable, UnauthorizedException, ConflictException, OnModuleInit, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from './user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Student } from 'src/student/entities/student.entity';
import { ConfigService } from '@nestjs/config';
import { Instructor } from 'src/instructor/entities/instructor.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
  @InjectRepository(User) private userRepo: Repository<User>,
  @InjectRepository(Student) private studentRepo: Repository<Student>,
  @InjectRepository(Instructor) private instructorRepo: Repository<Instructor>,
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

  //Try finding in User table first
  let user = await this.userRepo.findOne({ where: { email }, select: ['id', 'email', 'password', 'role'] });

  //If not found, try Instructor table
  if (!user) {
    const instructor = await this.instructorRepo.findOne({ where: { email }, select: ['id', 'email', 'password', 'fullName'] });
    if (instructor) {
      const isMatch = await bcrypt.compare(password, instructor.password);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');
      const payload = { id: instructor.id, email: instructor.email, role: 'instructor' };
      const accessToken = this.jwtService.sign(payload);
      return { id: instructor.id, accessToken, email: instructor.email, role: 'instructor' };
    }
  }
  if (!user) throw new UnauthorizedException('Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new UnauthorizedException('Invalid email or password');

  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = this.jwtService.sign(payload);
  return { id: user.id, accessToken, email: user.email, role: user.role };
  }

  async forgotPassword(email: string) {
    // Try to find the user or instructor
    const user =
      (await this.userRepo.findOne({ where: { email } })) ||
      (await this.instructorRepo.findOne({ where: { email } }));

    if (!user) throw new BadRequestException('No account found with that email');

    // Generate a short-lived reset token (15 minutes)
    const token = this.jwtService.sign(
      { email },
      { secret: this.configService.get('JWT_SECRET'), expiresIn: '15m' },
    );

    // In real app,send via email
    console.log(`Password reset link: http://localhost:3000/auth/reset-password?token=${token}`);


    return { message: 'Password reset link sent (check console for now)' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      const { email } = decoded;
      const hashed = await bcrypt.hash(newPassword, 10);

      // Update in User or Instructor table
      const user =
        (await this.userRepo.findOne({ where: { email } })) ||
        (await this.instructorRepo.findOne({ where: { email } }));

      if (!user) throw new BadRequestException('Invalid or expired token');

      user.password = hashed;
      await (user instanceof User
        ? this.userRepo.save(user)
        : this.instructorRepo.save(user));

      return { message: 'Password updated successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
