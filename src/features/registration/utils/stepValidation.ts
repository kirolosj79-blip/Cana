import type { RegistrationDraft } from '@/store/registration.store'
import { isValidPhoneForCountry } from '@/shared/utils/phone'
import { isValidEmail } from '@/shared/utils/email'
import { isPast20thBirthday } from '@/shared/utils/age'

/**
 * Returns whether the current step's required fields are all filled in.
 * Used to disable the Continue button until the page is complete — per the
 * "every question is required, the button stays disabled until everything
 * is filled" instruction. Deliberately checks the fields that are actually
 * still present in each step's UI (several were removed per review).
 */
export function isStepValid(stepKey: string, draft: RegistrationDraft): boolean {
  const filled = (v: unknown) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0)

  switch (stepKey) {
    case 'personal': {
      const p = draft.personal
      const nationalityOk = filled(p.nationality?.[0]) && (p.nationality?.[0] !== 'other' || filled(p.nationalityOtherOriginal))
      const stateOk = !['usa', 'canada', 'egypt'].includes(p.countryOfResidence ?? '') || filled(p.usState)
      const ageOk = filled(p.dateOfBirth) && isPast20thBirthday(p.dateOfBirth ?? '')
      return (
        filled(p.firstName) &&
        filled(p.middleName) &&
        filled(p.lastName) &&
        filled(p.email) &&
        isValidEmail(p.email ?? '') &&
        filled(draft.gender) &&
        ageOk &&
        filled(p.countryOfResidence) &&
        filled(p.cityState) &&
        stateOk &&
        nationalityOk &&
        filled(p.languagesSpoken) &&
        (p.weightKg ?? 0) >= 46 &&
        (p.heightCm ?? 0) >= 100 &&
        !!p.profilePhotoUrl &&
        !!p.governmentIdUploaded
      )
    }
    case 'church': {
      const c = draft.church
      // The Church step now always shows the structured mailing address
      // (name/street/city/state/zip/country) regardless of country.
      const addressOk = filled(c.churchAddressStreet) && filled(c.churchAddressCity) && filled(c.churchAddressState) && filled(c.churchAddressZip)
      return (
        filled(c.denomination) &&
        filled(c.churchName) &&
        addressOk &&
        filled(c.yearsAttending) &&
        filled(c.spiritualFatherName) &&
        isValidPhoneForCountry(draft.personal.countryOfResidence, c.spiritualFatherPhone ?? '') &&
        (!c.churchEmail || isValidEmail(c.churchEmail))
      )
    }
    case 'eligibility': {
      const e = draft.eligibility
      if (e.everMarried === undefined) return false
      if (!e.everMarried) return true
      return filled(e.previousMarriage?.date) && filled(e.previousMarriage?.type) && filled(e.currentMaritalStatus) && e.hasChildrenFromPrevious !== undefined
    }
    case 'family': {
      const f = draft.family
      return (
        filled(f.fatherName) &&
        filled(f.fatherOccupation) &&
        f.fatherLiving !== undefined &&
        filled(f.motherName) &&
        filled(f.motherOccupation) &&
        f.motherLiving !== undefined &&
        filled(f.parentsMaritalStatus) &&
        filled(f.numberOfBrothers) &&
        filled(f.numberOfSisters) &&
        filled(f.birthOrder) &&
        filled(f.livesWith)
      )
    }
    case 'education': {
      const ed = draft.education
      const yearOk = ed.yearGraduated !== undefined && ed.yearGraduated >= 1950 && ed.yearGraduated <= new Date().getFullYear()
      const fieldOk = filled(ed.fieldOfStudy) && (ed.fieldOfStudy !== 'Other' || filled(ed.fieldOfStudyOther))
      const institutionOk = filled(ed.institution) && (ed.institution !== 'Other' || filled(ed.institutionOther))
      return filled(ed.level) && fieldOk && institutionOk && yearOk
    }
    case 'employment': {
      const em = draft.employment
      return filled(em.occupation) && filled(em.yearsInCareer) && filled(em.workArrangement) && filled(em.monthlyIncomeRange)
    }
    case 'lifestyle': {
      const l = draft.lifestyle
      return filled(l.smoking) && filled(l.alcohol) && filled(l.petPreference) && filled(l.socialPersonality) && filled(l.freeTimeActivities)
    }
    case 'gettingToKnowYou': {
      const g = draft.gettingToKnowYou
      const childrenOk = g.desireChildren !== 'yes' || filled(g.idealNumberOfChildren)
      return (
        filled(g.threeWordsDescription) &&
        filled(g.goodPartnerQualities) &&
        filled(g.areasOfGrowth) &&
        filled(g.loveLanguages) &&
        filled(g.marriageTimeline) &&
        filled(g.desireChildren) &&
        childrenOk &&
        filled(g.locationPreference) &&
        filled(g.willingToRelocateInternationally)
      )
    }
    case 'genderSpecific': {
      if (draft.gender === 'female') {
        const w = draft.womenSpecific ?? {}
        return (
          filled(w.priorityHusbandQualities) &&
          filled(w.wifeRoleAspects) &&
          filled(w.husbandCareerExpectation) &&
          filled(w.willingToRelocate) &&
          filled(w.familyLifeExpectationAspects) &&
          filled(w.feelLovedFactors) &&
          filled(w.conflictHandlingPreference)
        )
      }
      const m = draft.menSpecific ?? {}
      return filled(m.familyGoals) && filled(m.wifeCareerExpectation) && filled(m.housingPlan)
    }
    case 'compatibility': {
      const c = draft.compatibilityPreferences
      return (
        filled(c.ageRangeMin) &&
        filled(c.ageRangeMax) &&
        (c.ageRangeMin ?? 0) >= 20 &&
        (c.ageRangeMax ?? 0) >= 20 &&
        (c.ageRangeMin ?? 0) <= (c.ageRangeMax ?? 0) &&
        filled(c.countryPreference) &&
        filled(c.heightPreference) &&
        filled(c.educationPreference) &&
        filled(c.occupationPreference) &&
        filled(c.churchPreference) &&
        filled(c.childrenPreference) &&
        filled(c.languagePreference)
      )
    }
    case 'safety':
      return draft.safetyDeclaration.agreedToTruthfulness === true && draft.safetyDeclaration.agreedToPrivacyPolicy === true
    case 'health': {
      const h = draft.health
      return filled(h.chronicConditions) && filled(h.physicalDisabilities) && filled(h.dailyLifeImpact)
    }
    case 'review':
      return true
    default:
      return true
  }
}
