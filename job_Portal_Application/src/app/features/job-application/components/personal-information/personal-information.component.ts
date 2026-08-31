import { Component, DestroyRef, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { ApplicationStateService } from '../../services/application-state.service';

type PersonalInformationForm = FormGroup<{
  fullName: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  address: FormControl<string>;
}>;

@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent],
  templateUrl: './personal-information.component.html'
})
export class PersonalInformationComponent implements OnInit {
  @Output() nextStep = new EventEmitter<void>();

  readonly form: PersonalInformationForm;

  constructor(
    private readonly fb: FormBuilder,
    private readonly stateService: ApplicationStateService,
    private readonly destroyRef: DestroyRef
  ) {
    this.form = this.fb.nonNullable.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    const saved = this.stateService.snapshot.personalInformation;
    if (saved) {
      this.form.patchValue(saved);
    }

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.stateService.markDraftStarted();

      if (this.form.valid) {
        this.stateService.updatePersonalInformation(this.form.getRawValue());
      }
    });
  }

  goNext(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.stateService.updatePersonalInformation(this.form.getRawValue());
      this.nextStep.emit();
    }
  }
}
