import LogoutButton from "./LogoutButton"

interface NavSidebarProps {
  activeTab: 'resumes' | 'blocks' | 'account'
  setActiveTab: (tab: 'resumes' | 'blocks' | 'account') => void
}

export default function NavSidebar({ activeTab, setActiveTab }: NavSidebarProps) {
  return (
    <aside className="layout-sidebar">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-primary-app mb-8">BlockResume</h1>
        
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => setActiveTab('resumes')}
            className={activeTab === 'resumes' ? 'sidebar-nav-item-active' : 'sidebar-nav-item'}
          >
            Resumes
          </button>
          
          <button
            onClick={() => setActiveTab('blocks')}
            className={activeTab === 'blocks' ? 'sidebar-nav-item-active' : 'sidebar-nav-item'}
          >
            Blocks
          </button>
          
          <button
            onClick={() => setActiveTab('account')}
            className={activeTab === 'account' ? 'sidebar-nav-item-active' : 'sidebar-nav-item'}
          >
            Account
          </button>
        </nav>
      </div>

      <LogoutButton/>
    </aside>
  )
}