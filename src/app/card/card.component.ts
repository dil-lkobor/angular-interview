import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  isActive: boolean = false;
  deleting: boolean = false;
  walletts: any = [{
    amount: 4000,
    currency: 'HUF'
  }];
  amount: number = 0;
  fromCurrency: string = 'HUF';
  currency: string = 'EUR';
  convertedAmount: number = 0;
  exchangeRate: any = 0;
  amounts: object[] = [];

  constructor(private http: HttpClient) { }
 
  ngOnInit(): void {
  }

  onCurrencyChange(value: string) {
    this.currency = value;
  }

  onAmountChange() {
    this.http.get(
      `https://api.exchangeratesapi.io/latest?base=${this.fromCurrency}&symbols=${this.currency}`
      ).subscribe(responseData => {
        this.exchangeRate = Object.values(responseData['rates'])[0];
      });
    Math.round(this.convertedAmount = this.exchangeRate * this.amount);
  }

  clearForm() {
    this.amount = 0;
    this.currency = 'EUR'
    this.convertedAmount = 0;
  }

  addItem() {
    let data = {
      'id' : this.amounts.length,
      'amount' : this.amount,
      'fromCurrency' : this.fromCurrency,
      'currency' : this.currency,
      'convertedAmount' : +this.convertedAmount.toPrecision(2),
      'time' : new Date().toLocaleDateString()
    }

    if(this.amount !== 0) {
      if(this.amount > this.walletts[0].amount) {
        return ;
      }
      this.walletts[0].amount -= this.amount;
      
      if(this.walletts.some(i => i.currency === this.currency)){
        let pos = this.walletts.findIndex(i => i.currency === this.currency);
        this.walletts[pos].amount += +this.convertedAmount.toPrecision(2);
      } else {
        this.walletts.push({
          amount: +this.convertedAmount.toPrecision(2),
          currency: this.currency
        })
      }
      this.amounts.push(data)
      this.clearForm()
      this.isActive = true;
      setTimeout(function(){this.isActive = false}.bind(this), 2000);
    }
  }

  deleteItem(event: any) {
    this.deleting = true;
    setTimeout(function(){this.deleting = false}.bind(this), 2000);
    let amountToDelete = event.target.parentElement.innerText.split('Ft')[0];
    console.log(amountToDelete);
    let index = amountToDelete.split('	')[0];
    let from = (amountToDelete.split('	')[2]).split(' ');
    let to = (amountToDelete.split('	')[3]).split(' ');

    let addPos = this.walletts.findIndex(i => i.currency === from[1]);
    this.walletts[addPos].amount += parseFloat(from[0]);

    let subPos = this.walletts.findIndex(i => i.currency === to[1]);
    this.walletts[subPos].amount -= parseFloat(to[0]);
    
    event.target.parentElement.remove();
    this.amounts.splice(1, index);
  }
}
