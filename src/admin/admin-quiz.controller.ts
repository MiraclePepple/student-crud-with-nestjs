import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin - Quizzes')
@Controller('admin/quizzes')
export class AdminQuizController {}
