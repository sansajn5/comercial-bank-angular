import { Toast, ToastrService } from "ngx-toastr";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "../../../core/services/local-storage.service";
import { LocalDataSource } from "ng2-smart-table";
import { CurrencyService } from '../../../core/services/currency.service';

@Component({
    selector: 'app-currency',
    templateUrl: './currency.component.html'
})
export class CurrencyComponent implements OnInit {

    @ViewChild('table') table;
    public source: LocalDataSource;
    public data;
    public rowSelected;
    public edit = false;

    constructor(
        private router: Router,
        private toastService: ToastrService,
        private localStorageService: LocalStorageService,
        private currencyService: CurrencyService
    ) {}

    ngOnInit() {
        this.getCurrencys();
    }

    settings = {
        mode: 'inline',
        actions: {
            add: false,
            edit: false
        },
        delete: {
            confirmDelete: true
        },
        columns: {
          name: {
            title: 'Name'
          },
          code: {
            title: 'Code'
          }
        }
    };

    setNext() {
        let selected = -1;
        for(let i= 0; i< this.table.grid.dataSet.rows.length; i++) {
          if(this.table.grid.dataSet.rows[i].isSelected) {
            selected = this.table.grid.dataSet.rows[i].index;
            this.table.grid.dataSet.rows[i].isSelected = false;
          }
          if(selected !== -1 ) {
            if(selected === this.table.grid.dataSet.rows.length -1) {
              this.table.grid.dataSet.rows[0].isSelected = true;
              this.rowSelected = this.table.grid.dataSet.rows[0].data.mark;
              break;
            } else {
              this.table.grid.dataSet.rows[selected+1].isSelected = true;
              this.rowSelected = this.table.grid.dataSet.rows[selected+1].data.mark;
              break;
            }
          }
        }
    }
  
    setPrev() {
        let selected = -1;
        for(let i= 0; i< this.table.grid.dataSet.rows.length; i++) {
          if(this.table.grid.dataSet.rows[i].isSelected) {
            selected = this.table.grid.dataSet.rows[i].index;
            this.table.grid.dataSet.rows[i].isSelected = false;
          }
          if(selected !== -1 ) {
            if(selected === 0) {
              this.table.grid.dataSet.rows[this.table.grid.dataSet.rows.length-1].isSelected = true;
              this.rowSelected = this.table.grid.dataSet.rows[this.table.grid.dataSet.rows.length-1].data.mark;
              break;
            } else {
              this.table.grid.dataSet.rows[selected-1].isSelected = true;
              this.rowSelected = this.table.grid.dataSet.rows[selected-1].data.mark;
              break;
            }
          }
        }
    }

    getCurrencys() {
        this.currencyService.getAllForBank().toPromise()
        .then(response => {
            this.data = response.data;
            this.source = new LocalDataSource(this.data);
        })
    }

    rowSelectedOnClick(event) {
        this.rowSelected = event.data._id
        this.edit = true;
    }

    onAdd() {
        this.router.navigateByUrl('/dashboard/currency/0')
    }

    onDelete(event) {
        const id = event.data._id;
        this.currencyService.deleteCurrency(id).toPromise()
        .then(data => {
            this.toastService.clear();
            this.toastService.info(`Removed currency ${event.data.name}`,'Info.')
            this.getCurrencys()
        })
        .catch(err => {
            this.toastService.clear();
            this.toastService.error(`${err.error.error}`,'Error!')
        });
    }

    onEdit(event) {
        this.router.navigateByUrl(`/dashboard/currency/${this.rowSelected}`)
    }
}