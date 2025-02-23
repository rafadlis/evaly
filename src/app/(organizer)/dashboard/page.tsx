import { Suspense } from 'react'
import DashboardPageClient from './page.client'

const Page = () => {
  return (
    <Suspense>
      <DashboardPageClient />
    </Suspense>
  )
}

export default Page