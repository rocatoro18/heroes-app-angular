import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { catchError, map, Observable, of, pipe, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = environments.baseUrl;
  private user?: User;

  constructor(private http: HttpClient) { }

  get currentUser(): User | undefined {
    if(!this.user) return undefined;
    // SE HACE EL DEEP CLONE PARA EVITAR EL PASO POR REFERENCIA? o USAR EL OPERADOR SPREAD SIEMPRE
    // Y CUANDO NO SE TENGAN MUCHOS OBJETOS ANIDADOS
    return structuredClone (this.user);
  }

  login(email: string, password: string): Observable<User>{
    // http.post('login',{email,password});
    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap(user => this.user = user),
        tap(user => localStorage.setItem('token', 'gsfshdas.sdfsdfsadgtsdf.sdfasdfgf'))
        // TAMBIEN SE PUEDE AGREGAR UN CATCH ERROR PARA MANEJAR LOS ERRORES
      );
  }

  checkAuthentication(): Observable<boolean>{

    // SE USA EL OF PORQUE SE REGRESA UN VALOR BOOLEANO DE OBSERVABLE
    // O TAMBIEN PODEMOS REGRESAR UN BOOLEANO
    //if(!localStorage.getItem('token')) false;
    if(!localStorage.getItem('token')) return of(false);

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap(user => this.user = user),
        // CON LA DOBLE NEGACION ME ASEGURO QUE SEA UN VALOR BOOLEANO LO QUE ESTOY REGRESANDO
        map(user => !!user),
        catchError(err => of(false))
      );

  }

  logout() {
    this.user = undefined;
    localStorage.clear();
  }

}
