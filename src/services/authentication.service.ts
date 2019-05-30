import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  urlBase = environment.urlBase;

  constructor(private http: HttpClient) { }

  /**
   * LoginUser hace el inicio de sesion del usuario
   */
  public LoginUser(body: {username: string, password: string}): Promise<User> {
    const url = this.urlBase + '/login';

    return this.http.post<User>(url, body).toPromise();
  }

  /**
   * LogoutUser hace el cierre de sesion en el servidor
   */
  public LogoutUser() {
    localStorage.clear();
  }
}
