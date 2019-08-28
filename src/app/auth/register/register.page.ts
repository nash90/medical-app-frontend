import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public profile;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.profile = {
      user: {
        username: ''
      },
      date_of_birth: ''
    };
  }

  register() {
    this.authService.register({
      user: {
        username: this.profile.user.username
      },
      date_of_birth: this.profile.date_of_birth
    });
  }

}
