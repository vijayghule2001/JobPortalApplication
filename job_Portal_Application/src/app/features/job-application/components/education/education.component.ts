import { Component, DestroyRef, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { passingYearValidator } from '../../validators/passing-year.validator';
import { ApplicationStateService } from '../../services/application-state.service';

type QualificationKey = 'ssc' | 'hsc' | 'graduation' | 'postGraduation';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, FormFieldComponent],
  templateUrl: './education.component.html'
})
export class EducationComponent implements OnInit {
  @Output() previousStep = new EventEmitter<void>();
  @Output() nextStep = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly stateService = inject(ApplicationStateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly qualificationKeys: QualificationKey[] = ['ssc', 'hsc', 'graduation', 'postGraduation'];

  readonly form = this.fb.nonNullable.group({
    ssc: this.createEducationGroup(true),
    hsc: this.createEducationGroup(true),
    graduation: this.createEducationGroup(false),
    postGraduation: this.createEducationGroup(false)
  });

  ngOnInit(): void {
    this.form.patchValue(this.stateService.snapshot.education);
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.form.valid) {
        this.stateService.updateEducation(this.form.getRawValue());
      }
    });
  }

  getLabel(key: QualificationKey): string {
    return key === 'postGraduation' ? 'Post Graduation' : key.toUpperCase();
  }

  goPrevious(): void {
    this.previousStep.emit();
  }

  goNext(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.stateService.updateEducation(this.form.getRawValue());
      this.nextStep.emit();
    }
  }

  private createEducationGroup(required: boolean) {
    const requiredValidator = required ? [Validators.required] : [];

    return this.fb.nonNullable.group({
      instituteName: ['', [...requiredValidator]],
      boardUniversity: ['', [...requiredValidator]],
      score: ['', [...requiredValidator, Validators.pattern(/^[0-9.]*$/)]],
      passingYear: ['', [...requiredValidator, passingYearValidator]]
    });
  }
}
