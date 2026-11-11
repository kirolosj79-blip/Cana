import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/shared/components/ui/Button'
import { PageContainer } from '@/shared/components/layout/PageContainer'
import { AnimatedLogo } from '@/shared/components/ui/AnimatedLogo'
import { cn } from '@/shared/utils/cn'
import { useLanguage } from '@/core/hooks/useLanguage'

const PARAGRAPHS_EN = [
  'Welcome to CANA — an application created with one simple and meaningful goal: to help Christian young men and women find a suitable life partner and build a family based on faith, shared values, and genuine compatibility.',
  'We created CANA because we understand a real challenge facing many Coptic young adults living in the United States and Canada. Finding the right person to marry can be difficult, especially when our communities are spread across different cities, states, and countries. Many young people would prefer to meet someone who shares their faith, culture, family values, and Coptic background.',
  'At the same time, there are many wonderful young men and women in Egypt who are also looking for a serious relationship leading to marriage. CANA is designed to help bring these two communities closer together in a respectful and meaningful way.',
  'For many families, this can become a beautiful win-win opportunity: helping young Copts in North America expand their chances of finding the right partner, while giving young people in Egypt the opportunity to meet someone who shares their faith, values, and hopes for the future. For some, it may even open the door to two dreams at the same time — the dream of building a happy Christian family and the dream of creating a new life in North America.',
  'CANA has been developed with the guidance and feedback of members of the Coptic community. Our questions, approach, and overall concept have been reviewed by priests who have expressed support for the values and purpose behind the application. However, priests generally do not publicly advertise or directly recommend individual marriage relationships because they do not want to become involved in personal marriage decisions.',
  'Ultimately, CANA does not choose your future spouse for you. Our role is simply to create a trusted environment where serious Christian men and women can meet, learn about each other, and decide for themselves whether there is a genuine foundation for a future together.',
  'We believe that marriage is much more than finding someone you like. It is about finding someone with whom you can share your faith, build a family, support one another, and grow together for life.',
  'Welcome to CANA — where faith, family, and the possibility of finding the right person come together.',
]

const PARAGRAPHS_AR = [
  'أهلًا بيك في CANA — تطبيق اتعمل بهدف واحد بسيط وله معنى: إننا نساعد الشباب والشابات المسيحيين يلاقوا شريك حياة مناسب، ويبنوا أسرة أساسها الإيمان، والقيم المشتركة، والتوافق الحقيقي.',
  'عملنا CANA لأننا فاهمين تحدي حقيقي بيواجه كتير من الشباب القبطي اللي عايش في أمريكا وكندا. لقاء الشخص المناسب للجواز ممكن يكون صعب، خصوصًا إن مجتمعاتنا موزعة على مدن وولايات ودول مختلفة. كتير من الشباب بيفضلوا يقابلوا حد بيشاركهم نفس الإيمان والثقافة والقيم الأسرية والأصول القبطية.',
  'وفي نفس الوقت، فيه شباب وشابات رائعين في مصر بيدوروا كمان على علاقة جادة تؤدي للجواز. CANA اتصمم عشان يساعد المجتمعين دول يقربوا من بعض بطريقة محترمة وذات معنى.',
  'وده ممكن يبقى فرصة جميلة لكل الأطراف: بيساعد الشباب القبطي في أمريكا الشمالية يوسّعوا فرصهم في إيجاد الشريك المناسب، وفي نفس الوقت بيدّي الشباب في مصر فرصة يقابلوا حد بيشاركهم نفس الإيمان والقيم والأحلام للمستقبل. وبالنسبة لبعض الناس، ده ممكن يفتح الباب لحلمين مع بعض في نفس الوقت — حلم بناء أسرة مسيحية سعيدة، وحلم بداية حياة جديدة في أمريكا الشمالية.',
  'CANA اتطور بتوجيه وآراء من أفراد المجتمع القبطي. أسئلتنا وأسلوبنا والفكرة كلها راجعها آباء كهنة عبّروا عن تأييدهم للقيم والهدف اللي وراء التطبيق. لكن عادةً الآباء الكهنة مش بيروّجوا علنًا أو يوصوا مباشرة بعلاقات جواز فردية، لأنهم مش عايزين يتدخلوا في قرارات الجواز الشخصية.',
  'في النهاية، CANA مش هو اللي هيختارلك شريك حياتك. دورنا ببساطة إننا نخلق بيئة موثوقة يقدر فيها الشباب والشابات المسيحيين الجادين يتقابلوا، ويتعرفوا على بعض، ويقرروا بنفسهم لو فيه أساس حقيقي لمستقبل مع بعض.',
  'إحنا مؤمنين إن الجواز أكتر بكتير من مجرد إنك تلاقي حد عاجبك. الموضوع عن إنك تلاقي حد تقدر تشاركه إيمانك، وتبني معاه أسرة، وتدعموا بعض، وتكبروا مع بعض طول العمر.',
  'أهلًا بيك في CANA — حيث يلتقي الإيمان والأسرة وفرصة إيجاد الشخص المناسب.',
]

export function WelcomeScreen() {
  const navigate = useNavigate()
  const { t, language } = useLanguage()
  const paragraphs = language === 'ar' ? PARAGRAPHS_AR : PARAGRAPHS_EN

  return (
    <PageContainer className="py-8" hideHearts>
      <div className="flex-1 flex flex-col items-center text-center gap-5 overflow-y-auto pb-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <AnimatedLogo size={72} className="shadow-[var(--shadow-soft-lg)]" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl font-medium text-ink-900"
        >
          {t('Welcome to CANA', 'أهلًا بيك في CANA')}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={cn(
            'w-full space-y-3.5 rounded-[var(--r-lg)] bg-parchment-0 border border-ink-100 px-5 py-5 shadow-[var(--shadow-soft-sm)]',
            language === 'ar' ? 'text-right' : 'text-left'
          )}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          {paragraphs.map((p, i) => (
            <p key={i} className="text-sm text-ink-600 leading-relaxed">
              {p}
            </p>
          ))}
        </motion.div>
      </div>

      <div className="space-y-3 pt-4">
        <Button variant="gold" size="lg" className="w-full" onClick={() => navigate('/phone-auth')}>
          {t('Continue', 'كمّل')}
        </Button>
        <button type="button" onClick={() => navigate('/phone-auth', { state: { mode: 'login' } })} className="w-full text-center text-sm text-ink-500 py-1">
          {t('Already have an account?', 'عندك حساب بالفعل؟')} <span className="text-gold-600 font-semibold">{t('Log In', 'سجّل دخول')}</span>
        </button>
      </div>
    </PageContainer>
  )
}
