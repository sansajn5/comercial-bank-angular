import { Injectable } from "@angular/core";
import { CanActivate, Router} from '@angular/router';
import { AuthService } from "../services/auth.service";
import { ToastrService } from "ngx-toastr";
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService,
              private toastr: ToastrService) {
  }

  canActivate() {
    // Token and userId are set, token is valid, everything looks good, let user pass auth guard
    if (localStorage.getItem('token') && localStorage.getItem('user') && tokenNotExpired()) {
      return true;
    }

    // Token and userId are set, but token is not valid, redirect to login page and send notification
    if (localStorage.getItem('token') && localStorage.getItem('user') && !tokenNotExpired()) {
      this.toastr.clear();
      this.toastr.warning('Your secure token expired.(Token is valid for 60 minutes)', 'Token expired');
      localStorage.clear();
      this.router.navigate(['auth/sign-in']);
      return false;
    }

    this.toastr.clear();
    this.toastr.warning('Make sure that you are logged in in order to see this page.', 'Hint');
    this.router.navigate(['auth/sign-in']);
    return false;
  }

}