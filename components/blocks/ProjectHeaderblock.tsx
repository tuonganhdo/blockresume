interface ProjectLink {
    label: string
    url: string
    icon?: React.ReactNode
}

interface ProjectHeaderBlockProps {
    display: 'block' | 'document'
    title: string
    description: string
    links?: ProjectLink[]
}

export default function ProjectHeaderBlock({
  display,
  title,
  description,
  links = []
}: ProjectHeaderBlockProps) {
  if (display === 'document') {
    return (
      <div className="w-full my-2 text-sm select-text text-app resume-text-serif leading-tight">
        <p>
          <span className="font-bold">{title}</span>
          {description && <span className="opacity-95"> | {description}</span>}
          {links.map((link, idx) => (
            <span key={idx}>
              {" | "}
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="resume-text-serif-italic text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                {link.label}
                {link.icon && <span className="inline-block text-[11px] align-middle">{link.icon}</span>}
              </a>
            </span>
          ))}
        </p>
      </div>
    )
  }

  return (
    <div className="card-surface block-preview-base p-4 rounded-lg flex flex-col justify-between group">
      <div className="w-full opacity-80 group-hover:opacity-100 transition-opacity text-[11px] leading-snug resume-text-serif truncate">
        <span className="font-bold">{title}</span>
        <span className="opacity-60"> | {description || "Tech Stack"}</span>
        {links.length > 0 && (
          <span className="resume-text-serif-italic text-blue-500">
            {" | "} {links[0].label}
          </span>
        )}
      </div>

      <div className="flex justify-between items-center mt-3 pt-1.5 border-t border-app opacity-40 text-[10px] uppercase tracking-wider font-mono">
        <span>Project Header</span>
      </div>
    </div>
  )
}