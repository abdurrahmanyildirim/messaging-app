import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertifyService: AlertifyService
  ) { }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if (this.authService.getCurrentAccountRole() == 'Admin') {
      return true;
    } else {
      this.router.navigateByUrl('/chat');
      this.alertifyService.error("Yetkisiz giriş!s")
      return false;
    }
  }
}
