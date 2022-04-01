import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-date-modal',
  templateUrl: './edit-date-modal.component.html',
  styleUrls: ['./edit-date-modal.component.scss'],
})
export class EditDateModalComponent implements OnInit {
  @Input() public data: any;
  @Input() public showFooterButtons? = true;
  @Input() public isNewOrderSelected? = false;
  readonly ROOT = 'NEW_ORDER.RIGHT_SIDEBAR.';

  @Output() modalResponse: EventEmitter<any> = new EventEmitter();

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  confirm(): void {
    this.activeModal.close(true);
  }

  reject(): void {
    this.activeModal.close(false);
  }
}
