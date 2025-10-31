import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @ApiBody({
  schema: {
    type: 'object',
    properties: {
      email: { type: 'string', example: 'instructor@example.com' },
    },
  },
  })
  async forgotPassword(@Body() body: { email: string }) {
    const { email } = body;
    if (!email) throw new BadRequestException('Email is required');
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiBody({
  schema: {
    type: 'object',
    properties: {
      token: { type: 'string', example: ' ' },
      newPassword: { type: 'string', example: 'newSecurePassword123' },
    },
  },
  })
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    const { token, newPassword } = body;
    if (!token || !newPassword)
      throw new BadRequestException('Token and new password are required');

    return this.authService.resetPassword(token, newPassword);
  }
}

