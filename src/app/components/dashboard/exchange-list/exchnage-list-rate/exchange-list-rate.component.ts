import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExchangeService } from '../../../../core/services/exchange.service';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
    selector: 'app-exchange-list-rate',
    templateUrl: './exchange-list-rate.component.html'
})
export class ExchangeListRateComponent implements OnInit {

    @ViewChild('table') table;
    public source: LocalDataSource;
    public data;
    public rowSelected;
    public edit = false;
    public litsId;

    constructor(
        private route: ActivatedRoute,
        private toastService: ToastrService,
        private exchangeService: ExchangeService,
        private router: Router
    ) 
    {}

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
          fromCurrency: {
            title: 'From',
            valuePrepareFunction: currency => {
                return currency.code
            },
            filter: true,
            filterFunction(cell: any, search?: string): boolean {
             return (cell.name.toLowerCase().includes(search.toLowerCase())) ? true : false;
            }
          },
          toCurrency: {
            title: 'To',
            valuePrepareFunction: currency => {
                return currency.code
            },
            filter: true,
            filterFunction(cell: any, search?: string): boolean {
             return (cell.name.toLowerCase().includes(search.toLowerCase())) ? true : false;
            }
          },
          value: {
              title: 'Value'
          }
        }
    };

    ngOnInit() {
        this.litsId = this.route.snapshot.params.id
        this.getRates()
    }

    getRates() {
        this.exchangeService.getRates(this.litsId).toPromise()
        .then(response => {
            this.data = response.data.list;
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
        this.router.navigateByUrl(`/dashboard/exchange-list-rate/${this.litsId}/0`)
    }

    onDelete(event) {
        const id = event.data._id;
        this.exchangeService.deleteRate(id).toPromise()
        .then(data => {
            this.toastService.clear();
            this.toastService.info(`Removed exchange rate`,'Info.')
            this.getRates()
        })
        .catch(err => {
            this.toastService.clear();
            this.toastService.error(`${err.error.error}`,'Error!')
        });
    }

    onEdit(event) {
        this.router.navigateByUrl(`/dashboard/exchange-list-rate/${this.litsId}/${this.rowSelected}`)
    }
}