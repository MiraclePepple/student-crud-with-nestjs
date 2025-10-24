import { IsString, IsNotEmpty, IsInt, Min, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  duration: number; // duration in weeks/hours

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  instructorId?: number;
  
}
