import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, GuardResult, MaybeAsync, Router, UrlSegment, RouterStateSnapshot } from '@angular/router';
import { map, Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PublicGuard implements CanMatch, CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  private checkAuthStatus() : boolean | Observable<boolean> {
    return this.authService.checkAuthentication()
      .pipe(
        tap(isAuthenticated => console.log('isAuthenticated:',isAuthenticated)),
        tap(isAuthenticated => {
          if(isAuthenticated){
            this.router.navigate(['./']);
          }
        }),
        // SE HACE ESTO PARA QUE LO DEJE PASAR CUANDO NO ESTE AUTENTICADO,
        // POR ESO LO ESTOY DEJANDO PASAR CON EL VALOR OPUESTO
        map(isAuthenticated => !isAuthenticated)
      );
  }

  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    return this.checkAuthStatus();
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return this.checkAuthStatus();
  }

}
