import { Component, NgZone, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserService } from '../../services/user.service';
import { NgIf } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { LogService } from '../../services/log.service';
import { isPlatform } from '@ionic/angular';
import {
  GoogleAuth,
  InitOptions,
} from '@codetrix-studio/capacitor-google-auth';
import { Observable } from 'rxjs';
import {
  FacebookLogin,
  FacebookLoginResponse,
} from '@capacitor-community/facebook-login';
import { GoogleUser, FacebookUser, NimbelWearUser } from '../../types/User';

declare const Typewriter: any;
declare const FB: any;

const FACEBOOK_PERMISSIONS = ['email', 'public_profile'];

import { addIcons } from 'ionicons';
import { logoFacebook, logoGoogle } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf],
})
export class SigninComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    protected user: UserService,
    private zone: NgZone,
    private api: ApiService,
    private log: LogService
  ) {
    addIcons({
      logoFacebook,
      logoGoogle,
    });
    if (!isPlatform('capacitor')) {
      this.GetClientId().subscribe(
        (res: any) => {
          this.InitGoogleAuth(res.client_id);
        },
        (err: any) => {
          this.log.error('Oops! Something went wrong on our end', err);
        }
      );
      (async () => {
        await this.InitFB();
      })();
    }
  }

  ngOnInit() {
    this.log.debug('LoginComponent.ngOnInit()');

    this.InitLogoutListener();

    let cachedUser = localStorage.getItem('user');

    if (cachedUser) {
      let user = JSON.parse(cachedUser) as NimbelWearUser;

      if (user && user.GoogleUser) {
        this.SignedIn(user.GoogleUser, 'Google');
      } else if (user && user.FacebookUser) {
        this.SignedIn(user.FacebookUser, 'Facebook');
      }
    }
    console.log(cachedUser);
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

  async SignInFB() {
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
    this.Greet();
  }

  Greet() {
    this.router.navigate(['/']);
    // setTimeout(() => {
    //   new Typewriter('#signin-message', {
    //     strings: ['Signing in as ' + this.user.currentUser?.name],
    //     autoStart: true,
    //     delay: 30,
    //     pauseFor: 400,
    //     deleteSpeed: 15,
    //   }).callFunction(() => {
    //     this.zone.run(() => {
    //       this.router.navigate(['/']);
    //     });
    //   });
    // }, 0);
  }

  async SignOut() {
    if (this.user.currentUser?.GoogleUser) {
      await GoogleAuth.signOut();
    } else if (this.user.currentUser?.FacebookUser) {
      await FacebookLogin.logout();
    }
  }

  GetClientId(): Observable<any> {
    this.log.debug('LoginComponent.GetClientId()');

    return this.api.get('google/appsettings');
  }

  InitGoogleAuth(client_id: string) {
    this.log.debug('LoginComponent.InitGoogleAuth()');

    let options: InitOptions = {
      clientId: client_id,
      scopes: ['profile'],
      grantOfflineAccess: true,
    };
    GoogleAuth.initialize(options);
  }

  async InitFB() {
    await FacebookLogin.initialize({ appId: '3620876911459542' });
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
