import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as jwt_decode from 'jwt-decode';

import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // http options used for making API calls
  private httpOptions: any;

  // the actual JWT token
  public token: string;

  public $token: Subject<string> = Subject.create('none');

  // the token expiration date
  public token_expires: Date;

  // the username of the logged in user
  public username: string;

  // error messages received from the login attempt
  public errors: any = [];

  public api_url = environment.apiUrl;

  constructor(private storage: Storage, private http: HttpClient, private navCtrl: NavController) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    this.$token.subscribe((value) => {
      this.token = value;
    });
  }

  // Uses http.post() to get an auth token from djangorestframework-jwt endpoint
  public login(user) {
    return this.http.post(this.api_url + '/api/login/', JSON.stringify(user), this.httpOptions);
  }

  public register(profile) {
    return this.http.post(this.api_url + '/api/register/', JSON.stringify(profile), this.httpOptions);
  }

  // Refreshes the JWT token, to extend the time the user is logged in
  public refreshToken() {
    this.http.post(this.api_url + '/api-token-refresh/', JSON.stringify({token: this.token}), this.httpOptions).subscribe(
      data => {
        this.updateData(data['token']);
      },
      err => {
        this.errors = err['error'];
      }
    );
  }

  public logout() {
    this.token = null;
    this.token_expires = null;
    this.username = null;
    this.storage.set('ACCESS_TOKEN', this.token).then(
      () => {
        this.$token.next(this.token);
        this.navCtrl.navigateRoot('/login');
      }
    );
  }

  public updateData(token) {
    this.token = token;
    this.storeToken(token);

  }

  private storeToken(token) {
    // console.log('storing token in storage');
    this.storage.set('ACCESS_TOKEN', token).then(
      () => {
        this.$token.next(token);
      }
    );
  }

  public getToken() {
    return this.storage.get('ACCESS_TOKEN').then(
      (value: string) => {
        // console.log('emitting through getToken', value);
        this.$token.next(value);
        this.token = value;
      }
    );
  }

  public getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);
    if (decoded.exp === undefined) {
      return null;
    }
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  public async isTokenExpired(): Promise<boolean> {
    await this.getToken();

    if (this.token === undefined || this.token == null || this.token === '') {
      return true;
    }

    const date = this.getTokenExpirationDate(this.token);
    if (date === undefined) {
      return false;
    }
    return !(date.valueOf() > new Date().valueOf());
  }
}
