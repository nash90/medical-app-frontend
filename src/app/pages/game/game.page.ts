import { Component, OnInit } from '@angular/core';
import { DruginfoService } from 'src/app/service/druginfo.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { ProfileService } from 'src/app/service/profile.service';

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
  public points = null;

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
      name: 'adverse effect'
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
      name: 'counseling point'
    }
  };

  public game = null; // active game information
  public hints = null;
  public warning = null;
  public hide_option = false;
  public wrong_answer = false;
  public state = '';

  constructor(
    private druginfoService: DruginfoService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private storage: Storage,
    private profileService: ProfileService
    ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => {
        const state = params.state;
        this.state = state;
        console.log('state', this.state);
        if (state === '1') {
          this.onReturnFromLevelQuiz();
        } else {
          this.play();
        }
      }
    );
  }

  goToMenu() {
    this.navCtrl.navigateRoot('/menu');
  }

  reload() {
    this.navCtrl.navigateRoot('/game');
  }

  goToQuiz(state = null) {
    if (state) {
      this.navCtrl.navigateRoot(`/quiz?state=${state}`);
    } else {
      this.navCtrl.navigateRoot('/quiz');
    }
  }

  play() {
    this.druginfoService.getGameItem().subscribe((item) => {
      if (item && item.length > 0) {
        this.gameItem = item;
        console.log('game item', item);
        this.setGame(item);
        this.getScreenInfo();
      }
    },
    (err) => console.log('get Game Item subscribe Failure', err)
    );
  }

  getScreenInfo() {
    this.getProfile();
    this.getLevel();
    console.log('current level', this.current_level);
    this.getCurrentInformation();
    this.getKeyword();
    if (this.current_keyword) {
      this.scrabble_key();
      this.getHint();
      this.getWarning();
    } else {
      this.changeKeyword();
    }
  }

  setGame(drug_infos) {
    this.active_level.indication.data = [];
    this.active_level.warning.data = [];
    this.active_level.adverse_effect.data = [];
    this.active_level.interaction.data = [];
    this.active_level.counseling_point.data = [];

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

  getProfile() {
    this.profileService.getProfileData().subscribe(
      (data) => {
        this.points = data.points;
        // console.log(data);
      }
    );
  }

  getLevel() {
    const levels = this.sort_object(this.active_level);

    this.current_level = null;
    for (const item of Object.keys(levels)) {
      if (!levels[item].completed) {
        this.current_level = levels[item];
        break;
      }
    }
  }

  getCurrentGameIndex() {
    // const level_obj = this.active_level[this.current_level.name].data;
    const level_obj = this.current_level.data;
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
    if (hints.length > 4) {
      hints = hints.slice(0, 4);
    }
    this.hints = hints;
    // console.log(hints);
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
    const replace_s = this.getReplaceMarker(key);
    key.split('').forEach((char, i) => {
        if (replace_s[i] === '*') {
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
      });
    this.scrabbled_value = key_list;
    this.option_list = option_list;
    // useful in short keyword to aviod zero blank
    if (this.checkCompletion()) {
      this.option_list.push({
        value: this.scrabbled_value[0].value,
        is_fixed: false
      });
      this.scrabbled_value[0] = {
        value: '*',
        is_fixed: false
      };
    }

    this.shuffle(this.option_list);
    // console.log(key_list);
    // console.log(option_list);
  }

  getReplaceMarker(keyword) {
    let key_list = keyword.split(' ');

    key_list = key_list.map((key) => {
      const suffle_range = [];
      let replace_length = 0;
      for (let i = 1; i < key.length - 1; i++) {
        suffle_range.push(i);
      }
      // console.log("suffle range:", suffle_range);
      replace_length = Math.round(suffle_range.length / 2);
      this.shuffle(suffle_range);
      const keys = key.split('');
      for (let i = 0; i < replace_length; i++) {
        keys[suffle_range[i]] = '*';
      }
      return keys.join('');
    });
    const transformed_key = key_list.join(' ');
    // console.log('transformed key', transformed_key);
    return transformed_key;
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
    // console.log('pop', pop);
    this.scrabbled_value[position] = pop;
    // console.log(this.scrabbled_value);
    this.completed_word = this.checkCompletion();
    // console.log(this.completed_word);

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
      async (data) => {
        console.log('ans response ', data);
        if (data.correct) {
          this.changeKeyword();
        } else {
          this.wrong_answer = true;
        }
      },
      (err) => {
        console.log('err', err);
      }
    );
  }

  async changeKeyword() {
    this.changeLevelIndex();
    await this.cacheGame();
    await this.chacheQuizLevel();
    if (!this.checkCompletedSingleLevel()) {
      this.getScreenInfo();
    } else {
      // console.log('Single level was complete');
      this.goToQuiz();
    }
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

  async cacheGame() {
    await this.storage.set('GAME', this.active_level);
  }

  async chacheQuizLevel() {
    await this.storage.set('QUIZ_LEVEL', this.current_level);
  }

  onReturnFromLevelQuiz() {
    this.storage.get('GAME').then(
      async (game) => {
        console.log('retrived game', game);
        this.active_level = game;
        this.changeLevel();
        // this.cacheGame();
        if (!this.checkCompletedAllLevels()) {
          this.getScreenInfo();
        } else {
          this.goToQuiz('1'); // go to full end quiz
        }
      }
    );
  }

  skip() {
    this.wrong_answer = false;
    this.changeKeyword();
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  sort_object(obj) {
    const items = Object.keys(obj).map((key) => {
        return [key, obj[key]];
    });
    items.sort((first, second) => {
        return second[1] - first[1];
    });
    const sorted_obj = {};

    items.forEach((item) => {
        const use_key = item[0];
        const use_value = item[1];
        sorted_obj[use_key] = use_value;
    });
    return(sorted_obj);
  }

  newline_rule(keyObj, pos, is_obj = true) {
    let keyword = null;
    if (is_obj) {
      keyword = keyObj.reduce((tot, cur) => (tot = tot + cur.value), '');
    } else {
      keyword = keyObj;
    }

    //
    // Decision tree determining what spaces to break on based
    // on a maximum of three words in 'keyword' phrase, and
    // a maximum of 10 characters of space per line.
    //
    if (keyword[pos] === ' ') { // only consider breaking if we are on a space
      const words = keyword.split(' ');
      const len1 = words[0].length;
      const len2 = words[1].length; // we know there is 2nd word due to space
      const len3 = words.length > 2 ? words[2].length : 0;
      if ( len1 + len2 + 1 > 10) { // we'll break at first space
        if (pos === len1) {
          return true; // return to break if this IS the first space
        } else if ( len2 + len3 + 1 > 10 ) {
          return true; // otherwise assume this is 2nd space and break if last two words > 10chars
        }
      // no break on first space, so add word lengths for full phrase to see if break needed on 2nd space
      // and break IF on the 2nd space
      } else if ( len1 + len2 + len3 + 2 > 10 && pos === len1 + len2 + 1) {
          return true;
      }
    }
    return false; // most character positions default ot not a break
  }
}
