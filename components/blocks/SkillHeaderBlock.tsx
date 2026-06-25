interface SkillHeaderBlockProps {
  display: 'block' | 'document'
  content: string
}

export default function SkillHeaderBlock({ display, content } : SkillHeaderBlockProps) {
  if (display === 'document') {
    return (
      <span className="font-bold mr-1 text-sm text-app resume-text-serif select-text">
        {content}:
      </span>
    )
  }

  return (
    <div className="card-surface block-preview-base p-4 rounded-lg flex flex-col justify-between group">
      <div className="w-full opacity-80 group-hover:opacity-100 transition-opacity text-sm font-bold resume-text-serif truncate">
        {content}:
      </div>

      <div className="flex justify-between items-center mt-3 pt-1.5 border-t border-app opacity-40 text-[10px] uppercase tracking-wider font-mono">
        <span>Skill Category</span>
      </div>
    </div>
  )
}