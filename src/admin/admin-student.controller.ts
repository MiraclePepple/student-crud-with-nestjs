import { Controller, Get, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { StudentService } from '../student/student.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../auth/user.entity';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Admin - Students')
@ApiBearerAuth()
@Controller('admin/students')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminStudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all students (Admin only)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name or email' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.studentService.findAll(page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single student by ID (Admin only)' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: number) {
    return this.studentService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student (Admin only)' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: number) {
    return this.studentService.remove(+id);
  }
}
