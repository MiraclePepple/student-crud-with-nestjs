import { Controller, Patch, Body, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { InstructorService } from './instructor.service';

@Controller('instructor')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}
  @Patch(':id/change-password')
  @ApiOperation({ summary: 'Change instructor password' })
  async changePassword(
  @Param('id') id: number,
  @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.instructorService.changePassword(id, body.oldPassword, body.newPassword);
    }
}
