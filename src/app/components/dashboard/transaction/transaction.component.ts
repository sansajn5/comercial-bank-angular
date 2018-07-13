import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import { TransactionService } from '../../../core/services/transaction.service';
import { LocalDataSource } from "ng2-smart-table";
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.component.html'
})
export class TransactionComponent implements OnInit {
    
    @ViewChild('table') table;
    public source: LocalDataSource;
    public data;
    public rowSelected;

    constructor(
        private router: Router,
        private transactionService: TransactionService
    ) {}

    ngOnInit() {
        this.getTransactions()
    }

    onScan() {
        this.router.navigateByUrl('dashboard/transaction-scan')
    }

    onFilter() {
        this.router.navigateByUrl('dashboard/transaction-filter')
    }

    getTransactions() {
        this.transactionService.getAllTransactions().toPromise()
        .then(response => {
            this.data = this.makeTransactionsOfData(response.data)
            console.log(this.data)
            this.source = new LocalDataSource(this.data);
        })
    }

    settings = {
        mode: 'inline',
        actions: {
            add: false,
            edit: false,
            delete: false
        },
        columns: {
            type: {
                title: 'Type'
            },
            sum: {
                title: 'Sum'
            },
            code: {
                title: 'Code'
            },
            emergency: {
                title: 'Emergency',
                valuePrepareFunction: element => {
                    return element ? 'Yes' : 'No';
                },
                filter: true,
                filterFunction(cell: any, search?: string): boolean {
                    const value = cell ? 'Yes' : 'No';
                    return (value.toLowerCase().includes(search.toLowerCase())) ? true : false;
                }
            },
            name: {
                title: 'Owner'
            },
            jmbg: {
                title: 'Owner JMBG'
            },
            purposeOfPayment: {
                title: 'Purpose'
            },
            accountCreditorXML: {
                title: 'Account number as Creditor'
            },
            debtorAccountXML: {
                title: 'Account number as Debtor'
            },
            paymentCurrencyXML: {
                title: 'Currency'
            }
        }
    };

    makeTransactionsOfData(data) {
        let transactions = [];
        data.forEach(element => {
            Object.keys(element).forEach(key => {
                if(key == 'states') {
                    if(element[key].length != 0) {
                        const name = element.owner.name;
                        const jmbg = element.owner.jmbg
                        element[key].forEach(insideElement => {
                            Object.keys(insideElement).forEach(keyInStates => {
                                if(keyInStates == 'transaction'){
                                    transactions.push(this.createElementForTable(insideElement[keyInStates], name, jmbg))
                                }
                            })
                        })
                    }
                }
            })
        })
        return transactions;
    }

    createElementForTable(el, name, jmbg) {
        return {
            _id: el._id,
            name: name,
            jmbg: jmbg,
            type: el.type,
            sum: el.sum,
            code: el.code,
            emergency: el.emergency,
            purposeOfPayment: el.purposeOfPayment,
            accountCreditorXML: el.accountCreditorXML,
            debtorAccountXML: el.debtorAccountXML,
            paymentCurrencyXML: el.paymentCurrencyXML
        }
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
    }
}