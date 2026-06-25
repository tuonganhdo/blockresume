interface BulletpointblockProps {
  display: 'block' | 'document'
  content: string
}

export default function BulletpointBlock({ display, content } : BulletpointblockProps) {
  const parseMarkdown = (text : string) => {
    // Regex splits text by bold (**), italic (*), or bold-italic (***) patterns
    const parts = text.split(/(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('***') && part.endsWith('***')) {
        return <strong key={index} className="italic">{part.slice(3, -3)}</strong>;
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  if (display === 'document') {
    return (
      <div className="w-full my-1 text-sm select-text text-app resume-text-serif leading-relaxed flex items-start">
        <span className="mr-2 select-none text-[12px] pt-0.75">•</span>
        <p className="flex-1">
          {parseMarkdown(content)}
        </p>
      </div>
    )
  }

  return (
    <div className="card-surface block-preview-base p-4 rounded-lg flex flex-col justify-between group">
      <div className="w-full opacity-80 group-hover:opacity-100 transition-opacity text-[11px] leading-snug resume-text-serif flex items-start truncate">
        <span className="mr-1.5 select-none">•</span>
        <span className="truncate">
          {parseMarkdown(content)}
        </span>
      </div>

      <div className="flex justify-between items-center mt-3 pt-1.5 border-t border-app opacity-40 text-[10px] uppercase tracking-wider font-mono">
        <span>Bulletpoint</span>
      </div>
    </div>
  )
}