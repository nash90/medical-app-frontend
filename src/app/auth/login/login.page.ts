import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { UsernameValidator } from '../../validators/username.validator';
import { BirthdateValidator } from '../../validators/birthdate.validator';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';

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
  validations_form: FormGroup;

  constructor(private authService: AuthService,
    public formBuilder: FormBuilder) { }

  ngOnInit() {

    this.user = {
      email: '',
      password: '',
      year_of_birth: ''
    };

    this.validations_form = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        UsernameValidator.validUsername,
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        Validators.required
      ])),
      birthdate: new FormControl('', Validators.compose([
        BirthdateValidator.validUsDate,
        Validators.required
      ]))
    });
  }

  login() {
    this.authService.login({
      'email': this.validations_form.get('username').value,
      'year_of_birth': this.validations_form.get('birthdate').value,
      'password': 'dummy value'
    });
  }

  refreshToken() {
    this.authService.refreshToken();
  }

  logout() {
    this.authService.logout();
  }

    // validation message when input information is incorrect
    validation_messages = {
      'username': [
        { type: 'required', message: 'Username is required.' },
        { type: 'minlength', message: 'Username must be at least 5 characters long.' },
        { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
        { type: 'pattern', message: 'Please enter a valid email.' },
        { type: 'validUsername', message: 'Your username has already been taken.' }
      ],
      'birthdate': [
        { type: 'required', message: 'Birthdate is required.' },
        { type: 'validUsDate', message: 'Please enter birthdate with format: YYYY-MM-DD'},
      ]
    };

}
