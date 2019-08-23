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

    const tokenObs = from(this.storage.get('ACCESS_TOKEN')).pipe(map(
      (token) => {
        // console.log('point 1', token);
        return token;
      })
    );

    return tokenObs.pipe(mergeMap(
      (token) => {
        // console.log('point 2', token);
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + token
          })
        };
        return this.http.get<Drug[]>(this.api_url + '/api/drugs/?format=json', httpOptions);
      }
    ));

  }
}
