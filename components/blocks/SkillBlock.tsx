interface SkillBlockProps {
  display: 'block' | 'document'
  name: string
  isLast?: boolean
}

export default function SkillBlock({ display, name, isLast = false }: SkillBlockProps) {
  if (display === 'document') {
    return (
      <span className="text-sm select-text text-app resume-text-serif">
        {name}{isLast ? '' : ','}{!isLast && <span>&nbsp;</span>}
      </span>
    )
  }

  return (
    <div className="card-surface block-preview-base px-3 py-1.5 rounded-full inline-flex items-center justify-between text-xs font-medium bg-(--background) hover:border-(--primary) max-w-xs group shadow-sm">
      <span className="truncate pr-2">{name}</span>
      <span className="text-[9px] opacity-30 uppercase font-mono tracking-tighter scale-90 group-hover:text-(--primary) transition-colors">
        Skill
      </span>
    </div>
  )
}