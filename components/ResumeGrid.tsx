import { Resume } from "@/hooks/useResumes"
import ResumeCard from "./ResumeCard"

interface ResumeGridProps {
	resumes: Resume[]
	loading: boolean
}

export default function ResumeGrid({ resumes, loading }: ResumeGridProps) {
	if (loading) {
		return <div className="text-sm font-medium opacity-50">Loading resumes...</div>
	}

	if (resumes.length === 0) {
		return (
			<div className="border-2 border-dashed border-app rounded-lg p-12 text-center opacity-50">
				No resumes created yet
			</div>
		)
	}

	return (
		<div className="content-grid">
			{resumes.map((resume) => <ResumeCard key={resume.id} resume={resume}/>)}
		</div>
	)
}