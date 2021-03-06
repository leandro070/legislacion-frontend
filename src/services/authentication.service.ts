import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/models/user';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  urlBase = environment.urlBase;

  constructor(private http: HttpClient, private storage: StorageService) { }

  /**
   * LoginUser hace el inicio de sesion del usuario
   */
  public LoginUser(body: {username: string, password: string}): Promise<User> {
    const url = this.urlBase + '/login';

    return this.http.post<User>(url, body).toPromise();
  }

  /**
   * ValidateToken
   */
  public ValidateToken(): Promise<User> {
    return new Promise((resolve, reject) => {
      const url = this.urlBase + '/userByToken';
      const token = this.getToken();
      if (!token) {
        reject(null);
      }
      this.http.get<User>(url).toPromise()
      .then((user) => {
        if(user) {
          resolve(user);
        }
      }, err => {
        reject(err.errors);
      });
    });
  }

  /**
   * LogoutUser hace el cierre de sesion en el servidor
   */
  public LogoutUser() {
    localStorage.clear();
  }

  public getToken() {
    return this.storage.getValue('token');
  }
}
