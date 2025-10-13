import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ForbiddenException, Req } from '@nestjs/common';
import { StudentService } from './student.service';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../auth/user.entity';

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
  @Roles(UserRole.ADMIN, UserRole.USER)
  async findOne(@Param('id') id: number, @Req() req) {
  const user = req.user;

  // If it's a normal user, ignore URL and show their own student record
  if (user.role === UserRole.USER) {
    return this.studentService.findOneByUserId(user.id);
  }

  // If it's an admin, they can view any student's record by ID
  return this.studentService.findOne(+id);
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
}
