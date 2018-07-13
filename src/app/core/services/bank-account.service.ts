import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LocalStorageService } from './local-storage.service';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable() 
export class BankAccountService {

    constructor(
        private apiService: ApiService,
        private localStorageService: LocalStorageService,
        private http: HttpClient
    ) {}

    getAllForBank(): Observable<any> {
        const bankId = this.localStorageService.getBank()._id;
        return this.apiService.get(`banks/${bankId}/accounts`)
    }

    getBankAccount(id): Observable<any> {
        return this.apiService.get(`bank-accounts/${id}`)
    }

    createBankAccount(body): Observable<any> {
        const bankId = this.localStorageService.getBank()._id;
        return this.apiService.post(`banks/${bankId}/accounts`, body)
    }

    deleteBankAccount(id): Observable<any> {
        return this.apiService.delete(`bank-accounts/${id}`)
    }

    editBankAccount(id, body): Observable<any> {
        return this.apiService.put(`bank-accounts/${id}`, body)
    }

    generatePdf(body): Observable<any> {
        return this.http.post('http://localhost:8080/api/pdf/bank-accounts', body, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: 'blob' });
    }
}