import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LocalStorageService } from './local-storage.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ExchangeService {

    constructor(
        private localStorageService: LocalStorageService,
        private apiService: ApiService
    ) {}

    getAllLists(): Observable<any> {
        const id = this.localStorageService.getBank()._id;
        return this.apiService.get(`banks/${id}/exchange-lists`)
    }

    createList(body): Observable<any> {
        const id = this.localStorageService.getBank()._id;
        return this.apiService.post(`banks/${id}/exchange-lists`, body)
    }

    deleteList(id): Observable<any> {
        return this.apiService.delete(`exchange-lists/${id}`)
    }

    getRates(id): Observable<any> {
        return this.apiService.get(`exchange-lists/${id}`)
    }

    createRate(id, body): Observable<any> {
        return this.apiService.post(`exchange-lists/${id}`, body)
    }

    deleteRate(id): Observable<any> {
        return this.apiService.delete(`exchange-lists-rate/${id}`)
    }

    getRate(id): Observable<any> {
        return this.apiService.get(`exchange-lists-rate/${id}`)
    }

    editRate(id, body): Observable<any> {
        return this.apiService.put(`exchange-lists-rate/${id}`, body)
    }
}