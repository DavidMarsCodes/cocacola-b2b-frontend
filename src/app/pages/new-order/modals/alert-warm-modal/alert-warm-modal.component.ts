import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/core/models/cart.model';

@Component({
  selector: 'app-alert-warm-modal',
  templateUrl: './alert-warm-modal.component.html',
  styleUrls: ['./alert-warm-modal.component.scss'],
})
export class AlertWarmModalComponent implements OnInit {
  readonly LANG_ROOT = 'NEW_ORDER.ORDER_DETAIL.MODAL_ALERT_WARM.';

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  confirm(): void {
    this.activeModal.close(true);
  }

  reject(): void {
    this.activeModal.close(false);
  }
}
