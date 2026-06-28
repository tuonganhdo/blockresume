import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Block } from './useBlocks' 

export interface ResumeBlockLink {
  resume_id: string
  block_id: string
  sort_order: number
  created_at: string
  blocks: Block 
}

export function useResumeBlocks(resumeId: string) {
  const [resumeBlocks, setResumeBlocks] = useState<ResumeBlockLink[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  // fetch all blocks in this resume
  const fetchResumeBlocks = useCallback(async () => {
    if (!resumeId) return
    
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('resume_blocks')
        .select(`
          resume_id,
          block_id,
          sort_order,
          created_at,
          blocks:blocks (*)
        `)
        .eq('resume_id', resumeId)
        .order('sort_order', { ascending: true })

      if (fetchError) throw fetchError

      setResumeBlocks((data as unknown as ResumeBlockLink[]) || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load blocks in resume')
    } finally {
      setLoading(false)
    }
  }, [resumeId, supabase])

  // add an existing block to this resume
  const linkBlockToResume = async (blockId: string) => {
    try {
      setError(null)

      // append block to the bottom of this resume
      const nextSortOrder = resumeBlocks.length > 0 
        ? Math.max(...resumeBlocks.map(b => b.sort_order)) + 1 
        : 0

      const { data, error: insertError } = await supabase
        .from('resume_blocks')
        .insert([{
          resume_id: resumeId,
          block_id: blockId,
          sort_order: nextSortOrder
        }])
        .select(`
          resume_id,
          block_id,
          sort_order,
          created_at,
          blocks:blocks (*)
        `)
        .single()

      if (insertError) throw insertError

      setResumeBlocks(prev => [...prev, data as unknown as ResumeBlockLink])
      return true
    } catch (err: any) {
      setError(err.message || 'Failed to add block to resume')
      return false
    }
  }

  // update block ordering
  const reorderResumeBlocks = async (updatedLinks: { block_id: string; sort_order: number }[]) => {
    try {
      setError(null)

      // optimistically update local state
      const localOptimisticState = resumeBlocks.map(item => {
        const matchingUpdate = updatedLinks.find(u => u.block_id === item.block_id)
        return matchingUpdate ? { ...item, sort_order: matchingUpdate.sort_order } : item
      }).sort((a, b) => a.sort_order - b.sort_order)
      
      setResumeBlocks(localOptimisticState)

      // update db ordering for all blocks in this resume
      const updatePromises = updatedLinks.map(link => 
        supabase
          .from('resume_blocks')
          .update({ sort_order: link.sort_order })
          .match({ resume_id: resumeId, block_id: link.block_id })
      )

      const results = await Promise.all(updatePromises)
      const failedResult = results.find(res => res.error)
      if (failedResult) throw failedResult.error

      return true
    } catch (err: any) {
      setError(err.message || 'Failed to reorder blocks in resume')
      // in case of error, revert to db state
      fetchResumeBlocks()
      return false
    }
  }

  // remove an existing block from this resume (doesn't delete the block)
  const unlinkBlockFromResume = async (blockId: string) => {
    try {
      setError(null)

      const { error: deleteError } = await supabase
        .from('resume_blocks')
        .delete()
        .match({ resume_id: resumeId, block_id: blockId })

      if (deleteError) throw deleteError

      setResumeBlocks(prev => prev.filter(b => b.block_id !== blockId))
      return true
    } catch (err: any) {
      setError(err.message || 'Failed to remove block from resume')
      return false
    }
  }

  // automatically sync on change to editor view
  useEffect(() => {
    fetchResumeBlocks()
  }, [resumeId, fetchResumeBlocks])

  return {
    resumeBlocks,
    loading,
    error,
    refresh: fetchResumeBlocks,
    linkBlockToResume,
    reorderResumeBlocks,
    unlinkBlockFromResume
  }
}