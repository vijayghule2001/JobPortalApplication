import { NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [NgClass, NgFor],
  templateUrl: './stepper.component.html'
})
export class StepperComponent {
  @Input() steps: readonly string[] = [];
  @Input() currentStep = 1;
  @Input() highestStepReached = 1;
  @Input() completedSteps: boolean[] = [];
  @Output() stepSelected = new EventEmitter<number>();

  canOpen(step: number): boolean {
    return step <= this.highestStepReached;
  }

  selectStep(step: number): void {
    if (this.canOpen(step)) {
      this.stepSelected.emit(step);
    }
  }
}

