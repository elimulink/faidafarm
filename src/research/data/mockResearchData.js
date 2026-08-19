export const researchStats = {
  householdsSurveyed: 1628,
  fmnrPlotsVerified: 412,
  childrenAssessed: 640,
  avgDietScore: 4.1,
  mddAchieved: 37,
  fmnrFoodBenefit: 54,
};

export const countySummaries = [
  {
    county: "Makueni",
    sites: "Kalawa, Kitise/Twaandu",
    households: 818,
    fmnrAwareness: "89%",
    avgDietScore: 3.8,
    status: "Active",
  },
  {
    county: "Kajiado",
    sites: "Osiligi",
    households: 413,
    fmnrAwareness: "91.5%",
    avgDietScore: 4.2,
    status: "Active",
  },
  {
    county: "Narok",
    sites: "Mara",
    households: 397,
    fmnrAwareness: "97%",
    avgDietScore: 4.5,
    status: "Active",
  },
];

export const households = [
  {
    id: "HH-KAL-001",
    county: "Makueni",
    site: "Kalawa",
    caregiver: "Caregiver 001",
    fmnrStatus: "High",
    childAgeGroup: "6–23 months",
    surveyStatus: "Complete",
  },
  {
    id: "HH-KIT-014",
    county: "Makueni",
    site: "Kitise/Twaandu",
    caregiver: "Caregiver 014",
    fmnrStatus: "Moderate",
    childAgeGroup: "24–59 months",
    surveyStatus: "Pending Review",
  },
  {
    id: "HH-OSI-088",
    county: "Kajiado",
    site: "Osiligi",
    caregiver: "Caregiver 088",
    fmnrStatus: "Low",
    childAgeGroup: "6–23 months",
    surveyStatus: "Flagged",
  },
  {
    id: "HH-MAR-043",
    county: "Narok",
    site: "Mara",
    caregiver: "Caregiver 043",
    fmnrStatus: "High",
    childAgeGroup: "6–23 months",
    surveyStatus: "Complete",
  },
];

export const fmnrPlots = [
  {
    plotId: "PLT-KAL-001",
    county: "Makueni",
    intensity: "High",
    gps: "Captured",
    observation: "Verified",
    photoEvidence: "3 Photos",
  },
  {
    plotId: "PLT-KIT-014",
    county: "Makueni",
    intensity: "Moderate",
    gps: "Captured",
    observation: "Pending",
    photoEvidence: "1 Photo",
  },
  {
    plotId: "PLT-OSI-088",
    county: "Kajiado",
    intensity: "Low",
    gps: "Missing",
    observation: "Flagged",
    photoEvidence: "None",
  },
  {
    plotId: "PLT-MAR-043",
    county: "Narok",
    intensity: "High",
    gps: "Captured",
    observation: "Verified",
    photoEvidence: "3 Photos",
  },
];

export const childNutrition = [
  {
    childId: "CH-KAL-001",
    county: "Makueni",
    ageGroup: "6–23 months",
    foodGroups: 5,
    mdd: "Achieved",
    fmnrLinkedFood: "Milk, vegetables",
  },
  {
    childId: "CH-KIT-014",
    county: "Makueni",
    ageGroup: "24–59 months",
    foodGroups: 4,
    mdd: "Study Score",
    fmnrLinkedFood: "Fruits",
  },
  {
    childId: "CH-OSI-088",
    county: "Kajiado",
    ageGroup: "6–23 months",
    foodGroups: 3,
    mdd: "Not Achieved",
    fmnrLinkedFood: "None recorded",
  },
  {
    childId: "CH-MAR-043",
    county: "Narok",
    ageGroup: "6–23 months",
    foodGroups: 6,
    mdd: "Achieved",
    fmnrLinkedFood: "Milk, fruits",
  },
];

export const fieldActivities = [
  {
    enumerator: "Enumerator A",
    county: "Makueni",
    completedForms: 42,
    pendingReviews: 5,
    flagged: 1,
  },
  {
    enumerator: "Enumerator B",
    county: "Kajiado",
    completedForms: 31,
    pendingReviews: 4,
    flagged: 2,
  },
  {
    enumerator: "Enumerator C",
    county: "Narok",
    completedForms: 38,
    pendingReviews: 3,
    flagged: 0,
  },
];

export const syncDevices = [
  {
    device: "Tablet-001",
    enumerator: "Enumerator A",
    status: "Online",
    failed: 0,
    lastSync: "Today, 10:42 AM",
  },
  {
    device: "Tablet-002",
    enumerator: "Enumerator B",
    status: "Offline",
    failed: 3,
    lastSync: "Yesterday, 6:12 PM",
  },
  {
    device: "Tablet-003",
    enumerator: "Enumerator C",
    status: "Online",
    failed: 1,
    lastSync: "Today, 9:18 AM",
  },
];
