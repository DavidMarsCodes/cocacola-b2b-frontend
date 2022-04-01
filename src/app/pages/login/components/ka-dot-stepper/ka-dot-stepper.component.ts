import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ka-dot-stepper',
  templateUrl: './ka-dot-stepper.component.html',
  styleUrls: ['./ka-dot-stepper.component.scss'],
})
export class KaDotStepperComponent implements OnInit {
  @Input() currentStep: number;
  @Input() totalSteps: number;
  steps: number[] = [];

  constructor() {}

  ngOnInit(): void {
    for (let i = 0; i < this.totalSteps; i++) {
      this.steps.push(i);
    }
  }
}
