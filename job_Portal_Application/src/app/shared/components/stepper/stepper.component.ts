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

  get progressPercentage(): number {
    if (this.steps.length === 0) {
      return 0;
    }

    return Math.round((this.currentStep / this.steps.length) * 100);
  }

  canOpen(step: number): boolean {
    return step <= this.highestStepReached;
  }

  selectStep(step: number): void {
    if (this.canOpen(step)) {
      this.stepSelected.emit(step);
    }
  }
}
