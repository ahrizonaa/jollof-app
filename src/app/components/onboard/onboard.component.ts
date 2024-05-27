import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { UserService } from 'src/app/services/user.service';
import { ProfileComponent } from '../profile/profile.component';
import { UserProfile } from 'src/app/types/UserProfile';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonContent,
    ProfileComponent,
  ],
})
export class OnboardComponent {
  profile: UserProfile = null as any;
  constructor(private user: UserService, private router: Router) {}

  async switchAccount() {
    this.user.SignOut();
    await this.router.navigate(['/login']);
  }

  profileChanged(profile: UserProfile) {
    this.profile = profile;
  }

  proceedClicked() {
    this.user.SignUp(this.profile);
  }
}
