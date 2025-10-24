import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
    @ApiProperty()
    @IsEmail({}, {message: 'Invalid email address!'})
    email: string;

    @ApiProperty()
    @IsNotEmpty({message: 'Password is required!'})
    @MinLength(8, {message: 'Password must be at least 8 characters long!'})
    password: string;

    @ApiProperty()
    @IsNotEmpty({message: 'Confirm password is required!'})
    confirmPassword: string;

    @ApiProperty()
    @IsNotEmpty({message: 'First name is required!'})
    firstName: string;

    @ApiProperty()
    @IsNotEmpty({message: 'Last name is required!'})
    lastName: string;
}