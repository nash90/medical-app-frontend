import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, Subscription, BehaviorSubject, Subject, from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Drug } from '../model/drug';
import { AuthService } from './auth.service';
import { Storage } from '@ionic/storage';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DruginfoService {

  api_url = environment.apiUrl;

  constructor(private http: HttpClient, private storage: Storage) {}

  getDrugList(): Observable<Drug[]> {
    return this.http.get<Drug[]>(this.api_url + '/api/drugs/?format=json');
  }

  async saveSelectedDrug(selectedDrug) {
    console.log('save selected drugs');
    const id_list = selectedDrug.map((item, idx) => {
      return item.drug_id;
    }
    );
    await this.storage.set('SELECTED_DRUGS', id_list);
  }

  async getSelectedDrug() {
    await this.storage.get('SELECTED_DRUGS');
  }

}
