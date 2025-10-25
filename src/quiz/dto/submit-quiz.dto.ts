import { ApiProperty } from '@nestjs/swagger';

export class SubmitQuizDto {
  @ApiProperty({
    example: [
      { questionId: 1, answer: 'A' },
      { questionId: 2, answer: 'C' },
    ],
  })
  answers: { questionId: number; answer: string }[];
}
