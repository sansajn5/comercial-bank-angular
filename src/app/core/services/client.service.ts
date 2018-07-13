import { Injectable } from "@angular/core";
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class ClientService {

    constructor(
        private apiService: ApiService,
        private localStorageService: LocalStorageService
    ) {}

    getAll(): Observable<any> {
        return this.apiService.get('clients');
    }

    getAllForBank(): Observable<any> {
        const bankId = this.localStorageService.getBank()._id;
        return this.apiService.get(`banks/${bankId}/clients`);
    }

    deleteClient(id): Observable<any> {
        return this.apiService.delete(`clients/${id}`)
    }

    createClient(body): Observable<any> {
        return this.apiService.post('clients', body)
    }

    getClient(id): Observable<any> {
        return this.apiService.get(`clients/${id}`)
    }

    editClient(id, body): Observable<any> {
        return this.apiService.put(`clients/${id}`, body);
    }
}