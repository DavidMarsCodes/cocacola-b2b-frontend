import { Component, Input, OnInit } from '@angular/core';
import { MyCreditModel } from 'src/app/core/models/my-account.model';

@Component({
  selector: 'app-ka-available-category-credits',
  templateUrl: './ka-available-category-credits.component.html',
  styleUrls: ['./ka-available-category-credits.component.scss'],
})
export class KaAvailableCategoryCreditsComponent implements OnInit {
  @Input() credits: MyCreditModel[];
  constructor() {}

  ngOnInit(): void {}
}
