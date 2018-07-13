import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExchangeService } from '../../../../core/services/exchange.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-exchange-list-add',
    templateUrl: './exchange-list-add.component.html'
})
export class ExchangeListAddComponent implements OnInit {

    public mode;
    public modeText: string = 'Add';
    public bank;
    public form: FormGroup;
    public createdDate: AbstractControl;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private localStorageService: LocalStorageService,
        private toastService: ToastrService,
        private router: Router,
        private exchangeService: ExchangeService
    ) {}

    ngOnInit() {
        this.bank = this.localStorageService.getBank();
        this.buildClassicForm();
    }

    buildClassicForm() {
        this.form = this.fb.group({
            'createdDate': [''],
        });
      
        this.createdDate = this.form.controls['createdDate'];
    }

    onSave() {
        let body: any = {
            createdDate: this.createdDate.value
        }
        this.exchangeService.createList(body).toPromise()
        .then(data => {
            this.toastService.clear();
            this.toastService.info(`Added new list`,'Info.')
            this.router.navigateByUrl('/dashboard/exchange-list')
        })
        .catch(err => {
            this.toastService.clear();
            this.toastService.error(`${err.error.error}`,'Error!')
        });
    }
}