import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiService {

    constructor(
        private http: HttpClient
    ) {}

    get(path: string): Observable<any> {
        return this.http.get(`${environment.api_url}/${path}`)
    }

    post(path: string, body: Object): Observable<any> {
        return this.http.post(`${environment.api_url}/${path}`, body)
    }

    delete(path: string): Observable<any> {
        return this.http.delete(`${environment.api_url}/${path}`);
    }

    put(path: string, body: any): Observable<any> {
        return this.http.put(`${environment.api_url}/${path}`, body);
    }

}