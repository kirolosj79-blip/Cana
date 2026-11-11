export interface Verse { en: string; ar: string; refEn: string; refAr: string }

/** Verses supplied by the CANA team (Love, Unity, Communication, Faith, Peace, Family, Patience, Joy). */
export const VERSES: Verse[] = [
  { en: 'Love is patient, love is kind.', ar: 'الْمَحَبَّةُ تَتَأَنَّى وَتَرْفُقُ.', refEn: '1 Corinthians 13:4', refAr: '١ كورنثوس ١٣: ٤' },
  { en: 'Love never fails.', ar: 'الْمَحَبَّةُ لاَ تَسْقُطُ أَبَدًا.', refEn: '1 Corinthians 13:8', refAr: '١ كورنثوس ١٣: ٨' },
  { en: 'Let all that you do be done in love.', ar: 'لِتَصِرْ كُلُّ أُمُورِكُمْ فِي مَحَبَّةٍ.', refEn: '1 Corinthians 16:14', refAr: '١ كورنثوس ١٦: ١٤' },
  { en: 'Above all, put on love.', ar: 'وَعَلَى جَمِيعِ هذِهِ الْبَسُوا الْمَحَبَّةَ.', refEn: 'Colossians 3:14', refAr: 'كولوسي ٣: ١٤' },
  { en: 'Remain in my love.', ar: 'اثْبُتُوا فِي مَحَبَّتِي.', refEn: 'John 15:9', refAr: 'يوحنا ١٥: ٩' },
  { en: 'The two shall become one flesh.', ar: 'وَيَكُونَانِ جَسَدًا وَاحِدًا.', refEn: 'Genesis 2:24', refAr: 'التكوين ٢: ٢٤' },
  { en: 'What God has joined together, let no one separate.', ar: 'فَالَّذِي جَمَعَهُ اللهُ لاَ يُفَرِّقْهُ إِنْسَانٌ.', refEn: 'Mark 10:9', refAr: 'مرقس ١٠: ٩' },
  { en: 'Two are better than one.', ar: 'اثْنَانِ خَيْرٌ مِنْ وَاحِدٍ.', refEn: 'Ecclesiastes 4:9', refAr: 'الجامعة ٤: ٩' },
  { en: 'A cord of three strands is not quickly broken.', ar: 'وَالْخَيْطُ الْمَثْلُوثُ لاَ يَنْقَطِعُ سَرِيعًا.', refEn: 'Ecclesiastes 4:12', refAr: 'الجامعة ٤: ١٢' },
  { en: 'Everyone should be quick to listen, slow to speak.', ar: 'لِيَكُنْ كُلُّ إِنْسَانٍ مُسْرِعًا فِي الاسْتِمَاعِ، مُبْطِئًا فِي التَّكَلُّمِ.', refEn: 'James 1:19', refAr: 'يعقوب ١: ١٩' },
  { en: 'Speak the truth in love.', ar: 'صَادِقِينَ فِي الْمَحَبَّةِ.', refEn: 'Ephesians 4:15', refAr: 'أفسس ٤: ١٥' },
  { en: 'Let your conversation be always full of grace.', ar: 'لِيَكُنْ كَلاَمُكُمْ كُلَّ حِينٍ بِنِعْمَةٍ.', refEn: 'Colossians 4:6', refAr: 'كولوسي ٤: ٦' },
  { en: 'Pray without ceasing.', ar: 'صَلُّوا بِلاَ انْقِطَاعٍ.', refEn: '1 Thessalonians 5:17', refAr: '١ تسالونيكي ٥: ١٧' },
  { en: 'As for me and my house, we will serve the Lord.', ar: 'أَمَّا أَنَا وَبَيْتِي فَنَعْبُدُ الرَّبَّ.', refEn: 'Joshua 24:15', refAr: 'يشوع ٢٤: ١٥' },
  { en: 'Trust in the Lord with all your heart.', ar: 'تَوَكَّلْ عَلَى الرَّبِّ بِكُلِّ قَلْبِكَ.', refEn: 'Proverbs 3:5', refAr: 'الأمثال ٣: ٥' },
  { en: 'With God all things are possible.', ar: 'عِنْدَ اللهِ كُلُّ شَيْءٍ مُسْتَطَاعٌ.', refEn: 'Matthew 19:26', refAr: 'متى ١٩: ٢٦' },
  { en: 'Forgive as the Lord forgave you.', ar: 'كَمَا غَفَرَ لَكُمُ الْمَسِيحُ هكَذَا أَنْتُمْ أَيْضًا.', refEn: 'Colossians 3:13', refAr: 'كولوسي ٣: ١٣' },
  { en: 'Be kind and compassionate to one another.', ar: 'كُونُوا لُطَفَاءَ بَعْضُكُمْ نَحْوَ بَعْضٍ، شَفُوقِينَ.', refEn: 'Ephesians 4:32', refAr: 'أفسس ٤: ٣٢' },
  { en: 'Bear with each other in love.', ar: 'مُحْتَمِلِينَ بَعْضُكُمْ بَعْضًا فِي الْمَحَبَّةِ.', refEn: 'Ephesians 4:2', refAr: 'أفسس ٤: ٢' },
  { en: 'Live in peace with each other.', ar: 'سَالِمُوا بَعْضُكُمْ بَعْضًا.', refEn: '1 Thessalonians 5:13', refAr: '١ تسالونيكي ٥: ١٣' },
  { en: 'Let the peace of Christ rule in your hearts.', ar: 'وَلْيَمْلِكْ فِي قُلُوبِكُمْ سَلاَمُ اللهِ.', refEn: 'Colossians 3:15', refAr: 'كولوسي ٣: ١٥' },
  { en: 'Blessed are the peacemakers.', ar: 'طُوبَى لِصَانِعِي السَّلاَمِ.', refEn: 'Matthew 5:9', refAr: 'متى ٥: ٩' },
  { en: 'Children are a heritage from the Lord.', ar: 'هُوَذَا الْبَنُونَ مِيرَاثٌ مِنْ عِنْدِ الرَّبِّ.', refEn: 'Psalm 127:3', refAr: 'المزمور ١٢٧: ٣' },
  { en: 'Honor your father and mother.', ar: 'أَكْرِمْ أَبَاكَ وَأُمَّكَ.', refEn: 'Exodus 20:12', refAr: 'الخروج ٢٠: ١٢' },
  { en: 'Husbands, love your wives.', ar: 'أَيُّهَا الرِّجَالُ، أَحِبُّوا نِسَاءَكُمْ.', refEn: 'Ephesians 5:25', refAr: 'أفسس ٥: ٢٥' },
  { en: 'Submit to one another.', ar: 'خَاضِعِينَ بَعْضُكُمْ لِبَعْضٍ فِي مَخَافَةِ اللهِ.', refEn: 'Ephesians 5:21', refAr: 'أفسس ٥: ٢١' },
  { en: 'Encourage one another.', ar: 'عَزُّوا بَعْضُكُمْ بَعْضًا.', refEn: '1 Thessalonians 5:11', refAr: '١ تسالونيكي ٥: ١١' },
  { en: "Carry each other's burdens.", ar: 'احْمِلُوا بَعْضُكُمْ أَثْقَالَ بَعْضٍ.', refEn: 'Galatians 6:2', refAr: 'غلاطية ٦: ٢' },
  { en: 'Give thanks in all circumstances.', ar: 'اشْكُرُوا فِي كُلِّ شَيْءٍ.', refEn: '1 Thessalonians 5:18', refAr: '١ تسالونيكي ٥: ١٨' },
  { en: 'Rejoice always.', ar: 'افْرَحُوا كُلَّ حِينٍ.', refEn: '1 Thessalonians 5:16', refAr: '١ تسالونيكي ٥: ١٦' },
  { en: 'The joy of the Lord is your strength.', ar: 'فَرَحُ الرَّبِّ هُوَ قُوَّتُكُمْ.', refEn: 'Nehemiah 8:10', refAr: 'نحميا ٨: ١٠' },
]

/** A different verse each day; `salt` keeps two banners on the same day from showing the same verse. */
export function verseOfDay(salt = 0): Verse {
  const day = Math.floor(Date.now() / 86_400_000)
  return VERSES[(day + salt * 7) % VERSES.length]
}
