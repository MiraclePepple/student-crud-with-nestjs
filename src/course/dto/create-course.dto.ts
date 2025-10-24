import { IsString, IsNotEmpty, IsInt, Min, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;


  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  duration: number; // duration in weeks/hours

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  instructorId?: number;
  
}
