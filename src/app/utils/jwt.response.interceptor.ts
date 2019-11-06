import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';
import { NavbarService } from './navbar.service';
import { UserService } from '../services/user.service';

@Injectable()
export class JwtResponseInterceptor implements HttpInterceptor {

    constructor(
        private navbarService: NavbarService,
        private userService: UserService,
        private router: Router
        
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
            }
        }, (err: any) => {
            /*if(err.error instanceof Error) {
                  console.log("Client-side error occured.");
               } else {
                  console.log("Server-side error occured.");
            }*/
            if (typeof err.error.message !== 'undefined')
                alert(err.error.message);
            else if (typeof err.error !== 'undefined')
                alert(err.error);
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    if (err.error.message === 'Token expired and not valid anymore') {
                        this.userService.logout();
                        this.navbarService.updateLoginStatus(false);
                        this.router.navigate(['home']);
                    }
                }
            }

        });
    }

}