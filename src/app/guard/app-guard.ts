import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

const AppGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const user = inject(UserService);
  // 👇 Redirects to another route
  if (!user.currentUser || !user.currentUser.email) {
    return inject(Router).createUrlTree(['/', 'login']);
  }

  return true;
};

export default AppGuard;
