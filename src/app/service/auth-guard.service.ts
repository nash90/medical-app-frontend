import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private navCtrl: NavController,
    private authService: AuthService) {}

  async canActivate() {
    const isTokenExpired = await this.authService.isTokenExpired();
    if (!isTokenExpired) {
      return true;
    }

    this.navCtrl.navigateRoot('/login');
    return false;
  }
}
