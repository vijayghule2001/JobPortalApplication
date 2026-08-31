import { Component, DestroyRef, EventEmitter, OnInit, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { ApplicationStateService } from '../../services/application-state.service';

type WorkExperienceGroup = FormGroup<{
  companyName: FormControl<string>;
  jobTitle: FormControl<string>;
  startDate: FormControl<string>;
  endDate: FormControl<string>;
  currentlyWorking: FormControl<boolean>;
}>;
type WorkExperienceForm = FormGroup<{
  experiences: FormArray<WorkExperienceGroup>;
}>;

@Component({
  selector: 'app-work-experience',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, FormFieldComponent],
  templateUrl: './work-experience.component.html'
})
export class WorkExperienceComponent implements OnInit {
  @Output() previousStep = new EventEmitter<void>();
  @Output() nextStep = new EventEmitter<void>();

  readonly form: WorkExperienceForm;

  constructor(
    private readonly fb: FormBuilder,
    private readonly stateService: ApplicationStateService,
    private readonly destroyRef: DestroyRef
  ) {
    this.form = this.fb.nonNullable.group({
      experiences: this.fb.array([this.createExperienceGroup()])
    });
  }

  get experiences(): FormArray<WorkExperienceGroup> {
    return this.form.controls.experiences;
  }

  ngOnInit(): void {
    const saved = this.stateService.snapshot.workExperience;

    if (saved.length > 0) {
      this.experiences.clear();
      saved.forEach((item) => this.experiences.push(this.createExperienceGroup(item)));
    }

    this.experiences.controls.forEach((group) => this.updateEndDateValidation(group));

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.stateService.markDraftStarted();

      if (this.form.valid) {
        this.stateService.setWorkExperience(this.experiences.getRawValue());
      }
    });
  }

  addExperience(): void {
    const group = this.createExperienceGroup();
    this.experiences.push(group);
    this.updateEndDateValidation(group);
  }

  removeExperience(index: number): void {
    if (this.experiences.length > 1) {
      this.experiences.removeAt(index);
      this.stateService.setWorkExperience(this.experiences.getRawValue());
    }
  }

  goPrevious(): void {
    this.previousStep.emit();
  }

  goNext(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.stateService.setWorkExperience(this.experiences.getRawValue());
      this.nextStep.emit();
    }
  }

  onCurrentlyWorkingChange(index: number): void {
    const group = this.experiences.at(index) as WorkExperienceGroup;
    this.updateEndDateValidation(group);

    if (this.form.valid) {
      this.stateService.setWorkExperience(this.experiences.getRawValue());
    }
  }

  private createExperienceGroup(
    value = { companyName: '', jobTitle: '', startDate: '', endDate: '', currentlyWorking: false }
  ): WorkExperienceGroup {
    const group = this.fb.nonNullable.group({
      companyName: [value.companyName, [Validators.required]],
      jobTitle: [value.jobTitle, [Validators.required]],
      startDate: [value.startDate, [Validators.required]],
      endDate: [value.endDate, [Validators.required]],
      currentlyWorking: [value.currentlyWorking]
    }, { validators: this.dateRangeValidator });

    this.updateEndDateValidation(group);
    return group;
  }

  private updateEndDateValidation(group: WorkExperienceGroup): void {
    const endDate = group.controls.endDate;

    if (group.controls.currentlyWorking.value) {
      endDate.clearValidators();
      endDate.setValue('', { emitEvent: false });
      endDate.disable({ emitEvent: false });
    } else {
      endDate.enable({ emitEvent: false });
      endDate.setValidators([Validators.required]);
    }

    endDate.updateValueAndValidity({ emitEvent: false });
    group.updateValueAndValidity({ emitEvent: false });
  }

  private dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const group = control as WorkExperienceGroup;
    const startDate = group.controls.startDate.value;
    const endDate = group.controls.endDate.value;
    const currentlyWorking = group.controls.currentlyWorking.value;

    if (!startDate || !endDate || currentlyWorking) {
      return null;
    }

    return endDate < startDate ? { dateRange: true } : null;
  }
}
