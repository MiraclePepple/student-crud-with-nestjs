import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../auth/user.entity';
import { InstructorService } from 'src/instructor/instructor.service';
import { CreateInstructorDto } from 'src/instructor/dto/create-instructor.dto';
import { UpdateInstructorDto } from 'src/instructor/dto/update-instructor.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Admin - Instructors')
@ApiBearerAuth()
@Controller('admin/instructors')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminInstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Get()
  @ApiOperation({ summary: 'Get all instructors (Admin only)' })
  findAll() {
    return this.instructorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get instructor by ID (Admin only)' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: number) {
    return this.instructorService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new instructor (Admin only)' })
  create(@Body() createInstructorDto: CreateInstructorDto) {
    return this.instructorService.create(createInstructorDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an instructor (Admin only)' })
  update(@Param('id') id: number, @Body() updateInstructorDto: UpdateInstructorDto) {
    return this.instructorService.update(id, updateInstructorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an instructor (Admin only)' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: number) {
    return this.instructorService.remove(id);
  }
}
