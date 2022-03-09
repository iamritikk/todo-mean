import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, throwError } from 'rxjs';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(public dialog: MatDialog) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        // console.log('our error-interceptor', err);
        // alert(err.error.status.message);
        let errorMessage = 'Unknown error';
        if (err.error.status.message) {
          errorMessage = err.error.status.message;
        }

        this.dialog.open(ErrorComponent, {
          data: { message: errorMessage },
        });
        return throwError(err);
      })
    );
  }
}
