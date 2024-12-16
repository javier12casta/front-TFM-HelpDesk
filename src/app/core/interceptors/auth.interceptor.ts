import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const router = inject(Router);

  // Clonar la petición agregando withCredentials: true para todas las peticiones
  const clonedRequest = req.clone({ 
    withCredentials: true
  });
  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        router.navigate(['/auth/login']);
      }
      return throwError(error);
    })
  );
};
