import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  api_url = environment.apiUrl;
  httpOptions = null;

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  getProfileData(): Observable<any> {
    return this.http.get<any>(this.api_url + `/api/profile/?format=json`);
  }
}
