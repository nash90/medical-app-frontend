import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, Subscription, BehaviorSubject, Subject, from } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { Drug } from '../model/drug';
import { AuthService } from './auth.service';
import { Storage } from '@ionic/storage';

import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DruginfoService {

  api_url = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private navCtrl: NavController
    ) {}

  getDrugList(): Observable<Drug[]> {
    return this.http.get<Drug[]>(this.api_url + '/api/drugs/?format=json');
  }

  getDrugInfoById(id): Observable<any> {
    const url = this.api_url + `/api/drugs/${id}/info/?format=json`;
    // console.log('getDrugInfoByID url:', url);
    return this.http.get<any>(url);
  }

  getRandomDrugInfo(): Observable<any> {
    return this.http.get<any>(this.api_url + `/api/drugs/0/info/?format=json`);
  }

  async saveSelectedDrug(selectedDrug) {
    // console.log('save selected drugs');
    const id_list = selectedDrug.map((item, idx) => {
      const obj = {
        drug_id : item.drug_id,
        played : false
      };
      return obj;
    }
    );
    await this.storage.set('SELECTED_DRUGS', id_list);
  }

  async getSelectedDrug() {
    return await this.storage.get('SELECTED_DRUGS');
  }

  checkPlayedAll(selectedDrugs) {
    let played = true;
    if (!selectedDrugs) {
      return played;
    }
    selectedDrugs.forEach(element => {
      if (element.played === false) {
        played = false;
      }
    });
    return played;
  }

  async changePlayed(drug_id) {
    // console.log('changePlayed');
    const selectList = await this.getSelectedDrug();
    if (selectList) {
      selectList.forEach(
        (item) => {
          if (item.drug_id === drug_id) {
            item.played = true;
          }
        }
      );
    }
    // console.log('selectList', selectList);
    await this.storage.set('SELECTED_DRUGS', selectList);
  }

  async getGameItemId() {
    const selectedDrugs = await this.getSelectedDrug();
    const playedAll = this.checkPlayedAll(selectedDrugs);

    if (playedAll) {
      this.navCtrl.navigateRoot('/drug-select');
    }

    // console.log('getGameItemId: selectedDrugs', selectedDrugs);
    let gameItemId = null;
    for (const element of selectedDrugs) {
      if (!element.played) {
        gameItemId = element;
        break;
      }
    }
    return gameItemId;
  }

  getGameItem(): Observable<any> {
    return from(this.getGameItemId()).pipe(mergeMap((gameItemId) => {
      // console.log('getGameItem: gameItemId', gameItemId );
      if (gameItemId !== null) {
        return this.getDrugInfoById(gameItemId.drug_id);
      } else {
        return this.getRandomDrugInfo();
      }
    }
    ));
  }

  checkAnswer(key_id, answer) {
    return this.http.get<any>(this.api_url + `/api/keys/${key_id}/answer/?answer=${answer}`);
  }
}
