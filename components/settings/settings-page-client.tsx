'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { SettingsDashboard } from '@/components/settings/settings-dashboard'

export function SettingsPageClient() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [locale, setLocale] = useState('en')

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLocaleChange={handleLocaleChange} currentLocale={locale} />

        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">
            <SettingsDashboard locale={locale} />
          </div>
        </main>
      </div>
    </div>
  )
}
