import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  isActive: boolean = false;
  deleting: boolean = false;
  amount: number = 0;
  currency: string = 'EUR';
  convertedAmount: number = 0;
  exchangeRate: object = {
    'EUR' : 0.0027,
    'USD' : 0.0033,
    'GBP' : 0.0024
  };
  amounts: object[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  onCurrencyChange(value: string) {
    this.currency = value;
  }

  onAmountChange() {
    Math.round(this.convertedAmount = this.exchangeRate[this.currency] * this.amount);
  }

  clearForm() {
    this.amount = 0;
    this.currency = 'EUR'
    this.convertedAmount = 0;
  }

  addItem() {
    let data = {
      'amount' : this.amount,
      'currency' : this.currency,
      'convertedAmount' : this.convertedAmount,
      'time' : new Date().toLocaleDateString()
    }

    if(this.amount !== 0) {
      this.amounts.push(data)
      this.clearForm()
      this.isActive = true;
      setTimeout(function(){this.isActive = false}.bind(this), 2000);
    }
  }

  deleteItem(event: any) {
    let amountToDelete = event.target.parentElement.innerText.split('Ft')[0];
    event.target.parentElement.remove();
    //this.amounts = this.amounts.filter(i => console.log(i));
    //console.log(this.amounts);
  this.deleting = true;
  setTimeout(function(){this.deleting = false}.bind(this), 2000);
  }
}
