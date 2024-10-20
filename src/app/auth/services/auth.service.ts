import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, pipe, tap } from 'rxjs';

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
        tap(user => localStorage.setItem('token', user.id.toString()))
        // TAMBIEN SE PUEDE AGREGAR UN CATCH ERROR PARA MANEJAR LOS ERRORES
      );
  }

}
