import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-ka-week-bestsellers',
  templateUrl: './ka-week-bestsellers.component.html',
  styleUrls: ['./ka-week-bestsellers.component.scss'],
})
export class KaWeekBestsellersComponent implements OnInit {
  @Input() products: Product[];
  constructor() {}

  ngOnInit(): void {}
}
