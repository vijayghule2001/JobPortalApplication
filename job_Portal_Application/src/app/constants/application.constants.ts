export const WIZARD_STEPS = [
  'Personal Information',
  'Education',
  'Work Experience',
  'Skills',
  'Additional Information',
  'Review & Submit'
] as const;

export const CURRENT_YEAR = new Date().getFullYear();
export const MIN_PASSING_YEAR = 1950;

export const RESUME_MAX_SIZE_BYTES = 5 * 1024 * 1024;
export const RESUME_MAX_SIZE_LABEL = '5 MB';
export const ALLOWED_RESUME_EXTENSIONS = ['pdf', 'doc', 'docx'];
export const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

