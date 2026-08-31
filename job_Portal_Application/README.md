# Job Application Portal

Responsive Angular job application wizard developed for the Angular Developer Assignment.

## Project Overview

This application is a six-step job application portal:

1. Personal Information
2. Education
3. Work Experience
4. Skills and Qualifications
5. Additional Information
6. Review and Submit

Only one step is displayed at a time. User data is retained while moving between steps, previous sections can be edited, and the final submission logs the complete application state in the browser console.

## Versions

- Node.js: use Node.js 18.19 or newer
- Angular CLI: 19.2.27
- Angular: 19.2.x
- TypeScript: 5.7.x
- RxJS: 7.8.x

## Setup Instructions

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Open:

```text
http://localhost:4200/
```

Create a production build:

```bash
npm run build
```

Run unit tests:

```bash
npm test
```

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

## Technical Decisions

- Standalone Angular components are used because this Angular 19 project was generated in standalone mode.
- Angular Reactive Forms are used for Personal Information, Education, Work Experience, and Additional Information.
- Work Experience uses `FormArray` so users can add, edit, and remove multiple rows.
- Centralized state is handled by `ApplicationStateService` using RxJS `BehaviorSubject`.
- Components update only their own slice of application state.
- Bootstrap-style responsive classes are used with custom CSS. No Bootstrap package was installed because the request was to avoid installing libraries at this stage.
- Angular Router is configured and the wizard is hosted on the root route.

## Validation Assumptions

- Full name requires at least 3 characters.
- Address requires at least 10 characters.
- Phone number must be exactly 10 digits.
- SSC and HSC education records are mandatory.
- Graduation and Post Graduation are optional.
- Passing year must be between 1950 and the current year.
- Work duration is required and must contain at least 3 characters.
- At least one technical skill is required.
- Duplicate technical skills are prevented case-insensitively.
- Cover letter requires at least 50 characters.
- Resume is mandatory.
- Supported resume formats: PDF, DOC, DOCX.
- Maximum resume size: 5 MB.
- No backend upload is performed; only file metadata is stored in application state.
- Duplicate final submission is prevented after a successful submit.

## Third-Party Libraries

No additional third-party libraries were added beyond the Angular project dependencies already present:

- Angular
- RxJS
- TypeScript
- Zone.js

## Screenshots

The assignment asks for screenshots of all six steps and one mobile view. Capture them after running the app locally with `npm start`.

