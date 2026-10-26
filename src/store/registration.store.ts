import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  PersonalInfo, ChurchInfo, MarriageEligibility, FamilyBackground, Education, Employment,
  Lifestyle, GettingToKnowYou, MenSpecific, WomenSpecific, CompatibilityPreferences,
  SafetyDeclaration, HealthMedical, Gender,
} from '@/types/profile.types'

export const REGISTRATION_STEPS = [
  { key: 'personal', labelEn: 'Personal Information', labelAr: 'المعلومات الشخصية' },
  { key: 'church', labelEn: 'Church & Faith Verification', labelAr: 'التحقق الكنسي والإيماني' },
  { key: 'eligibility', labelEn: 'Marriage Eligibility', labelAr: 'أهلية الزواج' },
  { key: 'family', labelEn: 'Family Background', labelAr: 'الخلفية العائلية' },
  { key: 'education', labelEn: 'Education', labelAr: 'التعليم' },
  { key: 'employment', labelEn: 'Employment & Financial Stability', labelAr: 'الوظيفة والاستقرار المالي' },
  { key: 'lifestyle', labelEn: 'Lifestyle & Personal Habits', labelAr: 'نمط الحياة والعادات' },
  { key: 'gettingToKnowYou', labelEn: 'Getting to Know You', labelAr: 'تعرف عليك أكثر' },
  { key: 'genderSpecific', labelEn: 'For Men / For Women', labelAr: 'أسئلة خاصة' },
  { key: 'compatibility', labelEn: 'Compatibility Preferences', labelAr: 'تفضيلات التوافق' },
  { key: 'safety', labelEn: 'Safety & Integrity Declaration', labelAr: 'إقرار السلامة والنزاهة' },
  { key: 'health', labelEn: 'Health & Medical Information', labelAr: 'المعلومات الصحية والطبية' },
  { key: 'review', labelEn: 'Review & Submit', labelAr: 'مراجعة وإرسال' },
] as const

export type RegistrationStepKey = (typeof REGISTRATION_STEPS)[number]['key']

export interface RegistrationDraft {
  gender?: Gender
  personal: Partial<PersonalInfo>
  church: Partial<ChurchInfo>
  eligibility: Partial<MarriageEligibility>
  family: Partial<FamilyBackground>
  education: Partial<Education>
  employment: Partial<Employment>
  lifestyle: Partial<Lifestyle>
  gettingToKnowYou: Partial<GettingToKnowYou>
  menSpecific: Partial<MenSpecific>
  womenSpecific: Partial<WomenSpecific>
  compatibilityPreferences: Partial<CompatibilityPreferences>
  safetyDeclaration: Partial<SafetyDeclaration>
  health: Partial<HealthMedical>
}

interface RegistrationState {
  currentStepIndex: number
  completedSteps: RegistrationStepKey[]
  draft: RegistrationDraft
  lastSavedAt: string | null
  /** Set when jumping to a step to edit it from Review/Checklist — lets the
   *  wizard's back/continue buttons return here instead of just stepping
   *  sequentially, so "edit one field" doesn't strand the user somewhere
   *  unexpected. */
  editReturnIndex: number | null
  setStep: (index: number) => void
  jumpToStepForEdit: (index: number) => void
  clearEditReturn: () => void
  nextStep: () => void
  prevStep: () => void
  updateSection: <K extends keyof RegistrationDraft>(section: K, data: RegistrationDraft[K]) => void
  setGender: (gender: Gender) => void
  markStepComplete: (key: RegistrationStepKey) => void
  saveDraft: () => void
  resetRegistration: () => void
}

const emptyDraft: RegistrationDraft = {
  personal: {}, church: {}, eligibility: {}, family: {}, education: {}, employment: {},
  lifestyle: {}, gettingToKnowYou: {}, menSpecific: {}, womenSpecific: {},
  compatibilityPreferences: {}, safetyDeclaration: {}, health: {},
}

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set, get) => ({
      currentStepIndex: 0,
      completedSteps: [],
      draft: emptyDraft,
      lastSavedAt: null,
      editReturnIndex: null,
      setStep: (index) => set({ currentStepIndex: Math.max(0, Math.min(index, REGISTRATION_STEPS.length - 1)) }),
      jumpToStepForEdit: (index) =>
        set((s) => ({
          editReturnIndex: s.currentStepIndex,
          currentStepIndex: Math.max(0, Math.min(index, REGISTRATION_STEPS.length - 1)),
        })),
      clearEditReturn: () => set({ editReturnIndex: null }),
      nextStep: () => {
        const { currentStepIndex } = get()
        set({ currentStepIndex: Math.min(currentStepIndex + 1, REGISTRATION_STEPS.length - 1) })
        get().saveDraft()
      },
      prevStep: () => set((s) => ({ currentStepIndex: Math.max(s.currentStepIndex - 1, 0) })),
      updateSection: (section, data) =>
        set((s) => ({ draft: { ...s.draft, [section]: { ...(s.draft[section] as object), ...(data as object) } } })),
      setGender: (gender) => set((s) => ({ draft: { ...s.draft, gender } })),
      markStepComplete: (key) =>
        set((s) => ({ completedSteps: s.completedSteps.includes(key) ? s.completedSteps : [...s.completedSteps, key] })),
      saveDraft: () => set({ lastSavedAt: new Date().toISOString() }),
      resetRegistration: () => set({ currentStepIndex: 0, completedSteps: [], draft: emptyDraft, lastSavedAt: null }),
    }),
    { name: 'koinonia-registration-draft' }
  )
)
