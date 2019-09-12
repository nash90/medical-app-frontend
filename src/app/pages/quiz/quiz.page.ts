import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/service/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
})
export class QuizPage implements OnInit {

  public quiz = [];

  constructor(
    private quizService: QuizService
    ) { }

  ngOnInit() {
    this.quizService.getQuizInfo().subscribe((data) => {
      console.log('api return', data);
      this.quiz = data;
    });
  }

}
