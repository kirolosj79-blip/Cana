// ============================================================
// Domain types — every field maps to a question in the PDF spec
// ============================================================

export type Gender = 'male' | 'female'

export type Denomination =
  | 'coptic_orthodox'
  | 'greek_orthodox'
  | 'armenian_orthodox'
  | 'syriac_orthodox'
  | 'ethiopian_orthodox'

export type Country = 'egypt' | 'usa' | 'canada' | 'other'

export type ChurchAttendance = 'regular' | 'occasional' | 'recent'

export type MaritalStatus = 'single' | 'divorced' | 'widowed' | 'annulled'

export type EmploymentStatus = 'full_time' | 'self_employed' | 'student' | 'retired' | 'not_working'

export type HabitFrequency = 'never' | 'occasional' | 'regular' | 'prefer_not_to_say'

export type ExerciseFrequency = 'rarely' | 'weekly_1_2' | 'weekly_3_5' | 'daily'

export type SocialPersonality = 'introvert' | 'extrovert' | 'balanced'

export type FamilyInvolvement = 'not_important' | 'slightly_important' | 'moderately_important' | 'very_important' | 'essential'

export type ForgivenessImportance = 'essential' | 'very_important' | 'important' | 'somewhat_important' | 'not_very_important'

export type MarriageTimeline = 'within_6_months' | 'within_1_year' | 'within_1_2_years' | 'open'

export type YesNoUnsure = 'yes' | 'no' | 'unsure'

export type VerificationStatus = 'not_started' | 'pending' | 'verified' | 'rejected' | 'needs_documents'

export interface VerificationBadgeState {
  identity: VerificationStatus
  church: VerificationStatus
  marriageEligibility: VerificationStatus
  medical: VerificationStatus
  premium: boolean
}

// ---- Section 1: Personal Information ----
export interface PersonalInfo {
  firstName: string
  middleName: string
  lastName: string
  displayName: string
  phone: string
  email: string
  gender: Gender
  dateOfBirth: string
  countryOfResidence: Country
  cityState: string
  usState?: string // US state, when countryOfResidence === 'usa'
  weightKg?: number
  heightCm?: number
  nationalityOtherOriginal?: string
  nationalityOtherAcquired?: string
  nationality: string[]
  languagesSpoken: string[]
  profilePhotoUrl: string
  galleryPhotoUrls: string[] // max 6, incl. profile photo
  governmentIdUploaded: boolean
  bio: string
}

// ---- Section 2: Church & Faith Verification ----
export interface ChurchInfo {
  denomination: Denomination
  churchName: string
  diocese: string
  churchAddress: string
  yearsAttending: number
  attendanceLevel: ChurchAttendance
  churchActivities: string
  spiritualFatherName: string
  spiritualFatherPhone: string
  churchEmail?: string
  churchWebsite?: string
  churchAddressFullName?: string
  churchAddressFloor?: string
  churchAddressStreet?: string
  churchAddressStreet2?: string
  churchAddressUnit?: string
  churchAddressCity?: string
  churchAddressState?: string
  churchAddressZip?: string
  spiritualFatherEmail: string
  recommendationLetterUploaded: boolean
}

// ---- Section 3: Marriage Eligibility ----
export interface PreviousMarriage {
  date: string
  type: 'church' | 'civil'
}

export interface MarriageEligibility {
  everMarried: boolean
  previousMarriage?: PreviousMarriage
  currentMaritalStatus?: MaritalStatus
  divorceCertificateUploaded?: boolean
  churchApprovalUploaded?: boolean
  deathCertificateUploaded?: boolean
  hasChildrenFromPrevious: boolean
  numberOfChildren?: number
  childrenAges?: number[]
  livingArrangement?: string
  relationshipWithChildren?: string
}

// ---- Section 4: Family Background ----
export interface FamilyBackground {
  fatherName: string
  fatherOccupation: string
  fatherLiving: boolean
  motherName: string
  motherOccupation: string
  motherLiving: boolean
  parentsMaritalStatus: 'married' | 'divorced' | 'widowed' | 'other'
  numberOfBrothers?: number
  numberOfSisters?: number
  birthOrder: 'oldest' | 'middle' | 'youngest' | 'only_child'
  familyInvolvementImportance: FamilyInvolvement
  livesWith: string
}

// ---- Section 5: Education ----
export interface Education {
  level: 'high_school' | 'diploma' | 'bachelors' | 'masters' | 'doctorate'
  fieldOfStudy: string
  fieldOfStudyOther?: string
  institution: string
  institutionOther?: string
  yearGraduated: number
  certifications: string
  degreeCertificateUploaded: boolean
}

// ---- Section 6: Employment & Financial ----
export interface Employment {
  status: EmploymentStatus
  occupation: string
  employerName: string
  yearsInCareer: number
  workArrangement?: 'on_site' | 'remote' | 'hybrid' | 'not_working'
  monthlyIncomeRange: string
  proofUploaded: boolean
}

// ---- Section 7: Lifestyle ----
export interface Lifestyle {
  smoking: HabitFrequency
  alcohol: HabitFrequency
  exercise: ExerciseFrequency
  dietaryPreference: 'none' | 'vegetarian' | 'vegan' | 'medical' | 'other'
  dietaryPreferenceOther?: string
  petPreference: string
  socialPersonality: SocialPersonality
  freeTimeActivities: string[]
}

// ---- Section 8: Getting to Know You / Marriage Expectations ----
export interface GettingToKnowYou {
  threeWordsDescription: string[]
  goodPartnerQualities: string[]
  areasOfGrowth: string[]
  areasOfGrowthOther?: string
  conflictResponse: string
  forgivenessImportance: ForgivenessImportance
  loveLanguages: string[]
  desiredMarriageValues: string[] // up to 5
  spouseAppreciationHope: string[]
  marriageReasons: string[]
  marriageTimeline: MarriageTimeline
  desireChildren: YesNoUnsure
  idealNumberOfChildren?: '1' | '2' | '3' | '4_plus' | 'open'
  locationPreference: string
  willingToRelocateInternationally: 'yes' | 'no' | 'maybe'
  faithImportance: 'very_important' | 'important' | 'somewhat_important' | 'open'
}

// ---- Section 9 / 10: Gender-specific questions ----
export interface MenSpecific {
  familyGoals: string[]
  husbandRoleAspects: string[]
  wifeCareerExpectation: string
  housingPlan: string
}

export interface WomenSpecific {
  priorityHusbandQualities: string[]
  wifeRoleAspects: string[]
  husbandCareerExpectation: string
  willingToRelocate: 'yes' | 'no' | 'maybe'
  familyLifeExpectationAspects: string[]
  feelLovedFactors: string[]
  conflictHandlingPreference: string
}

// ---- Section 11: Compatibility Preferences ----
export interface CompatibilityPreferences {
  ageRangeMin: number
  ageRangeMax: number
  countryPreference: string[]
  heightPreference?: string
  educationPreference?: string
  occupationPreference?: string
  churchPreference?: Denomination[]
  childrenPreference?: string
  languagePreference?: string[]
  familyValues?: string
}

// ---- Section 13: Health & Medical (chronic conditions / physical disabilities) ----
export type DailyLifeImpact = 'no' | 'mild' | 'moderate' | 'significant' | 'prefer_not_to_disclose'

export interface HealthMedical {
  chronicConditions: string[]
  chronicConditionOther?: string
  physicalDisabilities: string[]
  physicalDisabilityOther?: string
  /** 'no_condition' and/or 'prefer_not_to_disclose' — independent of the checklists above */
  disclosurePreference: string[]
  dailyLifeImpact?: DailyLifeImpact
  wantsToShareAdditionalInfo?: boolean
  additionalInfo?: string
}

// ---- Section 12: Safety declaration ----
export interface SafetyDeclaration {
  agreedToTruthfulness: boolean
  agreedAt?: string
  agreedToPrivacyPolicy?: boolean
}

export interface UserProfile {
  id: string
  personal: PersonalInfo
  church: ChurchInfo
  eligibility: MarriageEligibility
  family: FamilyBackground
  education: Education
  employment: Employment
  lifestyle: Lifestyle
  gettingToKnowYou: GettingToKnowYou
  menSpecific?: MenSpecific
  womenSpecific?: WomenSpecific
  compatibilityPreferences: CompatibilityPreferences
  safetyDeclaration: SafetyDeclaration
  health: HealthMedical
  verification: VerificationBadgeState
  compatibilityScore?: number
  createdAt: string
}
