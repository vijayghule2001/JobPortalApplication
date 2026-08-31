import { Component, DestroyRef, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { ApplicationStateService } from '../../services/application-state.service';

@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent],
  templateUrl: './personal-information.component.html'
})
export class PersonalInformationComponent implements OnInit {
  @Output() nextStep = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly stateService = inject(ApplicationStateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    address: ['', [Validators.required, Validators.minLength(10)]]
  });

  ngOnInit(): void {
    const saved = this.stateService.snapshot.personalInformation;
    if (saved) {
      this.form.patchValue(saved);
    }

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
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

