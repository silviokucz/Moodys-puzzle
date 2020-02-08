import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { map } from 'rxjs/operators';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  symbol: string;
  period: string;

  fromDate:Date
  toDate:Date 

  today = new Date()

  quotes$ = this.priceQuery.priceQueries$.pipe(map(data => {
    return data.filter(d => {
      const dt = new Date(d[0]);
      return (dt >= this.fromDate && dt <= this.toDate);
    }
      )
  }));

  // timePeriods = [
  //   { viewValue: 'All available data', value: 'max' },
  //   { viewValue: 'Five years', value: '5y' },
  //   { viewValue: 'Two years', value: '2y' },
  //   { viewValue: 'One year', value: '1y' },
  //   { viewValue: 'Year-to-date', value: 'ytd' },
  //   { viewValue: 'Six months', value: '6m' },
  //   { viewValue: 'Three months', value: '3m' },
  //   { viewValue: 'One month', value: '1m' }
  // ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      period: [null, Validators.required],
      fromDate: [null],
      toDate: [null]

    });
  }

  ngOnInit() {}

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, period } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, period);
    }
  }

  dateChanged(event) {
    if (this.stockPickerForm.value.fromDate && this.stockPickerForm.value.toDate) {

      this.fromDate = new Date(this.stockPickerForm.value.fromDate);
      this.toDate = new Date(this.stockPickerForm.value.toDate);

      const symbol = this.stockPickerForm.value.symbol;

      if(this.toDate > new Date()) {
        this.toDate = new Date()
      }

      if (this.fromDate > this.toDate) {
        this.fromDate = this.toDate;
      }
      

      this.priceQuery.fetchQuote(symbol, 'max');

    }
  }

}
