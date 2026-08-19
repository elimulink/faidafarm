export const fieldSummary = [
  { title: "Active Forms", value: "7", note: "Ready for field use" },
  { title: "Draft Submissions", value: "18", note: "Saved offline or incomplete" },
  { title: "Submitted Records", value: "246", note: "Received this round" },
  { title: "Sync Issues", value: "5", note: "Need retry or review" },
];

export const fieldWorkflowSteps = [
  "Download assigned form",
  "Fill interview in the field",
  "Save as draft if offline",
  "Submit when network is available",
  "Supervisor reviews submission",
];

export const fieldForms = [
  {
    id: "screening-consent",
    title: "Screening, Consent and Interview ID",
    description: "Records respondent eligibility, consent, enumerator ID, and interview metadata.",
    duration: "10 min",
    assignedRole: "Field officer",
    status: "Active",
    updatedAt: "25 May 2026",
  },
  {
    id: "household-questionnaire",
    title: "Household Questionnaire",
    description: "Captures household composition, assets, farm profile, and baseline context.",
    duration: "35 min",
    assignedRole: "Enumerator",
    status: "Active",
    updatedAt: "24 May 2026",
  },
  {
    id: "resilience-module",
    title: "Household Resilience Module",
    description: "Tracks coping capacity, shocks, income sources, and recovery indicators.",
    duration: "20 min",
    assignedRole: "Researcher",
    status: "Draft",
    updatedAt: "23 May 2026",
  },
  {
    id: "food-security",
    title: "Household Food Security Module",
    description: "Collects food access, shortage periods, meals, and household food stress.",
    duration: "18 min",
    assignedRole: "Field officer",
    status: "Active",
    updatedAt: "22 May 2026",
  },
  {
    id: "dietary-diversity",
    title: "Household Dietary Diversity Module",
    description: "Records food groups consumed and dietary diversity indicators.",
    duration: "15 min",
    assignedRole: "Enumerator",
    status: "Active",
    updatedAt: "22 May 2026",
  },
  {
    id: "child-wellbeing",
    title: "Child Well-being Assessment",
    description: "Captures child age, nutrition signals, wellbeing, and referral indicators.",
    duration: "25 min",
    assignedRole: "Field officer",
    status: "Draft",
    updatedAt: "21 May 2026",
  },
  {
    id: "fmnr-observation",
    title: "FMNR Observation Checklist",
    description: "Verifies pruning, tree density, regrowth, GPS, and photo evidence.",
    duration: "16 min",
    assignedRole: "Supervisor",
    status: "Active",
    updatedAt: "20 May 2026",
  },
  {
    id: "referral-safeguarding",
    title: "Referral and Safeguarding Form",
    description: "Documents sensitive referrals and safeguarding follow-up requirements.",
    duration: "12 min",
    assignedRole: "Supervisor",
    status: "Archived",
    updatedAt: "18 May 2026",
  },
  {
    id: "data-quality",
    title: "Data Quality Checklist",
    description: "Supervisor checklist for completeness, consistency, GPS, and consent checks.",
    duration: "14 min",
    assignedRole: "Supervisor",
    status: "Active",
    updatedAt: "17 May 2026",
  },
];

export const builderInitialQuestions = [
  {
    id: "q-county",
    label: "County",
    type: "Single Choice",
    required: true,
    options: ["Makueni", "Kajiado", "Narok"],
  },
  {
    id: "q-household",
    label: "Household ID",
    type: "Short Text",
    required: true,
    options: [],
  },
  {
    id: "q-consent",
    label: "Consent given?",
    type: "Consent Checkbox",
    required: true,
    options: [],
  },
];

export const previewQuestions = [
  { id: "county", label: "County", type: "Single Choice", required: true, options: ["Makueni", "Kajiado", "Narok"] },
  { id: "area", label: "Programme area", type: "Short Text", required: true },
  { id: "household", label: "Household ID", type: "Short Text", required: true },
  { id: "consent", label: "Consent given?", type: "Consent Checkbox", required: true },
  { id: "gps", label: "GPS location", type: "GPS Location", required: true },
  { id: "fmnr", label: "Does household practice FMNR?", type: "Single Choice", required: true, options: ["Yes", "No", "Not sure"] },
  { id: "age", label: "Child age in months", type: "Number", required: false },
  { id: "food", label: "Food groups consumed yesterday", type: "Multiple Choice", required: false, options: ["Grains", "Legumes", "Milk", "Eggs", "Fruits", "Vegetables"] },
  { id: "photo", label: "Photo evidence", type: "Photo Upload", required: false },
];

export const fieldSubmissions = [
  { id: "SUB-1041", formName: "Household Questionnaire", county: "Makueni", enumerator: "Caroline N.", status: "Submitted", submittedAt: "25 May 2026 09:42", syncStatus: "Online", review: "Pending Review" },
  { id: "SUB-1040", formName: "FMNR Observation Checklist", county: "Kajiado", enumerator: "Peter L.", status: "Approved", submittedAt: "25 May 2026 08:18", syncStatus: "Online", review: "Approved" },
  { id: "SUB-1039", formName: "Child Well-being Assessment", county: "Narok", enumerator: "Mercy W.", status: "Flagged", submittedAt: "24 May 2026 16:10", syncStatus: "Online", review: "Flagged" },
  { id: "SUB-1038", formName: "Dietary Diversity Module", county: "Makueni", enumerator: "Daniel K.", status: "Pending Review", submittedAt: "24 May 2026 14:55", syncStatus: "Pending", review: "Pending Review" },
];

export const fieldDrafts = [
  { id: "DR-221", formName: "Household Food Security Module", householdId: "HH-KAL-032", lastSaved: "25 May 2026 10:20", completion: "68%", device: "TAB-014" },
  { id: "DR-220", formName: "Screening, Consent and Interview ID", householdId: "HH-KIT-019", lastSaved: "25 May 2026 09:04", completion: "45%", device: "TAB-008" },
  { id: "DR-219", formName: "Child Well-being Assessment", householdId: "HH-MAR-077", lastSaved: "24 May 2026 17:36", completion: "82%", device: "TAB-021" },
];

export const fieldDevices = [
  { id: "TAB-014", enumerator: "Caroline N.", county: "Makueni", lastSync: "25 May 2026 10:28", appVersion: "0.9.2", signal: "4G / 74%", status: "Online" },
  { id: "TAB-008", enumerator: "Peter L.", county: "Kajiado", lastSync: "25 May 2026 08:40", appVersion: "0.9.2", signal: "3G / 52%", status: "Online" },
  { id: "TAB-021", enumerator: "Mercy W.", county: "Narok", lastSync: "24 May 2026 17:44", appVersion: "0.9.1", signal: "Offline / 31%", status: "Offline" },
];

export const fieldSyncQueue = [
  { id: "SYNC-301", submissionId: "DR-221", formName: "Household Food Security Module", device: "TAB-014", retryCount: 2, errorReason: "Weak network during media upload", lastAttempt: "25 May 2026 10:24" },
  { id: "SYNC-300", submissionId: "SUB-1038", formName: "Dietary Diversity Module", device: "TAB-008", retryCount: 1, errorReason: "Supervisor review payload pending", lastAttempt: "24 May 2026 15:02" },
  { id: "SYNC-299", submissionId: "DR-219", formName: "Child Well-being Assessment", device: "TAB-021", retryCount: 4, errorReason: "Device offline", lastAttempt: "24 May 2026 17:44" },
];

export const questionTypes = [
  "Short Text",
  "Number",
  "Single Choice",
  "Multiple Choice",
  "Date",
  "GPS Location",
  "Photo Upload",
  "Section Header",
  "Consent Checkbox",
];
