import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/service/quiz.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DruginfoService } from 'src/app/service/druginfo.service';
import { Storage } from '@ionic/storage';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
})
export class QuizPage implements OnInit {

  public quiz = [];
  public drug = null;
  public answers = {};
  public error = false;
  public not_valid = false;
  public feedback = null;
  public state = '';
  public points = 0;

  constructor(
    private quizService: QuizService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private storage: Storage,
    private druginfoService: DruginfoService,
    private profileService: ProfileService
    ) { }

  ngOnInit() {
    this.getProfile();
    this.route.queryParams.subscribe(
      (params) => {
        const state = params.state;
        this.state = state;
        // console.log('state', this.state);
        if (state === '1') {
          this.setEndLevelData();
        } else {
          this.setLevelData();
        }
      }
    );
  }

  goToMenu() {
    this.navCtrl.navigateRoot('/menu');
  }

  getProfile() {
    this.profileService.getProfileData().subscribe(
      (data) => {
        if (data.points) {
          this.points = data.points;
          }
        // console.log(data);
      }
    );
  }

  setLevelData() {
    this.quizService.getQuizInfo().subscribe((data) => {
      // console.log('api return', data);
      if (data.length > 0) {
        this.setScreenData(data);
        this.setAnswers();
      } else {
        this.goToGame('1');
      }
    });
  }

  setEndLevelData() {
    this.quizService.getEndLevelQuizInfo().subscribe((data) => {
      // console.log('api return', data);
      this.setScreenData(data);
      this.setAnswers();
    });
  }

  goToGame(state = null) {
    if (state) {
      this.navCtrl.navigateRoot(`/game?state=${state}`);
    } else {
      this.navCtrl.navigateRoot('/game');
    }
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
    // console.log(this.answers);
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
    if (this.validateAnswers() === false) {
      this.not_valid = true;
      return;
    }
    this.not_valid = false;
    this.quizService.checkAnswers(this.answers).subscribe((ans) => {
      this.error = false;
      const dic = {};
      ans.forEach((item) => {
        dic[item.quiz_id] = item;
      });
      this.feedback = dic;
    },
    (err) => {
      this.error = true;
    });
  }

  next() {
    // if final quiz was played change the status of selected medicine drug to played
    if (this.state === '1') {
      this.storage.get('GAME').then(
        async (game) => {
          const checkLevel = 'indication'; // TODO: store current drug id
          await this.druginfoService.changePlayed(game[checkLevel].data[0].drug.drug_id);
          this.goToGame();
        }
      );
    } else {
      this.goToGame('1');
    }
  }

}
