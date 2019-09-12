import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/service/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
})
export class QuizPage implements OnInit {

  public quiz = null;
  public drug = null;


  constructor(
    private quizService: QuizService
    ) { }

  ngOnInit() {
    this.quizService.getQuizInfo().subscribe((data) => {
      console.log('api return', data);
      this.setScreenData(data);
    });
  }

  setScreenData(data) {
    this.quiz = data;
    this.drug = data[0].drug_quiz.drug;
  }

}
