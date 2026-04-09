import { createContext, useContext, useState, type ReactNode } from "react";

export type Locale = "en" | "vi" | "es" | "zh-TW";

type Translations = Record<string, string>;

/* ─────────────────────────── English ─────────────────────────── */
const en: Translations = {
  // Navigation
  "nav.foundations": "Foundations",
  "nav.components": "Components",
  "nav.patterns": "Patterns",
  "nav.engineering": "Engineering",
  "nav.colors": "Colors",
  "nav.typography": "Typography",
  "nav.spacing": "Spacing & Layout",
  "nav.buttons": "Buttons",
  "nav.forms": "Form Elements",
  "nav.badges": "Badges, Tags & Status",
  "nav.feedback": "Feedback & Notifications",
  "nav.navigation": "Navigation",
  "nav.dropdowns": "Dropdowns",
  "nav.overlays": "Overlays",
  "nav.others": "Others",
  "nav.layouts": "Layouts",
  "nav.tokens": "Design Tokens",
  "nav.theming": "White-Label",
  "nav.formio": "Form.io Integration",

  // Sidebar
  "sidebar.brandColor": "Brand Color",
  "sidebar.mode": "Mode",
  "sidebar.fontFamily": "Font Family",
  "sidebar.language": "Language",

  // Hero
  "hero.badge": "React Aria + Tailwind — 2026",
  "hero.title": "VSee Clinic\nDesign System",
  "hero.desc":
    "The single source of truth for design and engineering. Modern, accessible, and built for telehealth at scale.",
  "hero.tokens": "Design Tokens",
  "hero.components": "Components",
  "hero.wcag": "WCAG Compliant",
  "hero.grid": "Base Grid",

  // Colors
  "colors.label": "Foundation",
  "colors.title": "Colors",
  "colors.desc":
    "A refined, accessible palette built on VSee's brand green. Every color has been tested for WCAG AA contrast compliance.",
  "colors.brand": "Brand",
  "colors.brandDesc":
    "The primary brand scale — from light tints to deep active states.",
  "colors.semantic": "Semantic",
  "colors.semanticDesc":
    "Communicating meaning — success, information, warning, and danger states.",
  "colors.neutrals": "Neutrals",
  "colors.surfaces": "Surfaces & Text",
  "colors.surfacesCard": "Surfaces",
  "colors.textColors": "Text Colors",

  // Typography
  "typography.label": "Foundation",
  "typography.title": "Typography",
  "typography.desc":
    "Plus Jakarta Sans is our system font — clean, legible, and optimized for UI. The type scale uses a harmonious progression from 12px to 60px.",
  "typography.display": "Design for health",
  "typography.h1": "Page title",
  "typography.h2": "Section heading",
  "typography.h3": "Subsection",
  "typography.h4": "Card title",
  "typography.h5": "Label heading",
  "typography.bodyLg":
    "Body text for longer-form content and introductory paragraphs.",
  "typography.body": "Standard body text used throughout the application.",
  "typography.caption": "Helper text, timestamps, and metadata",
  "typography.overline": "Section Label",
  "typography.fontWeights": "Font Weights",
  "typography.w400": "Regular 400 — For body text and descriptions",
  "typography.w500": "Medium 500 — For captions and secondary emphasis",
  "typography.w600": "Semi Bold 600 — For labels and small headings",
  "typography.w700": "Bold 700 — For headings and strong emphasis",
  "typography.w800": "Extra Bold 800 — For display and page titles",
  "typography.dateFormat": "Date Format",
  "typography.usFormat": "US Format",

  // Spacing
  "spacing.label": "Foundation",
  "spacing.title": "Spacing & Layout",
  "spacing.desc":
    "A 4px-based spacing scale ensures consistent rhythm across every component and layout.",
  "spacing.scale": "Spacing Scale",
  "spacing.shadows": "Shadows",
  "spacing.radius": "Border Radius",

  // Buttons
  "buttons.label": "Components",
  "buttons.title": "Buttons",
  "buttons.desc":
    "Buttons communicate actions. Primary for key actions, secondary for supporting, ghost for tertiary.",
  "buttons.variants": "Variants",
  "buttons.primary": "Primary",
  "buttons.secondary": "Secondary",
  "buttons.ghost": "Ghost",
  "buttons.danger": "Danger",
  "buttons.dangerOutline": "Danger Outline",
  "buttons.info": "Info",
  "buttons.warning": "Warning",
  "buttons.link": "Link",
  "buttons.sizes": "Sizes",
  "buttons.xl": "Extra Large",
  "buttons.lg": "Large",
  "buttons.default": "Default",
  "buttons.sm": "Small",
  "buttons.pill": "Pill Shape",
  "buttons.primaryPill": "Primary Pill",
  "buttons.secondaryPill": "Secondary Pill",
  "buttons.ghostPill": "Ghost Pill",
  "buttons.states": "States",
  "buttons.hover": "Hover",
  "buttons.pressed": "Pressed",
  "buttons.focus": "Focus",
  "buttons.disabled": "Disabled",
  "buttons.group": "Button Group",
  "buttons.today": "Today",
  "buttons.week": "Week",
  "buttons.month": "Month",
  "buttons.loading": "Loading",
  "buttons.saving": "Saving...",
  "buttons.loadingText": "Loading...",
  "buttons.pleaseWait": "Please wait",
  "buttons.deleting": "Deleting...",
  "buttons.toggles": "Toggles",
  "buttons.notifications": "Notifications",
  "buttons.autoSave": "Auto-save",
  "buttons.alwaysOn": "Always On",
  "buttons.unavailable": "Unavailable",
  "buttons.on": "On",
  "buttons.off": "Off",
  "buttons.withIcons": "With Icons",
  "buttons.withIconsDesc":
    "React Aria buttons support any child content — place icons before or after text, or use icon-only buttons.",
  "buttons.newPatient": "New Patient",
  "buttons.export": "Export",
  "buttons.share": "Share",
  "buttons.delete": "Delete",
  "buttons.iconRight": "Icon on Right",
  "buttons.send": "Send",
  "buttons.upload": "Upload",
  "buttons.schedule": "Schedule",
  "buttons.iconOnly": "Icon Only",
  "buttons.sizesWithIcons": "Sizes with Icons",

  // Forms
  "forms.label": "Components",
  "forms.title": "Form Elements",
  "forms.desc":
    "Clean, accessible form controls with clear focus states and error handling.",
  "forms.textInputs": "Text Inputs",
  "forms.emailAddress": "Email address",
  "forms.emailPlaceholder": "you@example.com",
  "forms.fullName": "Full name",
  "forms.fullNamePlaceholder": "Penny Ng",
  "forms.medicalLicenseHint": "As it appears on your medical license",
  "forms.fullNameRequired": "Full name is required",
  "forms.search": "Search",
  "forms.searchPatients": "Search patients...",
  "forms.selectTextarea": "Select & Textarea",
  "forms.specialty": "Specialty",
  "forms.selectSpecialty": "Select a specialty...",
  "forms.internalMedicine": "Internal Medicine",
  "forms.familyMedicine": "Family Medicine",
  "forms.pediatrics": "Pediatrics",
  "forms.notes": "Notes",
  "forms.clinicalNotes": "Add clinical notes...",
  "forms.multiSelect": "MultiSelect",
  "forms.filterSpecialty": "Filter by Specialty",
  "forms.addMore": "Add more...",
  "forms.searchSpecialties": "Search specialties...",
  "forms.noMatches": "No matches found",
  "forms.checkboxes": "Checkboxes",
  "forms.showConsultations": "Show consultations",
  "forms.onlyMyPatients": "Only my patients",
  "forms.archivedDisabled": "Archived (disabled)",
  "forms.radios": "Radios",
  "forms.phoneCall": "Phone call",
  "forms.videoCall": "Video call",
  "forms.inPerson": "In-person",
  "forms.largeInput": "Large Input",
  "forms.patientSearch": "Patient Search",
  "forms.searchByName": "Search by name, ID, or phone...",
  "forms.disabledState": "Disabled State",
  "forms.disabledField": "Disabled Field",
  "forms.readOnlyValue": "Read-only value",
  "forms.advancedInputs": "Advanced Inputs",
  "forms.advancedDesc":
    "Specialized form controls for phone numbers, dates, and inputs with action icons.",
  "forms.phoneNumber": "Phone Number",
  "forms.withCountryCode": "With Country Code",
  "forms.withCountryCodeExt": "With Country Code & Ext.",
  "forms.simple": "Simple",
  "forms.datePicker": "Date Picker",
  "forms.appointmentDate": "Appointment Date",
  "forms.appointmentTime": "Appointment Time",
  "forms.appointmentDateTime": "Appointment Date & Time",
  "forms.inputWithIcon": "Input with Action Icon",
  "forms.referenceCode": "Reference Code",
  "forms.websiteUrl": "Website URL",
  "forms.inputWithUnit": "Input with Unit",
  "forms.dosage": "Dosage",
  "forms.weight": "Weight",
  "forms.quantity": "Quantity",
  "forms.paymentInput": "Payment Input",
  "forms.payment": "Payment",
  "forms.cardNumber": "Card #",
  "forms.expiry": "Expiry",
  "forms.loginForm": "Login Form",
  "forms.email": "Email",
  "forms.password": "Password",
  "forms.enterPassword": "Enter password",
  "forms.rememberMe": "Remember me",
  "forms.forgotPassword": "Forgot password?",
  "forms.signIn": "Sign In",
  "forms.inlineInputs": "Inline Inputs",
  "forms.dispense": "Dispense",
  "forms.tabletsTake": "tablets, take",
  "forms.timesPerDayFor": "times per day for",
  "forms.days": "days.",
  "forms.fluidsGiven": "Fluids Given",
  "forms.dosageInline": "Dosage",
  "forms.quantityInline": "Quantity",
  "forms.dateOfService": "Date of Service",
  "forms.facility": "Facility",
  "forms.signature": "Signature",
  "forms.signatureDesc":
    "A hand-signature capture area for consent forms, agreements, and patient intake workflows.",
  "forms.active": "Active",
  "forms.signed": "Signed",
  "forms.signHere": "Sign here",
  "forms.clear": "Clear",
  "forms.confirm": "Confirm",

  // Badges
  "badges.label": "Components",
  "badges.title": "Badges, Tags & Status",
  "badges.desc":
    "Communicate states, categories, and counts with subtle visual indicators. Tags support keyboard navigation and removal.",
  "badges.soft": "Soft Badges",
  "badges.active": "Active",
  "badges.scheduled": "Scheduled",
  "badges.pending": "Pending",
  "badges.overdue": "Overdue",
  "badges.draft": "Draft",
  "badges.solid": "Solid Badges",
  "badges.approved": "Approved",
  "badges.processing": "Processing",
  "badges.review": "Review",
  "badges.urgent": "Urgent",
  "badges.default": "Default",
  "badges.removableTags": "Removable Tags",
  "badges.activeDiagnoses": "Active Diagnoses",

  // Feedback
  "feedback.label": "Components",
  "feedback.title": "Feedback & Notifications",
  "feedback.desc":
    "Alerts, toasts, progress indicators, empty states, and notifications for communicating system state.",
  "feedback.alerts": "Alerts",
  "feedback.changesSaved": "Changes saved",
  "feedback.changesSavedDesc":
    "Your patient record has been updated successfully.",
  "feedback.appointmentReminder": "Appointment reminder",
  "feedback.appointmentReminderDesc":
    "Your next appointment is scheduled for tomorrow at 2:00 PM.",
  "feedback.outstandingBalance": "Outstanding balance",
  "feedback.outstandingBalanceDesc":
    "This patient has an unpaid balance of $45.00.",
  "feedback.formFailed": "Form submission failed",
  "feedback.formFailedDesc":
    "Please check the required fields and try again.",
  "feedback.toasts": "Toast Notifications",
  "feedback.apptConfirmed": "Appointment confirmed",
  "feedback.apptConfirmedDesc": "Feb 26, 2026 at 10:00 AM with Dr. Chen",
  "feedback.connectionLost": "Connection lost",
  "feedback.connectionLostDesc":
    "Please check your internet connection.",
  "feedback.newMessage": "New message",
  "feedback.newMessageDesc":
    "You have 3 unread messages from patients.",
  "feedback.emptyState": "Empty State",
  "feedback.emptyStateDesc":
    "Placeholder content shown when a section has no data. Provides context and a call to action.",
  "feedback.noResults": "No Results Found",
  "feedback.noResultsDesc":
    "There are no lab results for this patient yet. Results will appear here once ordered labs have been processed.",
  "feedback.orderLabTest": "Order Lab Test",
  "feedback.noDocuments": "No Documents",
  "feedback.noDocumentsDesc":
    "This patient has no uploaded documents. Upload clinical documents, consent forms, or imaging reports.",
  "feedback.uploadDocument": "Upload Document",
  "feedback.notifications": "Notifications",
  "feedback.notificationsDesc":
    "Toast-style notifications that appear in the corner. Used for system feedback — order confirmations, errors, warnings, and informational messages.",
  "feedback.orderSubmitted": "Order Submitted",
  "feedback.orderSubmittedDesc":
    "CBC lab order has been sent to the lab successfully.",
  "feedback.submissionFailed": "Submission Failed",
  "feedback.submissionFailedDesc":
    "Unable to submit order. Please check the connection and try again.",
  "feedback.sessionExpiring": "Session Expiring",
  "feedback.sessionExpiringDesc":
    "Your session will expire in 5 minutes. Save your work.",
  "feedback.newMessageNotif": "New Message",
  "feedback.newMessageNotifDesc":
    "Dr. Chen has sent a message regarding patient Jane Doe.",
  "feedback.success": "Success",
  "feedback.error": "Error",

  // Navigation section
  "navigation.label": "Components",
  "navigation.title": "Navigation",
  "navigation.desc":
    "Navigation patterns for consistent wayfinding across the application.",
  "navigation.topNav": "Top Navigation Bar",
  "navigation.dashboard": "Dashboard",
  "navigation.patients": "Patients",
  "navigation.scheduleNav": "Schedule",
  "navigation.messages": "Messages",
  "navigation.help": "Help",
  "navigation.tabs": "Tabs",
  "navigation.allVisits": "All Visits",
  "navigation.documents": "Documents",
  "navigation.labResults": "Lab Results",
  "navigation.tabContent": "Tab content area",
  "navigation.allVisitsContent": "All visits content",
  "navigation.documentsContent": "Documents content",
  "navigation.labResultsContent": "Lab results content",
  "navigation.breadcrumb": "Breadcrumb",
  "navigation.pagination": "Pagination",
  "navigation.anchorNav": "Anchor Navigation",
  "navigation.anchorNavDesc":
    "In-page navigation for long scrollable content. Used in encounter notes and multi-section forms. The sticky bar at the top of this page is a live example.",
  "navigation.anchorNavText":
    "The anchor navigation bar fixed at the top of this page is a live demo of this component. It highlights the current section as you scroll and supports click-to-jump.",

  // Dropdowns
  "dropdowns.label": "Components",
  "dropdowns.title": "Dropdowns",
  "dropdowns.desc":
    "Dropdown menus, select lists, and action menus. All dropdowns are capped at 1/3 screen height and scroll when content overflows.",
  "dropdowns.selectDropdown": "Select Dropdown",
  "dropdowns.selectDropdownDesc":
    "Standard select input with a scrollable list of options.",
  "dropdowns.country": "Country",
  "dropdowns.selectCountry": "Select a country...",
  "dropdowns.dropdownButton": "Dropdown Button",
  "dropdowns.dropdownButtonDesc":
    "Action menus triggered by a button. Used for contextual actions on rows, cards, and toolbars.",
  "dropdowns.actions": "Actions",
  "dropdowns.editRecord": "Edit Record",
  "dropdowns.duplicate": "Duplicate",
  "dropdowns.exportPdf": "Export PDF",
  "dropdowns.archive": "Archive",
  "dropdowns.viewDetails": "View Details",
  "dropdowns.assignProvider": "Assign Provider",
  "dropdowns.flagReview": "Flag for Review",
  "dropdowns.newOrder": "New Order",
  "dropdowns.labOrders": "Lab Orders",
  "dropdowns.cbc": "Complete Blood Count",
  "dropdowns.bmp": "Basic Metabolic Panel",
  "dropdowns.lipid": "Lipid Panel",
  "dropdowns.imaging": "Imaging",
  "dropdowns.xray": "X-Ray",
  "dropdowns.mri": "MRI",

  // Others
  "others.label": "Components",
  "others.title": "Others",
  "others.desc":
    "Cards, tables, avatars, tooltips, and collapsible sections for displaying structured content.",
  "others.progressBars": "Progress Bars",
  "others.profileComplete": "Profile Complete",
  "others.uploadProgress": "Upload Progress",
  "others.storageUsed": "Storage Used",
  "others.avatars": "Avatars",

  // Overlays
  "overlays.label": "Components",
  "overlays.title": "Overlays",
  "overlays.desc":
    "Modals, tooltips, and drawer patterns for focused interactions.",
  "overlays.modal": "Modal / Dialog",
  "overlays.cancelAppointment": "Cancel Appointment",
  "overlays.cancelConfirm":
    "Are you sure you want to cancel this appointment with",
  "overlays.onDate": "on Feb 26, 2026?",
  "overlays.reasonForCancellation": "Reason for cancellation",
  "overlays.selectReason": "Select a reason...",
  "overlays.scheduleConflict": "Schedule conflict",
  "overlays.feelingBetter": "Feeling better",
  "overlays.other": "Other",
  "overlays.keepAppointment": "Keep Appointment",
  "overlays.tooltips": "Tooltips",
  "overlays.hoverTarget": "Hover target",
  "overlays.thisIsTooltip": "This is a tooltip",
  "overlays.save": "Save",
  "overlays.saveRecord": "Save patient record",
  "overlays.drawer": "Drawer",
  "overlays.drawerDesc":
    "A slide-in panel from the side of the screen. Used for detail views, editing records, and order entry without leaving the current context.",
  "overlays.openPatientDetails": "Open Patient Details",
  "overlays.patientDetails": "Patient Details",
  "overlays.demographics": "Demographics",
  "overlays.dateOfBirth": "Date of Birth",
  "overlays.gender": "Gender",
  "overlays.female": "Female",
  "overlays.phone": "Phone",
  "overlays.emailLabel": "Email",
  "overlays.insurance": "Insurance",
  "overlays.provider": "Provider",
  "overlays.planId": "Plan ID",
  "overlays.group": "Group",
  "overlays.recentEncounters": "Recent Encounters",
  "overlays.telemedicineFollowup": "Telemedicine — Follow-up",
  "overlays.inPersonAnnual": "In-Person — Annual Physical",
  "overlays.close": "Close",
  "overlays.editPatient": "Edit Patient",

  // Layouts
  "layouts.label": "Patterns",
  "layouts.title": "Layouts",
  "layouts.desc":
    "Common layout patterns used across the VSee Clinic application.",
  "layouts.sidebarContent": "Sidebar + Content",
  "layouts.menu": "Menu",
  "layouts.dashboard": "Dashboard",
  "layouts.patients": "Patients",
  "layouts.appointments": "Appointments",
  "layouts.messages": "Messages",
  "layouts.labResults": "Lab Results",
  "layouts.settings": "Settings",
  "layouts.welcomeBack":
    "Welcome back, Dr. Chen. Here's your overview for today.",
  "layouts.patientsToday": "Patients Today",
  "layouts.pendingOrders": "Pending Orders",
  "layouts.followUp": "Follow-up",
  "layouts.newPatient": "New Patient",
  "layouts.telemedicine": "Telemedicine",
  "layouts.unreadMessages":
    "You have 3 unread messages from patients. Check your inbox for the latest updates.",
  "layouts.labResultsReady":
    "2 new lab results are ready for review. Click a result to view the full report.",
  "layouts.settingsDesc":
    "Manage your profile, notification preferences, and clinic configuration.",

  // Theming
  "theming.label": "Engineering",
  "theming.title": "White-Label Theming",
  "theming.desc":
    'VSee supports white-label customization per tenant. Override CSS variables via [data-theme] for brand colors and [data-mode="dark"] for dark mode. Click a card below to switch the theme live, or toggle dark mode in the sidebar.',
  "theming.vseeDefault": "VSee Default",
  "theming.oceanBlue": "Ocean Blue",
  "theming.royalPurple": "Royal Purple",
  "theming.howToSwitch": "How to Switch Themes",
  "theming.darkMode": "Dark Mode",
  "theming.customTheme": "Creating a Custom Theme",

  // Form.io
  "formio.label": "Engineering",
  "formio.title": "Form.io + React Aria",
  "formio.howItWorks": "How it works",
  "formio.formBuilder": "Form.io Builder",
  "formio.formBuilderDesc":
    "Drag-and-drop form builder or JSON editor hosted on form.io or self-hosted",
  "formio.formSchema": "Form Schema",
  "formio.formSchemaDesc":
    "Form definition fetched at runtime — no redeploy needed to change a form",
  "formio.formComponent": "<Form>",
  "formio.formComponentDesc":
    "Renders schema, handles validation, submissions, and multi-step logic",
  "formio.customComponents": "Custom Components",
  "formio.customComponentsDesc":
    "TextField, Checkbox, Select etc. registered as Form.io custom component overrides",
  "formio.jsonSchema": "Form.io JSON Schema",
  "formio.jsonSchemaDesc":
    "The server returns a JSON schema like this. The type field maps to the registered custom component.",
  "formio.registration": "Custom Component Registration",
  "formio.registrationDesc":
    "Each Form.io component type is mapped to a React component. The component object carries the schema properties; onChange updates the submission data.",
  "formio.wiring": "Wiring it Together",
  "formio.livePreview": "Live Preview — Patient Intake Form",
  "formio.livePreviewDesc":
    "This is what the form above renders using the React Aria custom components. All validation, layout, and field logic come from the JSON schema; the React Aria components supply only styling and accessibility.",
  "formio.patientIntake": "Patient Intake Form",
  "formio.renderedBy":
    "Rendered by @formio/react · React Aria custom components",
  "formio.submitted": "Intake form submitted!",
  "formio.resetForm": "Reset form",
  "formio.firstName": "First Name",
  "formio.lastName": "Last Name",
  "formio.dateOfBirth": "Date of Birth",
  "formio.insuranceProvider": "Insurance Provider",
  "formio.selectProvider": "Select provider\u2026",
  "formio.reasonForVisit": "Reason for Visit",
  "formio.reasonPlaceholder":
    "Describe your symptoms or reason for visit\u2026",
  "formio.hipaaConsent":
    "I have read and agree to the HIPAA Privacy Notice",
  "formio.submitIntake": "Submit Intake Form",
  "formio.whatFormio": "What Form.io handles",
  "formio.whatAria": "What React Aria handles",
  "formio.formioList1": "Schema fetch & caching",
  "formio.formioList2":
    "Field-level validation rules (required, min/max, regex)",
  "formio.formioList3": "Conditional visibility logic",
  "formio.formioList4": "Multi-step wizard / page navigation",
  "formio.formioList5": "Submission to Form.io or custom endpoint",
  "formio.formioList6": "Offline drafts & resume",
  "formio.ariaList1": "Visual styling & brand tokens",
  "formio.ariaList2": "Keyboard navigation & focus rings",
  "formio.ariaList3": "ARIA labels, roles, error associations",
  "formio.ariaList4": "React Aria accessibility primitives",
  "formio.ariaList5": "Consistent hover / focus / disabled states",
  "formio.ariaList6": "Design system token inheritance",
  "formio.install": "Install",

  // Tokens
  "tokens.label": "Engineering",
  "tokens.title": "Design Tokens",
  "tokens.desc":
    "Copy the :root block into your global CSS. Tokens support light and dark mode via [data-mode] attributes. Available as CSS custom properties, Tokens Studio JSON, and Figma Variables.",

  // Footer
  "footer.sub": "Design System \u00b7 2026",
  "footer.meta":
    "Plus Jakarta Sans \u00b7 4px grid \u00b7 WCAG AA \u00b7 White-label ready",

  // Misc
  "misc.copied": "Copied",
  "misc.showCode": "Show code",
  "misc.hideCode": "Hide code",
};

/* ─────────────────────────── Vietnamese ─────────────────────────── */
const vi: Translations = {
  // Navigation
  "nav.foundations": "N\u1ec1n t\u1ea3ng",
  "nav.components": "Th\u00e0nh ph\u1ea7n",
  "nav.patterns": "M\u1eabu thi\u1ebft k\u1ebf",
  "nav.engineering": "K\u1ef9 thu\u1eadt",
  "nav.colors": "M\u00e0u s\u1eafc",
  "nav.typography": "Ki\u1ec3u ch\u1eef",
  "nav.spacing": "Kho\u1ea3ng c\u00e1ch & B\u1ed1 c\u1ee5c",
  "nav.buttons": "N\u00fat",
  "nav.forms": "Bi\u1ec3u m\u1eabu",
  "nav.badges": "Huy hi\u1ec7u, Nh\u00e3n & Tr\u1ea1ng th\u00e1i",
  "nav.feedback": "Ph\u1ea3n h\u1ed3i & Th\u00f4ng b\u00e1o",
  "nav.navigation": "\u0110i\u1ec1u h\u01b0\u1edbng",
  "nav.dropdowns": "Danh s\u00e1ch th\u1ea3 xu\u1ed1ng",
  "nav.overlays": "L\u1edbp ph\u1ee7",
  "nav.others": "Kh\u00e1c",
  "nav.layouts": "B\u1ed1 c\u1ee5c",
  "nav.tokens": "Token thi\u1ebft k\u1ebf",
  "nav.theming": "Nh\u00e3n tr\u1eafng",
  "nav.formio": "T\u00edch h\u1ee3p Form.io",

  // Sidebar
  "sidebar.brandColor": "M\u00e0u th\u01b0\u01a1ng hi\u1ec7u",
  "sidebar.mode": "Ch\u1ebf \u0111\u1ed9",
  "sidebar.fontFamily": "Ph\u00f4ng ch\u1eef",
  "sidebar.language": "Ng\u00f4n ng\u1eef",

  // Hero
  "hero.badge": "React Aria + Tailwind — 2026",
  "hero.title": "H\u1ec7 th\u1ed1ng thi\u1ebft k\u1ebf\nVSee Clinic",
  "hero.desc":
    "Ngu\u1ed3n ch\u00e2n l\u00fd duy nh\u1ea5t cho thi\u1ebft k\u1ebf v\u00e0 k\u1ef9 thu\u1eadt. Hi\u1ec7n \u0111\u1ea1i, d\u1ec5 ti\u1ebfp c\u1eadn v\u00e0 \u0111\u01b0\u1ee3c x\u00e2y d\u1ef1ng cho y t\u1ebf t\u1eeb xa quy m\u00f4 l\u1edbn.",
  "hero.tokens": "Token thi\u1ebft k\u1ebf",
  "hero.components": "Th\u00e0nh ph\u1ea7n",
  "hero.wcag": "Tu\u00e2n th\u1ee7 WCAG",
  "hero.grid": "L\u01b0\u1edbi c\u01a1 s\u1edf",

  // Colors
  "colors.label": "N\u1ec1n t\u1ea3ng",
  "colors.title": "M\u00e0u s\u1eafc",
  "colors.desc":
    "B\u1ea3ng m\u00e0u tinh t\u1ebf, d\u1ec5 ti\u1ebfp c\u1eadn, x\u00e2y d\u1ef1ng tr\u00ean m\u00e0u xanh th\u01b0\u01a1ng hi\u1ec7u VSee. M\u1ecdi m\u00e0u \u0111\u1ec1u \u0111\u01b0\u1ee3c ki\u1ec3m tra \u0111\u1ea1t chu\u1ea9n \u0111\u1ed9 t\u01b0\u01a1ng ph\u1ea3n WCAG AA.",
  "colors.brand": "Th\u01b0\u01a1ng hi\u1ec7u",
  "colors.brandDesc":
    "Thang m\u00e0u th\u01b0\u01a1ng hi\u1ec7u ch\u00ednh \u2014 t\u1eeb s\u1eafc nh\u1ea1t \u0111\u1ebfn tr\u1ea1ng th\u00e1i k\u00edch ho\u1ea1t \u0111\u1eadm nh\u1ea5t.",
  "colors.semantic": "Ng\u1eef ngh\u0129a",
  "colors.semanticDesc":
    "Truy\u1ec1n t\u1ea3i \u00fd ngh\u0129a \u2014 tr\u1ea1ng th\u00e1i th\u00e0nh c\u00f4ng, th\u00f4ng tin, c\u1ea3nh b\u00e1o v\u00e0 nguy hi\u1ec3m.",
  "colors.neutrals": "Trung t\u00ednh",
  "colors.surfaces": "B\u1ec1 m\u1eb7t & V\u0103n b\u1ea3n",
  "colors.surfacesCard": "B\u1ec1 m\u1eb7t",
  "colors.textColors": "M\u00e0u v\u0103n b\u1ea3n",

  // Typography
  "typography.label": "N\u1ec1n t\u1ea3ng",
  "typography.title": "Ki\u1ec3u ch\u1eef",
  "typography.desc":
    "Plus Jakarta Sans l\u00e0 ph\u00f4ng ch\u1eef h\u1ec7 th\u1ed1ng \u2014 s\u1ea1ch, d\u1ec5 \u0111\u1ecdc, t\u1ed1i \u01b0u cho giao di\u1ec7n. Thang ch\u1eef s\u1eed d\u1ee5ng ti\u1ebfn tr\u00ecnh h\u00e0i h\u00f2a t\u1eeb 12px \u0111\u1ebfn 60px.",
  "typography.display": "Thi\u1ebft k\u1ebf cho s\u1ee9c kh\u1ecfe",
  "typography.h1": "Ti\u00eau \u0111\u1ec1 trang",
  "typography.h2": "Ti\u00eau \u0111\u1ec1 ph\u1ea7n",
  "typography.h3": "Ti\u1ec3u m\u1ee5c",
  "typography.h4": "Ti\u00eau \u0111\u1ec1 th\u1ebb",
  "typography.h5": "Ti\u00eau \u0111\u1ec1 nh\u00e3n",
  "typography.bodyLg":
    "V\u0103n b\u1ea3n n\u1ed9i dung cho c\u00e1c \u0111o\u1ea1n d\u00e0i v\u00e0 \u0111o\u1ea1n gi\u1edbi thi\u1ec7u.",
  "typography.body":
    "V\u0103n b\u1ea3n n\u1ed9i dung chu\u1ea9n \u0111\u01b0\u1ee3c s\u1eed d\u1ee5ng trong to\u00e0n b\u1ed9 \u1ee9ng d\u1ee5ng.",
  "typography.caption":
    "V\u0103n b\u1ea3n ph\u1ee5, d\u1ea5u th\u1eddi gian v\u00e0 metadata",
  "typography.overline": "Nh\u00e3n ph\u1ea7n",
  "typography.fontWeights": "\u0110\u1ed9 \u0111\u1eadm ph\u00f4ng ch\u1eef",
  "typography.w400":
    "Th\u01b0\u1eddng 400 \u2014 D\u00f9ng cho v\u0103n b\u1ea3n n\u1ed9i dung v\u00e0 m\u00f4 t\u1ea3",
  "typography.w500":
    "V\u1eeba 500 \u2014 D\u00f9ng cho ch\u00fa th\u00edch v\u00e0 nh\u1ea5n m\u1ea1nh ph\u1ee5",
  "typography.w600":
    "N\u1eeda \u0111\u1eadm 600 \u2014 D\u00f9ng cho nh\u00e3n v\u00e0 ti\u00eau \u0111\u1ec1 nh\u1ecf",
  "typography.w700":
    "\u0110\u1eadm 700 \u2014 D\u00f9ng cho ti\u00eau \u0111\u1ec1 v\u00e0 nh\u1ea5n m\u1ea1nh",
  "typography.w800":
    "R\u1ea5t \u0111\u1eadm 800 \u2014 D\u00f9ng cho ti\u00eau \u0111\u1ec1 trang v\u00e0 hi\u1ec3n th\u1ecb",
  "typography.dateFormat": "\u0110\u1ecbnh d\u1ea1ng ng\u00e0y",
  "typography.usFormat": "\u0110\u1ecbnh d\u1ea1ng M\u1ef9",

  // Spacing
  "spacing.label": "N\u1ec1n t\u1ea3ng",
  "spacing.title": "Kho\u1ea3ng c\u00e1ch & B\u1ed1 c\u1ee5c",
  "spacing.desc":
    "Thang kho\u1ea3ng c\u00e1ch d\u1ef1a tr\u00ean 4px \u0111\u1ea3m b\u1ea3o nh\u1ecbp \u0111\u1ec1u \u0111\u1eb7n tr\u00ean m\u1ecdi th\u00e0nh ph\u1ea7n v\u00e0 b\u1ed1 c\u1ee5c.",
  "spacing.scale": "Thang kho\u1ea3ng c\u00e1ch",
  "spacing.shadows": "B\u00f3ng \u0111\u1ed5",
  "spacing.radius": "Bo g\u00f3c",

  // Buttons
  "buttons.label": "Th\u00e0nh ph\u1ea7n",
  "buttons.title": "N\u00fat",
  "buttons.desc":
    "N\u00fat truy\u1ec1n t\u1ea3i h\u00e0nh \u0111\u1ed9ng. N\u00fat ch\u00ednh cho h\u00e0nh \u0111\u1ed9ng quan tr\u1ecdng, n\u00fat ph\u1ee5 cho h\u1ed7 tr\u1ee3, n\u00fat m\u1edd cho h\u00e0nh \u0111\u1ed9ng th\u1ee9 ba.",
  "buttons.variants": "Bi\u1ebfn th\u1ec3",
  "buttons.primary": "Ch\u00ednh",
  "buttons.secondary": "Ph\u1ee5",
  "buttons.ghost": "M\u1edd",
  "buttons.danger": "Nguy hi\u1ec3m",
  "buttons.dangerOutline": "Nguy hi\u1ec3m vi\u1ec1n",
  "buttons.info": "Th\u00f4ng tin",
  "buttons.warning": "C\u1ea3nh b\u00e1o",
  "buttons.link": "Li\u00ean k\u1ebft",
  "buttons.sizes": "K\u00edch th\u01b0\u1edbc",
  "buttons.xl": "R\u1ea5t l\u1edbn",
  "buttons.lg": "L\u1edbn",
  "buttons.default": "M\u1eb7c \u0111\u1ecbnh",
  "buttons.sm": "Nh\u1ecf",
  "buttons.pill": "D\u1ea1ng vi\u00ean",
  "buttons.primaryPill": "Ch\u00ednh vi\u00ean",
  "buttons.secondaryPill": "Ph\u1ee5 vi\u00ean",
  "buttons.ghostPill": "M\u1edd vi\u00ean",
  "buttons.states": "Tr\u1ea1ng th\u00e1i",
  "buttons.hover": "Di chu\u1ed9t",
  "buttons.pressed": "Nh\u1ea5n",
  "buttons.focus": "L\u1ea5y n\u00e9t",
  "buttons.disabled": "V\u00f4 hi\u1ec7u h\u00f3a",
  "buttons.group": "Nh\u00f3m n\u00fat",
  "buttons.today": "H\u00f4m nay",
  "buttons.week": "Tu\u1ea7n",
  "buttons.month": "Th\u00e1ng",
  "buttons.loading": "\u0110ang t\u1ea3i",
  "buttons.saving": "\u0110ang l\u01b0u...",
  "buttons.loadingText": "\u0110ang t\u1ea3i...",
  "buttons.pleaseWait": "Vui l\u00f2ng ch\u1edd",
  "buttons.deleting": "\u0110ang x\u00f3a...",
  "buttons.toggles": "C\u00f4ng t\u1eafc",
  "buttons.notifications": "Th\u00f4ng b\u00e1o",
  "buttons.autoSave": "T\u1ef1 \u0111\u1ed9ng l\u01b0u",
  "buttons.alwaysOn": "Lu\u00f4n b\u1eadt",
  "buttons.unavailable": "Kh\u00f4ng kh\u1ea3 d\u1ee5ng",
  "buttons.on": "B\u1eadt",
  "buttons.off": "T\u1eaft",
  "buttons.withIcons": "V\u1edbi bi\u1ec3u t\u01b0\u1ee3ng",
  "buttons.withIconsDesc":
    "N\u00fat React Aria h\u1ed7 tr\u1ee3 m\u1ecdi n\u1ed9i dung con \u2014 \u0111\u1eb7t bi\u1ec3u t\u01b0\u1ee3ng tr\u01b0\u1edbc ho\u1eb7c sau v\u0103n b\u1ea3n, ho\u1eb7c d\u00f9ng n\u00fat ch\u1ec9 c\u00f3 bi\u1ec3u t\u01b0\u1ee3ng.",
  "buttons.newPatient": "B\u1ec7nh nh\u00e2n m\u1edbi",
  "buttons.export": "Xu\u1ea5t",
  "buttons.share": "Chia s\u1ebb",
  "buttons.delete": "X\u00f3a",
  "buttons.iconRight": "Bi\u1ec3u t\u01b0\u1ee3ng b\u00ean ph\u1ea3i",
  "buttons.send": "G\u1eedi",
  "buttons.upload": "T\u1ea3i l\u00ean",
  "buttons.schedule": "L\u1ecbch h\u1eb9n",
  "buttons.iconOnly": "Ch\u1ec9 bi\u1ec3u t\u01b0\u1ee3ng",
  "buttons.sizesWithIcons": "K\u00edch th\u01b0\u1edbc v\u1edbi bi\u1ec3u t\u01b0\u1ee3ng",

  // Forms
  "forms.label": "Th\u00e0nh ph\u1ea7n",
  "forms.title": "Bi\u1ec3u m\u1eabu",
  "forms.desc":
    "\u0110i\u1ec1u khi\u1ec3n bi\u1ec3u m\u1eabu s\u1ea1ch, d\u1ec5 ti\u1ebfp c\u1eadn v\u1edbi tr\u1ea1ng th\u00e1i l\u1ea5y n\u00e9t r\u00f5 r\u00e0ng v\u00e0 x\u1eed l\u00fd l\u1ed7i.",
  "forms.textInputs": "\u00d4 nh\u1eadp v\u0103n b\u1ea3n",
  "forms.emailAddress": "\u0110\u1ecba ch\u1ec9 email",
  "forms.emailPlaceholder": "you@example.com",
  "forms.fullName": "H\u1ecd v\u00e0 t\u00ean",
  "forms.fullNamePlaceholder": "Nguy\u1ec5n V\u0103n A",
  "forms.medicalLicenseHint":
    "Nh\u01b0 tr\u00ean gi\u1ea5y ph\u00e9p h\u00e0nh ngh\u1ec1 y",
  "forms.fullNameRequired":
    "H\u1ecd v\u00e0 t\u00ean l\u00e0 b\u1eaft bu\u1ed9c",
  "forms.search": "T\u00ecm ki\u1ebfm",
  "forms.searchPatients": "T\u00ecm b\u1ec7nh nh\u00e2n...",
  "forms.selectTextarea": "Ch\u1ecdn & V\u00f9ng v\u0103n b\u1ea3n",
  "forms.specialty": "Chuy\u00ean khoa",
  "forms.selectSpecialty": "Ch\u1ecdn chuy\u00ean khoa...",
  "forms.internalMedicine": "N\u1ed9i khoa",
  "forms.familyMedicine": "Y h\u1ecdc gia \u0111\u00ecnh",
  "forms.pediatrics": "Nhi khoa",
  "forms.notes": "Ghi ch\u00fa",
  "forms.clinicalNotes": "Th\u00eam ghi ch\u00fa l\u00e2m s\u00e0ng...",
  "forms.multiSelect": "Ch\u1ecdn nhi\u1ec1u",
  "forms.filterSpecialty": "L\u1ecdc theo chuy\u00ean khoa",
  "forms.addMore": "Th\u00eam n\u1eefa...",
  "forms.searchSpecialties": "T\u00ecm chuy\u00ean khoa...",
  "forms.noMatches": "Kh\u00f4ng t\u00ecm th\u1ea5y k\u1ebft qu\u1ea3",
  "forms.checkboxes": "H\u1ed9p ki\u1ec3m",
  "forms.showConsultations": "Hi\u1ec3n th\u1ecb l\u01b0\u1ee3t kh\u00e1m",
  "forms.onlyMyPatients":
    "Ch\u1ec9 b\u1ec7nh nh\u00e2n c\u1ee7a t\u00f4i",
  "forms.archivedDisabled":
    "L\u01b0u tr\u1eef (v\u00f4 hi\u1ec7u h\u00f3a)",
  "forms.radios": "N\u00fat radio",
  "forms.phoneCall": "G\u1ecdi \u0111i\u1ec7n tho\u1ea1i",
  "forms.videoCall": "G\u1ecdi video",
  "forms.inPerson": "Tr\u1ef1c ti\u1ebfp",
  "forms.largeInput": "\u00d4 nh\u1eadp l\u1edbn",
  "forms.patientSearch": "T\u00ecm b\u1ec7nh nh\u00e2n",
  "forms.searchByName":
    "T\u00ecm theo t\u00ean, ID ho\u1eb7c s\u1ed1 \u0111i\u1ec7n tho\u1ea1i...",
  "forms.disabledState": "Tr\u1ea1ng th\u00e1i v\u00f4 hi\u1ec7u h\u00f3a",
  "forms.disabledField":
    "Tr\u01b0\u1eddng v\u00f4 hi\u1ec7u h\u00f3a",
  "forms.readOnlyValue": "Gi\u00e1 tr\u1ecb ch\u1ec9 \u0111\u1ecdc",
  "forms.advancedInputs": "\u00d4 nh\u1eadp n\u00e2ng cao",
  "forms.advancedDesc":
    "\u0110i\u1ec1u khi\u1ec3n bi\u1ec3u m\u1eabu chuy\u00ean d\u1ee5ng cho s\u1ed1 \u0111i\u1ec7n tho\u1ea1i, ng\u00e0y th\u00e1ng v\u00e0 \u00f4 nh\u1eadp c\u00f3 bi\u1ec3u t\u01b0\u1ee3ng h\u00e0nh \u0111\u1ed9ng.",
  "forms.phoneNumber": "S\u1ed1 \u0111i\u1ec7n tho\u1ea1i",
  "forms.withCountryCode": "V\u1edbi m\u00e3 qu\u1ed1c gia",
  "forms.withCountryCodeExt":
    "V\u1edbi m\u00e3 qu\u1ed1c gia & s\u1ed1 m\u00e1y l\u1ebb",
  "forms.simple": "\u0110\u01a1n gi\u1ea3n",
  "forms.datePicker": "Ch\u1ecdn ng\u00e0y",
  "forms.appointmentDate": "Ng\u00e0y h\u1eb9n",
  "forms.appointmentTime": "Gi\u1edd h\u1eb9n",
  "forms.appointmentDateTime": "Ng\u00e0y & Gi\u1edd h\u1eb9n",
  "forms.inputWithIcon":
    "\u00d4 nh\u1eadp v\u1edbi bi\u1ec3u t\u01b0\u1ee3ng h\u00e0nh \u0111\u1ed9ng",
  "forms.referenceCode": "M\u00e3 tham chi\u1ebfu",
  "forms.websiteUrl": "URL trang web",
  "forms.inputWithUnit":
    "\u00d4 nh\u1eadp v\u1edbi \u0111\u01a1n v\u1ecb",
  "forms.dosage": "Li\u1ec1u l\u01b0\u1ee3ng",
  "forms.weight": "C\u00e2n n\u1eb7ng",
  "forms.quantity": "S\u1ed1 l\u01b0\u1ee3ng",
  "forms.paymentInput": "\u00d4 nh\u1eadp thanh to\u00e1n",
  "forms.payment": "Thanh to\u00e1n",
  "forms.cardNumber": "S\u1ed1 th\u1ebb",
  "forms.expiry": "Ng\u00e0y h\u1ebft h\u1ea1n",
  "forms.loginForm": "Bi\u1ec3u m\u1eabu \u0111\u0103ng nh\u1eadp",
  "forms.email": "Email",
  "forms.password": "M\u1eadt kh\u1ea9u",
  "forms.enterPassword": "Nh\u1eadp m\u1eadt kh\u1ea9u",
  "forms.rememberMe": "Ghi nh\u1edb t\u00f4i",
  "forms.forgotPassword": "Qu\u00ean m\u1eadt kh\u1ea9u?",
  "forms.signIn": "\u0110\u0103ng nh\u1eadp",
  "forms.inlineInputs": "\u00d4 nh\u1eadp n\u1ed9i tuy\u1ebfn",
  "forms.dispense": "C\u1ea5p ph\u00e1t",
  "forms.tabletsTake": "vi\u00ean, u\u1ed1ng",
  "forms.timesPerDayFor": "l\u1ea7n m\u1ed7i ng\u00e0y trong",
  "forms.days": "ng\u00e0y.",
  "forms.fluidsGiven": "D\u1ecbch truy\u1ec1n",
  "forms.dosageInline": "Li\u1ec1u l\u01b0\u1ee3ng",
  "forms.quantityInline": "S\u1ed1 l\u01b0\u1ee3ng",
  "forms.dateOfService": "Ng\u00e0y kh\u00e1m",
  "forms.facility": "C\u01a1 s\u1edf",
  "forms.signature": "Ch\u1eef k\u00fd",
  "forms.signatureDesc":
    "V\u00f9ng ch\u1eef k\u00fd tay cho bi\u1ec3u m\u1eabu \u0111\u1ed3ng \u00fd, h\u1ee3p \u0111\u1ed3ng v\u00e0 quy tr\u00ecnh nh\u1eadp li\u1ec7u b\u1ec7nh nh\u00e2n.",
  "forms.active": "Ho\u1ea1t \u0111\u1ed9ng",
  "forms.signed": "\u0110\u00e3 k\u00fd",
  "forms.signHere": "K\u00fd t\u1ea1i \u0111\u00e2y",
  "forms.clear": "X\u00f3a",
  "forms.confirm": "X\u00e1c nh\u1eadn",

  // Badges
  "badges.label": "Th\u00e0nh ph\u1ea7n",
  "badges.title": "Huy hi\u1ec7u, Nh\u00e3n & Tr\u1ea1ng th\u00e1i",
  "badges.desc":
    "Truy\u1ec1n t\u1ea3i tr\u1ea1ng th\u00e1i, danh m\u1ee5c v\u00e0 s\u1ed1 l\u01b0\u1ee3ng b\u1eb1ng c\u00e1c ch\u1ec9 b\u00e1o tr\u1ef1c quan tinh t\u1ebf. Nh\u00e3n h\u1ed7 tr\u1ee3 \u0111i\u1ec1u h\u01b0\u1edbng b\u00e0n ph\u00edm v\u00e0 x\u00f3a.",
  "badges.soft": "Huy hi\u1ec7u nh\u1ea1t",
  "badges.active": "Ho\u1ea1t \u0111\u1ed9ng",
  "badges.scheduled": "\u0110\u00e3 l\u00ean l\u1ecbch",
  "badges.pending": "\u0110ang ch\u1edd",
  "badges.overdue": "Qu\u00e1 h\u1ea1n",
  "badges.draft": "Nh\u00e1p",
  "badges.solid": "Huy hi\u1ec7u \u0111\u1eb7c",
  "badges.approved": "\u0110\u00e3 duy\u1ec7t",
  "badges.processing": "\u0110ang x\u1eed l\u00fd",
  "badges.review": "Xem x\u00e9t",
  "badges.urgent": "Kh\u1ea9n c\u1ea5p",
  "badges.default": "M\u1eb7c \u0111\u1ecbnh",
  "badges.removableTags": "Nh\u00e3n c\u00f3 th\u1ec3 x\u00f3a",
  "badges.activeDiagnoses":
    "Ch\u1ea9n \u0111o\u00e1n \u0111ang ho\u1ea1t \u0111\u1ed9ng",

  // Feedback
  "feedback.label": "Th\u00e0nh ph\u1ea7n",
  "feedback.title": "Ph\u1ea3n h\u1ed3i & Th\u00f4ng b\u00e1o",
  "feedback.desc":
    "C\u1ea3nh b\u00e1o, toast, ch\u1ec9 b\u00e1o ti\u1ebfn \u0111\u1ed9, tr\u1ea1ng th\u00e1i tr\u1ed1ng v\u00e0 th\u00f4ng b\u00e1o \u0111\u1ec3 truy\u1ec1n t\u1ea3i tr\u1ea1ng th\u00e1i h\u1ec7 th\u1ed1ng.",
  "feedback.alerts": "C\u1ea3nh b\u00e1o",
  "feedback.changesSaved": "Thay \u0111\u1ed5i \u0111\u00e3 l\u01b0u",
  "feedback.changesSavedDesc":
    "H\u1ed3 s\u01a1 b\u1ec7nh nh\u00e2n \u0111\u00e3 \u0111\u01b0\u1ee3c c\u1eadp nh\u1eadt th\u00e0nh c\u00f4ng.",
  "feedback.appointmentReminder":
    "Nh\u1eafc l\u1ecbch h\u1eb9n",
  "feedback.appointmentReminderDesc":
    "L\u1ecbch h\u1eb9n ti\u1ebfp theo c\u1ee7a b\u1ea1n v\u00e0o ng\u00e0y mai l\u00fac 14:00.",
  "feedback.outstandingBalance": "S\u1ed1 d\u01b0 c\u00f2n n\u1ee3",
  "feedback.outstandingBalanceDesc":
    "B\u1ec7nh nh\u00e2n n\u00e0y c\u00f3 s\u1ed1 d\u01b0 ch\u01b0a thanh to\u00e1n $45,00.",
  "feedback.formFailed":
    "G\u1eedi bi\u1ec3u m\u1eabu th\u1ea5t b\u1ea1i",
  "feedback.formFailedDesc":
    "Vui l\u00f2ng ki\u1ec3m tra c\u00e1c tr\u01b0\u1eddng b\u1eaft bu\u1ed9c v\u00e0 th\u1eed l\u1ea1i.",
  "feedback.toasts": "Th\u00f4ng b\u00e1o toast",
  "feedback.apptConfirmed":
    "L\u1ecbch h\u1eb9n \u0111\u00e3 x\u00e1c nh\u1eadn",
  "feedback.apptConfirmedDesc":
    "26 th\u00e1ng 2, 2026 l\u00fac 10:00 SA v\u1edbi BS. Chen",
  "feedback.connectionLost": "M\u1ea5t k\u1ebft n\u1ed1i",
  "feedback.connectionLostDesc":
    "Vui l\u00f2ng ki\u1ec3m tra k\u1ebft n\u1ed1i internet c\u1ee7a b\u1ea1n.",
  "feedback.newMessage": "Tin nh\u1eafn m\u1edbi",
  "feedback.newMessageDesc":
    "B\u1ea1n c\u00f3 3 tin nh\u1eafn ch\u01b0a \u0111\u1ecdc t\u1eeb b\u1ec7nh nh\u00e2n.",
  "feedback.emptyState": "Tr\u1ea1ng th\u00e1i tr\u1ed1ng",
  "feedback.emptyStateDesc":
    "N\u1ed9i dung gi\u1eef ch\u1ed7 hi\u1ec3n th\u1ecb khi kh\u00f4ng c\u00f3 d\u1eef li\u1ec7u. Cung c\u1ea5p ng\u1eef c\u1ea3nh v\u00e0 l\u1eddi k\u00eau g\u1ecdi h\u00e0nh \u0111\u1ed9ng.",
  "feedback.noResults":
    "Kh\u00f4ng t\u00ecm th\u1ea5y k\u1ebft qu\u1ea3",
  "feedback.noResultsDesc":
    "Ch\u01b0a c\u00f3 k\u1ebft qu\u1ea3 x\u00e9t nghi\u1ec7m cho b\u1ec7nh nh\u00e2n n\u00e0y. K\u1ebft qu\u1ea3 s\u1ebd hi\u1ec3n th\u1ecb t\u1ea1i \u0111\u00e2y khi x\u00e9t nghi\u1ec7m \u0111\u00e3 \u0111\u01b0\u1ee3c x\u1eed l\u00fd.",
  "feedback.orderLabTest":
    "Y\u00eau c\u1ea7u x\u00e9t nghi\u1ec7m",
  "feedback.noDocuments": "Kh\u00f4ng c\u00f3 t\u00e0i li\u1ec7u",
  "feedback.noDocumentsDesc":
    "B\u1ec7nh nh\u00e2n n\u00e0y kh\u00f4ng c\u00f3 t\u00e0i li\u1ec7u t\u1ea3i l\u00ean. T\u1ea3i l\u00ean t\u00e0i li\u1ec7u l\u00e2m s\u00e0ng, bi\u1ec3u m\u1eabu \u0111\u1ed3ng \u00fd ho\u1eb7c b\u00e1o c\u00e1o h\u00ecnh \u1ea3nh.",
  "feedback.uploadDocument": "T\u1ea3i l\u00ean t\u00e0i li\u1ec7u",
  "feedback.notifications": "Th\u00f4ng b\u00e1o",
  "feedback.notificationsDesc":
    "Th\u00f4ng b\u00e1o d\u1ea1ng toast xu\u1ea5t hi\u1ec7n \u1edf g\u00f3c m\u00e0n h\u00ecnh. D\u00f9ng cho ph\u1ea3n h\u1ed3i h\u1ec7 th\u1ed1ng \u2014 x\u00e1c nh\u1eadn \u0111\u01a1n, l\u1ed7i, c\u1ea3nh b\u00e1o v\u00e0 th\u00f4ng tin.",
  "feedback.orderSubmitted":
    "\u0110\u01a1n \u0111\u00e3 g\u1eedi",
  "feedback.orderSubmittedDesc":
    "\u0110\u01a1n x\u00e9t nghi\u1ec7m CBC \u0111\u00e3 \u0111\u01b0\u1ee3c g\u1eedi \u0111\u1ebfn ph\u00f2ng x\u00e9t nghi\u1ec7m th\u00e0nh c\u00f4ng.",
  "feedback.submissionFailed": "G\u1eedi th\u1ea5t b\u1ea1i",
  "feedback.submissionFailedDesc":
    "Kh\u00f4ng th\u1ec3 g\u1eedi \u0111\u01a1n. Vui l\u00f2ng ki\u1ec3m tra k\u1ebft n\u1ed1i v\u00e0 th\u1eed l\u1ea1i.",
  "feedback.sessionExpiring":
    "Phi\u00ean s\u1eafp h\u1ebft h\u1ea1n",
  "feedback.sessionExpiringDesc":
    "Phi\u00ean c\u1ee7a b\u1ea1n s\u1ebd h\u1ebft h\u1ea1n trong 5 ph\u00fat. H\u00e3y l\u01b0u c\u00f4ng vi\u1ec7c.",
  "feedback.newMessageNotif": "Tin nh\u1eafn m\u1edbi",
  "feedback.newMessageNotifDesc":
    "BS. Chen \u0111\u00e3 g\u1eedi tin nh\u1eafn v\u1ec1 b\u1ec7nh nh\u00e2n Jane Doe.",
  "feedback.success": "Th\u00e0nh c\u00f4ng",
  "feedback.error": "L\u1ed7i",

  // Navigation section
  "navigation.label": "Th\u00e0nh ph\u1ea7n",
  "navigation.title": "\u0110i\u1ec1u h\u01b0\u1edbng",
  "navigation.desc":
    "C\u00e1c m\u1eabu \u0111i\u1ec1u h\u01b0\u1edbng \u0111\u1ec3 \u0111\u1ecbnh h\u01b0\u1edbng nh\u1ea5t qu\u00e1n trong \u1ee9ng d\u1ee5ng.",
  "navigation.topNav":
    "Thanh \u0111i\u1ec1u h\u01b0\u1edbng tr\u00ean c\u00f9ng",
  "navigation.dashboard": "B\u1ea3ng \u0111i\u1ec1u khi\u1ec3n",
  "navigation.patients": "B\u1ec7nh nh\u00e2n",
  "navigation.scheduleNav": "L\u1ecbch h\u1eb9n",
  "navigation.messages": "Tin nh\u1eafn",
  "navigation.help": "Tr\u1ee3 gi\u00fap",
  "navigation.tabs": "Tab",
  "navigation.allVisits": "T\u1ea5t c\u1ea3 l\u01b0\u1ee3t kh\u00e1m",
  "navigation.documents": "T\u00e0i li\u1ec7u",
  "navigation.labResults":
    "K\u1ebft qu\u1ea3 x\u00e9t nghi\u1ec7m",
  "navigation.tabContent": "V\u00f9ng n\u1ed9i dung tab",
  "navigation.allVisitsContent":
    "N\u1ed9i dung t\u1ea5t c\u1ea3 l\u01b0\u1ee3t kh\u00e1m",
  "navigation.documentsContent": "N\u1ed9i dung t\u00e0i li\u1ec7u",
  "navigation.labResultsContent":
    "N\u1ed9i dung k\u1ebft qu\u1ea3 x\u00e9t nghi\u1ec7m",
  "navigation.breadcrumb": "\u0110\u01b0\u1eddng d\u1eabn",
  "navigation.pagination": "Ph\u00e2n trang",
  "navigation.anchorNav":
    "\u0110i\u1ec1u h\u01b0\u1edbng neo",
  "navigation.anchorNavDesc":
    "\u0110i\u1ec1u h\u01b0\u1edbng trong trang cho n\u1ed9i dung cu\u1ed9n d\u00e0i. D\u00f9ng trong ghi ch\u00fa kh\u00e1m v\u00e0 bi\u1ec3u m\u1eabu nhi\u1ec1u ph\u1ea7n. Thanh d\u00ednh \u1edf \u0111\u1ea7u trang l\u00e0 v\u00ed d\u1ee5 tr\u1ef1c ti\u1ebfp.",
  "navigation.anchorNavText":
    "Thanh \u0111i\u1ec1u h\u01b0\u1edbng neo c\u1ed1 \u0111\u1ecbnh \u1edf \u0111\u1ea7u trang l\u00e0 b\u1ea3n demo tr\u1ef1c ti\u1ebfp c\u1ee7a th\u00e0nh ph\u1ea7n n\u00e0y. N\u00f3 \u0111\u00e1nh d\u1ea5u ph\u1ea7n hi\u1ec7n t\u1ea1i khi cu\u1ed9n v\u00e0 h\u1ed7 tr\u1ee3 nh\u1ea5p \u0111\u1ec3 chuy\u1ec3n \u0111\u1ebfn.",

  // Dropdowns
  "dropdowns.label": "Th\u00e0nh ph\u1ea7n",
  "dropdowns.title": "Danh s\u00e1ch th\u1ea3 xu\u1ed1ng",
  "dropdowns.desc":
    "Menu th\u1ea3 xu\u1ed1ng, danh s\u00e1ch ch\u1ecdn v\u00e0 menu h\u00e0nh \u0111\u1ed9ng. T\u1ea5t c\u1ea3 gi\u1edbi h\u1ea1n 1/3 chi\u1ec1u cao m\u00e0n h\u00ecnh v\u00e0 cu\u1ed9n khi n\u1ed9i dung tr\u00e0n.",
  "dropdowns.selectDropdown":
    "Dropdown ch\u1ecdn",
  "dropdowns.selectDropdownDesc":
    "\u00d4 ch\u1ecdn ti\u00eau chu\u1ea9n v\u1edbi danh s\u00e1ch t\u00f9y ch\u1ecdn c\u00f3 th\u1ec3 cu\u1ed9n.",
  "dropdowns.country": "Qu\u1ed1c gia",
  "dropdowns.selectCountry": "Ch\u1ecdn qu\u1ed1c gia...",
  "dropdowns.dropdownButton": "N\u00fat dropdown",
  "dropdowns.dropdownButtonDesc":
    "Menu h\u00e0nh \u0111\u1ed9ng k\u00edch ho\u1ea1t b\u1eb1ng n\u00fat. D\u00f9ng cho h\u00e0nh \u0111\u1ed9ng theo ng\u1eef c\u1ea3nh tr\u00ean h\u00e0ng, th\u1ebb v\u00e0 thanh c\u00f4ng c\u1ee5.",
  "dropdowns.actions": "H\u00e0nh \u0111\u1ed9ng",
  "dropdowns.editRecord":
    "Ch\u1ec9nh s\u1eeda b\u1ea3n ghi",
  "dropdowns.duplicate": "Nh\u00e2n b\u1ea3n",
  "dropdowns.exportPdf": "Xu\u1ea5t PDF",
  "dropdowns.archive": "L\u01b0u tr\u1eef",
  "dropdowns.viewDetails": "Xem chi ti\u1ebft",
  "dropdowns.assignProvider":
    "Ch\u1ec9 \u0111\u1ecbnh b\u00e1c s\u0129",
  "dropdowns.flagReview":
    "\u0110\u00e1nh d\u1ea5u xem x\u00e9t",
  "dropdowns.newOrder":
    "\u0110\u01a1n m\u1edbi",
  "dropdowns.labOrders":
    "\u0110\u01a1n x\u00e9t nghi\u1ec7m",
  "dropdowns.cbc": "C\u00f4ng th\u1ee9c m\u00e1u to\u00e0n ph\u1ea7n",
  "dropdowns.bmp":
    "B\u1ea3ng chuy\u1ec3n h\u00f3a c\u01a1 b\u1ea3n",
  "dropdowns.lipid": "B\u1ea3ng lipid",
  "dropdowns.imaging": "H\u00ecnh \u1ea3nh",
  "dropdowns.xray": "X-Quang",
  "dropdowns.mri": "MRI",

  // Others
  "others.label": "Th\u00e0nh ph\u1ea7n",
  "others.title": "Kh\u00e1c",
  "others.desc":
    "Th\u1ebb, b\u1ea3ng, avatar, tooltip v\u00e0 c\u00e1c ph\u1ea7n c\u00f3 th\u1ec3 thu g\u1ecdn \u0111\u1ec3 hi\u1ec3n th\u1ecb n\u1ed9i dung c\u00f3 c\u1ea5u tr\u00fac.",
  "others.progressBars": "Thanh ti\u1ebfn \u0111\u1ed9",
  "others.profileComplete":
    "H\u1ed3 s\u01a1 ho\u00e0n th\u00e0nh",
  "others.uploadProgress": "Ti\u1ebfn \u0111\u1ed9 t\u1ea3i l\u00ean",
  "others.storageUsed":
    "Dung l\u01b0\u1ee3ng \u0111\u00e3 d\u00f9ng",
  "others.avatars": "Avatar",

  // Overlays
  "overlays.label": "Th\u00e0nh ph\u1ea7n",
  "overlays.title": "L\u1edbp ph\u1ee7",
  "overlays.desc":
    "Modal, tooltip v\u00e0 m\u1eabu ng\u0103n k\u00e9o cho t\u01b0\u01a1ng t\u00e1c t\u1eadp trung.",
  "overlays.modal": "Modal / H\u1ed9p tho\u1ea1i",
  "overlays.cancelAppointment":
    "H\u1ee7y l\u1ecbch h\u1eb9n",
  "overlays.cancelConfirm":
    "B\u1ea1n c\u00f3 ch\u1eafc mu\u1ed1n h\u1ee7y l\u1ecbch h\u1eb9n v\u1edbi",
  "overlays.onDate": "v\u00e0o ng\u00e0y 26 th\u00e1ng 2, 2026?",
  "overlays.reasonForCancellation": "L\u00fd do h\u1ee7y",
  "overlays.selectReason": "Ch\u1ecdn l\u00fd do...",
  "overlays.scheduleConflict": "Xung \u0111\u1ed9t l\u1ecbch",
  "overlays.feelingBetter":
    "C\u1ea3m th\u1ea5y t\u1ed1t h\u01a1n",
  "overlays.other": "Kh\u00e1c",
  "overlays.keepAppointment":
    "Gi\u1eef l\u1ecbch h\u1eb9n",
  "overlays.tooltips": "Tooltip",
  "overlays.hoverTarget": "V\u00f9ng di chu\u1ed9t",
  "overlays.thisIsTooltip": "\u0110\u00e2y l\u00e0 tooltip",
  "overlays.save": "L\u01b0u",
  "overlays.saveRecord":
    "L\u01b0u h\u1ed3 s\u01a1 b\u1ec7nh nh\u00e2n",
  "overlays.drawer": "Ng\u0103n k\u00e9o",
  "overlays.drawerDesc":
    "B\u1ea3ng tr\u01b0\u1ee3t v\u00e0o t\u1eeb c\u1ea1nh m\u00e0n h\u00ecnh. D\u00f9ng cho xem chi ti\u1ebft, ch\u1ec9nh s\u1eeda b\u1ea3n ghi v\u00e0 nh\u1eadp \u0111\u01a1n m\u00e0 kh\u00f4ng r\u1eddi ng\u1eef c\u1ea3nh hi\u1ec7n t\u1ea1i.",
  "overlays.openPatientDetails":
    "M\u1edf chi ti\u1ebft b\u1ec7nh nh\u00e2n",
  "overlays.patientDetails":
    "Chi ti\u1ebft b\u1ec7nh nh\u00e2n",
  "overlays.demographics": "Th\u00f4ng tin nh\u00e2n kh\u1ea9u",
  "overlays.dateOfBirth": "Ng\u00e0y sinh",
  "overlays.gender": "Gi\u1edbi t\u00ednh",
  "overlays.female": "N\u1eef",
  "overlays.phone": "\u0110i\u1ec7n tho\u1ea1i",
  "overlays.emailLabel": "Email",
  "overlays.insurance": "B\u1ea3o hi\u1ec3m",
  "overlays.provider": "Nh\u00e0 cung c\u1ea5p",
  "overlays.planId": "M\u00e3 g\u00f3i",
  "overlays.group": "Nh\u00f3m",
  "overlays.recentEncounters":
    "L\u01b0\u1ee3t kh\u00e1m g\u1ea7n \u0111\u00e2y",
  "overlays.telemedicineFollowup":
    "T\u1eeb xa \u2014 T\u00e1i kh\u00e1m",
  "overlays.inPersonAnnual":
    "Tr\u1ef1c ti\u1ebfp \u2014 Kh\u00e1m s\u1ee9c kh\u1ecfe h\u00e0ng n\u0103m",
  "overlays.close": "\u0110\u00f3ng",
  "overlays.editPatient":
    "Ch\u1ec9nh s\u1eeda b\u1ec7nh nh\u00e2n",

  // Layouts
  "layouts.label": "M\u1eabu thi\u1ebft k\u1ebf",
  "layouts.title": "B\u1ed1 c\u1ee5c",
  "layouts.desc":
    "C\u00e1c m\u1eabu b\u1ed1 c\u1ee5c th\u01b0\u1eddng d\u00f9ng trong \u1ee9ng d\u1ee5ng VSee Clinic.",
  "layouts.sidebarContent":
    "Thanh b\u00ean + N\u1ed9i dung",
  "layouts.menu": "Menu",
  "layouts.dashboard": "B\u1ea3ng \u0111i\u1ec1u khi\u1ec3n",
  "layouts.patients": "B\u1ec7nh nh\u00e2n",
  "layouts.appointments": "L\u1ecbch h\u1eb9n",
  "layouts.messages": "Tin nh\u1eafn",
  "layouts.labResults":
    "K\u1ebft qu\u1ea3 x\u00e9t nghi\u1ec7m",
  "layouts.settings": "C\u00e0i \u0111\u1eb7t",
  "layouts.welcomeBack":
    "Ch\u00e0o m\u1eebng tr\u1edf l\u1ea1i, BS. Chen. \u0110\u00e2y l\u00e0 t\u1ed5ng quan h\u00f4m nay c\u1ee7a b\u1ea1n.",
  "layouts.patientsToday":
    "B\u1ec7nh nh\u00e2n h\u00f4m nay",
  "layouts.pendingOrders":
    "\u0110\u01a1n ch\u1edd x\u1eed l\u00fd",
  "layouts.followUp": "T\u00e1i kh\u00e1m",
  "layouts.newPatient": "B\u1ec7nh nh\u00e2n m\u1edbi",
  "layouts.telemedicine": "T\u1eeb xa",
  "layouts.unreadMessages":
    "B\u1ea1n c\u00f3 3 tin nh\u1eafn ch\u01b0a \u0111\u1ecdc t\u1eeb b\u1ec7nh nh\u00e2n. Ki\u1ec3m tra h\u1ed9p th\u01b0 \u0111\u1ec3 xem c\u1eadp nh\u1eadt m\u1edbi nh\u1ea5t.",
  "layouts.labResultsReady":
    "2 k\u1ebft qu\u1ea3 x\u00e9t nghi\u1ec7m m\u1edbi s\u1eb5n s\u00e0ng xem x\u00e9t. Nh\u1ea5p v\u00e0o k\u1ebft qu\u1ea3 \u0111\u1ec3 xem b\u00e1o c\u00e1o \u0111\u1ea7y \u0111\u1ee7.",
  "layouts.settingsDesc":
    "Qu\u1ea3n l\u00fd h\u1ed3 s\u01a1, t\u00f9y ch\u1ecdn th\u00f4ng b\u00e1o v\u00e0 c\u1ea5u h\u00ecnh ph\u00f2ng kh\u00e1m.",

  // Theming
  "theming.label": "K\u1ef9 thu\u1eadt",
  "theming.title": "T\u00f9y ch\u1ec9nh nh\u00e3n tr\u1eafng",
  "theming.desc":
    'VSee h\u1ed7 tr\u1ee3 t\u00f9y ch\u1ec9nh nh\u00e3n tr\u1eafng theo t\u1eebng kh\u00e1ch h\u00e0ng. Ghi \u0111\u00e8 bi\u1ebfn CSS qua [data-theme] cho m\u00e0u th\u01b0\u01a1ng hi\u1ec7u v\u00e0 [data-mode="dark"] cho ch\u1ebf \u0111\u1ed9 t\u1ed1i. Nh\u1ea5p v\u00e0o th\u1ebb b\u00ean d\u01b0\u1edbi \u0111\u1ec3 chuy\u1ec3n giao di\u1ec7n, ho\u1eb7c b\u1eadt ch\u1ebf \u0111\u1ed9 t\u1ed1i trong thanh b\u00ean.',
  "theming.vseeDefault":
    "VSee m\u1eb7c \u0111\u1ecbnh",
  "theming.oceanBlue": "Xanh \u0111\u1ea1i d\u01b0\u01a1ng",
  "theming.royalPurple": "T\u00edm ho\u00e0ng gia",
  "theming.howToSwitch":
    "C\u00e1ch chuy\u1ec3n giao di\u1ec7n",
  "theming.darkMode": "Ch\u1ebf \u0111\u1ed9 t\u1ed1i",
  "theming.customTheme":
    "T\u1ea1o giao di\u1ec7n t\u00f9y ch\u1ec9nh",

  // Form.io
  "formio.label": "K\u1ef9 thu\u1eadt",
  "formio.title": "Form.io + React Aria",
  "formio.howItWorks": "C\u00e1ch ho\u1ea1t \u0111\u1ed9ng",
  "formio.formBuilder": "Tr\u00ecnh t\u1ea1o Form.io",
  "formio.formBuilderDesc":
    "Tr\u00ecnh t\u1ea1o bi\u1ec3u m\u1eabu k\u00e9o th\u1ea3 ho\u1eb7c tr\u00ecnh so\u1ea1n JSON, l\u01b0u tr\u1eef tr\u00ean form.io ho\u1eb7c t\u1ef1 l\u01b0u tr\u1eef",
  "formio.formSchema": "Schema bi\u1ec3u m\u1eabu",
  "formio.formSchemaDesc":
    "\u0110\u1ecbnh ngh\u0129a bi\u1ec3u m\u1eabu l\u1ea5y t\u1ea1i runtime \u2014 kh\u00f4ng c\u1ea7n tri\u1ec3n khai l\u1ea1i \u0111\u1ec3 thay \u0111\u1ed5i bi\u1ec3u m\u1eabu",
  "formio.formComponent": "<Form>",
  "formio.formComponentDesc":
    "Hi\u1ec3n th\u1ecb schema, x\u1eed l\u00fd ki\u1ec3m tra, g\u1eedi d\u1eef li\u1ec7u v\u00e0 logic nhi\u1ec1u b\u01b0\u1edbc",
  "formio.customComponents":
    "Th\u00e0nh ph\u1ea7n t\u00f9y ch\u1ec9nh",
  "formio.customComponentsDesc":
    "TextField, Checkbox, Select v.v. \u0111\u01b0\u1ee3c \u0111\u0103ng k\u00fd l\u00e0m th\u00e0nh ph\u1ea7n t\u00f9y ch\u1ec9nh ghi \u0111\u00e8 Form.io",
  "formio.jsonSchema": "Schema JSON Form.io",
  "formio.jsonSchemaDesc":
    "M\u00e1y ch\u1ee7 tr\u1ea3 v\u1ec1 schema JSON nh\u01b0 n\u00e0y. Tr\u01b0\u1eddng type \u00e1nh x\u1ea1 \u0111\u1ebfn th\u00e0nh ph\u1ea7n t\u00f9y ch\u1ec9nh \u0111\u00e3 \u0111\u0103ng k\u00fd.",
  "formio.registration":
    "\u0110\u0103ng k\u00fd th\u00e0nh ph\u1ea7n t\u00f9y ch\u1ec9nh",
  "formio.registrationDesc":
    "M\u1ed7i lo\u1ea1i th\u00e0nh ph\u1ea7n Form.io \u0111\u01b0\u1ee3c \u00e1nh x\u1ea1 t\u1edbi m\u1ed9t th\u00e0nh ph\u1ea7n React. \u0110\u1ed1i t\u01b0\u1ee3ng component mang thu\u1ed9c t\u00ednh schema; onChange c\u1eadp nh\u1eadt d\u1eef li\u1ec7u g\u1eedi.",
  "formio.wiring": "K\u1ebft n\u1ed1i t\u1ea5t c\u1ea3",
  "formio.livePreview":
    "Xem tr\u01b0\u1edbc tr\u1ef1c ti\u1ebfp \u2014 Bi\u1ec3u m\u1eabu nh\u1eadp li\u1ec7u b\u1ec7nh nh\u00e2n",
  "formio.livePreviewDesc":
    "\u0110\u00e2y l\u00e0 k\u1ebft qu\u1ea3 hi\u1ec3n th\u1ecb c\u1ee7a bi\u1ec3u m\u1eabu tr\u00ean s\u1eed d\u1ee5ng th\u00e0nh ph\u1ea7n React Aria t\u00f9y ch\u1ec9nh. T\u1ea5t c\u1ea3 ki\u1ec3m tra, b\u1ed1 c\u1ee5c v\u00e0 logic tr\u01b0\u1eddng \u0111\u1ebfn t\u1eeb schema JSON; c\u00e1c th\u00e0nh ph\u1ea7n React Aria ch\u1ec9 cung c\u1ea5p ki\u1ec3u d\u00e1ng v\u00e0 kh\u1ea3 n\u0103ng ti\u1ebfp c\u1eadn.",
  "formio.patientIntake":
    "Bi\u1ec3u m\u1eabu nh\u1eadp li\u1ec7u b\u1ec7nh nh\u00e2n",
  "formio.renderedBy":
    "Hi\u1ec3n th\u1ecb b\u1edfi @formio/react \u00b7 Th\u00e0nh ph\u1ea7n React Aria t\u00f9y ch\u1ec9nh",
  "formio.submitted":
    "Bi\u1ec3u m\u1eabu nh\u1eadp li\u1ec7u \u0111\u00e3 g\u1eedi!",
  "formio.resetForm":
    "\u0110\u1eb7t l\u1ea1i bi\u1ec3u m\u1eabu",
  "formio.firstName": "T\u00ean",
  "formio.lastName": "H\u1ecd",
  "formio.dateOfBirth": "Ng\u00e0y sinh",
  "formio.insuranceProvider":
    "Nh\u00e0 b\u1ea3o hi\u1ec3m",
  "formio.selectProvider":
    "Ch\u1ecdn nh\u00e0 cung c\u1ea5p\u2026",
  "formio.reasonForVisit": "L\u00fd do kh\u00e1m",
  "formio.reasonPlaceholder":
    "M\u00f4 t\u1ea3 tri\u1ec7u ch\u1ee9ng ho\u1eb7c l\u00fd do kh\u00e1m\u2026",
  "formio.hipaaConsent":
    "T\u00f4i \u0111\u00e3 \u0111\u1ecdc v\u00e0 \u0111\u1ed3ng \u00fd v\u1edbi Th\u00f4ng b\u00e1o Quy\u1ec1n Ri\u00eang t\u01b0 HIPAA",
  "formio.submitIntake":
    "G\u1eedi bi\u1ec3u m\u1eabu nh\u1eadp li\u1ec7u",
  "formio.whatFormio": "Form.io x\u1eed l\u00fd g\u00ec",
  "formio.whatAria": "React Aria x\u1eed l\u00fd g\u00ec",
  "formio.formioList1":
    "T\u1ea3i v\u00e0 l\u01b0u b\u1ed9 nh\u1edb schema",
  "formio.formioList2":
    "Quy t\u1eafc ki\u1ec3m tra c\u1ea5p tr\u01b0\u1eddng (b\u1eaft bu\u1ed9c, min/max, regex)",
  "formio.formioList3":
    "Logic hi\u1ec3n th\u1ecb c\u00f3 \u0111i\u1ec1u ki\u1ec7n",
  "formio.formioList4":
    "Tr\u00ecnh h\u01b0\u1edbng d\u1eabn nhi\u1ec1u b\u01b0\u1edbc / \u0111i\u1ec1u h\u01b0\u1edbng trang",
  "formio.formioList5":
    "G\u1eedi \u0111\u1ebfn Form.io ho\u1eb7c endpoint t\u00f9y ch\u1ec9nh",
  "formio.formioList6":
    "B\u1ea3n nh\u00e1p ngo\u1ea1i tuy\u1ebfn & ti\u1ebfp t\u1ee5c",
  "formio.ariaList1":
    "Ki\u1ec3u d\u00e1ng v\u00e0 token th\u01b0\u01a1ng hi\u1ec7u",
  "formio.ariaList2":
    "\u0110i\u1ec1u h\u01b0\u1edbng b\u00e0n ph\u00edm & vring l\u1ea5y n\u00e9t",
  "formio.ariaList3":
    "Nh\u00e3n ARIA, vai tr\u00f2, li\u00ean k\u1ebft l\u1ed7i",
  "formio.ariaList4":
    "Nguy\u00ean m\u1eabu kh\u1ea3 n\u0103ng ti\u1ebfp c\u1eadn React Aria",
  "formio.ariaList5":
    "Tr\u1ea1ng th\u00e1i hover / focus / disabled nh\u1ea5t qu\u00e1n",
  "formio.ariaList6":
    "K\u1ebf th\u1eeba token h\u1ec7 th\u1ed1ng thi\u1ebft k\u1ebf",
  "formio.install": "C\u00e0i \u0111\u1eb7t",

  // Tokens
  "tokens.label": "K\u1ef9 thu\u1eadt",
  "tokens.title": "Token thi\u1ebft k\u1ebf",
  "tokens.desc":
    "Sao ch\u00e9p kh\u1ed1i :root v\u00e0o CSS chung. Token h\u1ed7 tr\u1ee3 ch\u1ebf \u0111\u1ed9 s\u00e1ng v\u00e0 t\u1ed1i qua thu\u1ed9c t\u00ednh [data-mode]. C\u00f3 s\u1eb5n d\u01b0\u1edbi d\u1ea1ng thu\u1ed9c t\u00ednh CSS, JSON Tokens Studio v\u00e0 Figma Variables.",

  // Footer
  "footer.sub": "H\u1ec7 th\u1ed1ng thi\u1ebft k\u1ebf \u00b7 2026",
  "footer.meta":
    "Plus Jakarta Sans \u00b7 L\u01b0\u1edbi 4px \u00b7 WCAG AA \u00b7 S\u1eb5n s\u00e0ng nh\u00e3n tr\u1eafng",

  // Misc
  "misc.copied": "\u0110\u00e3 sao ch\u00e9p",
  "misc.showCode": "Hi\u1ec3n m\u00e3",
  "misc.hideCode": "\u1ea8n m\u00e3",
};

/* ─────────────────────────── Spanish ─────────────────────────── */
const es: Translations = {
  // Navigation
  "nav.foundations": "Fundamentos",
  "nav.components": "Componentes",
  "nav.patterns": "Patrones",
  "nav.engineering": "Ingenier\u00eda",
  "nav.colors": "Colores",
  "nav.typography": "Tipograf\u00eda",
  "nav.spacing": "Espaciado y Dise\u00f1o",
  "nav.buttons": "Botones",
  "nav.forms": "Elementos de formulario",
  "nav.badges": "Insignias, Etiquetas y Estado",
  "nav.feedback": "Retroalimentaci\u00f3n y Notificaciones",
  "nav.navigation": "Navegaci\u00f3n",
  "nav.dropdowns": "Men\u00fas desplegables",
  "nav.overlays": "Superposiciones",
  "nav.others": "Otros",
  "nav.layouts": "Dise\u00f1os",
  "nav.tokens": "Tokens de dise\u00f1o",
  "nav.theming": "Marca blanca",
  "nav.formio": "Integraci\u00f3n Form.io",

  // Sidebar
  "sidebar.brandColor": "Color de marca",
  "sidebar.mode": "Modo",
  "sidebar.fontFamily": "Familia tipogr\u00e1fica",
  "sidebar.language": "Idioma",

  // Hero
  "hero.badge": "React Aria + Tailwind — 2026",
  "hero.title": "Sistema de dise\u00f1o\nVSee Clinic",
  "hero.desc":
    "La fuente \u00fanica de verdad para dise\u00f1o e ingenier\u00eda. Moderno, accesible y construido para telesalud a escala.",
  "hero.tokens": "Tokens de dise\u00f1o",
  "hero.components": "Componentes",
  "hero.wcag": "Cumple WCAG",
  "hero.grid": "Cuadr\u00edcula base",

  // Colors
  "colors.label": "Fundamento",
  "colors.title": "Colores",
  "colors.desc":
    "Una paleta refinada y accesible basada en el verde de marca de VSee. Cada color ha sido probado para cumplir con el contraste WCAG AA.",
  "colors.brand": "Marca",
  "colors.brandDesc":
    "La escala de marca principal \u2014 desde tonos claros hasta estados activos profundos.",
  "colors.semantic": "Sem\u00e1ntico",
  "colors.semanticDesc":
    "Comunicando significado \u2014 estados de \u00e9xito, informaci\u00f3n, advertencia y peligro.",
  "colors.neutrals": "Neutros",
  "colors.surfaces": "Superficies y Texto",
  "colors.surfacesCard": "Superficies",
  "colors.textColors": "Colores de texto",

  // Typography
  "typography.label": "Fundamento",
  "typography.title": "Tipograf\u00eda",
  "typography.desc":
    "Plus Jakarta Sans es nuestra fuente del sistema \u2014 limpia, legible y optimizada para UI. La escala tipogr\u00e1fica usa una progresi\u00f3n armoniosa de 12px a 60px.",
  "typography.display": "Dise\u00f1o para la salud",
  "typography.h1": "T\u00edtulo de p\u00e1gina",
  "typography.h2": "Encabezado de secci\u00f3n",
  "typography.h3": "Subsecci\u00f3n",
  "typography.h4": "T\u00edtulo de tarjeta",
  "typography.h5": "Encabezado de etiqueta",
  "typography.bodyLg":
    "Texto de cuerpo para contenido extenso y p\u00e1rrafos introductorios.",
  "typography.body":
    "Texto de cuerpo est\u00e1ndar utilizado en toda la aplicaci\u00f3n.",
  "typography.caption":
    "Texto auxiliar, marcas de tiempo y metadatos",
  "typography.overline": "Etiqueta de secci\u00f3n",
  "typography.fontWeights": "Pesos tipogr\u00e1ficos",
  "typography.w400":
    "Regular 400 \u2014 Para texto de cuerpo y descripciones",
  "typography.w500":
    "Medium 500 \u2014 Para leyendas y \u00e9nfasis secundario",
  "typography.w600":
    "Semi Bold 600 \u2014 Para etiquetas y encabezados peque\u00f1os",
  "typography.w700":
    "Bold 700 \u2014 Para encabezados y \u00e9nfasis fuerte",
  "typography.w800":
    "Extra Bold 800 \u2014 Para display y t\u00edtulos de p\u00e1gina",
  "typography.dateFormat": "Formato de fecha",
  "typography.usFormat": "Formato EE. UU.",

  // Spacing
  "spacing.label": "Fundamento",
  "spacing.title": "Espaciado y Dise\u00f1o",
  "spacing.desc":
    "Una escala de espaciado basada en 4px asegura un ritmo consistente en cada componente y dise\u00f1o.",
  "spacing.scale": "Escala de espaciado",
  "spacing.shadows": "Sombras",
  "spacing.radius": "Radio de borde",

  // Buttons
  "buttons.label": "Componentes",
  "buttons.title": "Botones",
  "buttons.desc":
    "Los botones comunican acciones. Primario para acciones clave, secundario para soporte, fantasma para terciario.",
  "buttons.variants": "Variantes",
  "buttons.primary": "Primario",
  "buttons.secondary": "Secundario",
  "buttons.ghost": "Fantasma",
  "buttons.danger": "Peligro",
  "buttons.dangerOutline": "Peligro contorno",
  "buttons.info": "Info",
  "buttons.warning": "Advertencia",
  "buttons.link": "Enlace",
  "buttons.sizes": "Tama\u00f1os",
  "buttons.xl": "Extra grande",
  "buttons.lg": "Grande",
  "buttons.default": "Predeterminado",
  "buttons.sm": "Peque\u00f1o",
  "buttons.pill": "Forma p\u00edldora",
  "buttons.primaryPill": "Primario p\u00edldora",
  "buttons.secondaryPill": "Secundario p\u00edldora",
  "buttons.ghostPill": "Fantasma p\u00edldora",
  "buttons.states": "Estados",
  "buttons.hover": "Pasar el cursor",
  "buttons.pressed": "Presionado",
  "buttons.focus": "Enfoque",
  "buttons.disabled": "Deshabilitado",
  "buttons.group": "Grupo de botones",
  "buttons.today": "Hoy",
  "buttons.week": "Semana",
  "buttons.month": "Mes",
  "buttons.loading": "Cargando",
  "buttons.saving": "Guardando...",
  "buttons.loadingText": "Cargando...",
  "buttons.pleaseWait": "Por favor espere",
  "buttons.deleting": "Eliminando...",
  "buttons.toggles": "Interruptores",
  "buttons.notifications": "Notificaciones",
  "buttons.autoSave": "Autoguardado",
  "buttons.alwaysOn": "Siempre activo",
  "buttons.unavailable": "No disponible",
  "buttons.on": "Activado",
  "buttons.off": "Desactivado",
  "buttons.withIcons": "Con iconos",
  "buttons.withIconsDesc":
    "Los botones de React Aria admiten cualquier contenido hijo \u2014 coloque iconos antes o despu\u00e9s del texto, o use botones solo con icono.",
  "buttons.newPatient": "Nuevo paciente",
  "buttons.export": "Exportar",
  "buttons.share": "Compartir",
  "buttons.delete": "Eliminar",
  "buttons.iconRight": "Icono a la derecha",
  "buttons.send": "Enviar",
  "buttons.upload": "Subir",
  "buttons.schedule": "Programar",
  "buttons.iconOnly": "Solo icono",
  "buttons.sizesWithIcons": "Tama\u00f1os con iconos",

  // Forms
  "forms.label": "Componentes",
  "forms.title": "Elementos de formulario",
  "forms.desc":
    "Controles de formulario limpios y accesibles con estados de enfoque claros y manejo de errores.",
  "forms.textInputs": "Campos de texto",
  "forms.emailAddress": "Correo electr\u00f3nico",
  "forms.emailPlaceholder": "tu@ejemplo.com",
  "forms.fullName": "Nombre completo",
  "forms.fullNamePlaceholder": "Mar\u00eda Garc\u00eda",
  "forms.medicalLicenseHint":
    "Tal como aparece en su licencia m\u00e9dica",
  "forms.fullNameRequired": "El nombre completo es obligatorio",
  "forms.search": "Buscar",
  "forms.searchPatients": "Buscar pacientes...",
  "forms.selectTextarea": "Selector y \u00c1rea de texto",
  "forms.specialty": "Especialidad",
  "forms.selectSpecialty": "Seleccione una especialidad...",
  "forms.internalMedicine": "Medicina interna",
  "forms.familyMedicine": "Medicina familiar",
  "forms.pediatrics": "Pediatr\u00eda",
  "forms.notes": "Notas",
  "forms.clinicalNotes": "Agregar notas cl\u00ednicas...",
  "forms.multiSelect": "Selecci\u00f3n m\u00faltiple",
  "forms.filterSpecialty": "Filtrar por especialidad",
  "forms.addMore": "Agregar m\u00e1s...",
  "forms.searchSpecialties": "Buscar especialidades...",
  "forms.noMatches": "No se encontraron coincidencias",
  "forms.checkboxes": "Casillas de verificaci\u00f3n",
  "forms.showConsultations": "Mostrar consultas",
  "forms.onlyMyPatients": "Solo mis pacientes",
  "forms.archivedDisabled": "Archivado (deshabilitado)",
  "forms.radios": "Botones de radio",
  "forms.phoneCall": "Llamada telef\u00f3nica",
  "forms.videoCall": "Videollamada",
  "forms.inPerson": "Presencial",
  "forms.largeInput": "Campo grande",
  "forms.patientSearch": "B\u00fasqueda de pacientes",
  "forms.searchByName":
    "Buscar por nombre, ID o tel\u00e9fono...",
  "forms.disabledState": "Estado deshabilitado",
  "forms.disabledField": "Campo deshabilitado",
  "forms.readOnlyValue": "Valor de solo lectura",
  "forms.advancedInputs": "Campos avanzados",
  "forms.advancedDesc":
    "Controles de formulario especializados para n\u00fameros de tel\u00e9fono, fechas y campos con iconos de acci\u00f3n.",
  "forms.phoneNumber": "N\u00famero de tel\u00e9fono",
  "forms.withCountryCode": "Con c\u00f3digo de pa\u00eds",
  "forms.withCountryCodeExt": "Con c\u00f3digo de pa\u00eds y ext.",
  "forms.simple": "Simple",
  "forms.datePicker": "Selector de fecha",
  "forms.appointmentDate": "Fecha de la cita",
  "forms.appointmentTime": "Hora de la cita",
  "forms.appointmentDateTime": "Fecha y hora de la cita",
  "forms.inputWithIcon": "Campo con icono de acci\u00f3n",
  "forms.referenceCode": "C\u00f3digo de referencia",
  "forms.websiteUrl": "URL del sitio web",
  "forms.inputWithUnit": "Campo con unidad",
  "forms.dosage": "Dosis",
  "forms.weight": "Peso",
  "forms.quantity": "Cantidad",
  "forms.paymentInput": "Campo de pago",
  "forms.payment": "Pago",
  "forms.cardNumber": "N.\u00ba de tarjeta",
  "forms.expiry": "Vencimiento",
  "forms.loginForm": "Formulario de inicio de sesi\u00f3n",
  "forms.email": "Correo electr\u00f3nico",
  "forms.password": "Contrase\u00f1a",
  "forms.enterPassword": "Ingrese la contrase\u00f1a",
  "forms.rememberMe": "Recordarme",
  "forms.forgotPassword": "\u00bfOlvid\u00f3 su contrase\u00f1a?",
  "forms.signIn": "Iniciar sesi\u00f3n",
  "forms.inlineInputs": "Campos en l\u00ednea",
  "forms.dispense": "Dispensar",
  "forms.tabletsTake": "comprimidos, tomar",
  "forms.timesPerDayFor": "veces al d\u00eda durante",
  "forms.days": "d\u00edas.",
  "forms.fluidsGiven": "L\u00edquidos administrados",
  "forms.dosageInline": "Dosis",
  "forms.quantityInline": "Cantidad",
  "forms.dateOfService": "Fecha de servicio",
  "forms.facility": "Centro m\u00e9dico",
  "forms.signature": "Firma",
  "forms.signatureDesc":
    "\u00c1rea de captura de firma manual para formularios de consentimiento, acuerdos y flujos de admisi\u00f3n de pacientes.",
  "forms.active": "Activo",
  "forms.signed": "Firmado",
  "forms.signHere": "Firme aqu\u00ed",
  "forms.clear": "Borrar",
  "forms.confirm": "Confirmar",

  // Badges
  "badges.label": "Componentes",
  "badges.title": "Insignias, Etiquetas y Estado",
  "badges.desc":
    "Comunique estados, categor\u00edas y conteos con indicadores visuales sutiles. Las etiquetas admiten navegaci\u00f3n por teclado y eliminaci\u00f3n.",
  "badges.soft": "Insignias suaves",
  "badges.active": "Activo",
  "badges.scheduled": "Programado",
  "badges.pending": "Pendiente",
  "badges.overdue": "Vencido",
  "badges.draft": "Borrador",
  "badges.solid": "Insignias s\u00f3lidas",
  "badges.approved": "Aprobado",
  "badges.processing": "Procesando",
  "badges.review": "Revisi\u00f3n",
  "badges.urgent": "Urgente",
  "badges.default": "Predeterminado",
  "badges.removableTags": "Etiquetas removibles",
  "badges.activeDiagnoses": "Diagn\u00f3sticos activos",

  // Feedback
  "feedback.label": "Componentes",
  "feedback.title": "Retroalimentaci\u00f3n y Notificaciones",
  "feedback.desc":
    "Alertas, toasts, indicadores de progreso, estados vac\u00edos y notificaciones para comunicar el estado del sistema.",
  "feedback.alerts": "Alertas",
  "feedback.changesSaved": "Cambios guardados",
  "feedback.changesSavedDesc":
    "El expediente del paciente se ha actualizado correctamente.",
  "feedback.appointmentReminder": "Recordatorio de cita",
  "feedback.appointmentReminderDesc":
    "Su pr\u00f3xima cita est\u00e1 programada para ma\u00f1ana a las 2:00 PM.",
  "feedback.outstandingBalance": "Saldo pendiente",
  "feedback.outstandingBalanceDesc":
    "Este paciente tiene un saldo impago de $45.00.",
  "feedback.formFailed":
    "Error al enviar el formulario",
  "feedback.formFailedDesc":
    "Por favor verifique los campos obligatorios e int\u00e9ntelo de nuevo.",
  "feedback.toasts": "Notificaciones toast",
  "feedback.apptConfirmed": "Cita confirmada",
  "feedback.apptConfirmedDesc":
    "26 de feb. de 2026 a las 10:00 AM con Dr. Chen",
  "feedback.connectionLost": "Conexi\u00f3n perdida",
  "feedback.connectionLostDesc":
    "Por favor verifique su conexi\u00f3n a internet.",
  "feedback.newMessage": "Nuevo mensaje",
  "feedback.newMessageDesc":
    "Tiene 3 mensajes sin leer de pacientes.",
  "feedback.emptyState": "Estado vac\u00edo",
  "feedback.emptyStateDesc":
    "Contenido de marcador de posici\u00f3n que se muestra cuando una secci\u00f3n no tiene datos. Proporciona contexto y un llamado a la acci\u00f3n.",
  "feedback.noResults": "Sin resultados",
  "feedback.noResultsDesc":
    "A\u00fan no hay resultados de laboratorio para este paciente. Los resultados aparecer\u00e1n aqu\u00ed cuando los an\u00e1lisis ordenados hayan sido procesados.",
  "feedback.orderLabTest": "Ordenar an\u00e1lisis",
  "feedback.noDocuments": "Sin documentos",
  "feedback.noDocumentsDesc":
    "Este paciente no tiene documentos cargados. Cargue documentos cl\u00ednicos, formularios de consentimiento o informes de im\u00e1genes.",
  "feedback.uploadDocument": "Subir documento",
  "feedback.notifications": "Notificaciones",
  "feedback.notificationsDesc":
    "Notificaciones tipo toast que aparecen en la esquina. Se usan para retroalimentaci\u00f3n del sistema \u2014 confirmaciones de pedidos, errores, advertencias y mensajes informativos.",
  "feedback.orderSubmitted": "Pedido enviado",
  "feedback.orderSubmittedDesc":
    "La orden de laboratorio CBC ha sido enviada al laboratorio exitosamente.",
  "feedback.submissionFailed": "Error de env\u00edo",
  "feedback.submissionFailedDesc":
    "No se pudo enviar la orden. Verifique la conexi\u00f3n e int\u00e9ntelo de nuevo.",
  "feedback.sessionExpiring": "Sesi\u00f3n por expirar",
  "feedback.sessionExpiringDesc":
    "Su sesi\u00f3n expirar\u00e1 en 5 minutos. Guarde su trabajo.",
  "feedback.newMessageNotif": "Nuevo mensaje",
  "feedback.newMessageNotifDesc":
    "El Dr. Chen ha enviado un mensaje sobre la paciente Jane Doe.",
  "feedback.success": "\u00c9xito",
  "feedback.error": "Error",

  // Navigation section
  "navigation.label": "Componentes",
  "navigation.title": "Navegaci\u00f3n",
  "navigation.desc":
    "Patrones de navegaci\u00f3n para una orientaci\u00f3n consistente en la aplicaci\u00f3n.",
  "navigation.topNav": "Barra de navegaci\u00f3n superior",
  "navigation.dashboard": "Panel",
  "navigation.patients": "Pacientes",
  "navigation.scheduleNav": "Agenda",
  "navigation.messages": "Mensajes",
  "navigation.help": "Ayuda",
  "navigation.tabs": "Pesta\u00f1as",
  "navigation.allVisits": "Todas las visitas",
  "navigation.documents": "Documentos",
  "navigation.labResults": "Resultados de laboratorio",
  "navigation.tabContent": "\u00c1rea de contenido de pesta\u00f1a",
  "navigation.allVisitsContent": "Contenido de todas las visitas",
  "navigation.documentsContent": "Contenido de documentos",
  "navigation.labResultsContent":
    "Contenido de resultados de laboratorio",
  "navigation.breadcrumb": "Ruta de navegaci\u00f3n",
  "navigation.pagination": "Paginaci\u00f3n",
  "navigation.anchorNav": "Navegaci\u00f3n por anclas",
  "navigation.anchorNavDesc":
    "Navegaci\u00f3n dentro de la p\u00e1gina para contenido largo con desplazamiento. Se usa en notas de encuentro y formularios de m\u00faltiples secciones. La barra fija en la parte superior de esta p\u00e1gina es un ejemplo en vivo.",
  "navigation.anchorNavText":
    "La barra de navegaci\u00f3n por anclas fija en la parte superior de esta p\u00e1gina es una demostraci\u00f3n en vivo de este componente. Resalta la secci\u00f3n actual al desplazarse y permite hacer clic para saltar.",

  // Dropdowns
  "dropdowns.label": "Componentes",
  "dropdowns.title": "Men\u00fas desplegables",
  "dropdowns.desc":
    "Men\u00fas desplegables, listas de selecci\u00f3n y men\u00fas de acci\u00f3n. Todos los desplegables est\u00e1n limitados a 1/3 de la altura de pantalla y se desplazan cuando el contenido desborda.",
  "dropdowns.selectDropdown": "Desplegable de selecci\u00f3n",
  "dropdowns.selectDropdownDesc":
    "Campo de selecci\u00f3n est\u00e1ndar con una lista de opciones desplazable.",
  "dropdowns.country": "Pa\u00eds",
  "dropdowns.selectCountry": "Seleccione un pa\u00eds...",
  "dropdowns.dropdownButton": "Bot\u00f3n desplegable",
  "dropdowns.dropdownButtonDesc":
    "Men\u00fas de acci\u00f3n activados por un bot\u00f3n. Se usan para acciones contextuales en filas, tarjetas y barras de herramientas.",
  "dropdowns.actions": "Acciones",
  "dropdowns.editRecord": "Editar registro",
  "dropdowns.duplicate": "Duplicar",
  "dropdowns.exportPdf": "Exportar PDF",
  "dropdowns.archive": "Archivar",
  "dropdowns.viewDetails": "Ver detalles",
  "dropdowns.assignProvider": "Asignar proveedor",
  "dropdowns.flagReview": "Marcar para revisi\u00f3n",
  "dropdowns.newOrder": "Nueva orden",
  "dropdowns.labOrders": "\u00d3rdenes de laboratorio",
  "dropdowns.cbc": "Hemograma completo",
  "dropdowns.bmp": "Panel metab\u00f3lico b\u00e1sico",
  "dropdowns.lipid": "Panel de l\u00edpidos",
  "dropdowns.imaging": "Im\u00e1genes",
  "dropdowns.xray": "Radiograf\u00eda",
  "dropdowns.mri": "Resonancia magn\u00e9tica",

  // Others
  "others.label": "Componentes",
  "others.title": "Otros",
  "others.desc":
    "Tarjetas, tablas, avatares, tooltips y secciones colapsables para mostrar contenido estructurado.",
  "others.progressBars": "Barras de progreso",
  "others.profileComplete": "Perfil completo",
  "others.uploadProgress": "Progreso de subida",
  "others.storageUsed": "Almacenamiento usado",
  "others.avatars": "Avatares",

  // Overlays
  "overlays.label": "Componentes",
  "overlays.title": "Superposiciones",
  "overlays.desc":
    "Modales, tooltips y patrones de panel lateral para interacciones enfocadas.",
  "overlays.modal": "Modal / Di\u00e1logo",
  "overlays.cancelAppointment": "Cancelar cita",
  "overlays.cancelConfirm":
    "\u00bfEst\u00e1 seguro de que desea cancelar esta cita con",
  "overlays.onDate": "el 26 de feb. de 2026?",
  "overlays.reasonForCancellation": "Motivo de cancelaci\u00f3n",
  "overlays.selectReason": "Seleccione un motivo...",
  "overlays.scheduleConflict": "Conflicto de horario",
  "overlays.feelingBetter": "Se siente mejor",
  "overlays.other": "Otro",
  "overlays.keepAppointment": "Mantener cita",
  "overlays.tooltips": "Tooltips",
  "overlays.hoverTarget": "Objetivo de cursor",
  "overlays.thisIsTooltip": "Esto es un tooltip",
  "overlays.save": "Guardar",
  "overlays.saveRecord": "Guardar expediente del paciente",
  "overlays.drawer": "Panel lateral",
  "overlays.drawerDesc":
    "Un panel deslizante desde el costado de la pantalla. Se usa para vistas de detalle, edici\u00f3n de registros y entrada de \u00f3rdenes sin salir del contexto actual.",
  "overlays.openPatientDetails": "Abrir detalles del paciente",
  "overlays.patientDetails": "Detalles del paciente",
  "overlays.demographics": "Datos demogr\u00e1ficos",
  "overlays.dateOfBirth": "Fecha de nacimiento",
  "overlays.gender": "G\u00e9nero",
  "overlays.female": "Femenino",
  "overlays.phone": "Tel\u00e9fono",
  "overlays.emailLabel": "Correo electr\u00f3nico",
  "overlays.insurance": "Seguro",
  "overlays.provider": "Proveedor",
  "overlays.planId": "ID del plan",
  "overlays.group": "Grupo",
  "overlays.recentEncounters": "Encuentros recientes",
  "overlays.telemedicineFollowup":
    "Telemedicina \u2014 Seguimiento",
  "overlays.inPersonAnnual":
    "Presencial \u2014 Examen f\u00edsico anual",
  "overlays.close": "Cerrar",
  "overlays.editPatient": "Editar paciente",

  // Layouts
  "layouts.label": "Patrones",
  "layouts.title": "Dise\u00f1os",
  "layouts.desc":
    "Patrones de dise\u00f1o comunes usados en la aplicaci\u00f3n VSee Clinic.",
  "layouts.sidebarContent": "Barra lateral + Contenido",
  "layouts.menu": "Men\u00fa",
  "layouts.dashboard": "Panel",
  "layouts.patients": "Pacientes",
  "layouts.appointments": "Citas",
  "layouts.messages": "Mensajes",
  "layouts.labResults": "Resultados de laboratorio",
  "layouts.settings": "Configuraci\u00f3n",
  "layouts.welcomeBack":
    "Bienvenido de nuevo, Dr. Chen. Aqu\u00ed tiene su resumen del d\u00eda.",
  "layouts.patientsToday": "Pacientes hoy",
  "layouts.pendingOrders": "\u00d3rdenes pendientes",
  "layouts.followUp": "Seguimiento",
  "layouts.newPatient": "Nuevo paciente",
  "layouts.telemedicine": "Telemedicina",
  "layouts.unreadMessages":
    "Tiene 3 mensajes sin leer de pacientes. Revise su bandeja de entrada para las \u00faltimas novedades.",
  "layouts.labResultsReady":
    "2 nuevos resultados de laboratorio est\u00e1n listos para revisi\u00f3n. Haga clic en un resultado para ver el informe completo.",
  "layouts.settingsDesc":
    "Administre su perfil, preferencias de notificaci\u00f3n y configuraci\u00f3n de la cl\u00ednica.",

  // Theming
  "theming.label": "Ingenier\u00eda",
  "theming.title": "Personalizaci\u00f3n de marca blanca",
  "theming.desc":
    'VSee admite personalizaci\u00f3n de marca blanca por inquilino. Sobrescriba las variables CSS mediante [data-theme] para colores de marca y [data-mode="dark"] para modo oscuro. Haga clic en una tarjeta a continuaci\u00f3n para cambiar el tema en vivo, o active el modo oscuro en la barra lateral.',
  "theming.vseeDefault": "VSee predeterminado",
  "theming.oceanBlue": "Azul oc\u00e9ano",
  "theming.royalPurple": "P\u00farpura real",
  "theming.howToSwitch": "C\u00f3mo cambiar temas",
  "theming.darkMode": "Modo oscuro",
  "theming.customTheme": "Crear un tema personalizado",

  // Form.io
  "formio.label": "Ingenier\u00eda",
  "formio.title": "Form.io + React Aria",
  "formio.howItWorks": "C\u00f3mo funciona",
  "formio.formBuilder": "Constructor Form.io",
  "formio.formBuilderDesc":
    "Constructor de formularios arrastrar y soltar o editor JSON alojado en form.io o autoalojado",
  "formio.formSchema": "Esquema de formulario",
  "formio.formSchemaDesc":
    "Definici\u00f3n de formulario obtenida en tiempo de ejecuci\u00f3n \u2014 no se necesita redespliegue para cambiar un formulario",
  "formio.formComponent": "<Form>",
  "formio.formComponentDesc":
    "Renderiza el esquema, maneja validaci\u00f3n, env\u00edos y l\u00f3gica de m\u00faltiples pasos",
  "formio.customComponents": "Componentes personalizados",
  "formio.customComponentsDesc":
    "TextField, Checkbox, Select etc. registrados como sobrescrituras de componentes personalizados de Form.io",
  "formio.jsonSchema": "Esquema JSON de Form.io",
  "formio.jsonSchemaDesc":
    "El servidor devuelve un esquema JSON como este. El campo type se mapea al componente personalizado registrado.",
  "formio.registration":
    "Registro de componentes personalizados",
  "formio.registrationDesc":
    "Cada tipo de componente Form.io se mapea a un componente React. El objeto component lleva las propiedades del esquema; onChange actualiza los datos de env\u00edo.",
  "formio.wiring": "Conect\u00e1ndolo todo",
  "formio.livePreview":
    "Vista previa en vivo \u2014 Formulario de admisi\u00f3n",
  "formio.livePreviewDesc":
    "Esto es lo que renderiza el formulario anterior usando los componentes personalizados de React Aria. Toda la validaci\u00f3n, dise\u00f1o y l\u00f3gica de campos provienen del esquema JSON; los componentes React Aria solo aportan estilo y accesibilidad.",
  "formio.patientIntake":
    "Formulario de admisi\u00f3n del paciente",
  "formio.renderedBy":
    "Renderizado por @formio/react \u00b7 Componentes personalizados React Aria",
  "formio.submitted":
    "\u00a1Formulario de admisi\u00f3n enviado!",
  "formio.resetForm": "Restablecer formulario",
  "formio.firstName": "Nombre",
  "formio.lastName": "Apellido",
  "formio.dateOfBirth": "Fecha de nacimiento",
  "formio.insuranceProvider": "Proveedor de seguro",
  "formio.selectProvider": "Seleccione proveedor\u2026",
  "formio.reasonForVisit": "Motivo de la visita",
  "formio.reasonPlaceholder":
    "Describa sus s\u00edntomas o motivo de la visita\u2026",
  "formio.hipaaConsent":
    "He le\u00eddo y acepto el Aviso de Privacidad HIPAA",
  "formio.submitIntake":
    "Enviar formulario de admisi\u00f3n",
  "formio.whatFormio": "Qu\u00e9 maneja Form.io",
  "formio.whatAria": "Qu\u00e9 maneja React Aria",
  "formio.formioList1":
    "Obtenci\u00f3n y cach\u00e9 de esquemas",
  "formio.formioList2":
    "Reglas de validaci\u00f3n a nivel de campo (requerido, min/max, regex)",
  "formio.formioList3":
    "L\u00f3gica de visibilidad condicional",
  "formio.formioList4":
    "Asistente de m\u00faltiples pasos / navegaci\u00f3n de p\u00e1ginas",
  "formio.formioList5":
    "Env\u00edo a Form.io o endpoint personalizado",
  "formio.formioList6":
    "Borradores sin conexi\u00f3n y reanudaci\u00f3n",
  "formio.ariaList1":
    "Estilos visuales y tokens de marca",
  "formio.ariaList2":
    "Navegaci\u00f3n por teclado y anillos de enfoque",
  "formio.ariaList3":
    "Etiquetas ARIA, roles y asociaciones de errores",
  "formio.ariaList4":
    "Primitivas de accesibilidad React Aria",
  "formio.ariaList5":
    "Estados consistentes de hover / focus / disabled",
  "formio.ariaList6":
    "Herencia de tokens del sistema de dise\u00f1o",
  "formio.install": "Instalar",

  // Tokens
  "tokens.label": "Ingenier\u00eda",
  "tokens.title": "Tokens de dise\u00f1o",
  "tokens.desc":
    "Copie el bloque :root en su CSS global. Los tokens admiten modo claro y oscuro mediante atributos [data-mode]. Disponibles como propiedades CSS personalizadas, JSON de Tokens Studio y Variables de Figma.",

  // Footer
  "footer.sub": "Sistema de dise\u00f1o \u00b7 2026",
  "footer.meta":
    "Plus Jakarta Sans \u00b7 Cuadr\u00edcula 4px \u00b7 WCAG AA \u00b7 Listo para marca blanca",

  // Misc
  "misc.copied": "Copiado",
  "misc.showCode": "Mostrar c\u00f3digo",
  "misc.hideCode": "Ocultar c\u00f3digo",
};

/* ─────────────────────── Traditional Chinese ─────────────────────── */
const zhTW: Translations = {
  // Navigation
  "nav.foundations": "\u57fa\u790e",
  "nav.components": "\u5143\u4ef6",
  "nav.patterns": "\u6a21\u5f0f",
  "nav.engineering": "\u5de5\u7a0b",
  "nav.colors": "\u8272\u5f69",
  "nav.typography": "\u5b57\u578b",
  "nav.spacing": "\u9593\u8ddd\u8207\u4f48\u5c40",
  "nav.buttons": "\u6309\u9215",
  "nav.forms": "\u8868\u55ae\u5143\u4ef6",
  "nav.badges": "\u5fbd\u7ae0\u3001\u6a19\u7c64\u8207\u72c0\u614b",
  "nav.feedback": "\u56de\u994b\u8207\u901a\u77e5",
  "nav.navigation": "\u5c0e\u89bd",
  "nav.dropdowns": "\u4e0b\u62c9\u9078\u55ae",
  "nav.overlays": "\u8986\u758a\u5c64",
  "nav.others": "\u5176\u4ed6",
  "nav.layouts": "\u4f48\u5c40",
  "nav.tokens": "\u8a2d\u8a08\u4ee3\u5e63",
  "nav.theming": "\u767d\u724c",
  "nav.formio": "Form.io \u6574\u5408",

  // Sidebar
  "sidebar.brandColor": "\u54c1\u724c\u8272\u5f69",
  "sidebar.mode": "\u6a21\u5f0f",
  "sidebar.fontFamily": "\u5b57\u578b",
  "sidebar.language": "\u8a9e\u8a00",

  // Hero
  "hero.badge": "React Aria + Tailwind — 2026",
  "hero.title": "VSee Clinic\n\u8a2d\u8a08\u7cfb\u7d71",
  "hero.desc":
    "\u8a2d\u8a08\u8207\u5de5\u7a0b\u7684\u55ae\u4e00\u4e8b\u5be6\u4f86\u6e90\u3002\u73fe\u4ee3\u3001\u7121\u969c\u7919\u4e14\u5c08\u70ba\u5927\u898f\u6a21\u9060\u8ddd\u91ab\u7642\u800c\u5efa\u3002",
  "hero.tokens": "\u8a2d\u8a08\u4ee3\u5e63",
  "hero.components": "\u5143\u4ef6",
  "hero.wcag": "\u7b26\u5408 WCAG",
  "hero.grid": "\u57fa\u790e\u7db2\u683c",

  // Colors
  "colors.label": "\u57fa\u790e",
  "colors.title": "\u8272\u5f69",
  "colors.desc":
    "\u57fa\u65bc VSee \u54c1\u724c\u7da0\u5efa\u69cb\u7684\u7cbe\u7dfb\u3001\u7121\u969c\u7919\u8abf\u8272\u76e4\u3002\u6bcf\u500b\u984f\u8272\u5747\u901a\u904e WCAG AA \u5c0d\u6bd4\u5ea6\u6e2c\u8a66\u3002",
  "colors.brand": "\u54c1\u724c",
  "colors.brandDesc":
    "\u4e3b\u8981\u54c1\u724c\u8272\u968e \u2014 \u5f9e\u6dfa\u8272\u8272\u8abf\u5230\u6df1\u8272\u6d3b\u52d5\u72c0\u614b\u3002",
  "colors.semantic": "\u8a9e\u7fa9",
  "colors.semanticDesc":
    "\u50b3\u9054\u610f\u7fa9 \u2014 \u6210\u529f\u3001\u8cc7\u8a0a\u3001\u8b66\u544a\u548c\u5371\u96aa\u72c0\u614b\u3002",
  "colors.neutrals": "\u4e2d\u6027\u8272",
  "colors.surfaces": "\u8868\u9762\u8207\u6587\u5b57",
  "colors.surfacesCard": "\u8868\u9762",
  "colors.textColors": "\u6587\u5b57\u984f\u8272",

  // Typography
  "typography.label": "\u57fa\u790e",
  "typography.title": "\u5b57\u578b",
  "typography.desc":
    "Plus Jakarta Sans \u662f\u6211\u5011\u7684\u7cfb\u7d71\u5b57\u578b \u2014 \u7c21\u6f54\u3001\u6613\u8b80\u4e14\u91dd\u5c0d UI \u6700\u4f73\u5316\u3002\u5b57\u578b\u7e2e\u653e\u63a1\u7528\u5f9e 12px \u5230 60px \u7684\u548c\u8ae7\u905e\u9032\u3002",
  "typography.display": "\u70ba\u5065\u5eb7\u800c\u8a2d\u8a08",
  "typography.h1": "\u9801\u9762\u6a19\u984c",
  "typography.h2": "\u7bc0\u6a19\u984c",
  "typography.h3": "\u5b50\u7bc0",
  "typography.h4": "\u5361\u7247\u6a19\u984c",
  "typography.h5": "\u6a19\u7c64\u6a19\u984c",
  "typography.bodyLg":
    "\u7528\u65bc\u9577\u7bc7\u5167\u5bb9\u548c\u5c0e\u8a00\u6bb5\u843d\u7684\u6b63\u6587\u3002",
  "typography.body":
    "\u61c9\u7528\u7a0b\u5f0f\u4e2d\u4f7f\u7528\u7684\u6a19\u6e96\u6b63\u6587\u3002",
  "typography.caption":
    "\u8f14\u52a9\u6587\u5b57\u3001\u6642\u9593\u6233\u8a18\u548c\u5143\u8cc7\u6599",
  "typography.overline": "\u7bc0\u6a19\u7c64",
  "typography.fontWeights": "\u5b57\u91cd",
  "typography.w400":
    "Regular 400 \u2014 \u7528\u65bc\u6b63\u6587\u548c\u63cf\u8ff0",
  "typography.w500":
    "Medium 500 \u2014 \u7528\u65bc\u8aee\u89e3\u548c\u6b21\u8981\u5f37\u8abf",
  "typography.w600":
    "Semi Bold 600 \u2014 \u7528\u65bc\u6a19\u7c64\u548c\u5c0f\u6a19\u984c",
  "typography.w700":
    "Bold 700 \u2014 \u7528\u65bc\u6a19\u984c\u548c\u5f37\u8abf",
  "typography.w800":
    "Extra Bold 800 \u2014 \u7528\u65bc\u5c55\u793a\u548c\u9801\u9762\u6a19\u984c",
  "typography.dateFormat": "\u65e5\u671f\u683c\u5f0f",
  "typography.usFormat": "\u7f8e\u570b\u683c\u5f0f",

  // Spacing
  "spacing.label": "\u57fa\u790e",
  "spacing.title": "\u9593\u8ddd\u8207\u4f48\u5c40",
  "spacing.desc":
    "\u57fa\u65bc 4px \u7684\u9593\u8ddd\u7e2e\u653e\u78ba\u4fdd\u6bcf\u500b\u5143\u4ef6\u548c\u4f48\u5c40\u7684\u4e00\u81f4\u7bc0\u594f\u3002",
  "spacing.scale": "\u9593\u8ddd\u7e2e\u653e",
  "spacing.shadows": "\u9670\u5f71",
  "spacing.radius": "\u5713\u89d2",

  // Buttons
  "buttons.label": "\u5143\u4ef6",
  "buttons.title": "\u6309\u9215",
  "buttons.desc":
    "\u6309\u9215\u50b3\u9054\u52d5\u4f5c\u3002\u4e3b\u8981\u7528\u65bc\u95dc\u9375\u64cd\u4f5c\uff0c\u6b21\u8981\u7528\u65bc\u8f14\u52a9\uff0c\u5e7d\u9748\u7528\u65bc\u7b2c\u4e09\u5c64\u3002",
  "buttons.variants": "\u8b8a\u9ad4",
  "buttons.primary": "\u4e3b\u8981",
  "buttons.secondary": "\u6b21\u8981",
  "buttons.ghost": "\u5e7d\u9748",
  "buttons.danger": "\u5371\u96aa",
  "buttons.dangerOutline": "\u5371\u96aa\u5916\u6846",
  "buttons.info": "\u8cc7\u8a0a",
  "buttons.warning": "\u8b66\u544a",
  "buttons.link": "\u9023\u7d50",
  "buttons.sizes": "\u5c3a\u5bf8",
  "buttons.xl": "\u7279\u5927",
  "buttons.lg": "\u5927",
  "buttons.default": "\u9810\u8a2d",
  "buttons.sm": "\u5c0f",
  "buttons.pill": "\u85e5\u4e38\u5f62",
  "buttons.primaryPill": "\u4e3b\u8981\u85e5\u4e38",
  "buttons.secondaryPill": "\u6b21\u8981\u85e5\u4e38",
  "buttons.ghostPill": "\u5e7d\u9748\u85e5\u4e38",
  "buttons.states": "\u72c0\u614b",
  "buttons.hover": "\u61f8\u505c",
  "buttons.pressed": "\u6309\u4e0b",
  "buttons.focus": "\u805a\u7126",
  "buttons.disabled": "\u505c\u7528",
  "buttons.group": "\u6309\u9215\u7d44",
  "buttons.today": "\u4eca\u5929",
  "buttons.week": "\u9031",
  "buttons.month": "\u6708",
  "buttons.loading": "\u8f09\u5165\u4e2d",
  "buttons.saving": "\u5132\u5b58\u4e2d...",
  "buttons.loadingText": "\u8f09\u5165\u4e2d...",
  "buttons.pleaseWait": "\u8acb\u7a0d\u5019",
  "buttons.deleting": "\u522a\u9664\u4e2d...",
  "buttons.toggles": "\u958b\u95dc",
  "buttons.notifications": "\u901a\u77e5",
  "buttons.autoSave": "\u81ea\u52d5\u5132\u5b58",
  "buttons.alwaysOn": "\u59cb\u7d42\u958b\u555f",
  "buttons.unavailable": "\u4e0d\u53ef\u7528",
  "buttons.on": "\u958b",
  "buttons.off": "\u95dc",
  "buttons.withIcons": "\u5e36\u5716\u793a",
  "buttons.withIconsDesc":
    "React Aria \u6309\u9215\u652f\u63f4\u4efb\u4f55\u5b50\u5167\u5bb9 \u2014 \u5728\u6587\u5b57\u524d\u5f8c\u653e\u7f6e\u5716\u793a\uff0c\u6216\u4f7f\u7528\u50c5\u5716\u793a\u6309\u9215\u3002",
  "buttons.newPatient": "\u65b0\u75c5\u60a3",
  "buttons.export": "\u532f\u51fa",
  "buttons.share": "\u5206\u4eab",
  "buttons.delete": "\u522a\u9664",
  "buttons.iconRight": "\u5716\u793a\u5728\u53f3",
  "buttons.send": "\u50b3\u9001",
  "buttons.upload": "\u4e0a\u50b3",
  "buttons.schedule": "\u9810\u7d04",
  "buttons.iconOnly": "\u50c5\u5716\u793a",
  "buttons.sizesWithIcons": "\u5e36\u5716\u793a\u7684\u5c3a\u5bf8",

  // Forms
  "forms.label": "\u5143\u4ef6",
  "forms.title": "\u8868\u55ae\u5143\u4ef6",
  "forms.desc":
    "\u7c21\u6f54\u3001\u7121\u969c\u7919\u7684\u8868\u55ae\u63a7\u5236\u9805\uff0c\u5177\u6709\u6e05\u6670\u7684\u805a\u7126\u72c0\u614b\u548c\u932f\u8aa4\u8655\u7406\u3002",
  "forms.textInputs": "\u6587\u5b57\u8f38\u5165",
  "forms.emailAddress": "\u96fb\u5b50\u90f5\u4ef6",
  "forms.emailPlaceholder": "you@example.com",
  "forms.fullName": "\u59d3\u540d",
  "forms.fullNamePlaceholder": "\u738b\u5c0f\u660e",
  "forms.medicalLicenseHint":
    "\u8acb\u8207\u91ab\u7642\u57f7\u7167\u4e0a\u7684\u59d3\u540d\u4e00\u81f4",
  "forms.fullNameRequired": "\u59d3\u540d\u70ba\u5fc5\u586b\u6b04\u4f4d",
  "forms.search": "\u641c\u5c0b",
  "forms.searchPatients": "\u641c\u5c0b\u75c5\u60a3...",
  "forms.selectTextarea": "\u9078\u64c7\u8207\u6587\u5b57\u5340\u57df",
  "forms.specialty": "\u5c08\u79d1",
  "forms.selectSpecialty": "\u9078\u64c7\u5c08\u79d1...",
  "forms.internalMedicine": "\u5167\u79d1",
  "forms.familyMedicine": "\u5bb6\u5ead\u91ab\u5b78",
  "forms.pediatrics": "\u5c0f\u5152\u79d1",
  "forms.notes": "\u8a3b\u8a18",
  "forms.clinicalNotes": "\u65b0\u589e\u81e8\u5e8a\u8a3b\u8a18...",
  "forms.multiSelect": "\u591a\u9078",
  "forms.filterSpecialty": "\u4f9d\u5c08\u79d1\u7be9\u9078",
  "forms.addMore": "\u65b0\u589e\u66f4\u591a...",
  "forms.searchSpecialties": "\u641c\u5c0b\u5c08\u79d1...",
  "forms.noMatches": "\u627e\u4e0d\u5230\u7b26\u5408\u9805\u76ee",
  "forms.checkboxes": "\u6838\u53d6\u65b9\u584a",
  "forms.showConsultations": "\u986f\u793a\u8a3a\u7642",
  "forms.onlyMyPatients": "\u50c5\u6211\u7684\u75c5\u60a3",
  "forms.archivedDisabled": "\u5df2\u5c01\u5b58\uff08\u505c\u7528\uff09",
  "forms.radios": "\u55ae\u9078\u6309\u9215",
  "forms.phoneCall": "\u96fb\u8a71\u901a\u8a71",
  "forms.videoCall": "\u8996\u8a0a\u901a\u8a71",
  "forms.inPerson": "\u89aa\u81ea\u5c31\u8a3a",
  "forms.largeInput": "\u5927\u578b\u8f38\u5165",
  "forms.patientSearch": "\u75c5\u60a3\u641c\u5c0b",
  "forms.searchByName":
    "\u4f9d\u59d3\u540d\u3001ID \u6216\u96fb\u8a71\u641c\u5c0b...",
  "forms.disabledState": "\u505c\u7528\u72c0\u614b",
  "forms.disabledField": "\u505c\u7528\u6b04\u4f4d",
  "forms.readOnlyValue": "\u552f\u8b80\u503c",
  "forms.advancedInputs": "\u9032\u968e\u8f38\u5165",
  "forms.advancedDesc":
    "\u5c08\u7528\u65bc\u96fb\u8a71\u865f\u78bc\u3001\u65e5\u671f\u548c\u5e36\u64cd\u4f5c\u5716\u793a\u8f38\u5165\u7684\u5c08\u696d\u8868\u55ae\u63a7\u5236\u9805\u3002",
  "forms.phoneNumber": "\u96fb\u8a71\u865f\u78bc",
  "forms.withCountryCode": "\u542b\u570b\u78bc",
  "forms.withCountryCodeExt": "\u542b\u570b\u78bc\u8207\u5206\u6a5f",
  "forms.simple": "\u7c21\u55ae",
  "forms.datePicker": "\u65e5\u671f\u9078\u64c7\u5668",
  "forms.appointmentDate": "\u9810\u7d04\u65e5\u671f",
  "forms.appointmentTime": "\u9810\u7d04\u6642\u9593",
  "forms.appointmentDateTime": "\u9810\u7d04\u65e5\u671f\u8207\u6642\u9593",
  "forms.inputWithIcon": "\u5e36\u64cd\u4f5c\u5716\u793a\u7684\u8f38\u5165",
  "forms.referenceCode": "\u53c3\u8003\u4ee3\u78bc",
  "forms.websiteUrl": "\u7db2\u7ad9\u7db2\u5740",
  "forms.inputWithUnit": "\u5e36\u55ae\u4f4d\u7684\u8f38\u5165",
  "forms.dosage": "\u5291\u91cf",
  "forms.weight": "\u9ad4\u91cd",
  "forms.quantity": "\u6578\u91cf",
  "forms.paymentInput": "\u4ed8\u6b3e\u8f38\u5165",
  "forms.payment": "\u4ed8\u6b3e",
  "forms.cardNumber": "\u5361\u865f",
  "forms.expiry": "\u5230\u671f\u65e5",
  "forms.loginForm": "\u767b\u5165\u8868\u55ae",
  "forms.email": "\u96fb\u5b50\u90f5\u4ef6",
  "forms.password": "\u5bc6\u78bc",
  "forms.enterPassword": "\u8f38\u5165\u5bc6\u78bc",
  "forms.rememberMe": "\u8a18\u4f4f\u6211",
  "forms.forgotPassword": "\u5fd8\u8a18\u5bc6\u78bc\uff1f",
  "forms.signIn": "\u767b\u5165",
  "forms.inlineInputs": "\u5167\u806f\u8f38\u5165",
  "forms.dispense": "\u914d\u85e5",
  "forms.tabletsTake": "\u9320\uff0c\u6bcf\u6b21\u670d\u7528",
  "forms.timesPerDayFor": "\u6b21\uff0c\u6bcf\u65e5\uff0c\u7e8c\u7528",
  "forms.days": "\u5929\u3002",
  "forms.fluidsGiven": "\u8f38\u6db2",
  "forms.dosageInline": "\u5291\u91cf",
  "forms.quantityInline": "\u6578\u91cf",
  "forms.dateOfService": "\u670d\u52d9\u65e5\u671f",
  "forms.facility": "\u6a5f\u69cb",
  "forms.signature": "\u7c3d\u540d",
  "forms.signatureDesc":
    "\u624b\u5beb\u7c3d\u540d\u64f7\u53d6\u5340\u57df\uff0c\u7528\u65bc\u540c\u610f\u66f8\u3001\u5408\u7d04\u548c\u75c5\u60a3\u5165\u9662\u6d41\u7a0b\u3002",
  "forms.active": "\u6d3b\u52d5\u4e2d",
  "forms.signed": "\u5df2\u7c3d\u540d",
  "forms.signHere": "\u8acb\u5728\u6b64\u7c3d\u540d",
  "forms.clear": "\u6e05\u9664",
  "forms.confirm": "\u78ba\u8a8d",

  // Badges
  "badges.label": "\u5143\u4ef6",
  "badges.title": "\u5fbd\u7ae0\u3001\u6a19\u7c64\u8207\u72c0\u614b",
  "badges.desc":
    "\u4ee5\u7d30\u5fae\u7684\u8996\u89ba\u6307\u793a\u5668\u50b3\u9054\u72c0\u614b\u3001\u985e\u5225\u548c\u8a08\u6578\u3002\u6a19\u7c64\u652f\u63f4\u9375\u76e4\u5c0e\u89bd\u548c\u79fb\u9664\u3002",
  "badges.soft": "\u67d4\u548c\u5fbd\u7ae0",
  "badges.active": "\u6d3b\u52d5\u4e2d",
  "badges.scheduled": "\u5df2\u6392\u7a0b",
  "badges.pending": "\u5f85\u8655\u7406",
  "badges.overdue": "\u904e\u671f",
  "badges.draft": "\u8349\u7a3f",
  "badges.solid": "\u5be6\u5fc3\u5fbd\u7ae0",
  "badges.approved": "\u5df2\u6838\u51c6",
  "badges.processing": "\u8655\u7406\u4e2d",
  "badges.review": "\u5be9\u67e5",
  "badges.urgent": "\u7dca\u6025",
  "badges.default": "\u9810\u8a2d",
  "badges.removableTags": "\u53ef\u79fb\u9664\u6a19\u7c64",
  "badges.activeDiagnoses": "\u73fe\u884c\u8a3a\u65b7",

  // Feedback
  "feedback.label": "\u5143\u4ef6",
  "feedback.title": "\u56de\u994b\u8207\u901a\u77e5",
  "feedback.desc":
    "\u8b66\u793a\u3001Toast\u3001\u9032\u5ea6\u6307\u793a\u5668\u3001\u7a7a\u72c0\u614b\u548c\u901a\u77e5\uff0c\u7528\u65bc\u50b3\u9054\u7cfb\u7d71\u72c0\u614b\u3002",
  "feedback.alerts": "\u8b66\u793a",
  "feedback.changesSaved": "\u8b8a\u66f4\u5df2\u5132\u5b58",
  "feedback.changesSavedDesc":
    "\u60a8\u7684\u75c5\u60a3\u8a18\u9304\u5df2\u6210\u529f\u66f4\u65b0\u3002",
  "feedback.appointmentReminder": "\u9810\u7d04\u63d0\u9192",
  "feedback.appointmentReminderDesc":
    "\u60a8\u7684\u4e0b\u4e00\u6b21\u9810\u7d04\u5b9a\u65bc\u660e\u5929\u4e0b\u5348 2:00\u3002",
  "feedback.outstandingBalance": "\u672a\u4ed8\u9918\u984d",
  "feedback.outstandingBalanceDesc":
    "\u6b64\u75c5\u60a3\u6709 $45.00 \u672a\u4ed8\u9918\u984d\u3002",
  "feedback.formFailed": "\u8868\u55ae\u63d0\u4ea4\u5931\u6557",
  "feedback.formFailedDesc":
    "\u8acb\u6aa2\u67e5\u5fc5\u586b\u6b04\u4f4d\u5f8c\u91cd\u8a66\u3002",
  "feedback.toasts": "Toast \u901a\u77e5",
  "feedback.apptConfirmed": "\u9810\u7d04\u5df2\u78ba\u8a8d",
  "feedback.apptConfirmedDesc":
    "2026\u5e742\u670826\u65e5 \u4e0a\u534810:00\uff0cChen \u91ab\u5e2b",
  "feedback.connectionLost": "\u9023\u7dda\u4e2d\u65b7",
  "feedback.connectionLostDesc":
    "\u8acb\u6aa2\u67e5\u60a8\u7684\u7db2\u969b\u7db2\u8def\u9023\u7dda\u3002",
  "feedback.newMessage": "\u65b0\u8a0a\u606f",
  "feedback.newMessageDesc":
    "\u60a8\u6709 3 \u5247\u4f86\u81ea\u75c5\u60a3\u7684\u672a\u8b80\u8a0a\u606f\u3002",
  "feedback.emptyState": "\u7a7a\u72c0\u614b",
  "feedback.emptyStateDesc":
    "\u7576\u5340\u584a\u7121\u8cc7\u6599\u6642\u986f\u793a\u7684\u4f54\u4f4d\u5167\u5bb9\u3002\u63d0\u4f9b\u8108\u7d61\u548c\u884c\u52d5\u547c\u7c72\u3002",
  "feedback.noResults": "\u627e\u4e0d\u5230\u7d50\u679c",
  "feedback.noResultsDesc":
    "\u6b64\u75c5\u60a3\u5c1a\u7121\u6aa2\u9a57\u7d50\u679c\u3002\u7576\u5df2\u4e0b\u55ae\u7684\u6aa2\u9a57\u8655\u7406\u5b8c\u7562\u5f8c\uff0c\u7d50\u679c\u5c07\u986f\u793a\u65bc\u6b64\u3002",
  "feedback.orderLabTest": "\u4e0b\u55ae\u6aa2\u9a57",
  "feedback.noDocuments": "\u7121\u6587\u4ef6",
  "feedback.noDocumentsDesc":
    "\u6b64\u75c5\u60a3\u7121\u5df2\u4e0a\u50b3\u6587\u4ef6\u3002\u8acb\u4e0a\u50b3\u81e8\u5e8a\u6587\u4ef6\u3001\u540c\u610f\u66f8\u6216\u5f71\u50cf\u5831\u544a\u3002",
  "feedback.uploadDocument": "\u4e0a\u50b3\u6587\u4ef6",
  "feedback.notifications": "\u901a\u77e5",
  "feedback.notificationsDesc":
    "\u986f\u793a\u5728\u89d2\u843d\u7684 Toast \u5f0f\u901a\u77e5\u3002\u7528\u65bc\u7cfb\u7d71\u56de\u994b \u2014 \u8a02\u55ae\u78ba\u8a8d\u3001\u932f\u8aa4\u3001\u8b66\u544a\u548c\u8cc7\u8a0a\u8a0a\u606f\u3002",
  "feedback.orderSubmitted": "\u8a02\u55ae\u5df2\u63d0\u4ea4",
  "feedback.orderSubmittedDesc":
    "CBC \u6aa2\u9a57\u55ae\u5df2\u6210\u529f\u9001\u9054\u5be6\u9a57\u5ba4\u3002",
  "feedback.submissionFailed": "\u63d0\u4ea4\u5931\u6557",
  "feedback.submissionFailedDesc":
    "\u7121\u6cd5\u63d0\u4ea4\u8a02\u55ae\u3002\u8acb\u6aa2\u67e5\u9023\u7dda\u5f8c\u91cd\u8a66\u3002",
  "feedback.sessionExpiring": "\u5de5\u4f5c\u968e\u6bb5\u5373\u5c07\u904e\u671f",
  "feedback.sessionExpiringDesc":
    "\u60a8\u7684\u5de5\u4f5c\u968e\u6bb5\u5c07\u5728 5 \u5206\u9418\u5f8c\u904e\u671f\u3002\u8acb\u5132\u5b58\u5de5\u4f5c\u3002",
  "feedback.newMessageNotif": "\u65b0\u8a0a\u606f",
  "feedback.newMessageNotifDesc":
    "Chen \u91ab\u5e2b\u5df2\u50b3\u9001\u95dc\u65bc\u75c5\u60a3 Jane Doe \u7684\u8a0a\u606f\u3002",
  "feedback.success": "\u6210\u529f",
  "feedback.error": "\u932f\u8aa4",

  // Navigation section
  "navigation.label": "\u5143\u4ef6",
  "navigation.title": "\u5c0e\u89bd",
  "navigation.desc":
    "\u5c0e\u89bd\u6a21\u5f0f\uff0c\u7528\u65bc\u5728\u61c9\u7528\u7a0b\u5f0f\u4e2d\u63d0\u4f9b\u4e00\u81f4\u7684\u5c0b\u8def\u9ad4\u9a57\u3002",
  "navigation.topNav": "\u9802\u90e8\u5c0e\u89bd\u5217",
  "navigation.dashboard": "\u5100\u8868\u677f",
  "navigation.patients": "\u75c5\u60a3",
  "navigation.scheduleNav": "\u884c\u7a0b",
  "navigation.messages": "\u8a0a\u606f",
  "navigation.help": "\u5e6b\u52a9",
  "navigation.tabs": "\u5206\u9801\u7c64",
  "navigation.allVisits": "\u6240\u6709\u5c31\u8a3a",
  "navigation.documents": "\u6587\u4ef6",
  "navigation.labResults": "\u6aa2\u9a57\u7d50\u679c",
  "navigation.tabContent": "\u5206\u9801\u7c64\u5167\u5bb9\u5340",
  "navigation.allVisitsContent": "\u6240\u6709\u5c31\u8a3a\u5167\u5bb9",
  "navigation.documentsContent": "\u6587\u4ef6\u5167\u5bb9",
  "navigation.labResultsContent": "\u6aa2\u9a57\u7d50\u679c\u5167\u5bb9",
  "navigation.breadcrumb": "\u9762\u5305\u5c51\u5c0e\u89bd",
  "navigation.pagination": "\u5206\u9801",
  "navigation.anchorNav": "\u9328\u9ede\u5c0e\u89bd",
  "navigation.anchorNavDesc":
    "\u7528\u65bc\u9577\u5377\u52d5\u5167\u5bb9\u7684\u9801\u5167\u5c0e\u89bd\u3002\u7528\u65bc\u5c31\u8a3a\u8a3b\u8a18\u548c\u591a\u5340\u584a\u8868\u55ae\u3002\u6b64\u9801\u9802\u90e8\u7684\u56fa\u5b9a\u5217\u5373\u70ba\u5373\u6642\u7bc4\u4f8b\u3002",
  "navigation.anchorNavText":
    "\u56fa\u5b9a\u5728\u9801\u9762\u9802\u90e8\u7684\u9328\u9ede\u5c0e\u89bd\u5217\u662f\u6b64\u5143\u4ef6\u7684\u5373\u6642\u5c55\u793a\u3002\u5b83\u6703\u5728\u6372\u52d5\u6642\u6a19\u8a18\u7576\u524d\u5340\u584a\uff0c\u4e26\u652f\u63f4\u9ede\u64ca\u8df3\u8f49\u3002",

  // Dropdowns
  "dropdowns.label": "\u5143\u4ef6",
  "dropdowns.title": "\u4e0b\u62c9\u9078\u55ae",
  "dropdowns.desc":
    "\u4e0b\u62c9\u9078\u55ae\u3001\u9078\u64c7\u5217\u8868\u548c\u64cd\u4f5c\u9078\u55ae\u3002\u6240\u6709\u4e0b\u62c9\u9650\u5236\u70ba\u87a2\u5e55\u9ad8\u5ea6\u7684 1/3\uff0c\u5167\u5bb9\u6ea2\u51fa\u6642\u53ef\u6372\u52d5\u3002",
  "dropdowns.selectDropdown": "\u9078\u64c7\u4e0b\u62c9",
  "dropdowns.selectDropdownDesc":
    "\u6a19\u6e96\u9078\u64c7\u8f38\u5165\uff0c\u5e36\u53ef\u6372\u52d5\u9078\u9805\u5217\u8868\u3002",
  "dropdowns.country": "\u570b\u5bb6",
  "dropdowns.selectCountry": "\u9078\u64c7\u570b\u5bb6...",
  "dropdowns.dropdownButton": "\u4e0b\u62c9\u6309\u9215",
  "dropdowns.dropdownButtonDesc":
    "\u7531\u6309\u9215\u89f8\u767c\u7684\u64cd\u4f5c\u9078\u55ae\u3002\u7528\u65bc\u884c\u3001\u5361\u7247\u548c\u5de5\u5177\u5217\u7684\u60c5\u5883\u64cd\u4f5c\u3002",
  "dropdowns.actions": "\u64cd\u4f5c",
  "dropdowns.editRecord": "\u7de8\u8f2f\u8a18\u9304",
  "dropdowns.duplicate": "\u8907\u88fd",
  "dropdowns.exportPdf": "\u532f\u51fa PDF",
  "dropdowns.archive": "\u5c01\u5b58",
  "dropdowns.viewDetails": "\u6aa2\u8996\u8a73\u60c5",
  "dropdowns.assignProvider": "\u6307\u6d3e\u91ab\u5e2b",
  "dropdowns.flagReview": "\u6a19\u8a18\u5be9\u67e5",
  "dropdowns.newOrder": "\u65b0\u8a02\u55ae",
  "dropdowns.labOrders": "\u6aa2\u9a57\u8a02\u55ae",
  "dropdowns.cbc": "\u5168\u8840\u7403\u8a08\u6578",
  "dropdowns.bmp": "\u57fa\u672c\u4ee3\u8b1d\u5957\u7d44",
  "dropdowns.lipid": "\u8840\u8102\u5957\u7d44",
  "dropdowns.imaging": "\u5f71\u50cf",
  "dropdowns.xray": "X \u5149",
  "dropdowns.mri": "\u78c1\u632f\u9020\u5f71",

  // Others
  "others.label": "\u5143\u4ef6",
  "others.title": "\u5176\u4ed6",
  "others.desc":
    "\u5361\u7247\u3001\u8868\u683c\u3001\u982d\u50cf\u3001\u63d0\u793a\u548c\u53ef\u6536\u5408\u5340\u584a\uff0c\u7528\u65bc\u986f\u793a\u7d50\u69cb\u5316\u5167\u5bb9\u3002",
  "others.progressBars": "\u9032\u5ea6\u689d",
  "others.profileComplete": "\u500b\u4eba\u8cc7\u6599\u5b8c\u6210\u5ea6",
  "others.uploadProgress": "\u4e0a\u50b3\u9032\u5ea6",
  "others.storageUsed": "\u5df2\u7528\u5132\u5b58\u7a7a\u9593",
  "others.avatars": "\u982d\u50cf",

  // Overlays
  "overlays.label": "\u5143\u4ef6",
  "overlays.title": "\u8986\u758a\u5c64",
  "overlays.desc":
    "\u6a21\u614b\u5c0d\u8a71\u6846\u3001\u63d0\u793a\u548c\u62bd\u5c5c\u6a21\u5f0f\uff0c\u7528\u65bc\u5c08\u6ce8\u4e92\u52d5\u3002",
  "overlays.modal": "\u6a21\u614b / \u5c0d\u8a71\u6846",
  "overlays.cancelAppointment": "\u53d6\u6d88\u9810\u7d04",
  "overlays.cancelConfirm":
    "\u60a8\u78ba\u5b9a\u8981\u53d6\u6d88\u8207",
  "overlays.onDate": "\u65bc 2026\u5e742\u670826\u65e5\u7684\u9810\u7d04\u55ce\uff1f",
  "overlays.reasonForCancellation": "\u53d6\u6d88\u539f\u56e0",
  "overlays.selectReason": "\u9078\u64c7\u539f\u56e0...",
  "overlays.scheduleConflict": "\u884c\u7a0b\u885d\u7a81",
  "overlays.feelingBetter": "\u611f\u89ba\u597d\u8f49",
  "overlays.other": "\u5176\u4ed6",
  "overlays.keepAppointment": "\u4fdd\u7559\u9810\u7d04",
  "overlays.tooltips": "\u63d0\u793a",
  "overlays.hoverTarget": "\u61f8\u505c\u76ee\u6a19",
  "overlays.thisIsTooltip": "\u9019\u662f\u63d0\u793a",
  "overlays.save": "\u5132\u5b58",
  "overlays.saveRecord": "\u5132\u5b58\u75c5\u60a3\u8a18\u9304",
  "overlays.drawer": "\u62bd\u5c5c",
  "overlays.drawerDesc":
    "\u5f9e\u87a2\u5e55\u5074\u908a\u6ed1\u5165\u7684\u9762\u677f\u3002\u7528\u65bc\u8a73\u60c5\u6aa2\u8996\u3001\u7de8\u8f2f\u8a18\u9304\u548c\u8f38\u5165\u8a02\u55ae\uff0c\u7121\u9700\u96e2\u958b\u7576\u524d\u60c5\u5883\u3002",
  "overlays.openPatientDetails": "\u958b\u555f\u75c5\u60a3\u8a73\u60c5",
  "overlays.patientDetails": "\u75c5\u60a3\u8a73\u60c5",
  "overlays.demographics": "\u4eba\u53e3\u7d71\u8a08",
  "overlays.dateOfBirth": "\u51fa\u751f\u65e5\u671f",
  "overlays.gender": "\u6027\u5225",
  "overlays.female": "\u5973\u6027",
  "overlays.phone": "\u96fb\u8a71",
  "overlays.emailLabel": "\u96fb\u5b50\u90f5\u4ef6",
  "overlays.insurance": "\u4fdd\u96aa",
  "overlays.provider": "\u63d0\u4f9b\u8005",
  "overlays.planId": "\u65b9\u6848 ID",
  "overlays.group": "\u7d44\u5225",
  "overlays.recentEncounters": "\u8fd1\u671f\u5c31\u8a3a",
  "overlays.telemedicineFollowup": "\u9060\u8ddd\u91ab\u7642 \u2014 \u8907\u8a3a",
  "overlays.inPersonAnnual": "\u89aa\u81ea\u5c31\u8a3a \u2014 \u5e74\u5ea6\u9ad4\u6aa2",
  "overlays.close": "\u95dc\u9589",
  "overlays.editPatient": "\u7de8\u8f2f\u75c5\u60a3",

  // Layouts
  "layouts.label": "\u6a21\u5f0f",
  "layouts.title": "\u4f48\u5c40",
  "layouts.desc":
    "VSee Clinic \u61c9\u7528\u7a0b\u5f0f\u4e2d\u5e38\u7528\u7684\u4f48\u5c40\u6a21\u5f0f\u3002",
  "layouts.sidebarContent": "\u5074\u6b04 + \u5167\u5bb9",
  "layouts.menu": "\u9078\u55ae",
  "layouts.dashboard": "\u5100\u8868\u677f",
  "layouts.patients": "\u75c5\u60a3",
  "layouts.appointments": "\u9810\u7d04",
  "layouts.messages": "\u8a0a\u606f",
  "layouts.labResults": "\u6aa2\u9a57\u7d50\u679c",
  "layouts.settings": "\u8a2d\u5b9a",
  "layouts.welcomeBack":
    "\u6b61\u8fce\u56de\u4f86\uff0cChen \u91ab\u5e2b\u3002\u4ee5\u4e0b\u662f\u60a8\u4eca\u5929\u7684\u6982\u89bd\u3002",
  "layouts.patientsToday": "\u4eca\u65e5\u75c5\u60a3",
  "layouts.pendingOrders": "\u5f85\u8655\u7406\u8a02\u55ae",
  "layouts.followUp": "\u8907\u8a3a",
  "layouts.newPatient": "\u65b0\u75c5\u60a3",
  "layouts.telemedicine": "\u9060\u8ddd\u91ab\u7642",
  "layouts.unreadMessages":
    "\u60a8\u6709 3 \u5247\u4f86\u81ea\u75c5\u60a3\u7684\u672a\u8b80\u8a0a\u606f\u3002\u8acb\u6aa2\u67e5\u6536\u4ef6\u5323\u4ee5\u7372\u53d6\u6700\u65b0\u66f4\u65b0\u3002",
  "layouts.labResultsReady":
    "2 \u9805\u65b0\u6aa2\u9a57\u7d50\u679c\u5df2\u53ef\u5be9\u95b1\u3002\u9ede\u64ca\u7d50\u679c\u4ee5\u6aa2\u8996\u5b8c\u6574\u5831\u544a\u3002",
  "layouts.settingsDesc":
    "\u7ba1\u7406\u60a8\u7684\u500b\u4eba\u8cc7\u6599\u3001\u901a\u77e5\u504f\u597d\u548c\u8a3a\u6240\u8a2d\u5b9a\u3002",

  // Theming
  "theming.label": "\u5de5\u7a0b",
  "theming.title": "\u767d\u724c\u4e3b\u984c\u5316",
  "theming.desc":
    'VSee \u652f\u63f4\u6bcf\u500b\u79df\u6236\u7684\u767d\u724c\u5ba2\u88fd\u3002\u900f\u904e [data-theme] \u8986\u5beb CSS \u8b8a\u6578\u4f86\u8a2d\u5b9a\u54c1\u724c\u8272\u5f69\uff0c\u900f\u904e [data-mode="dark"] \u555f\u7528\u6df1\u8272\u6a21\u5f0f\u3002\u9ede\u64ca\u4e0b\u65b9\u5361\u7247\u5373\u6642\u5207\u63db\u4e3b\u984c\uff0c\u6216\u5728\u5074\u6b04\u5207\u63db\u6df1\u8272\u6a21\u5f0f\u3002',
  "theming.vseeDefault": "VSee \u9810\u8a2d",
  "theming.oceanBlue": "\u6d77\u6d0b\u85cd",
  "theming.royalPurple": "\u7687\u5bb6\u7d2b",
  "theming.howToSwitch": "\u5982\u4f55\u5207\u63db\u4e3b\u984c",
  "theming.darkMode": "\u6df1\u8272\u6a21\u5f0f",
  "theming.customTheme": "\u5efa\u7acb\u81ea\u8a02\u4e3b\u984c",

  // Form.io
  "formio.label": "\u5de5\u7a0b",
  "formio.title": "Form.io + React Aria",
  "formio.howItWorks": "\u904b\u4f5c\u65b9\u5f0f",
  "formio.formBuilder": "Form.io \u5efa\u69cb\u5668",
  "formio.formBuilderDesc":
    "\u62d6\u653e\u5f0f\u8868\u55ae\u5efa\u69cb\u5668\u6216 JSON \u7de8\u8f2f\u5668\uff0c\u8a17\u7ba1\u65bc form.io \u6216\u81ea\u884c\u67b6\u8a2d",
  "formio.formSchema": "\u8868\u55ae Schema",
  "formio.formSchemaDesc":
    "\u8868\u55ae\u5b9a\u7fa9\u5728\u57f7\u884c\u6642\u53d6\u5f97 \u2014 \u4fee\u6539\u8868\u55ae\u7121\u9700\u91cd\u65b0\u90e8\u7f72",
  "formio.formComponent": "<Form>",
  "formio.formComponentDesc":
    "\u6e32\u67d3 schema\u3001\u8655\u7406\u9a57\u8b49\u3001\u63d0\u4ea4\u548c\u591a\u6b65\u9a5f\u908f\u8f2f",
  "formio.customComponents": "\u81ea\u8a02\u5143\u4ef6",
  "formio.customComponentsDesc":
    "TextField\u3001Checkbox\u3001Select \u7b49\u8a3b\u518a\u70ba Form.io \u81ea\u8a02\u5143\u4ef6\u8986\u5beb",
  "formio.jsonSchema": "Form.io JSON Schema",
  "formio.jsonSchemaDesc":
    "\u4f3a\u670d\u5668\u50b3\u56de\u5982\u6b64\u7684 JSON schema\u3002type \u6b04\u4f4d\u5c0d\u61c9\u5df2\u8a3b\u518a\u7684\u81ea\u8a02\u5143\u4ef6\u3002",
  "formio.registration": "\u81ea\u8a02\u5143\u4ef6\u8a3b\u518a",
  "formio.registrationDesc":
    "\u6bcf\u500b Form.io \u5143\u4ef6\u985e\u578b\u5c0d\u61c9\u4e00\u500b React \u5143\u4ef6\u3002component \u7269\u4ef6\u651c\u5e36 schema \u5c6c\u6027\uff1bonChange \u66f4\u65b0\u63d0\u4ea4\u8cc7\u6599\u3002",
  "formio.wiring": "\u7d44\u88dd\u5728\u4e00\u8d77",
  "formio.livePreview":
    "\u5373\u6642\u9810\u89bd \u2014 \u75c5\u60a3\u5165\u9662\u8868\u55ae",
  "formio.livePreviewDesc":
    "\u9019\u662f\u4e0a\u65b9\u8868\u55ae\u4f7f\u7528 React Aria \u81ea\u8a02\u5143\u4ef6\u6e32\u67d3\u7684\u7d50\u679c\u3002\u6240\u6709\u9a57\u8b49\u3001\u4f48\u5c40\u548c\u6b04\u4f4d\u908f\u8f2f\u5747\u4f86\u81ea JSON schema\uff1bReact Aria \u5143\u4ef6\u50c5\u63d0\u4f9b\u6a23\u5f0f\u548c\u7121\u969c\u7919\u529f\u80fd\u3002",
  "formio.patientIntake": "\u75c5\u60a3\u5165\u9662\u8868\u55ae",
  "formio.renderedBy":
    "\u7531 @formio/react \u6e32\u67d3 \u00b7 React Aria \u81ea\u8a02\u5143\u4ef6",
  "formio.submitted": "\u5165\u9662\u8868\u55ae\u5df2\u63d0\u4ea4\uff01",
  "formio.resetForm": "\u91cd\u8a2d\u8868\u55ae",
  "formio.firstName": "\u540d",
  "formio.lastName": "\u59d3",
  "formio.dateOfBirth": "\u51fa\u751f\u65e5\u671f",
  "formio.insuranceProvider": "\u4fdd\u96aa\u63d0\u4f9b\u8005",
  "formio.selectProvider": "\u9078\u64c7\u63d0\u4f9b\u8005\u2026",
  "formio.reasonForVisit": "\u5c31\u8a3a\u539f\u56e0",
  "formio.reasonPlaceholder":
    "\u63cf\u8ff0\u60a8\u7684\u75c7\u72c0\u6216\u5c31\u8a3a\u539f\u56e0\u2026",
  "formio.hipaaConsent":
    "\u6211\u5df2\u95b1\u8b80\u4e26\u540c\u610f HIPAA \u96b1\u79c1\u8072\u660e",
  "formio.submitIntake": "\u63d0\u4ea4\u5165\u9662\u8868\u55ae",
  "formio.whatFormio": "Form.io \u8655\u7406\u4ec0\u9ebc",
  "formio.whatAria": "React Aria \u8655\u7406\u4ec0\u9ebc",
  "formio.formioList1": "Schema \u53d6\u5f97\u8207\u5feb\u53d6",
  "formio.formioList2":
    "\u6b04\u4f4d\u5c64\u7d1a\u9a57\u8b49\u898f\u5247\uff08\u5fc5\u586b\u3001\u6700\u5c0f/\u6700\u5927\u3001\u6b63\u898f\u8868\u9054\u5f0f\uff09",
  "formio.formioList3": "\u689d\u4ef6\u5f0f\u986f\u793a\u908f\u8f2f",
  "formio.formioList4":
    "\u591a\u6b65\u9a5f\u7cbe\u9748 / \u9801\u9762\u5c0e\u89bd",
  "formio.formioList5":
    "\u63d0\u4ea4\u81f3 Form.io \u6216\u81ea\u8a02\u7aef\u9ede",
  "formio.formioList6":
    "\u96e2\u7dda\u8349\u7a3f\u8207\u7e8c\u586b",
  "formio.ariaList1":
    "\u8996\u89ba\u6a23\u5f0f\u8207\u54c1\u724c\u4ee3\u5e63",
  "formio.ariaList2":
    "\u9375\u76e4\u5c0e\u89bd\u8207\u805a\u7126\u5708",
  "formio.ariaList3":
    "ARIA \u6a19\u7c64\u3001\u89d2\u8272\u3001\u932f\u8aa4\u95dc\u806f",
  "formio.ariaList4":
    "React Aria \u7121\u969c\u7919\u539f\u59cb\u5143\u4ef6",
  "formio.ariaList5":
    "\u4e00\u81f4\u7684 hover / focus / disabled \u72c0\u614b",
  "formio.ariaList6":
    "\u8a2d\u8a08\u7cfb\u7d71\u4ee3\u5e63\u7e7c\u627f",
  "formio.install": "\u5b89\u88dd",

  // Tokens
  "tokens.label": "\u5de5\u7a0b",
  "tokens.title": "\u8a2d\u8a08\u4ee3\u5e63",
  "tokens.desc":
    "\u5c07 :root \u5340\u584a\u8907\u88fd\u5230\u60a8\u7684\u5168\u57df CSS\u3002\u4ee3\u5e63\u900f\u904e [data-mode] \u5c6c\u6027\u652f\u63f4\u6dfa\u8272\u548c\u6df1\u8272\u6a21\u5f0f\u3002\u53ef\u4f5c\u70ba CSS \u81ea\u8a02\u5c6c\u6027\u3001Tokens Studio JSON \u548c Figma Variables \u4f7f\u7528\u3002",

  // Footer
  "footer.sub": "\u8a2d\u8a08\u7cfb\u7d71 \u00b7 2026",
  "footer.meta":
    "Plus Jakarta Sans \u00b7 4px \u7db2\u683c \u00b7 WCAG AA \u00b7 \u767d\u724c\u5c31\u7dd2",

  // Misc
  "misc.copied": "\u5df2\u8907\u88fd",
  "misc.showCode": "\u986f\u793a\u7a0b\u5f0f\u78bc",
  "misc.hideCode": "\u96b1\u85cf\u7a0b\u5f0f\u78bc",
};

/* ─────────────────────── All translations map ─────────────────────── */
const allTranslations: Record<Locale, Translations> = {
  en,
  vi,
  es,
  "zh-TW": zhTW,
};

/* ─────────────────────── React Context ─────────────────────── */
type LanguageContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

export const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const t = (key: string) =>
    allTranslations[locale][key] ?? allTranslations.en[key] ?? key;
  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
