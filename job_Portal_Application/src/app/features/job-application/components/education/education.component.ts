import { Component, DestroyRef, EventEmitter, OnInit, Output } from '@angular/core';
import { NgFor } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { ValidationMessageComponent } from '../../../../shared/components/validation-message/validation-message.component';
import { passingYearValidator } from '../../validators/passing-year.validator';
import { ApplicationStateService } from '../../services/application-state.service';

type QualificationKey = 'ssc' | 'hsc' | 'graduation' | 'postGraduation';
type EducationGroup = FormGroup<{
  instituteName: FormControl<string>;
  boardUniversity: FormControl<string>;
  score: FormControl<string>;
  passingYear: FormControl<string>;
}>;
type EducationForm = FormGroup<Record<QualificationKey, EducationGroup>>;

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, FormFieldComponent, ValidationMessageComponent],
  templateUrl: './education.component.html'
})
export class EducationComponent implements OnInit {
  @Output() previousStep = new EventEmitter<void>();
  @Output() nextStep = new EventEmitter<void>();

  readonly qualificationKeys: QualificationKey[] = ['ssc', 'hsc', 'graduation', 'postGraduation'];
  readonly form: EducationForm;

  constructor(
    private readonly fb: FormBuilder,
    private readonly stateService: ApplicationStateService,
    private readonly destroyRef: DestroyRef
  ) {
    this.form = this.fb.nonNullable.group({
      ssc: this.createEducationGroup(true),
      hsc: this.createEducationGroup(true),
      graduation: this.createEducationGroup(false),
      postGraduation: this.createEducationGroup(false)
    });
  }

  ngOnInit(): void {
    this.form.patchValue(this.stateService.snapshot.education);
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.stateService.markDraftStarted();

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

  private createEducationGroup(required: boolean): EducationGroup {
    const requiredValidator = required ? [Validators.required] : [];

    return this.fb.nonNullable.group({
      instituteName: ['', [...requiredValidator, Validators.pattern(/^[a-zA-Z0-9 .,&'-]+$/)]],
      boardUniversity: ['', [...requiredValidator, Validators.pattern(/^[a-zA-Z0-9 .,&'-]+$/)]],
      score: ['', [...requiredValidator, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
      passingYear: ['', [...requiredValidator, passingYearValidator]]
    });
  }
}
