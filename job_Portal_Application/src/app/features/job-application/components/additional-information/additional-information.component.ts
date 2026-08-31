import { Component, DestroyRef, EventEmitter, OnInit, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { ResumeFile } from '../../models/application.models';
import { ApplicationStateService } from '../../services/application-state.service';

type AdditionalInformationForm = FormGroup<{
  coverLetter: FormControl<string>;
}>;

@Component({
  selector: 'app-additional-information',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, FormFieldComponent, FileUploadComponent],
  templateUrl: './additional-information.component.html'
})
export class AdditionalInformationComponent implements OnInit {
  @Output() previousStep = new EventEmitter<void>();
  @Output() nextStep = new EventEmitter<void>();

  resume: ResumeFile | null = null;
  resumeTouched = false;
  readonly form: AdditionalInformationForm;

  constructor(
    private readonly fb: FormBuilder,
    private readonly stateService: ApplicationStateService,
    private readonly destroyRef: DestroyRef
  ) {
    this.form = this.fb.nonNullable.group({
      coverLetter: ['', [Validators.required, Validators.minLength(50)]]
    });
  }

  ngOnInit(): void {
    const state = this.stateService.snapshot;
    this.form.patchValue({ coverLetter: state.coverLetter });
    this.resume = state.resume;

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.stateService.markDraftStarted();

      if (this.form.valid && this.resume) {
        this.save();
      }
    });
  }

  onResumeChange(resume: ResumeFile | null): void {
    this.resumeTouched = true;
    this.resume = resume;
    this.stateService.setResume(resume);

    if (this.form.valid && resume) {
      this.save();
    }
  }

  goPrevious(): void {
    this.previousStep.emit();
  }

  goNext(): void {
    this.form.markAllAsTouched();
    this.resumeTouched = true;

    if (this.form.valid && this.resume) {
      this.save();
      this.nextStep.emit();
    }
  }

  private save(): void {
    this.stateService.updateAdditionalInformation({
      coverLetter: this.form.controls.coverLetter.value,
      resume: this.resume
    });
  }
}
