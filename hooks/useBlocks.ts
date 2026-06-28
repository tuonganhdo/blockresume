import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'

// interfaces and types for each block type + generic block
export interface BulletpointProperties {
  content: string;
}

export interface ProjectLink {
  label: string;
  url: string;
  icon?: string; 
}

export interface ProjectHeaderProperties {
  title: string;
  description: string;
  links?: ProjectLink[];
}

export interface SkillSectionProperties {
  category: string;
  skills: string[];
}

export interface PositionHeaderProperties {
  company: string;
  location: string;
  role: string;
  dates: string;
}

export interface SectionHeaderProperties {
  content: string;
}

export type BlockData =
  | { type: 'bulletpoint'; properties: BulletpointProperties }
  | { type: 'project_header'; properties: ProjectHeaderProperties }
  | { type: 'skill_section'; properties: SkillSectionProperties }
  | { type: 'position_header'; properties: PositionHeaderProperties }
  | { type: 'section_header'; properties: SectionHeaderProperties };

export type Block = {
  id: string;
  resume_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
} & BlockData;

export type BlockType = Block['type'];

// useBlocks hook 
export function useBlocks() {
  const supabase = createClient()
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // fetch all blocks created by the user
  const fetchBlocks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('blocks')
        .select('*')
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError

      setBlocks((data as unknown as Block[]) || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch blocks')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  // fetch blocks of a specific type
  const fetchBlocksByType = useCallback(async (type: BlockType) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('blocks')
        .select('*')
        .eq('type', type)
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError

      return (data as unknown as Block[]) || []
    } catch (err: any) {
      setError(err.message || `Failed to fetch ${type} blocks`)
      return []
    } finally {
      setLoading(false)
    }
  }, [supabase])

  // add a new block
  const addBlock = async (type: BlockType, properties: any) => {
    try {
      setError(null)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Log in to add a block')

      const { data, error: insertError } = await supabase
        .from('blocks')
        .insert([{
          user_id: user.id,
          type,
          properties
        }])
        .select()
        .single()

      if (insertError) throw insertError

      setBlocks(prev => [...prev, data as unknown as Block])
      return data as unknown as Block
    } catch (err: any) {
      setError(err.message || 'Failed to create block')
      return null
    }
  }

  // update an existing block
  const updateBlock = async (blockId: string, updatedProperties: Partial<any>) => {
    try {
      setError(null)

      const currentBlock = blocks.find(b => b.id === blockId)
      const mergedProperties = {
        ...(currentBlock?.properties || {}),
        ...updatedProperties
      }

      const { data, error: updateError } = await supabase
        .from('blocks')
        .update({ 
          properties: mergedProperties,
          updated_at: new Date().toISOString()
        })
        .eq('id', blockId)
        .select()
        .single()

      if (updateError) throw updateError

      setBlocks(prev => prev.map(b => b.id === blockId ? (data as unknown as Block) : b))
      return true
    } catch (err: any) {
      setError(err.message || 'Failed to update block')
      return false
    }
  }

  // delete a block
  const deleteBlock = async (blockId: string) => {
    try {
      setError(null)

      const { error: deleteError } = await supabase
        .from('blocks')
        .delete()
        .eq('id', blockId)

      if (deleteError) throw deleteError

      setBlocks(prev => prev.filter(b => b.id !== blockId))
      return true
    } catch (err: any) {
      setError(err.message || 'Failed to delete block')
      return false
    }
  }

  // automatically fetch all blocks from library
  useEffect(() => {
    fetchBlocks()
  }, [fetchBlocks])

  return {
    blocks,
    loading,
    error,
    refresh: fetchBlocks,
    fetchBlocksByType,
    addBlock,
    updateBlock,
    deleteBlock
  }
}