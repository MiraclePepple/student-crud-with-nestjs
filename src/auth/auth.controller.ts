import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InstructorService } from '../instructor/instructor.service';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly instructorService: InstructorService,
    private readonly jwtService: JwtService,
  ) {}

  //Student signup/login handled by AuthService
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  //Instructor login route
  @Post('instructor/login')
  async instructorLogin(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    // Find instructor and include password (since we hid it with select: false)
    const instructor = await this.instructorService.findOneByEmailWithPassword(email);
    if (!instructor) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, instructor.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: instructor.id, role: 'instructor', email: instructor.email };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
