import { Resume } from '@/hooks/useResumes'

interface ResumeCardProps {
  resume: Resume
}

export default function ResumeCard({ resume }: ResumeCardProps) {
  return (
    <div 
    onClick={() => window.location.href = `/editor/${resume.id}`}
      className="card-surface card-surface-hover p-6 rounded-lg flex flex-col justify-between h-44 transition-all cursor-pointer group"
    >
      <h3 className="font-semibold text-lg tracking-tight truncate group-hover:text-primary-app transition-colors">{resume.title}</h3>
      <div className="text-[11px] opacity-50 border-t border-app pt-2">
        Updated: {new Date(resume.updated_at).toLocaleDateString()}
      </div>
    </div>
  )
}