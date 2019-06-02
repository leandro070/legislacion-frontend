import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authServ: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authServ.getToken();
    if (token) {
      const authReq = request.clone({
        headers: request.headers.set(
          'Authorization', `Beaver ${token}`
        )
      });
      // Pass on the cloned request instead of the original request.
      return next.handle(authReq);
    }

    return next.handle(request);
  }
}
