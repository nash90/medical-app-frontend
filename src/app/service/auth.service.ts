import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

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

  constructor(private storage: Storage, private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    this.$token.subscribe((value) => {
      this.token = value;
    });
  }

  // Uses http.post() to get an auth token from djangorestframework-jwt endpoint
  public login(user) {
    this.http.post(this.api_url + '/api-token-auth/', JSON.stringify(user), this.httpOptions).subscribe(
      data => {
        this.updateData(data['token']);
      },
      err => {
        this.errors = err['error'];
      }
    );
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
  }

  private updateData(token) {
    this.token = token;
    this.errors = [];
    this.storeToken(token);

    // decode the token to read the username and expiration timestamp
    // tslint:disable-next-line:variable-name
    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.username = token_decoded.username;
    console.log({username: this.username, expiry: this.token_expires});
  }

  private storeToken(token) {
    console.log('storing token in storage');
    this.storage.set('ACCESS_TOKEN', token).then(
      () => {
        this.$token.next(token);
      }
    );
  }

  public getToken() {
    return this.storage.get('ACCESS_TOKEN').then(
      (value: string) => {
        console.log('emitting through getToken', value);
        this.$token.next(value);
      }
    );
  }
}
