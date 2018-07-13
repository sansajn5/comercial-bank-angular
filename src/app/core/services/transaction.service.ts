import { Injectable } from "@angular/core";
import { LocalStorageService } from './local-storage.service';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';

@Injectable() 
export class TransactionService {

    constructor(
        private localStorageService: LocalStorageService,
        private apiService: ApiService
    ) {}

    scanDocument(body): Observable<any> {
        return this.apiService.post(`parse`, body)
    }

    makeDocument(body): Observable<any> {
        const id = this.localStorageService.getBank()._id;
        return this.apiService.post(`transactions/${id}`, body)
    }

    getAllTransactions(): Observable<any> {
        const id = this.localStorageService.getBank()._id;
        return this.apiService.get(`transactions-find/${id}`)
    }

    findBetween(body, id): Observable<any> {
        return this.apiService.post(`transactions-find/${id}`, body)
    }
}