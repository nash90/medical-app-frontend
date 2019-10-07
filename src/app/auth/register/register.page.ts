import { Component, OnInit, ModuleWithComponentFactories } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { BirthdateValidator } from '../../validators/birthdate.validator';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { EighteenPlusValidator } from 'src/app/validators/eieghteenplus.validator';
import { NavController } from '@ionic/angular';
import { IonicSelectableModalComponent } from 'ionic-selectable';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  profile;
  server_errors;
  error_key = 'non_field_errors';

  validations_form: FormGroup;
  /* validation message when input formate is invalid */
  validation_messages = {
    username: [
      { type: 'required', message: 'Email is required.' },
      { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Please enter a valid email.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    birthdate: [
      { type: 'required', message: 'Birthdate is required.' },
      { type: 'validUsDate', message: 'Please enter birthdate with format: YYYY-MM-DD'},
      { type: 'validEighteenPlus', message: 'You must be over 18 years old'}
    ]
  };

  constructor(
    private authService: AuthService,
    public formBuilder: FormBuilder,
    private router: Router,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.profile = {
      user: {
        email: ''
      },
        date_of_birth: ''
    };

    /* validation control for username & birthdate input on register page */
    this.validations_form = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        Validators.required
      ])),
      birthdate: new FormControl('', Validators.compose([
        BirthdateValidator.validUsDate,
        EighteenPlusValidator.validEighteenPlus,
        Validators.required
      ]))
    });
  }

  register() {
    this.changeDateFormat;
    this.authService.register({
      user: {
        email: this.validations_form.get('username').value
      },
        date_of_birth: this.validations_form.get('birthdate').value
    }).subscribe(
      data => {
        this.navCtrl.navigateRoot('/login');
      },
      err => {
        if (err.user && err.user.email) {
          this.server_errors = ['User Email already exist'];
        } else {
          this.server_errors = ['Unexpected error occured'];
        }
      }
    );
  }

  changeDateFormat() {
    var date = new Date(this.validations_form.get("birthdate").value);
    this.validations_form.get("birthdate").setValue(date.getFullYear.toString + 
      "-" + date.getMonth.toString + "-" + date.getDay.toString);
  }

  onSubmit(values) {
    // console.log(values);
    this.router.navigate(['/user']);
  }

}
