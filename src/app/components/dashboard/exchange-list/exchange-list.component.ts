import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';
import { ExchangeService } from '../../../core/services/exchange.service';

@Component({
    selector: 'app-exchange-list',
    templateUrl: './exchange-list.component.html'
})
export class ExchangeListComponent implements OnInit {

    @ViewChild('table') table;
    public source: LocalDataSource;
    public data;
    public rowSelected;

    constructor(
        private toastService: ToastrService,
        private router: Router,
        private exchangeService: ExchangeService
    ) {}

    ngOnInit() {
        this.getExchangeLists();
    }

    getExchangeLists() {
        this.exchangeService.getAllLists().toPromise()
        .then(response => {
            this.data = response.data;
            this.source = new LocalDataSource(this.data);
        })
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
        createdDate: {
            title: 'Start from',
                valuePrepareFunction: element => {
                return new DatePipe('en-US').transform(element);
                },
                filterFunction(cell: any, search?: string): boolean {
                    return (new DatePipe('en-US').transform(cell).toString().toLowerCase().includes(search)) ? true : false;
                }
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

    rowSelectedOnClick(event) {
        this.rowSelected = event.data._id
    }

    onAdd() {
        this.router.navigateByUrl('/dashboard/exchange-list-add')
    }

    onOpen() {
        this.router.navigateByUrl(`/dashboard/exchange-list-rate/${this.rowSelected}`)
    }

    onDelete(event) {
        const id = event.data._id;
        this.exchangeService.deleteList(id).toPromise()
        .then(data => {
            this.toastService.clear();
            this.toastService.info(`Removed list`,'Info.')
            this.getExchangeLists()
        })
        .catch(err => {
            this.toastService.clear();
            this.toastService.error(`${err.error.error}`,'Error!')
        });
    }

}