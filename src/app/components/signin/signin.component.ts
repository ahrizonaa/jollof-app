import { Component, NgZone, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgIf } from '@angular/common';
import { ApiService } from '../../services/api.service';
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

const FACEBOOK_PERMISSIONS = ['email', 'public_profile'];

import { addIcons } from 'ionicons';
import { logoFacebook, logoGoogle } from 'ionicons/icons';
import { ConfigService } from 'src/app/services/config.service';

import { IonicSocialLoginComponent } from 'ionic-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, NgIf, IonicSocialLoginComponent],
})
export class SigninComponent implements OnInit, AfterViewInit {
  googleClientKey: string = '';
  facebookClientKey: string = '';

  constructor(
    private router: Router,
    protected user: UserService,
    private log: LogService,
    private config: ConfigService
  ) {
    addIcons({
      logoFacebook,
      logoGoogle,
    });

    if (!isPlatform('capacitor')) {
      this.config.googleClientId.subscribe((clientId: string) => {
        this.googleClientKey = clientId;

        this.config.facebookAppId.subscribe(async (appId: string) => {
          this.facebookClientKey = appId;
        });
      });
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

  ngAfterViewInit() {
    this.log.debug('LoginComponent.ngAfterViewInit()');
  }

  async SignInGoogle() {
    let user = await GoogleAuth.signIn();
    if (user.email) {
      this.SignedIn(user, 'Google');
    }
  }

  async SignInFacebook() {
    const result: FacebookLoginResponse = await FacebookLogin.login({
      permissions: FACEBOOK_PERMISSIONS,
    });

    if (result.accessToken && result.accessToken.token) {
      let user: FacebookUser = await FacebookLogin.getProfile({
        fields: ['email', 'name', 'picture'],
      });
      if (user.email) {
        this.SignedIn(user, 'Facebook');
      }
    }
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

  InitGoogle(clientId: string) {
    this.log.debug('LoginComponent.InitGoogleAuth()');

    let options: InitOptions = {
      clientId: clientId,
      scopes: ['profile'],
      grantOfflineAccess: true,
    };
    GoogleAuth.initialize(options);
  }

  async InitFacebook(appId: string) {
    await FacebookLogin.initialize({ appId });
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
