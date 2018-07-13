import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from './../services/local-storage.service';
import { Injectable, Injector } from "@angular/core";
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpInterceptor } from '@angular/common/http';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

    public config = {
        Accept: 'application/json',
    }

    constructor(
        private localStorageService: LocalStorageService,
        private router: Router,
        private spinnerService: Ng4LoadingSpinnerService
    ) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        this.spinnerService.show();
        if(this.localStorageService.existInStorage('token'))
            this.setTokenHeader();

        const request = req.clone({ setHeaders: this.config });
        return next.handle(request).do( response => {
            if(response instanceof HttpResponse)
                this.spinnerService.hide();
        }, error => {
            this.spinnerService.hide();
            if(error.status === 401 || error.status === 403)
                this.router.navigateByUrl('/auth/sign-in');
        });
    }

    setTokenHeader() {
        this.config['Authorization'] = this.localStorageService.getToken();
    }

}