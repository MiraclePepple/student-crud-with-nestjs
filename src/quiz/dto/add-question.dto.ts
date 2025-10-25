import { ApiProperty } from '@nestjs/swagger';

export class AddQuestionDto {
  @ApiProperty()
  text: string;

  @ApiProperty({ type: [String] })
  options: string[];

  @ApiProperty()
  correctAnswer: string;
}
