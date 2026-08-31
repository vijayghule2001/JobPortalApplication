import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidationMessageComponent } from '../validation-message/validation-message.component';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [ValidationMessageComponent],
  templateUrl: './form-field.component.html'
})
export class FormFieldComponent {
  @Input() label = '';
  @Input() control: AbstractControl | null = null;
}

