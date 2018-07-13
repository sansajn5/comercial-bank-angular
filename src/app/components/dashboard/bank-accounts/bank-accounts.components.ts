import { Component, OnInit, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { LocalDataSource } from "ng2-smart-table";
import { BankAccountService } from "../../../core/services/bank-account.service";
import { DatePipe } from "@angular/common";
import * as FileSaver from 'file-saver'; 

@Component({
    selector: 'app-bank-accounts',
    templateUrl: './bank-accounts.component.html'
})
export class BankAccountComponent implements OnInit {

    @ViewChild('table') table;
    public source: LocalDataSource;
    public data;
    public rowSelected;
    public edit = false;

    constructor(
        private toastService: ToastrService,
        private router: Router,
        private bankAccountService: BankAccountService
    ) {}

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
          number: {
            title: 'Number'
          },
          owner: {
            title: 'Owner',
            valuePrepareFunction: owner => {
                return owner.name
            },
            filter: true,
            filterFunction(cell: any, search?: string): boolean {
             return (cell.name.toLowerCase().includes(search.toLowerCase())) ? true : false;
            }
          },
          currency: {
            title: 'Currency',
            valuePrepareFunction: currency => {
                return currency.code
            },
            filter: true,
            filterFunction(cell: any, search?: string): boolean {
             return (cell.name.toLowerCase().includes(search.toLowerCase())) ? true : false;
            }
          },
          valid: {
            title: 'Valid',
            valuePrepareFunction: element => {
                return element ? 'Yes' : 'No';
            },
            filter: true,
            filterFunction(cell: any, search?: string): boolean {
                const value = cell ? 'Yes' : 'No';
                return (value.toLowerCase().includes(search.toLowerCase())) ? true : false;
            }
          },
          mailReporting: {
            title: 'Mail Reporting',
            valuePrepareFunction: element => {
                return element ? 'Yes' : 'No';
            },
            filter: true,
            filterFunction(cell: any, search?: string): boolean {
                const value = cell ? 'Yes' : 'No';
                return (value.toLowerCase().includes(search.toLowerCase())) ? true : false;
            }
          },
          createdDate: {
              title: 'Created Date',
              valuePrepareFunction: element => {
                return new DatePipe('en-US').transform(element);
            },
                filterFunction(cell: any, search?: string): boolean {
                    return (new DatePipe('en-US').transform(cell).toString().toLowerCase().includes(search)) ? true : false;
                }
            }
        }
    };

    ngOnInit() {
        this.getBankAccounts();
    }

    onPdf() {
        localStorage.setItem('stop','1')
        this.bankAccountService.generatePdf({list:this.data}).toPromise()
        .then(data => {
            let file = new Blob([data], { type: 'application/pdf' });
            FileSaver.saveAs(file, 'bank account')
            localStorage.removeItem('stop')     
        })
    }
    getBankAccounts() {
        this.bankAccountService.getAllForBank().toPromise()
        .then(response => {
            this.data = response.data;
            this.source = new LocalDataSource(this.data)
        })
        .catch(err => {
            this.toastService.clear();
            this.toastService.error(`${err.error.error}`,'Error!')
        });
    }

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

    rowSelectedOnClick(event) {
        this.rowSelected = event.data._id
        this.edit = true;
    }

    onAdd() {
        this.router.navigateByUrl('/dashboard/bank-account/0')
    }

    onDelete(event) {
        const id = event.data._id;
        this.bankAccountService.deleteBankAccount(id).toPromise()
        .then(data => {
            this.toastService.clear();
            this.toastService.info(`Removed bank account of ${event.data.owner.name}`,'Info.')
            this.getBankAccounts()
        })
        .catch(err => {
            this.toastService.clear();
            this.toastService.info(`Removed bank account of ${event.data.owner.name}`,'Info.')
            this.getBankAccounts()
        });
    }

    onEdit(event) {
        this.router.navigateByUrl(`/dashboard/bank-account/${this.rowSelected}`)
    }
}