import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  public points = 0;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.getProfile();
  }

  logout() {
    this.authService.logout();
  }

  getProfile() {
    this.profileService.getProfileData().subscribe(
      (data) => {
        if (data.points) {
        this.points = data.points;
        }
        // console.log(data);
      }
    );
  }

}
