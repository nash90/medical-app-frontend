import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  /**
   * An object representing the user for the login form
   */
  public user: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.user = {
      username: '',
      password: '',
      year_of_birth: ''
    };
  }

  login() {
    this.authService.login({
      'username': this.user.username,
      'year_of_birth': this.user.year_of_birth,
      'password': 'dummy value'
    });
  }

  refreshToken() {
    this.authService.refreshToken();
  }

  logout() {
    this.authService.logout();
  }

}
