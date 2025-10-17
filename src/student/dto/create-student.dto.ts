import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateStudentDto {
    @IsString()
    @IsNotEmpty({message: 'First name is required!'})
    firstName: string;

    @IsString()
    @IsNotEmpty({message: 'Last name is required!'})
    lastName: string;

    @IsInt()
    @Min(18, {message: 'Age must be at least 18!'})
    @Max(100, {message: 'I know you are not that old. Age must be below 100!'})
    age: number;

    @IsEmail({}, {message: 'Invalid email address!'})
    email: string;

    @IsOptional()
    @IsString()
    course?: string;
}
