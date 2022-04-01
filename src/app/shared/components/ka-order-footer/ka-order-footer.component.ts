import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ka-order-footer',
  templateUrl: './ka-order-footer.component.html',
  styleUrls: ['./ka-order-footer.component.scss'],
})
export class KaOrderFooterComponent implements OnInit {
  @Input() step: number;
  constructor() {}

  ngOnInit(): void {}
}
