import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class CurrencyService {

    constructor(
        private apiService: ApiService,
        private localStorageService: LocalStorageService
    ) {}

    getAllForBank(): Observable<any> {
        const bankId = this.localStorageService.getBank()._id;
        return this.apiService.get(`banks/${bankId}/currencys`)
    }

    createCurrency(body): Observable<any> {
        return this.apiService.post('currencys', body)
    }

    getCurrency(id): Observable<any> {
        return this.apiService.get(`currencys/${id}`)
    }

    deleteCurrency(id): Observable<any> {
        const bankId = this.localStorageService.getBank()._id;
        return this.apiService.delete(`currencys/${bankId}/${id}`)
    }

    editCurrency(id, body): Observable<any> {
        return this.apiService.put(`currencys/${id}`, body)
    }
}