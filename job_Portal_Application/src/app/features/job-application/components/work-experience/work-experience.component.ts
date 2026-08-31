import { Component, DestroyRef, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { ApplicationStateService } from '../../services/application-state.service';

@Component({
  selector: 'app-work-experience',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, FormFieldComponent],
  templateUrl: './work-experience.component.html'
})
export class WorkExperienceComponent implements OnInit {
  @Output() previousStep = new EventEmitter<void>();
  @Output() nextStep = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly stateService = inject(ApplicationStateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly form = this.fb.nonNullable.group({
    experiences: this.fb.array([this.createExperienceGroup()])
  });

  get experiences(): FormArray {
    return this.form.controls.experiences;
  }

  ngOnInit(): void {
    const saved = this.stateService.snapshot.workExperience;

    if (saved.length > 0) {
      this.experiences.clear();
      saved.forEach((item) => this.experiences.push(this.createExperienceGroup(item)));
    }

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.form.valid) {
        this.stateService.setWorkExperience(this.experiences.getRawValue());
      }
    });
  }

  addExperience(): void {
    this.experiences.push(this.createExperienceGroup());
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

  private createExperienceGroup(value = { companyName: '', jobTitle: '', duration: '' }) {
    return this.fb.nonNullable.group({
      companyName: [value.companyName, [Validators.required]],
      jobTitle: [value.jobTitle, [Validators.required]],
      duration: [value.duration, [Validators.required, Validators.minLength(3)]]
    });
  }
}

