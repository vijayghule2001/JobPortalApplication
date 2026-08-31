import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Certification } from '../../models/application.models';
import { ApplicationStateService } from '../../services/application-state.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './skills.component.html'
})
export class SkillsComponent implements OnInit {
  @Output() previousStep = new EventEmitter<void>();
  @Output() nextStep = new EventEmitter<void>();

  private readonly stateService = inject(ApplicationStateService);

  technicalSkills: string[] = [];
  certifications: Certification[] = [];
  skillInput = '';
  certificationForm: Certification = { name: '', issuer: '', year: '' };
  editingCertificationIndex: number | null = null;
  errorMessage = '';

  ngOnInit(): void {
    const state = this.stateService.snapshot;
    this.technicalSkills = [...state.technicalSkills];
    this.certifications = [...state.certifications];
  }

  addSkill(): void {
    const skill = this.skillInput.trim();
    const duplicate = this.technicalSkills.some((item) => item.toLowerCase() === skill.toLowerCase());
    this.errorMessage = '';

    if (!skill) {
      this.errorMessage = 'Enter a technical skill.';
      return;
    }

    if (duplicate) {
      this.errorMessage = 'This technical skill is already added.';
      return;
    }

    this.technicalSkills.push(skill);
    this.skillInput = '';
    this.save();
  }

  removeSkill(index: number): void {
    this.technicalSkills.splice(index, 1);
    this.save();
  }

  saveCertification(): void {
    const certification = {
      name: this.certificationForm.name.trim(),
      issuer: this.certificationForm.issuer.trim(),
      year: this.certificationForm.year.trim()
    };

    if (!certification.name) {
      return;
    }

    if (this.editingCertificationIndex === null) {
      this.certifications.push(certification);
    } else {
      this.certifications[this.editingCertificationIndex] = certification;
    }

    this.cancelEdit();
    this.save();
  }

  editCertification(index: number): void {
    this.editingCertificationIndex = index;
    this.certificationForm = { ...this.certifications[index] };
  }

  removeCertification(index: number): void {
    this.certifications.splice(index, 1);
    this.save();
  }

  cancelEdit(): void {
    this.editingCertificationIndex = null;
    this.certificationForm = { name: '', issuer: '', year: '' };
  }

  goPrevious(): void {
    this.previousStep.emit();
  }

  goNext(): void {
    if (this.technicalSkills.length === 0) {
      this.errorMessage = 'At least one technical skill is required.';
      return;
    }

    this.save();
    this.nextStep.emit();
  }

  private save(): void {
    this.stateService.setSkills(this.technicalSkills, this.certifications);
  }
}

