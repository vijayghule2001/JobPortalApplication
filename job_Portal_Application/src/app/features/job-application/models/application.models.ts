export interface PersonalInformation {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export interface EducationRecord {
  instituteName: string;
  boardUniversity: string;
  score: string;
  passingYear: string;
}

export interface EducationRecords {
  ssc: EducationRecord;
  hsc: EducationRecord;
  graduation: EducationRecord;
  postGraduation: EducationRecord;
}

export interface WorkExperience {
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface ResumeFile {
  name: string;
  size: number;
  type: string;
}

export interface AdditionalInformation {
  coverLetter: string;
  resume: ResumeFile | null;
}

export interface ApplicationState {
  currentStep: number;
  highestStepReached: number;
  personalInformation: PersonalInformation | null;
  education: EducationRecords;
  workExperience: WorkExperience[];
  technicalSkills: string[];
  certifications: Certification[];
  coverLetter: string;
  resume: ResumeFile | null;
  completedSteps: boolean[];
  draftStarted: boolean;
  submitted: boolean;
}
