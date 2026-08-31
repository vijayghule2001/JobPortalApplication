import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  AdditionalInformation,
  ApplicationState,
  Certification,
  EducationRecord,
  EducationRecords,
  PersonalInformation,
  ResumeFile,
  WorkExperience
} from '../models/application.models';

const emptyEducationRecord: EducationRecord = {
  instituteName: '',
  boardUniversity: '',
  score: '',
  passingYear: ''
};

const initialState: ApplicationState = {
  currentStep: 1,
  highestStepReached: 1,
  personalInformation: null,
  education: {
    ssc: { ...emptyEducationRecord },
    hsc: { ...emptyEducationRecord },
    graduation: { ...emptyEducationRecord },
    postGraduation: { ...emptyEducationRecord }
  },
  workExperience: [],
  technicalSkills: [],
  certifications: [],
  coverLetter: '',
  resume: null,
  completedSteps: [false, false, false, false, false, false],
  draftStarted: false,
  submitted: false
};

@Injectable({
  providedIn: 'root'
})
export class ApplicationStateService {
  private readonly stateSubject = new BehaviorSubject<ApplicationState>(initialState);
  readonly state$ = this.stateSubject.asObservable();

  get snapshot(): ApplicationState {
    return this.stateSubject.value;
  }

  setCurrentStep(step: number): void {
    const safeStep = Math.min(Math.max(step, 1), 6);
    this.updateState({
      currentStep: safeStep,
      highestStepReached: Math.max(this.snapshot.highestStepReached, safeStep)
    });
  }

  markDraftStarted(): void {
    if (!this.snapshot.draftStarted) {
      this.updateState({ draftStarted: true });
    }
  }

  hasUnsavedDraft(): boolean {
    return this.snapshot.draftStarted && !this.snapshot.submitted;
  }

  markStepComplete(step: number, complete = true): void {
    const completedSteps = [...this.snapshot.completedSteps];
    completedSteps[step - 1] = complete;
    this.updateState({ completedSteps });
  }

  updatePersonalInformation(personalInformation: PersonalInformation): void {
    this.updateState({ personalInformation, draftStarted: true, submitted: false });
    this.markStepComplete(1);
  }

  updateEducation(education: EducationRecords): void {
    this.updateState({ education, draftStarted: true, submitted: false });
    this.markStepComplete(2);
  }

  setWorkExperience(workExperience: WorkExperience[]): void {
    this.updateState({ workExperience, draftStarted: true, submitted: false });
    this.markStepComplete(3);
  }

  setSkills(technicalSkills: string[], certifications: Certification[]): void {
    this.updateState({ technicalSkills, certifications, draftStarted: true, submitted: false });
    this.markStepComplete(4);
  }

  updateAdditionalInformation(additionalInformation: AdditionalInformation): void {
    this.updateState({
      coverLetter: additionalInformation.coverLetter,
      resume: additionalInformation.resume,
      draftStarted: true,
      submitted: false
    });
    this.markStepComplete(5);
  }

  setResume(resume: ResumeFile | null): void {
    this.updateState({ resume, draftStarted: true, submitted: false });
  }

  submitApplication(): void {
    this.updateState({ submitted: true });
    console.log('Submitted Job Application:', this.snapshot);
  }

  resetApplication(): void {
    this.stateSubject.next({
      ...initialState,
      education: {
        ssc: { ...emptyEducationRecord },
        hsc: { ...emptyEducationRecord },
        graduation: { ...emptyEducationRecord },
        postGraduation: { ...emptyEducationRecord }
      },
      completedSteps: [...initialState.completedSteps]
    });
  }

  private updateState(changes: Partial<ApplicationState>): void {
    this.stateSubject.next({
      ...this.snapshot,
      ...changes
    });
  }
}
