import { createBrowserRouter, Navigate } from 'react-router-dom'

import { SplashScreen } from '@/features/auth/screens/SplashScreen'
import { OnboardingCarouselScreen } from '@/features/auth/screens/OnboardingCarouselScreen'
import { WelcomeScreen } from '@/features/auth/screens/WelcomeScreen'
import { ChooseLanguageScreen } from '@/features/auth/screens/ChooseLanguageScreen'
import { PhoneAuthScreen } from '@/features/auth/screens/PhoneAuthScreen'
import { OtpVerificationScreen } from '@/features/auth/screens/OtpVerificationScreen'

import { RegistrationIntroScreen } from '@/features/registration/screens/RegistrationIntroScreen'
import { RegistrationChecklistScreen } from '@/features/registration/screens/RegistrationChecklistScreen'

import { RegistrationWizardScreen } from '@/features/registration/screens/RegistrationWizardScreen'
import { RegistrationSubmittedScreen } from '@/features/registration/screens/RegistrationSubmittedScreen'

import { SubscriptionPaymentScreen } from '@/features/payment/screens/SubscriptionPaymentScreen'
import { PaymentSuccessScreen, PaymentFailedScreen, ResumePaymentScreen } from '@/features/payment/screens/PaymentStatusScreens'

import { AppShell } from '@/shared/components/layout/AppShell'
import { HomeScreen } from '@/features/matches/screens/HomeScreen'
import { DiscoverScreen } from '@/features/matches/screens/DiscoverScreen'
import { SavedScreen } from '@/features/matches/screens/SavedScreen'
import { ProfileDetailScreen } from '@/features/profile/screens/ProfileDetailScreen'
import { MyProfileScreen } from '@/features/profile/screens/MyProfileScreen'
import { EditProfileScreen } from '@/features/profile/screens/EditProfileScreen'
import { ProfilePreviewScreen } from '@/features/profile/screens/ProfilePreviewScreen'
import { RequestsScreen } from '@/features/requests/screens/RequestsScreen'
import { NotificationsScreen } from '@/features/notifications/screens/NotificationsScreen'
import { ComplaintsListScreen } from '@/features/complaints/screens/ComplaintsListScreen'
import { ComplaintFormScreen } from '@/features/complaints/screens/ComplaintFormScreen'
import { SettingsScreen } from '@/features/settings/screens/SettingsScreen'
import { PrivacySettingsScreen } from '@/features/settings/screens/PrivacySettingsScreen'
import { PrivacyPolicyScreen } from '@/features/settings/screens/PrivacyPolicyScreen'
import { ProfileVisibilityScreen } from '@/features/settings/screens/ProfileVisibilityScreen'
import { AdminReviewScreen } from '@/features/admin/components/AdminReviewScreen'
import { PaymentReviewScreen } from '@/features/admin/components/PaymentReviewScreen'

import { SafetyFirstScreen } from '@/features/journey/SafetyFirstScreen'
import { ContactPolicyScreen } from '@/features/journey/ContactPolicyScreen'
import { ProfileReadyScreen } from '@/features/journey/ProfileReadyScreen'
import { GuidelinesScreen } from '@/features/journey/GuidelinesScreen'
import { ChatScreen } from '@/features/journey/ChatScreen'
import { ContactShareScreen } from '@/features/journey/ContactShareScreen'
import { IntroCompleteScreen } from '@/features/journey/IntroCompleteScreen'
import { FeedbackScreen } from '@/features/journey/FeedbackScreen'
import { MessagesScreen } from '@/features/journey/MessagesScreen'

import { RequireAuth } from './RequireAuth'
import { ErrorScreen } from '@/shared/components/feedback/StateScreens'
import { useLanguage } from '@/core/hooks/useLanguage'

function RouteError() {
  const { t } = useLanguage()
  return <ErrorScreen title={t('Something went wrong', 'حصلت مشكلة')} description={t('Please go back and try again.', 'ارجع وحاول تاني.')} />
}

export const router = createBrowserRouter([
  { path: '/', element: <SplashScreen /> },
  { path: '/onboarding', element: <OnboardingCarouselScreen /> },
  { path: '/welcome', element: <WelcomeScreen /> },
  { path: '/language', element: <ChooseLanguageScreen /> },
  { path: '/phone-auth', element: <PhoneAuthScreen /> },
  { path: '/otp-verification', element: <OtpVerificationScreen /> },

  {
    element: <RequireAuth />,
    errorElement: <RouteError />,
    children: [
      { path: '/registration-intro', element: <RegistrationIntroScreen /> },
      { path: '/registration', element: <RegistrationWizardScreen /> },
      { path: '/registration-checklist', element: <RegistrationChecklistScreen /> },
      { path: '/registration-submitted', element: <RegistrationSubmittedScreen /> },
      { path: '/safety-first', element: <SafetyFirstScreen /> },
      { path: '/contact-policy', element: <ContactPolicyScreen /> },
      { path: '/profile-ready', element: <ProfileReadyScreen /> },
      { path: '/profile-pending', element: <RegistrationSubmittedScreen /> },
      { path: '/payment/subscription', element: <SubscriptionPaymentScreen /> },
      { path: '/payment/success', element: <PaymentSuccessScreen /> },
      { path: '/payment/failed', element: <PaymentFailedScreen /> },
      { path: '/payment/resume', element: <ResumePaymentScreen /> },
      {
        path: '/app',
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="home" replace /> },
          { path: 'home', element: <HomeScreen /> },
          { path: 'discover', element: <DiscoverScreen /> },
          { path: 'saved', element: <SavedScreen /> },
          { path: 'profile', element: <MyProfileScreen /> },
          { path: 'profile/edit', element: <EditProfileScreen /> },
          { path: 'profile/preview', element: <ProfilePreviewScreen /> },
          { path: 'profile/:id', element: <ProfileDetailScreen /> },
          { path: 'messages', element: <MessagesScreen /> },
          { path: 'guidelines/:id', element: <GuidelinesScreen /> },
          { path: 'chat/:id', element: <ChatScreen /> },
          { path: 'contact-share/:id', element: <ContactShareScreen /> },
          { path: 'intro-complete/:id', element: <IntroCompleteScreen /> },
          { path: 'feedback', element: <FeedbackScreen /> },
          { path: 'requests', element: <RequestsScreen /> },
          { path: 'connections', element: <RequestsScreen /> },
          { path: 'notifications', element: <NotificationsScreen /> },
          { path: 'complaints', element: <ComplaintsListScreen /> },
          { path: 'complaints/new', element: <ComplaintFormScreen /> },
          { path: 'settings', element: <SettingsScreen /> },
          { path: 'settings/privacy', element: <PrivacySettingsScreen /> },
          { path: 'settings/privacy-policy', element: <PrivacyPolicyScreen /> },
          { path: 'settings/visibility', element: <ProfileVisibilityScreen /> },
          { path: 'settings/verification', element: <AdminReviewScreen /> },
          { path: 'settings/payment-review', element: <PaymentReviewScreen /> },
        ],
      },
    ],
  },

  { path: '*', element: <RouteError /> },
])
