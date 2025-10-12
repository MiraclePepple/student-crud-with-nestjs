import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsEmail ({}, {message: 'Invalid email address!'} )
    email: string;

    @IsNotEmpty()
    password: string;
}