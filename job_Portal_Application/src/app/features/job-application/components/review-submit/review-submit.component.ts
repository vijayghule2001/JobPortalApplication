import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationState, EducationRecord } from '../../models/application.models';
import { ApplicationStateService } from '../../services/application-state.service';

@Component({
  selector: 'app-review-submit',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf],
  templateUrl: './review-submit.component.html'
})
export class ReviewSubmitComponent {
  @Output() previousStep = new EventEmitter<void>();
  @Output() editStep = new EventEmitter<number>();

  private readonly stateService = inject(ApplicationStateService);
  readonly state$: Observable<ApplicationState> = this.stateService.state$;
  successMessage = '';

  educationRows(state: ApplicationState): { label: string; record: EducationRecord }[] {
    return [
      { label: 'SSC', record: state.education.ssc },
      { label: 'HSC', record: state.education.hsc },
      { label: 'Graduation', record: state.education.graduation },
      { label: 'Post Graduation', record: state.education.postGraduation }
    ];
  }

  submit(state: ApplicationState): void {
    if (state.submitted) {
      return;
    }

    this.stateService.submitApplication();
    this.successMessage = 'Application submitted successfully.';
  }
}
