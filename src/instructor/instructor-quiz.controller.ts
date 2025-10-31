import { Controller, Post, Body, Param, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../auth/user.entity';
import { QuizService } from '../quiz/quiz.service';
import { CreateQuizDto } from '../quiz/dto/create-quiz.dto';
import { AddQuestionDto } from '../quiz/dto/add-question.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Instructor - Quizzes')
@ApiBearerAuth()
@Controller('instructor/quizzes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.INSTRUCTOR)
export class InstructorQuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new quiz (Instructor only)' })
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.createQuiz(createQuizDto);
  }

  @Post(':quizId/questions')
  @ApiOperation({ summary: 'Add a question to a quiz (Instructor only)' })
  @ApiParam({ name: 'quizId', type: Number })
  addQuestion(@Param('quizId') quizId: number, @Body() addQuestionDto: AddQuestionDto) {
    return this.quizService.addQuestion(quizId, addQuestionDto);
  }

  @Get()
  @ApiOperation({ summary: 'View all quizzes (Instructor only)' })
  findAll() {
    return this.quizService.findAll();
  }
}
