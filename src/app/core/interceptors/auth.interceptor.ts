import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const router = inject(Router);

  // Rutas que no necesitan token en el header pero sí withCredentials
  if (req.url.includes('/auth/login') || 
      req.url.includes('/register') || 
      req.url.includes('/auth/logout')) {
    return next(req.clone({ 
      withCredentials: true 
    }));
  }

  // Para el resto de las peticiones, incluir el token en el header
  const clonedRequest = req.clone({ 
    withCredentials: true
  });

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};
