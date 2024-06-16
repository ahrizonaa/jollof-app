import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgIf } from '@angular/common';
import { LogService } from '../../services/log.service';
import { isPlatform } from '@ionic/angular';
import {
  GoogleAuth,
  InitOptions,
} from '@codetrix-studio/capacitor-google-auth';
import {
  FacebookLogin,
  FacebookLoginResponse,
} from '@capacitor-community/facebook-login';
import { GoogleUser, FacebookUser } from '../../types/User';

import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';

declare const FB: any;

import { AngularIonicSocialLogin } from 'angular-ionic-social-login';

import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, NgIf, AngularIonicSocialLogin],
})
export class SigninComponent implements OnInit {
  googleClientKey: string = env.googleClientKey;
  facebookClientKey: string = env.facebookClientKey;

  constructor(
    private router: Router,
    protected user: UserService,
    private log: LogService
  ) {
    if (!isPlatform('capacitor')) {
    }
  }

  googleUserReceived(user: GoogleUser) {
    this.SignedIn(user, 'Google');
  }

  facebookUserReceived(user: FacebookUser) {
    this.SignedIn(user, 'Facebook');
  }

  ngOnInit() {
    this.log.debug('LoginComponent.ngOnInit()');
    this.InitLogoutListener();
  }

  SignedIn(user: GoogleUser | FacebookUser, provider: 'Google' | 'Facebook') {
    this.log.debug('LoginComponent.SignedIn()', user);
    this.user.SignIn(user, provider);
  }

  async SignOut() {
    if (this.user.currentUser?.GoogleUser) {
      await GoogleAuth.signOut();
    } else if (this.user.currentUser?.FacebookUser) {
      await FacebookLogin.logout();
    }
  }

  InitLogoutListener() {
    this.user.logoutEmitter.subscribe(
      async (doLogout: boolean) => {
        if (doLogout) {
          await this.SignOut();
          await this.router.navigate(['/login']);
        }
      },
      (err: any) => {
        this.log.error(
          "Something wen't wrong while trying to log you out.",
          err
        );
      }
    );
  }
}
