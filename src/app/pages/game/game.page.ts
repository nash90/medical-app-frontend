import { Component, OnInit } from '@angular/core';
import { DruginfoService } from 'src/app/service/druginfo.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  public gameItem = [];
  public current_level = '';

  public active_level = {
    indication: {
      completed: false,
      data: []
    },
    warning: {
      completed: false,
      data: []
    },
    adverse_effect: {
      completed: false,
      data: []
    },
    interaction: {
      completed: false,
      data: []
    },
    counseling_point: {
      completed: false,
      data: []
    }
  };

  public game = null; // active game information

  constructor(
    private druginfoService: DruginfoService,
    private navCtrl: NavController
    ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.druginfoService.getGameItem().subscribe((item) => {
      this.gameItem = item;
      // console.log('game item', item);
      this.setGame(item);
      this.current_level = this.getLevel();
      console.log('counseling point', this.active_level.counseling_point);
      console.log('current level', this.current_level);
      this.getCurrentInformation();
    },
    (err) => console.log('get Game Item subscribe Failure', err)
    );
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
    for (const item of Object.keys(levels)) {
      if (!levels[item].completed) {
        return item;
      }
    }
    return null;
  }

  getCurrentGameIndex() {
    const level_obj = this.active_level[this.current_level].data;
    for (let i = 0; i < level_obj.length; i++) {
      if (!level_obj[i].completed) {
        return i;
      }
    }
    return null;
  }

  getCurrentInformation() {
    const level_obj = this.active_level[this.current_level];
    const current_index = this.getCurrentGameIndex();
    this.game = level_obj.data[current_index];
    console.log('getCurrentInfo', this.game);
  }

  goToMenu() {
    this.navCtrl.navigateRoot('/menu');
  }
}
