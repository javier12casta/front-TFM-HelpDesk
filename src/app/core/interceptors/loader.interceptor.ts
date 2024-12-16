import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../services/loader.service';

let totalRequests = 0;

export const LoaderInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const loaderService = inject(LoaderService);
  
  totalRequests++;
  loaderService.show();

  return next(req).pipe(
    finalize(() => {
      totalRequests--;
      if (totalRequests === 0) {
        loaderService.hide();
      }
    })
  );
}; 