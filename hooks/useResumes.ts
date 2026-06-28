import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export interface Resume {
  id: string
  user_id: string
  title: string
  show_location: boolean
  show_phone_number: boolean
  show_github: boolean
  show_linkedin: boolean
  show_twitter: boolean
  show_website: boolean
  updated_at: string
}

export function useResumes(activeTab: string) {
  const supabase = createClient()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  // fetch all resumes for current user
  const fetchResumes = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data, error } = await supabase
          .from('resumes')
          .select(`
            id, user_id, title, 
            show_location, show_phone_number, show_github, 
            show_linkedin, show_twitter, show_website, updated_at
          `)
          .order('updated_at', { ascending: false })

        if (error) throw error
        if (data) setResumes(data as Resume[])
      }
    } catch (err: any) {
      console.error('Error fetching resumes:', err.message)
    } finally {
      setLoading(false)
    }
  }

  // refetch resumes whenever user navigates back to resumes page
  useEffect(() => {
    if (activeTab === 'resumes') {
      fetchResumes()
    }
  }, [activeTab])

  // create new resume
  const createResume = async () => {
    setIsCreating(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('resumes')
        .insert([{ 
          user_id: user.id, 
          title: 'Untitled Resume', 
        }])
        .select()
        .single()

      if (error) throw error
      if (data) setResumes([data as Resume, ...resumes])
    } catch (err: any) {
      alert('Error creating new resume: ' + err.message)
    } finally {
      setIsCreating(false)
    }
  }

  return { resumes, loading, isCreating, createResume }
}