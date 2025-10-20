import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../auth/user.entity';
import { CourseService } from '../course/course.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Admin - Courses')
@ApiBearerAuth()
@Controller('admin/courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminCourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  @ApiOperation({ summary: 'Get all courses (Admin only)' })
  async findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single course by ID (Admin only)' })
  @ApiParam({ name: 'id', type: Number })
  async findOne(@Param('id') id: number) {
    const course = await this.courseService.findOne(id);
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new course (Admin only)' })
  async create(
    @Body()
    createCourseDto: {
      title: string;
      description: string;
      duration: number;
    },
  ) {
    return this.courseService.create(createCourseDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a course (Admin only)' })
  async update(
    @Param('id') id: number,
    @Body()
    updateCourseDto: {
      title?: string;
      description?: string;
      duration?: number;
    },
  ) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course (Admin only)' })
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id') id: number) {
    return this.courseService.remove(id);
  }
}
