import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ALLOWED_RESUME_EXTENSIONS,
  ALLOWED_RESUME_TYPES,
  RESUME_MAX_SIZE_BYTES,
  RESUME_MAX_SIZE_LABEL
} from '../../../constants/application.constants';
import { ResumeFile } from '../../../features/job-application/models/application.models';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [NgIf],
  templateUrl: './file-upload.component.html'
})
export class FileUploadComponent {
  @Input() resume: ResumeFile | null = null;
  @Output() resumeChange = new EventEmitter<ResumeFile | null>();

  errorMessage = '';
  readonly helperText = `Accepted formats: PDF, DOC, DOCX. Maximum size: ${RESUME_MAX_SIZE_LABEL}.`;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.errorMessage = '';

    if (!file) {
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    const hasAllowedExtension = ALLOWED_RESUME_EXTENSIONS.includes(extension);
    const hasAllowedType = ALLOWED_RESUME_TYPES.includes(file.type) || extension === 'doc';

    if (!hasAllowedExtension || !hasAllowedType) {
      this.errorMessage = 'Please upload a PDF, DOC, or DOCX file.';
      input.value = '';
      return;
    }

    if (file.size > RESUME_MAX_SIZE_BYTES) {
      this.errorMessage = `Resume must be ${RESUME_MAX_SIZE_LABEL} or smaller.`;
      input.value = '';
      return;
    }

    this.resumeChange.emit({
      name: file.name,
      size: file.size,
      type: file.type || extension
    });
  }

  removeResume(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    this.errorMessage = '';
    this.resumeChange.emit(null);
  }
}

