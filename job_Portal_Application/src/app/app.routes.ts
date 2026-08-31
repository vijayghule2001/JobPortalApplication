import { Routes } from '@angular/router';
import { JobApplicationWizardComponent } from './features/job-application/components/job-application-wizard/job-application-wizard.component';

export const routes: Routes = [
  {
    path: '',
    component: JobApplicationWizardComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
