import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LogService } from './log.service';
import { GoogleUser, FacebookUser, NimbelWearUser } from '../types/User';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser: NimbelWearUser | null = null;
  logoutEmitter: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private log: LogService, private router: Router) {}

  SignIn(user: GoogleUser | FacebookUser, provider: 'Google' | 'Facebook') {
    switch (provider) {
      case 'Google':
        let ug = user as GoogleUser;
        this.currentUser = {
          email: ug.email,
          name: ug.name,
          imgUrl: ug.imageUrl,
          id: ug.id,
          GoogleUser: ug,
          FacebookUser: null,
        };
        break;
      case 'Facebook':
        let uf = user as FacebookUser;
        this.currentUser = {
          email: uf.email,
          name: uf.name,
          imgUrl: uf.picture.url,
          id: uf.id,
          GoogleUser: null,
          FacebookUser: uf,
        };
        break;
      default:
        this.log.error(`Unknown provider: ${provider}`);
        this.currentUser = null;
        break;
    }

    localStorage.setItem('user', JSON.stringify(this.currentUser));

    this.router.navigate(['/']);
  }

  Register(profile: any) {
    if (this.currentUser != null) {
      this.currentUser.profile = profile;
      localStorage.setItem('user', JSON.stringify(this.currentUser));
      this.router.navigate(['/']);
    }
  }

  async SignOut(params?: any) {
    this.currentUser = null;
    localStorage.removeItem('user');
    this.logoutEmitter.next(true);
  }
}
