import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../app/admin/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getTokenFromCookies();


    if (req.url.includes('/api/auth/login')) {
      return next.handle(req); 
    }
    if (authToken) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)
      });
      return next.handle(authReq);
    } else {
      console.warn('No token found, logging out...');
      this.authService.signOut(); 
      this.router.navigate(['/api/auth/login']); 
    }

    return new Observable<HttpEvent<any>>(); 
  }
}
