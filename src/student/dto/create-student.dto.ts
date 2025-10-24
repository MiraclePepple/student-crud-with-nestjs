import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty({message: 'First name is required!'})
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message: 'Last name is required!'})
    lastName: string;

    @ApiProperty()
    @IsInt()
    @Min(18, {message: 'Age must be at least 18!'})
    @Max(100, {message: 'I know you are not that old. Age must be below 100!'})
    age: number;

    @ApiProperty()
    @IsEmail({}, {message: 'Invalid email address!'})
    email: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    course?: string;
}
