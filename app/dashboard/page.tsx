"use client"

import { useState } from 'react'
import AccountView from '@/components/AccountView'
import ResumeGrid from '@/components/ResumeGrid'
import NavSidebar from '@/components/NavSidebar'
import { useResumes } from '@/hooks/useResumes'

type Tab = 'resumes' | 'blocks' | 'account'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('resumes')
  const { resumes, loading, isCreating, createResume } = useResumes(activeTab)

  return (
    <div className="layout-shell">
      <NavSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* main workspace */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* resumes tab */}
        {activeTab === 'resumes' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Resumes</h2>
              <button onClick={createResume} disabled={isCreating} className="btn-primary">
                {isCreating ? 'Creating new resume...' : '+ New resume'}
              </button>
            </div>

            <ResumeGrid resumes={resumes} loading={loading} />
          </div>
        )}
        
        {/* blocks tab */}
        {activeTab === 'blocks' && (
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Block library</h2>
            <div className="card-surface p-8 rounded-lg text-sm opacity-60">
              TODO: block library
            </div>
          </div>
        )}

        {/* account tab */}
        {activeTab === 'account' && <AccountView />}
      </main>
    </div>
  )
}