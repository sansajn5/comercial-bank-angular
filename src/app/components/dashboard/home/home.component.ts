import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from '../../../core/services/local-storage.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    public bank;

    constructor(private localStorageService: LocalStorageService) {}

    ngOnInit() {
        this.bank = this.localStorageService.getBank();
    }
}