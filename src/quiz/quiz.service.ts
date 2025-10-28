import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { Question } from './entities/question.entity';
import { StudentQuiz } from './entities/student-quiz.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { AddQuestionDto } from './dto/add-question.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(StudentQuiz)
    private readonly studentQuizRepository: Repository<StudentQuiz>,
  ) {}

  async createQuiz(createQuizDto: CreateQuizDto) {
    const quiz = this.quizRepository.create(createQuizDto);
    return this.quizRepository.save(quiz);
  }

  async addQuestion(quizId: number, addQuestionDto: AddQuestionDto) {
    const quiz = await this.quizRepository.findOne({ where: { id: quizId } });
    if (!quiz) throw new NotFoundException('Quiz not found');

    const question = this.questionRepository.create({
      ...addQuestionDto,
      quiz,
    });

    return this.questionRepository.save(question);
  }

  async findAll() {
    return this.quizRepository.find({ relations: ['questions'] });
  }

  async findOne(id: number) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ['questions'],
    });
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async remove(id: number) {
    const quiz = await this.findOne(id);
    return this.quizRepository.remove(quiz);
  }

  // Grading Logic
  async gradeQuiz(quizId: number, studentId: number, submitQuizDto: SubmitQuizDto) {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['questions'],
    });
    if (!quiz) throw new NotFoundException('Quiz not found');

    let score = 0;
    const totalQuestions = quiz.questions.length;

    for (const answer of submitQuizDto.answers) {
      const question = quiz.questions.find((q) => q.id === answer.questionId);
      if (question && question.correctAnswer === answer.answer) {
        score += 1;
      }
    }

    const finalScore = (score / totalQuestions) * 100;

    const studentQuiz = this.studentQuizRepository.create({
      quiz,
      student: { id: studentId } as any, // temporary; from JWT in controller
      score: finalScore,
      isCompleted: true,
    });

    return this.studentQuizRepository.save(studentQuiz);
  }

  async getResult(quizId: number, studentId: number) {
    const result = await this.studentQuizRepository.findOne({
      where: { 
        quiz: { id: quizId }, 
        student: { id: studentId } 
      } as any,
      relations: ['quiz', 'student'],
    });

    if (!result) throw new NotFoundException('Result not found for this quiz');
    return result;
  }

  async getAllResultsForStudent(studentId: number) {
    return this.studentQuizRepository.find({
      where: { student: { id: studentId } as any },
      relations: ['quiz'],
    });
  }
}
