import { AbstractControl, ValidationErrors } from '@angular/forms';
import { CURRENT_YEAR, MIN_PASSING_YEAR } from '../../../constants/application.constants';

export function passingYearValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null;
  }

  const year = Number(value);
  const isFourDigitYear = /^\d{4}$/.test(String(value));

  if (!isFourDigitYear || year < MIN_PASSING_YEAR || year > CURRENT_YEAR) {
    return { passingYear: { min: MIN_PASSING_YEAR, max: CURRENT_YEAR } };
  }

  return null;
}

