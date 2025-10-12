import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from './user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor (
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwtService: JwtService
    )
    {}

    async signup(signupDto: SignupDto): Promise<{ message: string }> {
        const { email, password } = signupDto;
        const existingUser = await this.userRepo.findOne({ where: { email }});
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepo.create({
             email, 
             password: hashedPassword, 
            role: UserRole.USER});
        await this.userRepo.save(user);
        return { message: 'User registered successfully' };
    }

    async login(loginDto: LoginDto): Promise<{ accessToken: string, email: string; role: string }> {
        const { email, password } = loginDto;
        const user = await this.userRepo.findOne({ where: { email }});
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const payload = { email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken,
            email: user.email,
            role: user.role,
         };
    }



}