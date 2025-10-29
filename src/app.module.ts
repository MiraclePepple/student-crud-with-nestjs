import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { AdminModule } from './admin/admin.module';
import { InstructorModule } from './instructor/instructor.module';
import { QuizModule } from './quiz/quiz.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    // ✅ Load environment variables globally
    ConfigModule.forRoot({ isGlobal: true }),

    // ✅ Setup MySQL connection
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),

    // ✅ Setup MailerModule properly
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER || 'yourgmail@gmail.com',
          pass: process.env.MAIL_PASS || 'your-app-password',
        },
      },
      defaults: {
        from: '"LMS Support" <yourgmail@gmail.com>',
      },
    }),

    // ✅ Feature Modules
    StudentModule,
    AuthModule,
    CourseModule,
    AdminModule,
    InstructorModule,
    QuizModule,
  ],
})
export class AppModule {}
