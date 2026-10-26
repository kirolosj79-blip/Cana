export const denominationOptions = [
  { value: 'coptic_orthodox', en: 'Coptic Orthodox', ar: 'الأرثوذكسية القبطية' },
  { value: 'greek_orthodox', en: 'Greek Orthodox', ar: 'الأرثوذكسية اليونانية' },
  { value: 'armenian_orthodox', en: 'Armenian Orthodox', ar: 'الأرثوذكسية الأرمنية' },
  { value: 'syriac_orthodox', en: 'Syriac Orthodox', ar: 'الأرثوذكسية السريانية' },
  { value: 'ethiopian_orthodox', en: 'Ethiopian Orthodox', ar: 'الأرثوذكسية الإثيوبية' },
] as const

export const countryOptions = [
  { value: 'egypt', en: 'Egypt', ar: 'مصر' },
  { value: 'usa', en: 'United States', ar: 'الولايات المتحدة' },
  { value: 'canada', en: 'Canada', ar: 'كندا' },
  { value: 'other', en: 'Other', ar: 'أخرى' },
] as const

// Used specifically for "country of residence" — no "Other" here, since
// the whole rest of the flow (phone validation, diocese list, address
// format) only has real support for these three; a residence outside
// them isn't something the app can meaningfully handle yet.
export const residenceCountryOptions = countryOptions.filter((c) => c.value !== 'other')

export const attendanceOptions = [
  { value: 'regular', en: 'Regularly attending', ar: 'حضور منتظم' },
  { value: 'occasional', en: 'Occasionally attending', ar: 'حضور أحياناً' },
  { value: 'recent', en: 'Recently joined', ar: 'انضممت مؤخراً' },
] as const

export const educationLevelOptions = [
  { value: 'high_school', en: 'High school', ar: 'ثانوية عامة' },
  { value: 'diploma', en: 'Diploma', ar: 'دبلوم' },
  { value: 'bachelors', en: "Bachelor's", ar: 'بكالوريوس' },
  { value: 'masters', en: "Master's", ar: 'ماجستير' },
  { value: 'doctorate', en: 'Doctorate', ar: 'دكتوراه' },
] as const

export const employmentStatusOptions = [
  { value: 'full_time', en: 'Full-time', ar: 'دوام كامل' },
  { value: 'self_employed', en: 'Self-employed (Business Owner)', ar: 'صاحب عمل خاص' },
  { value: 'student', en: 'Student', ar: 'طالب' },
  { value: 'retired', en: 'Retired', ar: 'متقاعد' },
  { value: 'not_working', en: 'Not currently working', ar: 'لا يعمل حالياً' },
] as const

export const incomeRangesEgypt = ['Less than EGP 10,000', 'Between EGP 10,000 – 30,000', 'Between EGP 30,000 – 50,000', 'Between EGP 50,000 – 75,000', 'Above EGP 75,000']
export const incomeRangesUSA = ['Less than $2,000', 'Between $2,000 – 4,000', 'Between $4,000 – 6,000', 'Between $6,000 – 10,000', 'Above $10,000']

export const habitFrequencyOptions = [
  { value: 'never', en: 'Never', ar: 'أبداً' },
  { value: 'occasional', en: 'Occasionally', ar: 'أحياناً' },
  { value: 'regular', en: 'Regularly', ar: 'بانتظام' },
] as const

export const exerciseOptions = [
  { value: 'rarely', en: 'Rarely or never', ar: 'نادراً أو أبداً' },
  { value: 'weekly_1_2', en: '1–2 times a week', ar: '1-2 مرة أسبوعياً' },
  { value: 'weekly_3_5', en: '3–5 times a week', ar: '3-5 مرات أسبوعياً' },
  { value: 'daily', en: 'Almost every day', ar: 'كل يوم تقريباً' },
] as const

export const dietaryOptions = [
  { value: 'none', en: 'No specific preference', ar: 'لا يوجد تفضيل' },
  { value: 'vegetarian', en: 'Vegetarian', ar: 'نباتي' },
  { value: 'vegan', en: 'Vegan', ar: 'نباتي صرف' },
  { value: 'medical', en: 'Medical or allergy-related diet', ar: 'حمية طبية' },
  { value: 'other', en: 'Other', ar: 'أخرى' },
] as const

export const freeTimeOptions = [
  'Spending time with family', 'Church activities or volunteering', 'Reading', 'Sports or fitness',
  'Traveling', 'Movies or TV', 'Music', 'Outdoor activities', 'Cooking or baking', 'Arts and crafts',
  'Gaming', 'Learning new skills',
]

export const loveLanguageOptions = [
  'Spending quality time together', 'Words of encouragement and appreciation', 'Acts of kindness and service',
  'Thoughtful gifts', 'Physical affection (within the commitment of marriage)', "Supporting their goals and dreams",
]

export const marriageValuesOptions = [
  'Faith in God', 'Love and Respect', 'Honesty and Trust', 'Family Commitment', 'Kindness and Compassion',
  'Loyalty and Faithfulness', 'Good Communication', 'Forgiveness', 'Financial Responsibility',
  'Service to Others', 'Personal Growth', 'Education and Learning',
]

export const marriageReasonOptions = [
  'Building a Christ-centered family', 'Sharing life with a loving companion and partner',
  'Growing together spiritually, emotionally, and personally', 'Having and raising children',
  'Seeking a lifelong commitment and partnership',
]

export const timelineOptions = [
  { value: 'within_6_months', en: 'Within the next 6 months', ar: 'خلال 6 أشهر' },
  { value: 'within_1_year', en: 'Within 1 year', ar: 'خلال سنة' },
  { value: 'within_1_2_years', en: 'Within 1–2 years', ar: 'خلال 1-2 سنة' },
  { value: 'open', en: 'Open to the right timing', ar: 'مرن حسب الظروف' },
] as const

export const menFamilyGoalsOptions = ['Building a Christ-centered family', 'Creating a loving and supportive home', 'Providing stability and security', 'Growing together as a couple']
export const menCareerExpectationOptions = ['I support my wife working full-time', 'I support my wife working part-time', 'I prefer my wife to focus on the home and family', 'I am open to discussing what works best for both of us']
export const menPreparationOptions = ['Financial preparation', 'Emotional maturity', 'Spiritual growth', 'Relationship skills']

export const womenPriorityQualitiesOptions = [
  'A God-fearing man',
  'Responsible and committed',
  'Calm and composed',
  'Kind and affectionate',
  'Honest and clear',
  'Respects women',
  'Good at dialogue and communication',
  'Has a vision for his life',
  'Psychologically stable',
  'Financially stable',
  'Loves children',
  'Supportive and encouraging',
  'Has a leadership spirit',
  'Has a spirit of partnership',
  'Values family life',
]
export const womenFeelLovedOptions = ['Open and honest communication', 'Quality time together', 'Emotional support', 'Affection and appreciation', 'Faith and prayer together', 'Trust and commitment']

export const chronicConditionOptions = ['Diabetes', 'High blood pressure', 'Heart conditions', 'Autoimmune conditions', 'Genetic conditions', 'Other']
export const reproductiveConditionOptions = ['PCOS', 'Endometriosis', 'Fibroids', 'Other conditions']

export const languageLabel = (obj: { en: string; ar: string }, lang: 'en' | 'ar') => (lang === 'ar' ? obj.ar : obj.en)

// Egypt's 27 governorates, alphabetized (English order) — used as a
// dropdown instead of free text so later filtering/matching can't miss a
// profile because of a typo or inconsistent spelling.
export const egyptGovernorateOptions = [
  { en: 'Alexandria', ar: 'الإسكندرية' },
  { en: 'Aswan', ar: 'أسوان' },
  { en: 'Asyut', ar: 'أسيوط' },
  { en: 'Beheira', ar: 'البحيرة' },
  { en: 'Beni Suef', ar: 'بني سويف' },
  { en: 'Cairo', ar: 'القاهرة' },
  { en: 'Dakahlia', ar: 'الدقهلية' },
  { en: 'Damietta', ar: 'دمياط' },
  { en: 'Faiyum', ar: 'الفيوم' },
  { en: 'Gharbia', ar: 'الغربية' },
  { en: 'Giza', ar: 'الجيزة' },
  { en: 'Ismailia', ar: 'الإسماعيلية' },
  { en: 'Kafr El Sheikh', ar: 'كفر الشيخ' },
  { en: 'Luxor', ar: 'الأقصر' },
  { en: 'Matrouh', ar: 'مطروح' },
  { en: 'Minya', ar: 'المنيا' },
  { en: 'Monufia', ar: 'المنوفية' },
  { en: 'New Valley', ar: 'الوادي الجديد' },
  { en: 'North Sinai', ar: 'شمال سيناء' },
  { en: 'Port Said', ar: 'بورسعيد' },
  { en: 'Qalyubia', ar: 'القليوبية' },
  { en: 'Qena', ar: 'قنا' },
  { en: 'Red Sea', ar: 'البحر الأحمر' },
  { en: 'Sharqia', ar: 'الشرقية' },
  { en: 'Sohag', ar: 'سوهاج' },
  { en: 'South Sinai', ar: 'جنوب سيناء' },
  { en: 'Suez', ar: 'السويس' },
]

// Canada's 10 provinces + 3 territories, alphabetized.
export const canadaProvinceOptions = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
  'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
  'Quebec', 'Saskatchewan', 'Yukon',
]

export const usStateOptions = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida',
  'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska',
  'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas',
  'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia',
]

export const nationalityOptions = [
  { value: 'egyptian', en: 'Egyptian', ar: 'مصري' },
  { value: 'american', en: 'American', ar: 'أمريكي' },
  { value: 'canadian', en: 'Canadian', ar: 'كندي' },
  { value: 'other', en: 'Other', ar: 'أخرى' },
] as const

export const chronicMedicalConditionOptions = [
  { value: 'none', en: 'None', ar: 'لا يوجد' },
  { value: 'asthma_respiratory', en: 'Asthma or chronic respiratory condition', ar: 'ربو أو مرض تنفسي مزمن' },
  { value: 'diabetes', en: 'Diabetes', ar: 'السكري' },
  { value: 'hypertension', en: 'High blood pressure (Hypertension)', ar: 'ضغط الدم المرتفع' },
  { value: 'cardiovascular', en: 'Heart or cardiovascular condition', ar: 'مرض قلب أو أوعية دموية' },
  { value: 'kidney_disease', en: 'Kidney disease', ar: 'مرض كلى' },
  { value: 'liver_disease', en: 'Liver disease', ar: 'مرض كبد' },
  { value: 'gastrointestinal', en: 'Gastrointestinal/digestive disorder', ar: 'اضطراب هضمي' },
  { value: 'thyroid', en: 'Thyroid disorder', ar: 'اضطراب في الغدة الدرقية' },
  { value: 'neurological', en: 'Neurological condition', ar: 'حالة عصبية' },
  { value: 'epilepsy', en: 'Epilepsy/seizure disorder', ar: 'صرع أو نوبات تشنجية' },
  { value: 'autoimmune', en: 'Autoimmune disorder', ar: 'مرض مناعة ذاتية' },
  { value: 'arthritis', en: 'Arthritis or chronic joint condition', ar: 'التهاب مفاصل أو حالة مفصلية مزمنة' },
  { value: 'chronic_pain', en: 'Chronic pain condition', ar: 'حالة ألم مزمن' },
  { value: 'cancer', en: 'Cancer / history of cancer', ar: 'سرطان / تاريخ إصابة بسرطان' },
  { value: 'blood_disorder', en: 'Blood disorder', ar: 'اضطراب في الدم' },
  { value: 'genetic_hereditary', en: 'Genetic or hereditary condition', ar: 'حالة وراثية' },
  { value: 'chronic_infectious', en: 'Chronic infectious disease', ar: 'مرض معدي مزمن' },
  { value: 'mental_behavioral', en: 'Mental or behavioral health condition', ar: 'حالة نفسية أو سلوكية' },
  { value: 'other', en: 'Other chronic medical condition', ar: 'حالة مزمنة أخرى' },
] as const

export const physicalDisabilityOptions = [
  { value: 'none', en: 'None', ar: 'لا يوجد' },
  { value: 'mobility', en: 'Mobility/physical movement disability', ar: 'إعاقة حركية' },
  { value: 'wheelchair', en: 'Uses wheelchair', ar: 'يستخدم كرسي متحرك' },
  { value: 'prosthetic', en: 'Uses prosthetic limb', ar: 'يستخدم طرف صناعي' },
  { value: 'limb_loss', en: 'Limb or body-part loss', ar: 'فقدان طرف أو جزء من الجسم' },
  { value: 'vision_impairment', en: 'Significant vision impairment/blindness', ar: 'ضعف بصر شديد أو كفيف' },
  { value: 'hearing_impairment', en: 'Significant hearing impairment/deafness', ar: 'ضعف سمع شديد أو أصم' },
  { value: 'speech_disability', en: 'Speech or communication disability', ar: 'إعاقة في النطق أو التواصل' },
  { value: 'neuromuscular', en: 'Neuromuscular disability', ar: 'إعاقة عصبية عضلية' },
  { value: 'developmental', en: 'Developmental disability affecting daily activities', ar: 'إعاقة نمائية بتأثر على الأنشطة اليومية' },
  { value: 'other', en: 'Other physical disability', ar: 'إعاقة جسدية أخرى' },
] as const

export const personalityTraitOptions = [
  { en: 'Kind', arM: 'حنون', arF: 'حنونة' },
  { en: 'Calm', arM: 'هادي', arF: 'هادية' },
  { en: 'Social', arM: 'اجتماعي', arF: 'اجتماعية' },
  { en: 'Understanding', arM: 'متفهم', arF: 'متفهمة' },
  { en: 'Patient', arM: 'صبور', arF: 'صبورة' },
  { en: 'Ambitious', arM: 'طموح', arF: 'طموحة' },
  { en: 'Responsible', arM: 'مسؤول', arF: 'مسؤولة' },
  { en: 'Family-oriented', arM: 'عائلي', arF: 'عائلية' },
  { en: 'Loyal', arM: 'مخلص', arF: 'مخلصة' },
  { en: 'Frank', arM: 'صريح', arF: 'صريحة' },
  { en: 'Humble', arM: 'متواضع', arF: 'متواضعة' },
  { en: 'Cheerful', arM: 'مرح', arF: 'مرحة' },
  { en: 'Practical', arM: 'عملي', arF: 'عملية' },
  { en: 'Organized', arM: 'منظم', arF: 'منظمة' },
  { en: 'Confident', arM: 'واثق', arF: 'واثقة' },
  { en: 'Loves helping others', arM: 'محب للمساعدة', arF: 'محب للمساعدة' },
  { en: 'Loves learning', arM: 'محب للتعلم', arF: 'محب للتعلم' },
  { en: 'Loves quiet', arM: 'بيحب الهدوء', arF: 'بيحب الهدوء' },
  { en: 'Loves gatherings', arM: 'بيحب التجمعات', arF: 'بيحب التجمعات' },
  { en: 'Loves travel', arM: 'بيحب السفر', arF: 'بيحب السفر' },
  { en: 'Values family life', arM: 'بيقدر الحياة الأسرية', arF: 'بيقدر الحياة الأسرية' },
  { en: "Respects others' differences", arM: 'بيحترم اختلاف الآخرين', arF: 'بيحترم اختلاف الآخرين' },
  { en: 'A good listener', arM: 'بيعرف يسمع', arF: 'بيعرف يسمع' },
  { en: 'Cooperative', arM: 'متعاون', arF: 'متعاونة' },
  { en: 'Independent', arM: 'مستقل', arF: 'مستقلة' },
] as const

export const areasOfGrowthOptions = [
  { en: 'Patience', ar: 'الصبر' },
  { en: 'Communication', ar: 'التواصل' },
  { en: 'Managing my time better', ar: 'إدارة وقتي بشكل أفضل' },
  { en: 'Expressing my feelings', ar: 'التعبير عن مشاعري' },
  { en: 'Work-life balance', ar: 'التوازن بين الشغل والحياة' },
  { en: 'Trusting others', ar: 'الثقة في الآخرين' },
  { en: 'Letting go of past hurt', ar: 'تجاوز جروح الماضي' },
  { en: 'Financial discipline', ar: 'الانضباط المالي' },
  { en: 'Spiritual consistency', ar: 'الثبات الروحي' },
  { en: 'Other', ar: 'أخرى' },
] as const
