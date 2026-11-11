import type { AppNotification, ComplaintCategory } from '@/types/app.types'

export const mockNotifications: AppNotification[] = [
  { id: 'n1', type: 'new_match', title: 'ترشيح جديد ليك', body: 'ماريام فهمي، 27 سنة، بتتوافق معاك 91%.', createdAt: '2026-08-03T08:00:00Z', read: false, relatedUserId: 'c1' },
  { id: 'n2', type: 'request_received', title: 'طلب ارتباط جديد', body: 'مينا حنا عايز يرتبط بيك.', createdAt: '2026-08-02T18:20:00Z', read: false, relatedUserId: 'c2' },
  { id: 'n3', type: 'request_accepted', title: 'تم قبول طلبك', body: 'ماجي إبراهيم وافقت على طلب الارتباط.', createdAt: '2026-08-02T09:15:00Z', read: true, relatedUserId: 'c3' },
  { id: 'n4', type: 'verification_update', title: 'تم قبول توثيق الكنيسة', body: 'خطاب توصية كنيستك اتوثق بنجاح.', createdAt: '2026-08-01T14:00:00Z', read: true },
  { id: 'n5', type: 'message_unlocked', title: 'بيانات التواصل اتفتحت', body: 'إنت ومايكل يوسف بقيتوا تقدروا تشوفوا بيانات التواصل بتاعت بعض.', createdAt: '2026-07-30T11:40:00Z', read: true, relatedUserId: 'c4' },
  { id: 'n6', type: 'payment_update', title: 'تجديد العضوية', body: 'عضويتك اتجددت بنجاح.', createdAt: '2026-07-28T10:00:00Z', read: true },
  { id: 'n7', type: 'system', title: 'كمّل بياناتك', body: 'الأعضاء اللي كمّلوا بياناتهم الصحية بيوصلهم ترشيحات أكتر بـ 30%.', createdAt: '2026-07-25T09:00:00Z', read: true },
]

export const complaintCategoryLabels: Record<ComplaintCategory, { en: string; ar: string }> = {
  fake_profile: { en: 'Fake profile', ar: 'حساب وهمي' },
  inappropriate_behavior: { en: 'Inappropriate behavior', ar: 'سلوك غير لائق' },
  harassment: { en: 'Harassment', ar: 'تحرش' },
  offensive_language: { en: 'Offensive language', ar: 'ألفاظ مسيئة' },
  false_information: { en: 'False information', ar: 'معلومات غير صحيحة' },
  suspicious_activity: { en: 'Suspicious activity', ar: 'نشاط مشبوه' },
  other: { en: 'Other', ar: 'أخرى' },
}
