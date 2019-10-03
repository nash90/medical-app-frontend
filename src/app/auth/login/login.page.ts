import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  /**
   * An object representing the user for the login form
   */
  token_key = 'token';
  error_key = 'non_field_errors';
  public user: any;
  validations_form: FormGroup;
  server_errors = [];

  // validation message when input information is incorrect
  validation_messages = {
    username: [
      { type: 'required', message: 'Username is required.' },
      { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Please enter a valid email.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    birthdate: [
      { type: 'required', message: 'Birthdate is required.' },
      { type: 'minlength', message: 'Please enter the year of your birthdate with format: YYYY' },
      { type: 'maxlength', message: 'Please enter the year of your birthdate with format: YYYY' }
      // { type: 'validUsDate', message: 'Please enter the year of your birthdate with format: YYYY'},
    ]
  };

  constructor(
    private authService: AuthService,
    public formBuilder: FormBuilder,
    private navCtrl: NavController) { }

  ngOnInit() {

    this.user = {
      email: '',
      password: '',
      year_of_birth: ''
    };

    this.validations_form = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        Validators.required
      ])),
      birthdate: new FormControl('', Validators.compose([
        Validators.minLength(4),
        Validators.maxLength(4),
        Validators.required
      ]))
    });
  }

  login() {
    this.authService.login({
      email: this.validations_form.get('username').value,
      year_of_birth: this.validations_form.get('birthdate').value,
      password: 'dummy value'
    }).subscribe(
      data => {
        this.authService.updateData(data[this.token_key]);
        this.navCtrl.navigateRoot('/menu');
      },
      err => {
        this.server_errors = err[this.error_key];
      }
    );
  }

  refreshToken() {
    this.authService.refreshToken();
  }

  logout() {
    this.authService.logout();
  }

}
