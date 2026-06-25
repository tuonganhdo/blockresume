interface SectionHeaderBlockProps {
  display: 'block' | 'document'
  content: string
}

export default function SectionHeaderBlock({ display, content} : SectionHeaderBlockProps) {
  if (display === 'document') {
    return (
      <div className="w-full my-4 select-text">
        <h2 className="text-lg font-semibold border-b border-current pb-1 resume-heading-serif">
          {content}
        </h2>
      </div>
    )
  }

  return (
    <div className="card-surface block-preview-base p-4 rounded-lg flex flex-col justify-between group">
      <div className="w-full border-b border-current pb-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
        <span className="text-sm font-semibold tracking-wider resume-heading-serif">
          {content}
        </span>
      </div>

      <div className="flex items-center mt-3 pt-1.5 border-t border-app opacity-40 text-[10px] uppercase tracking-wider font-mono">
        <span>Section Header</span>
      </div>
    </div>
  )
}