import type { UserProfile } from '@/types/profile.types'
import { localizeCandidate } from '@/services/mock/candidates.ar'

// m1 grey shirt = Michael, m4 navy blazer = Mina, m3 green sweater = David, m2 white shirt = Peter
const PHOTOS: Record<string, string> = { c4: '/images/people/m1.jpg', c2: '/images/people/m4.jpg', c5: '/images/people/m3.jpg', c8: '/images/people/m2.jpg' }
const AVATAR = (seed: string) => `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=f6f1e8,eee6d5`

interface CandidateSeed {
  id: string
  name: string
  age: number
  gender: 'male' | 'female'
  city: string
  country: 'egypt' | 'usa' | 'canada'
  denomination: string
  denominationLabel: string
  occupation: string
  education: string
  timeline: string
  compatibility: number
  wantsChildren: string
  bio: string
  tags: string[]
  churchVerified: boolean
  identityVerified: boolean
  eligibilityVerified: boolean
  medicalVerified: boolean
  premium: boolean
  photos: number
}

const seeds: CandidateSeed[] = [
  { id: 'c1', name: 'Mariam Fahmy', age: 27, gender: 'female', city: 'New York, NY', country: 'usa', denomination: 'coptic_orthodox', denominationLabel: 'Coptic Orthodox', occupation: 'Pharmacist', education: "Master's Degree", timeline: 'Within 1 year', compatibility: 91, wantsChildren: 'Wants children', bio: 'I love serving in church, spending time with family, reading, and enjoying simple things in life. Looking for a God-fearing man who is kind, loyal, and ready to build a Christ-centered family.', tags: ['Church Involved', 'Family Oriented', 'Kindness', 'Prays Daily'], churchVerified: true, identityVerified: true, eligibilityVerified: true, medicalVerified: false, premium: true, photos: 8 },
  { id: 'c2', name: 'Mina Hanna', age: 29, gender: 'male', city: 'Cairo, Egypt', country: 'egypt', denomination: 'coptic_orthodox', denominationLabel: 'Coptic Orthodox', occupation: 'Cardiologist', education: 'Doctorate', timeline: 'Within 1 year', compatibility: 85, wantsChildren: 'Wants children', bio: 'St. Mark Coptic Church member. Looking for a God-fearing wife and life partner to build a home rooted in faith and mutual respect.', tags: ['Church Involved', 'Family Oriented', 'Reliable'], churchVerified: true, identityVerified: true, eligibilityVerified: true, medicalVerified: false, premium: false, photos: 6 },
  { id: 'c3', name: 'Maggie Ibrahim', age: 28, gender: 'female', city: 'New York, NY', country: 'usa', denomination: 'coptic_orthodox', denominationLabel: 'Coptic Orthodox', occupation: 'Pharmacist', education: "Bachelor's Degree", timeline: 'Within 6 months', compatibility: 88, wantsChildren: 'Open to discussion', bio: 'St. George Coptic Church. Looking for a God-fearing husband and life partner who values faith, honesty, and family.', tags: ['Faith in God', 'Honest', 'Warm'], churchVerified: true, identityVerified: true, eligibilityVerified: false, medicalVerified: false, premium: false, photos: 10 },
  { id: 'c4', name: 'Michael Youssef', age: 32, gender: 'male', city: 'Cairo, Egypt', country: 'egypt', denomination: 'coptic_orthodox', denominationLabel: 'Coptic Orthodox', occupation: 'Civil Engineer', education: "Master's Degree", timeline: 'Within 1 year', compatibility: 79, wantsChildren: 'Wants children', bio: 'St. Mary Coptic Church. Looking for a God-fearing wife and life partner to share a lifelong journey of faith.', tags: ['Financially Responsible', 'Faithful'], churchVerified: true, identityVerified: true, eligibilityVerified: true, medicalVerified: true, premium: true, photos: 5 },
  { id: 'c5', name: 'David Samir', age: 31, gender: 'male', city: 'Toronto, ON', country: 'canada', denomination: 'coptic_orthodox', denominationLabel: 'Coptic Orthodox', occupation: 'Systems Architect', education: "Bachelor's Degree", timeline: 'Within 1–2 years', compatibility: 82, wantsChildren: 'Wants children', bio: 'Serving at St. Antonious. Seeking a partner who shares a heart for family, service, and spiritual growth.', tags: ['Service to Others', 'Educated', 'Calm'], churchVerified: true, identityVerified: true, eligibilityVerified: true, medicalVerified: false, premium: false, photos: 7 },
  { id: 'c7', name: 'Sarah Kamel', age: 26, gender: 'female', city: 'Cairo, Egypt', country: 'egypt', denomination: 'coptic_orthodox', denominationLabel: 'Coptic Orthodox', occupation: 'Teacher', education: "Bachelor's Degree", timeline: 'Within 1 year', compatibility: 87, wantsChildren: 'Wants children', bio: 'Deeply rooted in faith and family. Looking for a partner who values tradition, kindness, and a shared spiritual life.', tags: ['Family Commitment', 'Faithful', 'Kind'], churchVerified: true, identityVerified: true, eligibilityVerified: true, medicalVerified: true, premium: true, photos: 9 },
  { id: 'c8', name: 'Peter Nassif', age: 33, gender: 'male', city: 'New Jersey, NJ', country: 'usa', denomination: 'coptic_orthodox', denominationLabel: 'Coptic Orthodox', occupation: 'Pharmacist', education: "Bachelor's Degree", timeline: 'Within 6 months', compatibility: 73, wantsChildren: 'Wants children', bio: 'Established and ready for marriage. Looking for a wife who shares the same values of faith and family commitment.', tags: ['Financially Stable', 'Family Oriented'], churchVerified: true, identityVerified: true, eligibilityVerified: true, medicalVerified: false, premium: false, photos: 5 },
  { id: 'c9', name: 'Marina Fouad', age: 25, gender: 'female', city: 'Alexandria, Egypt', country: 'egypt', denomination: 'coptic_orthodox', denominationLabel: 'Coptic Orthodox', occupation: 'Dentist', education: "Master's Degree", timeline: 'Within 1–2 years', compatibility: 90, wantsChildren: 'Wants children', bio: 'A woman of faith looking to build a loving home. Family, church, and lifelong companionship matter most to me.', tags: ['Faith in God', 'Educated', 'Warm-hearted'], churchVerified: true, identityVerified: true, eligibilityVerified: true, medicalVerified: true, premium: true, photos: 11 },
]

const rawCandidates: UserProfile[] = seeds.map((s) => ({
  id: s.id,
  personal: {
    firstName: s.name.split(' ')[0],
    middleName: '',
    lastName: s.name.split(' ')[1] ?? '',
    displayName: s.name,
    phone: '+1 000 000 0000',
    email: `${s.id}@example.com`,
    gender: s.gender,
    dateOfBirth: `${2026 - s.age}-01-01`,
    countryOfResidence: s.country,
    cityState: s.city,
    nationality: [s.country === 'egypt' ? 'Egyptian' : 'American'],
    languagesSpoken: ['Arabic', 'English'],
    profilePhotoUrl: PHOTOS[s.id] ?? AVATAR(s.id),
    galleryPhotoUrls: PHOTOS[s.id] ? [PHOTOS[s.id]] : Array.from({ length: Math.min(s.photos, 6) }, (_, i) => AVATAR(`${s.id}-${i}`)),
    governmentIdUploaded: s.identityVerified,
    bio: s.bio,
    heightCm: s.gender === 'male' ? 175 + (s.age % 7) : 163,
  },
  church: {
    denomination: s.denomination as any,
    churchName: `${s.denominationLabel} Parish`,
    diocese: `Diocese of ${s.city.split(',')[0]}`,
    churchAddress: s.city,
    yearsAttending: 10,
    attendanceLevel: 'regular',
    churchActivities: 'Choir, Sunday school teaching, community service',
    spiritualFatherName: 'Fr. Abanoub',
    spiritualFatherPhone: '+1 000 000 0000',
    spiritualFatherEmail: 'father@church.org',
    recommendationLetterUploaded: s.churchVerified,
  },
  eligibility: {
    everMarried: false,
    hasChildrenFromPrevious: false,
  },
  family: {
    fatherName: 'N/A',
    fatherOccupation: 'N/A',
    fatherLiving: true,
    motherName: 'N/A',
    motherOccupation: 'N/A',
    motherLiving: true,
    parentsMaritalStatus: 'married',
    numberOfBrothers: 1,
    numberOfSisters: 1,
    birthOrder: 'middle',
    familyInvolvementImportance: 'moderately_important',
    livesWith: 'Parents or family members',
  },
  education: {
    level: s.education.includes('Doctorate') ? 'doctorate' : s.education.includes('Master') ? 'masters' : 'bachelors',
    fieldOfStudy: s.occupation,
    institution: 'State University',
    yearGraduated: 2018,
    certifications: '',
    degreeCertificateUploaded: true,
  },
  employment: {
    status: 'full_time',
    occupation: s.occupation,
    employerName: '',
    yearsInCareer: 5,
    monthlyIncomeRange: s.country === 'egypt' ? 'Between EGP 30,000 – 50,000' : 'Between $ 4,000 – 6,000',
    proofUploaded: true,
  },
  lifestyle: {
    smoking: 'never',
    alcohol: 'never',
    exercise: 'weekly_3_5',
    dietaryPreference: 'none',
    petPreference: 'I like pets.',
    socialPersonality: 'balanced',
    freeTimeActivities: ['Church activities or volunteering', 'Spending time with family', 'Reading'],
  },
  gettingToKnowYou: {
    threeWordsDescription: ['Faithful', 'Warm-hearted', 'Loyal'],
    goodPartnerQualities: ['Patient', 'Supportive', 'A good listener'],
    areasOfGrowth: ['Patience'],
    conflictResponse: 'I prefer to talk things through calmly.',
    forgivenessImportance: 'essential',
    loveLanguages: ['Quality time together', 'Words of encouragement and appreciation'],
    desiredMarriageValues: ['Faith in God', 'Honesty and Trust', 'Family Commitment', 'Love and Respect'],
    spouseAppreciationHope: ['Faithful', 'Family-oriented'],
    marriageReasons: ['Building a Christ-centered family', 'Growing together spiritually, emotionally, and personally'],
    marriageTimeline: s.timeline.includes('6 months') ? 'within_6_months' : s.timeline.includes('1–2') ? 'within_1_2_years' : 'within_1_year',
    desireChildren: s.wantsChildren === 'Wants children' ? 'yes' : 'unsure',
    idealNumberOfChildren: '2',
    locationPreference: 'Open to relocation for marriage',
    willingToRelocateInternationally: 'maybe',
    faithImportance: 'very_important',
  },
  compatibilityPreferences: {
    ageRangeMin: s.age - 4,
    ageRangeMax: s.age + 4,
    countryPreference: ['egypt', 'usa', 'canada'],
    churchPreference: ['coptic_orthodox'],
  },
  safetyDeclaration: { agreedToTruthfulness: true, agreedAt: '2026-01-01' },
  health: {
    chronicConditions: ['none'],
    physicalDisabilities: ['none'],
    disclosurePreference: ['no_condition'],
  },
  verification: {
    identity: s.identityVerified ? 'verified' : 'pending',
    church: s.churchVerified ? 'verified' : 'pending',
    marriageEligibility: s.eligibilityVerified ? 'verified' : 'pending',
    medical: s.medicalVerified ? 'verified' : 'not_started',
    premium: s.premium,
  },
  compatibilityScore: s.compatibility,
  createdAt: '2026-06-01',
}))

export const getMockCandidates = (): UserProfile[] => rawCandidates.map(localizeCandidate)
export const findCandidate = (id: string) => getMockCandidates().find((c) => c.id === id)
