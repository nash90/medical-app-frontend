import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private storage: Storage, private navCtrl: NavController) { }

  // Intercepts all HTTP requests!
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const tokenObs = from(this.storage.get('ACCESS_TOKEN')).pipe(map(
      (token) => {
        // console.log('point 1', token);
        return token;
      })
    );

    return tokenObs.pipe(mergeMap(
      (token) => {
        // console.log('point 2', token);
        const clonedReq = this.addToken(request, token);
        return next.handle(clonedReq).pipe(
          catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.navCtrl.navigateRoot('/login');
            }
            //return err;
            const error = err.error || err.statusText;
            return throwError(error);
          }));
      }
    ));
  }
  // Adds the token to your headers if it exists
  private addToken(request: HttpRequest<any>, token: any): HttpRequest<any> {
    if (token) {
        let clone: HttpRequest<any>;
        clone = request.clone({
            setHeaders: {
                Accept: `application/json`,
                'Content-Type': `application/json`,
                'Authorization': 'JWT ' + token
            }
        });
        return clone;
    }

    return request;
  }
}
