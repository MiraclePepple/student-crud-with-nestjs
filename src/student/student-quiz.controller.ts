import { Controller, Post, Body, Param, UseGuards, Get, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../auth/user.entity';
import { QuizService } from '../quiz/quiz.service';
import { SubmitQuizDto } from '../quiz/dto/submit-quiz.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Student - Quizzes')
@ApiBearerAuth()
@Controller('student/quizzes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
export class StudentQuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post(':quizId/submit')
  @ApiOperation({ summary: 'Submit answers for a quiz' })
  @ApiParam({ name: 'quizId', type: Number })
  async submit(
    @Param('quizId') quizId: number,
    @Body() submitQuizDto: SubmitQuizDto,
    @Req() req: any,
  ) {
    const studentId = req.user.id; //from JWT
    return this.quizService.gradeQuiz(quizId, studentId, submitQuizDto);
  }

  @Get(':quizId/result')
  @ApiOperation({ summary: 'View result for a quiz' })
  @ApiParam({ name: 'quizId', type: Number })
  async getResult(@Param('quizId') quizId: number, @Req() req: any) {
    const studentId = req.user.id;
    return this.quizService.getResult(quizId, studentId);
  }

  @Get('results')
  @ApiOperation({ summary: 'View all quiz results' })
  async getAllResults(@Req() req: any) {
    const studentId = req.user.id;
    return this.quizService.getAllResultsForStudent(studentId);
  }
}
