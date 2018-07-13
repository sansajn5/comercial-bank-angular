import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LocalStorageService } from './local-storage.service';
import { Observable } from 'rxjs/Observable';

@Injectable() 
export class BankAccountService {

    constructor(
        private apiService: ApiService,
        private localStorageService: LocalStorageService
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
}