import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
    @IsEmail({}, {message: 'Invalid email address!'})
    email: string;

    @IsNotEmpty({message: 'Password is required!'})
    @MinLength(8, {message: 'Password must be at least 8 characters long!'})
    password: string;

    @IsNotEmpty({message: 'Confirm password is required!'})
    confirmPassword: string;
}