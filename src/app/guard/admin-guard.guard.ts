import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { LoginService } from "../services/login.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AdminPermissionsService implements CanActivate{
  constructor(private router: Router, private authService : LoginService) {}

  canActivate(): boolean {
  try {
    let  admin = sessionStorage.getItem('adminCookie');

    if (admin == "true") {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
} catch (error) {
  return false;
}
  }
}
