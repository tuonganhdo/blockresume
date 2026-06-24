"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import LogoutButton from "@/components/LogoutButton";

export default function AccountPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // form input states
  const [email, setEmail] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [twitterUrl, setTwitterUrl] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [location, setLocation] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  // get user profile from supabase
  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('email, github_url, linkedin_url, twitter_url, website_url, location, phone_number')
            .eq('id', user.id)
            .single()

          if (error) throw error

          if (data) {
            setEmail(data.email)
            setGithubUrl(data.github_url || '')
            setLinkedinUrl(data.linkedin_url || '')
            setTwitterUrl(data.twitter_url || '')
            setWebsiteUrl(data.website_url || '')
            setLocation(data.location || '')
            setPhoneNumber(data.phone_number || '')
          }
        }
      } catch (err: any) {
        console.error('Error loading profile:', err.message)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [])

  // form submission handler for profile updates
  const handleUpdateProfile = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('No user session found.')

      // update public.profiles with new data
      const { error } = await supabase
        .from('profiles')
        .update({
          github_url: githubUrl,
          linkedin_url: linkedinUrl,
          twitter_url: twitterUrl,
          website_url: websiteUrl,
          location: location,
          phone_number: phoneNumber,
        })
        .eq('id', user.id)

      if (error) throw error
      setMessage({ type: 'success', text: 'Successfully updated profile' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An error occurred while saving profile' })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] text-sm font-medium opacity-50">
        Loading profile...
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Account</h2>
      
      <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
        <div>
          <label className="form-label">Email address</label>
          <input type="text" value={email} disabled className="opacity-60 cursor-not-allowed" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Location</label>
            <input 
              type="text" 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              placeholder="e.g. Seattle, WA" 
            />
          </div>
          <div>
            <label className="form-label">Phone number</label>
            <input 
              type="text" 
              value={phoneNumber} 
              onChange={e => setPhoneNumber(e.target.value)} 
              placeholder="e.g. (123) 456-7890" 
            />
          </div>
        </div>

        <h3 className="section-divider">Social links</h3>
        
        <div>
          <label className="form-label">Website/portfolio</label>
          <input 
            type="text" 
            value={websiteUrl} 
            onChange={e => setWebsiteUrl(e.target.value)} 
            placeholder="https://myportfolio.com" 
          />
        </div>

        <div>
          <label className="form-label">GitHub</label>
          <input 
            type="text" 
            value={githubUrl} 
            onChange={e => setGithubUrl(e.target.value)} 
            placeholder="https://github.com/username" 
          />
        </div>

        <div>
          <label className="form-label">LinkedIn</label>
          <input 
            type="text" 
            value={linkedinUrl} 
            onChange={e => setLinkedinUrl(e.target.value)} 
            placeholder="https://linkedin.com/in/username" 
          />
        </div>

        <div>
          <label className="form-label">Twitter/X</label>
          <input 
            type="text" 
            value={twitterUrl} 
            onChange={e => setTwitterUrl(e.target.value)} 
            placeholder="https://x.com/username" 
          />
        </div>
        
        <div className="mt-2">
          <button 
            type="submit" 
            disabled={isSaving}
            className="btn-primary"
          >
            {isSaving ? 'Saving changes...' : 'Save'}
          </button>
        </div>
      </form>

      {/* notification block */}
      {message && (
        <div className={message.type === 'success' ? 'banner-success' : 'banner-error'}>
          {message.text}
        </div>
      )}

      <div className="mt-8 border-t border-app pt-6">
        <LogoutButton/>
      </div>
    </div>
  );
}
