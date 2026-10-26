import { useState } from 'react'
import { toOptionalNumber } from '@/shared/utils/number'
import { useRegistrationStore } from '@/store/registration.store'
import { Input } from '@/shared/components/ui/Input'
import { Select } from '@/shared/components/ui/Select'
import { ChoiceGroup } from '@/shared/components/ui/ChoiceGroup'
import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { denominationOptions } from '@/features/registration/data/options'
import { egyptDioceseOptions, usaDioceseOptions, canadaDioceseOptions } from '@/features/registration/data/dioceses'
import { usStateOptions, canadaProvinceOptions, egyptGovernorateOptions } from '@/features/registration/data/options'
import { sortBilingual } from '@/shared/utils/sortBilingual'
import { countryDialCode, isValidPhoneForCountry } from '@/shared/utils/phone'
import { useLanguage } from '@/core/hooks/useLanguage'
import { FieldVisibilityToggle } from '@/shared/components/ui/FieldVisibilityToggle'
import { HelpCircle, Download, FileText } from 'lucide-react'
import { QuestionCard } from '@/shared/components/ui/QuestionCard'
import { DocumentUploadCard } from '@/shared/components/ui/DocumentUploadCard'
import { EmailField } from '@/shared/components/ui/EmailField'

const TEMPLATE_EN = `CHURCH VERIFICATION & MARRIAGE RECOMMENDATION LETTER

[Church Name]
[Church Address]
[City, State, ZIP Code]
Phone: [Church Phone]
Email: [Church Email]
Date: [Month Day, Year]

To Whom It May Concern:

This letter is to confirm that [Full Legal Name], date of birth [Date of Birth], is known to and/or is a member of [Church Name].

Based on the information available to the church and our records, we confirm the following:

• The individual is known to our church and is in good standing, to the best of our knowledge.
• The personal and church-related information provided by the individual is consistent with the information available to the church, to the best of our knowledge.
• According to our records and information available to us, the individual has not previously entered into a marriage, [or: has the following marital history: __________].
• To the best of our knowledge, there is no known church-related impediment to this individual pursuing marriage at the time this letter is issued.
• The individual is currently seeking marriage and has requested this letter for the purpose of participating in the CANA Christian Marriage Application.

This letter is provided at the individual's request for verification purposes. It represents the information known to the church at the time of issuance and should not be interpreted as a guarantee of the individual's character, future conduct, compatibility with another person, or outcome of any future relationship or marriage.

If additional verification is required, the church may be contacted using the information provided above.

Sincerely,
[Priest's Full Name]
[Priest's Title]
[Church Name]

Signature: ______________________________
Church Seal/Stamp: ______________________
Date: ___________________________________`

const TEMPLATE_AR = `خطاب إثبات الأهلية للزواج والتحقق من البيانات

اسم الكنيسة: [.......................]
العنوان: [.......................]
المدينة / الولاية / الرمز البريدي: [.......................]
التليفون: [.......................]
البريد الإلكتروني: [.......................]
التاريخ: [.... / .... / ....]

إلى من يهمه الأمر،

تشهد كنيسة [اسم الكنيسة] بأن السيد/السيدة [الاسم الكامل]، مواليد [تاريخ الميلاد]، معروف/ة لدى الكنيسة و/أو من أبنائها.

وبناءً على المعلومات المتاحة لدى الكنيسة والسجلات الموجودة لدينا، نؤكد الآتي:

• أن المذكور/ة معروف/ة لدى الكنيسة ويتمتع/تتمتع بحسن السير الكنسي، في حدود ما هو معلوم لدينا.
• أن البيانات الشخصية والبيانات المتعلقة بالكنيسة التي قدمها/قدمتها المذكور/ة تتوافق، في حدود علمنا، مع المعلومات المتاحة لدى الكنيسة.
• وفقًا لسجلات الكنيسة والمعلومات المتاحة لدينا، فإن المذكور/ة لم يسبق له/لها الزواج، [أو: لديه/لديها تاريخ زواج سابق على النحو التالي: .......................].
• وفقًا لما هو معلوم لدينا في تاريخ إصدار هذا الخطاب، لا يوجد مانع كنسي معروف يحول دون سعي المذكور/ة للزواج.
• وقد تم إصدار هذا الخطاب بناءً على طلب المذكور/ة بغرض استكمال إجراءات التسجيل في تطبيق CANA للزواج المسيحي.

وقد تم إصدار هذا الخطاب بناءً على المعلومات المتاحة لدى الكنيسة وقت إصداره، ولا يُعد هذا الخطاب ضمانًا لشخصية المذكور/ة أو سلوكه/سلوكها المستقبلي أو مدى التوافق مع أي شخص آخر أو نجاح أي علاقة أو زواج مستقبلي.

ولمزيد من التحقق أو الاستفسار، يمكن التواصل مع الكنيسة من خلال بيانات الاتصال الموضحة أعلاه.

وتفضلوا بقبول فائق الاحترام،

اسم الأب/الكاهن: [.......................]
الصفة: [.......................]
اسم الكنيسة: [.......................]

التوقيع: ______________________________
خاتم الكنيسة: _________________________
التاريخ: ______________________________`

export function ChurchStep() {
  const { draft, updateSection } = useRegistrationStore()
  const c = draft.church
  const set = (data: Partial<typeof c>) => updateSection('church', data)
  const isFemale = draft.gender === 'female'
  const { language, t } = useLanguage()
  const [templateOpen, setTemplateOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="rounded-[var(--radius-lg)] bg-gold-50 border border-gold-200 px-4 py-3 text-xs text-gold-700">
        {t("This section is the most important — it's the basis for church-approved marriage.", 'القسم ده أهم حاجة — هو أساس موافقة الكنيسة على الجواز.')}
      </div>

      <QuestionCard question={t('What is your Christian denomination?', 'إيه طائفتك المسيحية؟')} labelExtra={<FieldVisibilityToggle fieldKey="church.denomination" />}>
        <ChoiceGroup
          value={c.denomination ?? ''}
          onChange={(v) => set({ denomination: v })}
          options={denominationOptions.map((d) => ({ value: d.value, label: language === 'ar' ? d.ar : d.en }))}
        />
      </QuestionCard>

      <QuestionCard question={t('Name of your church / parish', 'اسم كنيستك')} labelExtra={<FieldVisibilityToggle fieldKey="church.churchName" />}>
        <Input value={c.churchName ?? ''} onChange={(e) => set({ churchName: e.target.value })} />
      </QuestionCard>

      <QuestionCard question={t('Diocese', 'الإيبارشية')}>
        <Select value={c.diocese ?? ''} onChange={(e) => set({ diocese: e.target.value })} placeholder={t('Select diocese', 'اختار الإيبارشية')}>
          {sortBilingual(
            draft.personal.countryOfResidence === 'usa'
              ? usaDioceseOptions
              : draft.personal.countryOfResidence === 'canada'
              ? canadaDioceseOptions
              : egyptDioceseOptions,
            language
          ).map((d) => (
            <option key={d.en} value={d.en}>
              {language === 'ar' ? d.ar : d.en}
            </option>
          ))}
        </Select>
      </QuestionCard>

      <QuestionCard question={t('Church address', 'عنوان الكنيسة')}>
        <div className="space-y-2.5">
          <Input placeholder={t('Address details (street, area, landmark)', 'تفاصيل العنوان (الشارع، المنطقة، علامة مميزة)')} value={c.churchAddressStreet ?? ''} onChange={(e) => set({ churchAddressStreet: e.target.value })} />
          <div className="grid grid-cols-2 gap-2.5">
            <Input placeholder={t('Floor number (optional)', 'رقم الدور (اختياري)')} optional value={c.churchAddressFloor ?? ''} onChange={(e) => set({ churchAddressFloor: e.target.value })} />
            <Input placeholder={t('Apartment / Unit number (optional)', 'رقم الشقة/الوحدة (اختياري)')} optional value={c.churchAddressUnit ?? ''} onChange={(e) => set({ churchAddressUnit: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Input placeholder={t('City', 'المدينة')} value={c.churchAddressCity ?? ''} onChange={(e) => set({ churchAddressCity: e.target.value })} />
            {draft.personal.countryOfResidence === 'usa' ? (
              <Select value={c.churchAddressState ?? ''} onChange={(e) => set({ churchAddressState: e.target.value })} placeholder={t('State', 'الولاية')}>
                {usStateOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            ) : draft.personal.countryOfResidence === 'canada' ? (
              <Select value={c.churchAddressState ?? ''} onChange={(e) => set({ churchAddressState: e.target.value })} placeholder={t('Province', 'المقاطعة')}>
                {canadaProvinceOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            ) : (
              <Select value={c.churchAddressState ?? ''} onChange={(e) => set({ churchAddressState: e.target.value })} placeholder={t('Governorate', 'المحافظة')}>
                {sortBilingual(egyptGovernorateOptions, language).map((g) => (
                  <option key={g.en} value={g.en}>
                    {language === 'ar' ? g.ar : g.en}
                  </option>
                ))}
              </Select>
            )}
          </div>
          <Input placeholder={t('ZIP / Postal code', 'الرمز البريدي')} value={c.churchAddressZip ?? ''} onChange={(e) => set({ churchAddressZip: e.target.value })} />
          <div className="h-12 w-full flex items-center rounded-[var(--radius-md)] border border-ink-100 bg-ink-50 px-4 text-[15px] text-ink-600">
            {draft.personal.countryOfResidence === 'usa'
              ? t('United States', 'الولايات المتحدة')
              : draft.personal.countryOfResidence === 'canada'
              ? t('Canada', 'كندا')
              : t('Egypt', 'مصر')}
          </div>
        </div>
      </QuestionCard>

      <QuestionCard question={t('Church website or Facebook page', 'موقع الكنيسة أو صفحة الفيسبوك')} labelExtra={<span className="text-xs field-hint">{t('Optional', 'اختياري')}</span>}>
        <Input placeholder="https://..." value={c.churchWebsite ?? ''} onChange={(e) => set({ churchWebsite: e.target.value })} dir="ltr" />
      </QuestionCard>

      <QuestionCard question={t('How long have you been attending this church?', `من امتى وانت بت${isFemale ? 'ترددي' : 'تردد'} على الكنيسة دي؟`)}>
        <Input type="number" placeholder={t('Years', 'سنين')} value={c.yearsAttending ?? ''} onChange={(e) => set({ yearsAttending: toOptionalNumber(e.target.value) })} />
      </QuestionCard>

      <QuestionCard question={t('What is the name of your spiritual father / priest?', 'إيه اسم أب اعترافك؟')}>
        <Input value={c.spiritualFatherName ?? ''} onChange={(e) => set({ spiritualFatherName: e.target.value })} />
      </QuestionCard>

      <QuestionCard question={t("Your priest's cellphone", 'رقم موبايل أب اعترافك')}>
        <Input
          type="tel"
          hint={countryDialCode(draft.personal.countryOfResidence) ? t(`Starts with ${countryDialCode(draft.personal.countryOfResidence)}`, `يبدأ بـ ${countryDialCode(draft.personal.countryOfResidence)}`) : undefined}
          value={c.spiritualFatherPhone ?? ''}
          onChange={(e) => set({ spiritualFatherPhone: e.target.value.replace(/\D/g, '') })}
          error={
            c.spiritualFatherPhone && !isValidPhoneForCountry(draft.personal.countryOfResidence, c.spiritualFatherPhone)
              ? t('Please enter a valid phone number', 'اكتب رقم موبايل صحيح')
              : undefined
          }
        />
      </QuestionCard>

      <QuestionCard question={t("Priest's email", 'إيميل الكاهن')}>
        <EmailField optional value={c.churchEmail ?? ''} onChange={(v) => set({ churchEmail: v })} />
      </QuestionCard>

      <DocumentUploadCard
        icon={<FileText size={18} />}
        title={t("Priest's Letter", 'خطاب الكاهن')}
        subtitle={t('Upload PDF or Image', 'ارفع PDF أو صورة')}
        defaultUploaded={c.recommendationLetterUploaded}
        onUploaded={(v) => set({ recommendationLetterUploaded: v })}
      />
      <div className="flex items-center justify-between px-1 -mt-1.5">
        <span className="text-xs field-hint">{t('Optional', 'اختياري')}</span>
        <button
          type="button"
          onClick={() => setTemplateOpen(true)}
          className="flex items-center gap-1.5 text-xs font-bold text-emphasis-text underline"
        >
          <HelpCircle size={13} /> {t('View a letter template to give your priest', 'شوف نموذج الخطاب تديه لأب اعترافك')}
        </button>
      </div>

      <Modal open={templateOpen} onClose={() => setTemplateOpen(false)} title={t('Letter Template', 'نموذج الخطاب')}>
        <p className="text-xs text-ink-500 mb-3">
          {t(
            'Share this template with your priest or church office to prepare your letter.',
            'شارك النموذج ده مع أب اعترافك أو مكتب الكنيسة عشان يجهزوا الخطاب.'
          )}
        </p>
        <pre className="whitespace-pre-wrap text-[11px] leading-relaxed text-ink-700 bg-ink-50 rounded-[var(--radius-md)] p-3 max-h-72 overflow-y-auto" dir="ltr">
          {TEMPLATE_EN}
        </pre>
        <pre className="whitespace-pre-wrap text-[11px] leading-relaxed text-ink-700 bg-ink-50 rounded-[var(--radius-md)] p-3 max-h-72 overflow-y-auto mt-3" dir="rtl">
          {TEMPLATE_AR}
        </pre>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3"
          onClick={() => {
            navigator.clipboard?.writeText(language === 'ar' ? TEMPLATE_AR : TEMPLATE_EN).catch(() => {})
          }}
        >
          {t('Copy Template', 'نسخ النموذج')}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => {
            const text = language === 'ar' ? TEMPLATE_AR : TEMPLATE_EN
            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = language === 'ar' ? 'نموذج-خطاب-الكنيسة.txt' : 'church-letter-template.txt'
            a.click()
            URL.revokeObjectURL(url)
          }}
        >
          <Download size={14} /> {t('Download Template', 'تحميل النموذج')}
        </Button>
      </Modal>
    </div>
  )
}
