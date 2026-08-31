import { AsyncPipe, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { WIZARD_STEPS } from '../../../../constants/application.constants';
import { StepperComponent } from '../../../../shared/components/stepper/stepper.component';
import { ApplicationState } from '../../models/application.models';
import { ApplicationStateService } from '../../services/application-state.service';
import { AdditionalInformationComponent } from '../additional-information/additional-information.component';
import { EducationComponent } from '../education/education.component';
import { PersonalInformationComponent } from '../personal-information/personal-information.component';
import { ReviewSubmitComponent } from '../review-submit/review-submit.component';
import { SkillsComponent } from '../skills/skills.component';
import { WorkExperienceComponent } from '../work-experience/work-experience.component';

@Component({
  selector: 'app-job-application-wizard',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    StepperComponent,
    PersonalInformationComponent,
    EducationComponent,
    WorkExperienceComponent,
    SkillsComponent,
    AdditionalInformationComponent,
    ReviewSubmitComponent
  ],
  templateUrl: './job-application-wizard.component.html'
})
export class JobApplicationWizardComponent {
  private readonly stateService = inject(ApplicationStateService);

  readonly state$: Observable<ApplicationState> = this.stateService.state$;
  readonly steps = WIZARD_STEPS;

  goToStep(step: number): void {
    this.stateService.setCurrentStep(step);
  }

  nextStep(currentStep: number): void {
    this.stateService.setCurrentStep(currentStep + 1);
  }

  previousStep(currentStep: number): void {
    this.stateService.setCurrentStep(currentStep - 1);
  }
}

