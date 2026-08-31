# Job Application Portal

Responsive multi-step Job Application Portal built with Angular, TypeScript, Reactive Forms, RxJS state management, Angular Router, and Bootstrap-style responsive UI.

## Project Overview

This project is developed for the Angular Developer Assignment. It provides a six-step job application wizard where a candidate can enter application details, move between steps, review all entered data, and submit the final application.

Wizard steps:

1. Personal Information
2. Education
3. Work Experience
4. Skills and Qualifications
5. Additional Information
6. Review and Submit

The application keeps data in centralized state while the user moves between steps. Users can return to previous steps, edit entered information, review updated data, and submit the application without backend integration.

## Features

- Six separate step components
- One active step visible at a time
- Angular Reactive Forms
- Centralized state using Angular service and RxJS `BehaviorSubject`
- Form data retained while navigating between steps
- Previous and Next wizard navigation
- Completed-step navigation through stepper
- Dynamic work experience rows using `FormArray`
- Start date, end date, and Present checkbox for work experience
- Technical skill suggestions from a static list
- Manual skill entry support
- Duplicate technical skill prevention
- Dynamic certifications with add, edit, and remove actions
- Resume upload with file type and file size validation
- Review screen with section-wise Edit actions
- Submit success dialog with OK button
- Duplicate submission prevention
- Refresh/close-page warning when user has unsaved draft changes
- Responsive desktop and mobile UI

## Versions

Project dependency versions are taken from `package.json`.

- Node.js: 18.20.6
- npm: 10.8.2
- Angular CLI: 19.2.27
- Angular: 19.2.x
- TypeScript: 5.7.x
- RxJS: 7.8.x
- Zone.js: 0.15.x

Note: If your local/global Angular CLI shows a different version, use the project commands through `npm` after installing dependencies. The local Angular CLI from this project will be used by npm scripts.

## Setup Instructions

This project ZIP should not include `node_modules` or build output. After extracting the ZIP, run the following commands from the project root.

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm start
```

Open the application in browser:

```text
http://localhost:4200/
```

Create production build:

```bash
npm run build
```

Run unit tests:

```bash
npm test
```

Run tests one time in Chrome Headless:

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

## Project Run Flow

1. Open the application.
2. Fill Personal Information.
3. Fill SSC and HSC education details.
4. Add one or more work experience records.
5. Add at least one technical skill.
6. Add certifications if available.
7. Enter cover letter and upload resume.
8. Review all entered information on Review and Submit screen.
9. Click Edit on any section if changes are needed.
10. Click Submit Application.
11. Success dialog appears.
12. Click OK to reset the application and return to the home step.

## Project Structure

```text
src/app/
├── core/
│   └── services/
├── shared/
│   └── components/
│       ├── file-upload/
│       ├── form-field/
│       ├── stepper/
│       └── validation-message/
├── features/
│   └── job-application/
│       ├── components/
│       │   ├── additional-information/
│       │   ├── education/
│       │   ├── job-application-wizard/
│       │   ├── personal-information/
│       │   ├── review-submit/
│       │   ├── skills/
│       │   └── work-experience/
│       ├── models/
│       ├── services/
│       └── validators/
├── store/
├── constants/
├── app.routes.ts
└── app.config.ts
```

## Assumptions

### Validation Rules

- Full Name is required and must contain at least 3 characters.
- Email is required and must be valid.
- Phone Number is required and must contain exactly 10 digits.
- Address is required and must contain at least 10 characters.
- SSC education information is mandatory.
- HSC education information is mandatory.
- Graduation education information is optional.
- Post Graduation education information is optional.
- Institute Name accepts valid text.
- Board/University accepts valid text.
- CGPA/Percentage accepts numeric values.
- Passing Year must be a valid year.
- At least one technical skill is mandatory.
- Duplicate technical skills are not allowed.
- Certifications are optional.
- Cover Letter is required and must contain at least 50 characters.
- Resume upload is mandatory.

### Resume Rules

- Supported file formats: PDF, DOC, DOCX
- Maximum file size: 5 MB
- No backend upload is implemented.
- Resume file metadata is stored in application state.

### Passing Year Rule

- Passing year must be between 1950 and the current year.

### Work Experience Rules

- Company Name is required.
- Job Title is required.
- Start Date is required.
- If Present is checked, End Date is hidden and not required.
- If Present is unchecked, End Date is required.
- End Date cannot be before Start Date.
- Multiple work experience records can be added and removed.

## Technical Decisions

### Component Architecture

The application uses a feature-based structure. All job application screens are placed under `features/job-application`. Reusable UI components are placed under `shared/components`.

Main components:

- `JobApplicationWizardComponent`: parent wizard shell and step switching
- `PersonalInformationComponent`: personal details form
- `EducationComponent`: education details form
- `WorkExperienceComponent`: dynamic work experience form
- `SkillsComponent`: technical skills and certifications
- `AdditionalInformationComponent`: cover letter and resume upload
- `ReviewSubmitComponent`: final review and submission

### State Management Approach

State is managed centrally using `ApplicationStateService`.

The service uses:

- `BehaviorSubject<ApplicationState>`
- public `state$` observable
- typed update methods for each step

This approach keeps the code simple and readable for the assignment. NgRx was not used because the application state is small and does not require reducers, actions, or effects.

### Reactive Forms Implementation

Angular Reactive Forms are used for form handling.

Used form features:

- `FormGroup`
- `FormControl`
- `FormArray`
- Built-in validators
- Custom passing year validator
- Custom date range validation for work experience

The Skills step also uses Reactive Forms for skill input and certification input while keeping selected skills and certifications as arrays for simple add/edit/remove behavior.

### Validation Approach

Most validation is handled using Angular built-in validators:

- `Validators.required`
- `Validators.minLength`
- `Validators.email`
- `Validators.pattern`

Custom validation is used only where needed:

- Passing year range validation
- Work experience date range validation
- Resume file type and size validation
- Duplicate technical skill check

### UI Framework Selection

The UI follows Bootstrap-style responsive classes and layout patterns with custom CSS.

No Bootstrap package was installed because the project was requested to avoid installing additional libraries during development. Required layout styles are implemented in `src/styles.css`.

### Performance and Maintainability

- Standalone Angular components are used.
- RxJS subscriptions use `takeUntilDestroyed` for proper cleanup.
- Components use typed interfaces and typed forms.
- Reusable shared components reduce repeated markup.
- Business data is not shared directly between step components.
- Application state is updated through service methods.
- Refresh warning is handled in the wizard shell using `beforeunload`.

## Third-Party Libraries

No extra third-party UI libraries were installed.

Project dependencies:

| Library | Purpose |
| --- | --- |
| Angular | Main frontend framework |
| Angular Router | Application routing |
| Angular Reactive Forms | Form handling and validation |
| RxJS | Centralized state and observables |
| TypeScript | Strong typing |
| Zone.js | Angular change detection support |
| Karma/Jasmine | Unit testing |

## Screenshots

All application screenshots are available in the `screenshots/` folder.

Add the following screenshots in the `screenshots/` folder before sharing the ZIP file:

1. Personal Information
2. Education
3. Work Experience
4. Skills and Qualifications
5. Additional Information / Resume Upload
6. Review and Submit
7. Mobile Responsive View

Run the application before capturing screenshots:

```bash
npm start
```

## Build Verification

The project was verified with:

```bash
npm run build
```

and:

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```
