import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Drug } from '../model/drug';
import { AuthService } from './auth.service';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DruginfoService {

  api_url = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getDrugList(): Observable<Drug[]> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this.authService.token
      })
    };
    return this.http.get<Drug[]>(this.api_url + '/api/drugs/?format=json', httpOptions);
  }
}
