import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ForbiddenException, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { StudentService } from './student.service';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../auth/user.entity';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';


@ApiTags('Student - Profile')
@ApiBearerAuth()
@Controller('student')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  //Get Logged-In Student Profile
  @Get('profile')
  @ApiOperation({ summary: 'Get student profile (User only)' })
  async getProfile(@Req() req) {
    const user = req.user;
    return this.studentService.findOneByUserId(user.id);
  }

  //Update Student Profile
  @Patch('profile')
  @ApiOperation({ summary: 'Update student profile (User only)' })
  async updateProfile(@Req() req, @Body() updateStudentDto: UpdateStudentDto) {
    const user = req.user;
    return this.studentService.update(user.id, updateStudentDto);
  }

  //Upload Profile Picture
  @Patch('profile/upload')
  @ApiOperation({ summary: 'Upload profile picture (User only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile-pics',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadProfile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const user = req.user;
    if (!file) throw new ForbiddenException('No file uploaded.');
    return this.studentService.updateProfilePicture(user.id, file.path);
  }

  //Update or Choose a Course
  @Patch('profile/course')
  @ApiOperation({ summary: 'Update or choose a course (User only)' })
  async updateCourse(@Req() req, @Body('course') course: string) {
    const user = req.user;
    return this.studentService.updateCourse(user.id, course);
  }

  //View All Available Courses
  @Get('courses')
  @ApiOperation({ summary: 'View all available courses (User only)' })
  async getAvailableCourses() {
    return this.studentService.getAllCourses();
  }

  //View My Registered Course
  @Get('my-course')
  @ApiOperation({ summary: 'View my registered course (User only)' })
  async getMyCourse(@Req() req) {
    const user = req.user;
    return this.studentService.getStudentCourse(user.id);
  }

  @Post('register-course/:courseId')
  @Roles(UserRole.USER)
  async registerCourse(@Param('courseId') courseId: number, @Req() req) {
    const user = req.user;
    return this.studentService.registerCourse(user.id, courseId);
  }

}

