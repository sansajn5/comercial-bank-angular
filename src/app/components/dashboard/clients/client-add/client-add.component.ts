import { ClientService } from "../../../../core/services/client.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, AbstractControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { ToastrService } from "ngx-toastr";
import { ApiService } from '../../../../core/services/api.service';

@Component({
    selector: 'app-client-add',
    templateUrl: './client-add.component.html'
})
export class ClientAddComponent implements OnInit {

    public mode;
    public form: FormGroup;
    public formExtra: FormGroup;
    public name: AbstractControl;
    public address: AbstractControl;
    public phone: AbstractControl;
    public JMBG: AbstractControl;
    public email: AbstractControl; 
    public legal: boolean = false;
    public pib: AbstractControl;
    public taxAuthority: AbstractControl;
    public deliveryAddress: AbstractControl;
    public responsiblePerson: AbstractControl;
    public clientType: string = "Individual"
    public changeClientType: string = "Legal"
    public modeText: string = 'Add';
    public bank;

    constructor(
        private clientService: ClientService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private localStorageService: LocalStorageService,
        private toastService: ToastrService,
        private router: Router
    ) {}

    ngOnInit() {
        this.mode = this.route.snapshot.params.id;
        this.bank = this.localStorageService.getBank();
        if(this.mode != 0) {
            this.modeText = 'Edit';
            this.loadValues(this.mode)
        } else {
            this.modeText = 'Add'
        }
        this.buildClassicForm();
    }

    buildClassicForm() {
        this.form = this.fb.group({
            'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            'address': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            'phone': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            'JMBG': ['', Validators.compose([Validators.required, Validators.minLength(5),Validators.maxLength(13)])],
            'email': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
        });
      
        this.name = this.form.controls['name'];
        this.address = this.form.controls['address'];
        this.phone = this.form.controls['phone'];
        this.JMBG = this.form.controls['JMBG'];
        this.email = this.form.controls['email'];
    }

    public onLegal() {
        this.legal = !this.legal
        if(this.legal) {
            this.clientType = 'Legal';
            this.changeClientType = 'Individual'
            this.buildExtraForm();
        } else {
            this.changeClientType = 'Legal';
            this.clientType = 'Individual'
        }
    }

    buildExtraForm() {
        this.formExtra = this.fb.group({
            'pib': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            'taxAuthority': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            'deliveryAddress': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            'responsiblePerson': ['', Validators.compose([Validators.required, Validators.minLength(5)])]
        });
      
        this.pib = this.formExtra.controls['pib'];
        this.taxAuthority = this.formExtra.controls['taxAuthority'];
        this.deliveryAddress = this.formExtra.controls['deliveryAddress'];
        this.responsiblePerson = this.formExtra.controls['responsiblePerson'];
    }

    public onSave() {
        let body:any = {
            name: this.name.value,
            address: this.address.value,
            phone: this.phone.value,
            jmbg: this.JMBG.value,
            email: this.email.value,
            bank: this.bank._id
        }
        if(this.legal) {
            body.legal = true;
            body.pib = this.pib.value;
            body.taxAuthority = this.taxAuthority.value;
            body.deliveryAddress = this.deliveryAddress.value;
            body.responsiblePerson = this.responsiblePerson.value;
        }
        if(this.mode == 0) {
            this.clientService.createClient(body).toPromise()
            .then(data => {
                this.toastService.clear();
                this.toastService.info(`Added new client`,'Info.')
                this.router.navigateByUrl('/dashboard/clients')
            })
            .catch(err => {
                this.toastService.clear();
                this.toastService.error(`${err.error.error}`,'Error!')
            });
        } else {
            this.clientService.editClient(this.mode, body).toPromise()
            .then(data => {
                this.toastService.clear();
                this.toastService.info(`Edited client`,'Info.')
                this.router.navigateByUrl('/dashboard/clients')
            })
            .catch(err => {
                this.toastService.clear();
                this.toastService.error(`${err.error.error}`,'Error!')
            });
        }
    }

    public loadValues(id) {
        this.clientService.getClient(id).toPromise()
        .then(response => {
            this.name.setValue(response.data.name);
            this.address.setValue(response.data.address);
            this.phone.setValue(response.data.phone);
            this.JMBG.setValue(response.data.jmbg);
            this.email.setValue(response.data.email);
            if(response.data.legal) {
                this.buildExtraForm();
                this.legal = true;
                this.pib.setValue(response.data.pib);
                this.taxAuthority.setValue(response.data.taxAuthority);
                this.deliveryAddress.setValue(response.data.deliveryAddress);
                this.responsiblePerson.setValue(response.data.responsiblePerson);
            }
        })
        .catch(err => {
            this.toastService.clear();
            this.toastService.error(`${err.error.error}`,'Error!')
        });
    }
}