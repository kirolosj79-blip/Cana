import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from '@/core/navigation/router'
import { ToastProvider } from '@/shared/components/feedback/Toast'
import { CelebrationProvider } from '@/shared/components/feedback/Celebration'
import { EncouragementProvider } from '@/shared/components/feedback/EncouragementOverlay'
import { GlobalBackgroundMusic } from '@/shared/components/ui/GlobalBackgroundMusic'
import { useLanguageSync } from '@/core/hooks/useLanguage'

const queryClient = new QueryClient()

function AppInner() {
  useLanguageSync()
  return (
    <>
      <GlobalBackgroundMusic />
      <RouterProvider router={router} />
    </>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <CelebrationProvider>
          <EncouragementProvider>
            <AppInner />
          </EncouragementProvider>
        </CelebrationProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
}
