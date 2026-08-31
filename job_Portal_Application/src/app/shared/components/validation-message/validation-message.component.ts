import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-validation-message',
  standalone: true,
  imports: [NgIf],
  templateUrl: './validation-message.component.html'
})
export class ValidationMessageComponent {
  @Input() control: AbstractControl | null = null;
  @Input() label = 'Field';

  get message(): string {
    if (!this.control || !this.control.errors || !(this.control.touched || this.control.dirty)) {
      return '';
    }

    const errors = this.control.errors;

    if (errors['required']) {
      return `${this.label} is required.`;
    }

    if (errors['minlength']) {
      return `${this.label} must be at least ${errors['minlength'].requiredLength} characters.`;
    }

    if (errors['maxlength']) {
      return `${this.label} must be less than ${errors['maxlength'].requiredLength} characters.`;
    }

    if (errors['email']) {
      return 'Please enter a valid email address.';
    }

    if (errors['pattern']) {
      return `${this.label} has an invalid format.`;
    }

    if (errors['passingYear']) {
      return `${this.label} must be between ${errors['passingYear'].min} and ${errors['passingYear'].max}.`;
    }

    return `${this.label} is invalid.`;
  }
}

