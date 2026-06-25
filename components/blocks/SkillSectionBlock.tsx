import SkillHeaderBlock from './SkillHeaderBlock'
import SkillBlock from './SkillBlock'

interface SkillSectionBlockProps {
  display: 'block' | 'document'
  category: string
  skills: string[]
}

export default function SkillSectionBlock({ display, category, skills }: SkillSectionBlockProps) {
  if (display === 'document') {
    return (
      <div className="w-full my-1.5 flex flex-wrap items-baseline">
        {/* display skill category name */}
        <SkillHeaderBlock display="document" content={category} />
        
        {/* display individual skills as pills */}
        {skills.map((skill, index) => (
          <SkillBlock 
            key={index} 
            display="document" 
            name={skill} 
            isLast={index === skills.length - 1} 
          />
        ))}
      </div>
    )
  }

  return (
    <div className="card-surface block-preview-base p-4 rounded-lg flex flex-col justify-between group">
      <div>
        {/* display skill category name */}
        <div className="text-xs font-bold opacity-50 uppercase tracking-wider mb-2 font-mono">
          {category}
        </div>
        
        {/* display individual skills as comma-separated text items */}
        <div className="flex flex-wrap gap-1.5 max-h-16 overflow-hidden">
          {skills.map((skill, index) => (
            <div 
              key={index} 
              className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-app bg-app opacity-80"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-1.5 border-t border-app opacity-40 text-[10px] uppercase tracking-wider font-mono">
        <span>Skills Section</span>
      </div>
    </div>
  )
}