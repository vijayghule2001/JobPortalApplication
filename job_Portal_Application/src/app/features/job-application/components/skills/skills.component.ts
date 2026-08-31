import { Component, DestroyRef, EventEmitter, OnInit, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Certification } from '../../models/application.models';
import { ApplicationStateService } from '../../services/application-state.service';

type SkillsForm = FormGroup<{
  skillInput: FormControl<string>;
  certification: FormGroup<{
    name: FormControl<string>;
    issuer: FormControl<string>;
    year: FormControl<string>;
  }>;
}>;

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './skills.component.html'
})
export class SkillsComponent implements OnInit {
  @Output() previousStep = new EventEmitter<void>();
  @Output() nextStep = new EventEmitter<void>();

  readonly skillSuggestions = [
    'Angular',
    'Angular Material',
    'Bootstrap',
    'CSS',
    'Docker',
    'Express.js',
    'Git',
    'HTML',
    'Java',
    'JavaScript',
    'MongoDB',
    'Node.js',
    'PostgreSQL',
    'Pycharm',
    'Python',
    'Python Programming',
    'React',
    'REST API',
    'RxJS',
    'SQL',
    'TypeScript',
    'Unit Testing'
  ];

  technicalSkills: string[] = [];
  certifications: Certification[] = [];
  editingCertificationIndex: number | null = null;
  errorMessage = '';
  readonly form: SkillsForm;

  constructor(
    private  fb: FormBuilder,
    private  stateService: ApplicationStateService,
    private  destroyRef: DestroyRef
  ) {
    this.form = this.fb.nonNullable.group({
      skillInput: [''],
      certification: this.fb.nonNullable.group({
        name: [''],
        issuer: [''],
        year: ['']
      })
    });
  }

  get filteredSkillSuggestions(): string[] {
    const searchText = this.form.controls.skillInput.value.trim().toLowerCase();

    if (!searchText) {
      return [];
    }

    return this.skillSuggestions
      .filter((skill) => skill.toLowerCase().startsWith(searchText))
      .filter((skill) => !this.hasSkill(skill))
      .slice(0, 6);
  }

  ngOnInit(): void {
    const state = this.stateService.snapshot;
    this.technicalSkills = [...state.technicalSkills];
    this.certifications = [...state.certifications];

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.stateService.markDraftStarted();
    });
  }

  addSkill(): void {
    this.stateService.markDraftStarted();

    const skill = this.form.controls.skillInput.value.trim();
    this.errorMessage = '';

    if (!skill) {
      this.errorMessage = 'Enter a technical skill.';
      return;
    }

    if (this.hasSkill(skill)) {
      this.errorMessage = 'This technical skill is already added.';
      return;
    }

    this.technicalSkills.push(skill);
    this.form.controls.skillInput.setValue('');
    this.save();
  }

  addSuggestedSkill(skill: string): void {
    this.form.controls.skillInput.setValue(skill);
    this.addSkill();
  }

  removeSkill(index: number): void {
    this.technicalSkills.splice(index, 1);
    this.save();
  }

  saveCertification(): void {
    this.stateService.markDraftStarted();

    const certificationValue = this.form.controls.certification.getRawValue();
    const certification: Certification = {
      name: certificationValue.name.trim(),
      issuer: certificationValue.issuer.trim(),
      year: certificationValue.year.trim()
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
    this.form.controls.certification.patchValue(this.certifications[index]);
  }

  removeCertification(index: number): void {
    this.certifications.splice(index, 1);
    this.save();
  }

  cancelEdit(): void {
    this.editingCertificationIndex = null;
    this.form.controls.certification.reset();
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
  private hasSkill(skill: string): boolean {
    return this.technicalSkills.some((item) => item.toLowerCase() === skill.toLowerCase());
  }
}
