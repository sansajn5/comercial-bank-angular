import { OnInit, Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { ClientService } from '../../../core/services/client.service';
import { ToastrService } from "ngx-toastr";
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {

    @ViewChild('table') table;
    public source: LocalDataSource;
    public data;
    public rowSelected;
    public edit = false;

    constructor(
        private clientService: ClientService,
        private toastService: ToastrService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getClients()
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
          jmbg: {
            title: 'JMBG'
          },
          email: {
            title: 'Email'
          },
          legal: {
            title: 'Type',
            valuePrepareFunction: element => {
                return element ? 'Legal' : 'Individual';
            },
            filter: true,
            filterFunction(cell: any, search?: string): boolean {
                const value = cell ? 'Legal' : 'Individual';
                return (value.toLowerCase().includes(search.toLowerCase())) ? true : false;
            }
          },
          phone: {
              title: 'Phone'
          }
        }
    };

    getClients() {
        this.clientService.getAllForBank().toPromise()
        .then(response => {
            this.data = response.data
            this.source = new LocalDataSource(this.data);
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
        this.router.navigateByUrl('/dashboard/clients/0')
    }

    onDelete(event) {
        const id = event.data._id;
        this.clientService.deleteClient(id).toPromise()
        .then(data => {
            this.toastService.clear();
            this.toastService.info(`Removed client ${event.data.name}`,'Info.')
            this.getClients()
        })
        .catch(err => {
            this.toastService.clear();
            this.toastService.error(`${err.error.error}`,'Error!')
        });
    }

    onEdit(event) {
        this.router.navigateByUrl(`/dashboard/clients/${this.rowSelected}`)
    }

}