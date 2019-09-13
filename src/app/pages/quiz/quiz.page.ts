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
  public answers = {};
  public error = false;
  public feedback = null;

  constructor(
    private quizService: QuizService
    ) { }

  ngOnInit() {
    this.quizService.getQuizInfo().subscribe((data) => {
      console.log('api return', data);
      this.setScreenData(data);
      this.setAnswers();
    });
  }

  setScreenData(data) {
    this.quiz = data;
    this.drug = data[0].drug_quiz.drug;
  }

  setAnswers() {
    const data = this.quiz;
    data.forEach((q) => {
      this.answers[q.drug_quiz.drug_quiz_id] = null;
    });
  }

  radioSelect(quiz_id, option_id) {
    this.answers[quiz_id] = option_id;
    console.log(this.answers);
  }

  validateAnswers() {
   let pass = true;
   const q = Object.keys(this.answers);
   q.forEach((item) => {
    if (this.answers[item] == null) {
      pass = false;
    }
   });
   return pass;
  }

  submitAnswer() {
    console.log('submitAns');
    if (this.validateAnswers() === false) {
      this.error = true;
      return;
    }
    this.quizService.checkAnswers(this.answers).subscribe((ans) => {
      const dic = {};
      ans.forEach((item) => {
        dic[item.quiz_id] = item;
      });
      this.feedback = dic;
      console.log('answer check', dic);

    });
  }

}
