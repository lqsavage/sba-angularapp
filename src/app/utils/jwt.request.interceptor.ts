import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TOKEN_PREFIX } from '../models/constants';

@Injectable()
export class JwtRequestInterceptor implements HttpInterceptor {
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token: string = "";
        let logedUser = JSON.parse(localStorage.getItem('logedUser'));
        if (logedUser && logedUser.token)
            token = `${TOKEN_PREFIX}${logedUser.token}`;
        let language = localStorage.getItem("locale");
        request = request.clone({
            headers: request.headers
                .set('Authorization', token)
                .set('Accept-Language', language)
        });
        return next.handle(request);
    }
}