import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty()
    @IsEmail ({}, {message: 'Invalid email address!'} )
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}