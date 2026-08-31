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

  markStepComplete(step: number, complete = true): void {
    const completedSteps = [...this.snapshot.completedSteps];
    completedSteps[step - 1] = complete;
    this.updateState({ completedSteps });
  }

  updatePersonalInformation(personalInformation: PersonalInformation): void {
    this.updateState({ personalInformation, submitted: false });
    this.markStepComplete(1);
  }

  updateEducation(education: EducationRecords): void {
    this.updateState({ education, submitted: false });
    this.markStepComplete(2);
  }

  setWorkExperience(workExperience: WorkExperience[]): void {
    this.updateState({ workExperience, submitted: false });
    this.markStepComplete(3);
  }

  setSkills(technicalSkills: string[], certifications: Certification[]): void {
    this.updateState({ technicalSkills, certifications, submitted: false });
    this.markStepComplete(4);
  }

  updateAdditionalInformation(additionalInformation: AdditionalInformation): void {
    this.updateState({
      coverLetter: additionalInformation.coverLetter,
      resume: additionalInformation.resume,
      submitted: false
    });
    this.markStepComplete(5);
  }

  setResume(resume: ResumeFile | null): void {
    this.updateState({ resume, submitted: false });
  }

  submitApplication(): void {
    this.updateState({ submitted: true });
    console.log('Submitted Job Application:', this.snapshot);
  }

  private updateState(changes: Partial<ApplicationState>): void {
    this.stateSubject.next({
      ...this.snapshot,
      ...changes
    });
  }
}

