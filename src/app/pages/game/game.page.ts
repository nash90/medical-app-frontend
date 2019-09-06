import { Component, OnInit } from '@angular/core';
import { DruginfoService } from 'src/app/service/druginfo.service';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  public gameItem = [];
  public current_level = {
    completed: false,
    data: [],
    level: 1,
    name: 'indication'
  };
  public current_keyword = null;
  public scrabbled_value = null;
  public option_list = null;
  public completed_word = false;

  public active_level = {
    indication: {
      completed: false,
      data: [],
      level: 1,
      name: 'indication'
    },
    warning: {
      completed: false,
      data: [],
      level: 2,
      name: 'warning'
    },
    adverse_effect: {
      completed: false,
      data: [],
      level: 3,
      name: 'adverse_effect'
    },
    interaction: {
      completed: false,
      data: [],
      level: 4,
      name: 'interaction'
    },
    counseling_point: {
      completed: false,
      data: [],
      level: 5,
      name: 'counseling_point'
    }
  };

  public game = null; // active game information
  public hints = null;
  public warning = null;
  public hide_option = false;
  public wrong_answer = false;

  constructor(
    private druginfoService: DruginfoService,
    private navCtrl: NavController
    ) {}

  ngOnInit() {
    this.getData();
  }

  goToMenu() {
    this.navCtrl.navigateRoot('/menu');
  }

  getData() {
    this.druginfoService.getGameItem().subscribe((item) => {
      this.gameItem = item;
      // console.log('game item', item);
      this.setGame(item);
      this.getScreenInfo();
    },
    (err) => console.log('get Game Item subscribe Failure', err)
    );
  }

  getScreenInfo() {
    this.getLevel();
    console.log('current level', this.current_level);
    this.getCurrentInformation();
    this.getKeyword();
    this.scrabble_key();
    this.getHint();
    this.getWarning();
  }

  setGame(drug_infos) {
    for (const item of drug_infos) {
      const type = item.drug_info_type.drug_information_type;
      if (type.toLowerCase() === 'Indication'.toLowerCase()) {
        item.completed = false;
        this.active_level.indication.data.push(item);
        this.active_level.indication.completed = false;
      } else if (type.toLowerCase() === 'Warning'.toLowerCase()) {
        item.completed = false;
        this.active_level.warning.data.push(item);
        this.active_level.warning.completed = false;
      } else if (type.toLowerCase() === 'Adverse Effect'.toLowerCase()) {
        item.completed = false;
        this.active_level.adverse_effect.data.push(item);
        this.active_level.adverse_effect.completed = false;
      } else if (type.toLowerCase() === 'Interaction'.toLowerCase()) {
        item.completed = false;
        this.active_level.interaction.data.push(item);
        this.active_level.interaction.completed = false;
      } else if (type.toLowerCase() === 'Counseling Point'.toLowerCase()) {
        item.completed = false;
        this.active_level.counseling_point.data.push(item);
        this.active_level.counseling_point.completed = false;
      }
    }
  }

  getLevel() {
    const levels = this.active_level;
    this.current_level = null;
    for (const item of Object.keys(levels)) {
      if (!levels[item].completed) {
        this.current_level = levels[item];
        break;
      }
    }
  }

  getCurrentGameIndex() {
    const level_obj = this.active_level[this.current_level.name].data;
    for (let i = 0; i < level_obj.length; i++) {
      if (!level_obj[i].completed) {
        return i;
      }
    }
    return null;
  }

  getCurrentInformation() {
    const level_obj = this.current_level;
    const current_index = this.getCurrentGameIndex();
    this.game = level_obj.data[current_index];
    console.log('getCurrentInfo', this.game);
  }

  getHint() {
    let hints = this.game.scrabble_hint;
    hints = hints.split(';');
    this.hints = hints;
    console.log(hints);
  }

  getWarning() {
    let warning = this.game.drug.black_box_warning;
    if (warning === '(none)') {
      warning = null;
    }
    this.warning = warning;
  }

  getKeyword() {
    const keys_length = this.game.keyword.length;
    const keys_list = this.game.keyword;
    const choice_idx = Math.floor(Math.random() * keys_length);
    this.current_keyword = keys_list[choice_idx];
    console.log('getKeyword', this.current_keyword);
  }

  scrabble_key() {
    const key = this.current_keyword.keyword;
    const key_list = [];
    const option_list = [];
    for (const char of key) {
        const char_state = {
          value: '',
          is_fixed: false,
        };
        if (char !== ' ' && Math.random() >= 0.5) {
          key_list.push({
            value: '*',
            is_fixed: false
          });
          option_list.push({
            value: char,
            is_fixed: false,
          });
        } else {
          key_list.push({
            value: char,
            is_fixed: true
          });
        }
      }
    this.scrabbled_value = key_list;
    this.option_list = option_list;
    // useful in short keyword to aviod zero blank
    if (this.checkCompletion()) {
      this.option_list.push(this.scrabbled_value[0]);
      this.scrabbled_value[0] = '*';

    }

    this.shuffle(this.option_list);
    console.log(key_list);
    console.log(option_list);
  }

  addChar(idx) {
    const pop = this.option_list.splice(idx, 1);
    this.addToScrabble(pop[0]);
  }

  addToScrabble(pop) {
    let position = 0;
    for (let idx = 0; idx < this.scrabbled_value.length; idx ++ ) {
      if (this.scrabbled_value[idx].value === '*') {
        position = idx;
        break;
      }
    }
    console.log('pop', pop);
    this.scrabbled_value[position] = pop;
    console.log(this.scrabbled_value);
    this.completed_word = this.checkCompletion();
    console.log(this.completed_word);

    if (this.completed_word) {
      this.checkCorrectKeyword();
    }
  }

  removeChar(idx) {
    // console.log('removeChar: idx', idx);
    const push_item = this.scrabbled_value[idx];
    // console.log('push item', push_item);
    this.option_list.push(push_item);
    this.scrabbled_value[idx] = {
      value: '*',
      is_fixed: false
    };
  }

  checkCompletion() {
    const chars = this.scrabbled_value;
    for (const char of chars) {
      if (char.value === '*') {
        return false;
      }
    }
    return true;
  }

  checkCorrectKeyword() {
    let answer = '';
    for (const item of this.scrabbled_value) {
      answer = answer + item.value;
    }
    this.druginfoService.checkAnswer(this.current_keyword.keyword_id, answer).subscribe(
      (data) => {
        console.log('ans response ', data);
        if (data.correct) {
          this.changeLevelIndex();
          if (!this.checkCompletedSingleLevel()) {
            this.getScreenInfo();
          } else {
            console.log('Single level was complete');
            this.changeLevel();
            if (!this.checkCompletedAllLevels()) {
              this.getScreenInfo();
            } else {
              this.goToMenu();
            }
          }
        } else {
          this.wrong_answer = true;
        }
      },
      (err) => {
        console.log('err', err);
      }
    );
  }

  changeLevelIndex() {
    const current_level = this.current_level;
    for (const item of current_level.data) {
      if (!item.completed) {
        item.completed = true;
        break;
      }
    }
    this.current_level = current_level;
  }

  checkCompletedSingleLevel() {
    const current_level = this.current_level;
    let completed = true;
    for (const item of current_level.data) {
      if (!item.completed) {
        completed = false;
        break;
      }
    }
    return completed;
  }

  changeLevel() {
    const active_level = this.active_level;
    const levels = Object.keys(active_level);
    for (const item of levels) {
      if (!active_level[item].completed) {
        active_level[item].completed = true;
        break;
      }
    }
  }

  checkCompletedAllLevels() {
    const active_level = this.active_level;
    const levels = Object.keys(active_level);
    let completed = true;
    for (const item of levels) {
      if (!active_level[item].completed) {
        completed = false;
        break;
      }
    }
    return completed;
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
