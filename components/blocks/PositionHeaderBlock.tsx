interface PositionHeaderBlockProps {
  display: 'block' | 'document'
  organization: string
  location: string
  role: string
  dates: string
}

export default function PositionHeaderBlock({ 
  display, 
  organization, 
  location, 
  role, 
  dates 
}: PositionHeaderBlockProps) {
  if (display === 'document') {
    return (
      <div className="w-full my-3 text-sm select-text text-app resume-text-serif">
        {/* row 1: organization name + location */}
        <div className="flex justify-between items-baseline font-bold">
          <span className="text-base">{organization}</span>
          <span className="font-normal">{location}</span>
        </div>
        
        {/* row 2: role title + dates */}
        <div className="flex justify-between items-baseline resume-text-serif-italic mt-0.5">
          <span>{role}</span>
          <span className="text-xs tracking-wide">{dates}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="card-surface block-preview-base p-4 rounded-lg flex flex-col justify-between group">
      <div className="w-full opacity-80 group-hover:opacity-100 transition-opacity text-[11px] leading-tight resume-text-serif">
        <div className="flex justify-between font-bold">
          <span className="truncate max-w-[70%]">{organization}</span>
          <span className="font-normal opacity-50 truncate max-w-[25%]">{location}</span>
        </div>
        <div className="flex justify-between text-gray-500 mt-0.5 dark:text-gray-400">
          <span className="resume-text-serif-italic truncate max-w-[65%]">{role}</span>
          <span className="text-[10px] opacity-50">{dates}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 pt-1.5 border-t border-app opacity-40 text-[10px] uppercase tracking-wider font-mono">
        <span>Position Header</span>
      </div>
    </div>
  )
}