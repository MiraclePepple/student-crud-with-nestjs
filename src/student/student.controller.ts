import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ForbiddenException, Req } from '@nestjs/common';
import { StudentService } from './student.service';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../auth/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Students')
@ApiBearerAuth()

@Controller('student')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.studentService.findAll( page, limit, search );
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: number, @Req() req) {
  const user = req.user;
  return this.studentService.findOne(+id);
 }

  @Get('profile')
  @Roles(UserRole.USER)
  async findProfile(@Req() req) {
   const user = req.user;
   return this.studentService.findOneByUserId(user.id);
  }



  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async update(@Param('id') id: number,@Body() updateStudentDto: UpdateStudentDto,@Req() req) {
    const user = req.user;
    if (user.role === UserRole.USER && user.id !== +id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.studentService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }

  @Patch(':id/course')
  async updateCourse(
    @Param('id') id: number,
    @Body('course') course: string,
    @Req() req
  ) {
    const user = req.user;

    // Allow if user is admin or updating their own profile
    if (user.role !== UserRole.ADMIN && user.id !== +id) {
      throw new ForbiddenException('You can only update your own course.');
    }

    return this.studentService.updateCourse(+id, course);
  }
  
}

