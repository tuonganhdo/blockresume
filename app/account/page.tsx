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
      <div className="flex items-center justify-center min-height-80vh text-sm font-medium">
        Loading profile...
      </div>
    )
  }

  return (
    <div className="account-container">
      <h2>Account</h2>
      
      <form onSubmit={handleUpdateProfile}>
        <div>
          <label>Email address</label>
          <input type="text" value={email} disabled />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Location</label>
            <input 
              type="text" 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              placeholder="e.g. Seattle, WA" 
            />
          </div>
          <div>
            <label>Phone number</label>
            <input 
              type="text" 
              value={phoneNumber} 
              onChange={e => setPhoneNumber(e.target.value)} 
              placeholder="e.g. (123) 456-7890" 
            />
          </div>
        </div>

        <h3>Social links</h3>
        
        <div>
          <label>Website/portfolio</label>
          <input 
            type="text" 
            value={websiteUrl} 
            onChange={e => setWebsiteUrl(e.target.value)} 
            placeholder="https://myportfolio.com" 
          />
        </div>

        <div>
          <label>GitHub</label>
          <input 
            type="text" 
            value={githubUrl} 
            onChange={e => setGithubUrl(e.target.value)} 
            placeholder="https://github.com/username" 
          />
        </div>

        <div>
          <label>LinkedIn</label>
          <input 
            type="text" 
            value={linkedinUrl} 
            onChange={e => setLinkedinUrl(e.target.value)} 
            placeholder="https://linkedin.com/in/username" 
          />
        </div>

        <div>
          <label>Twitter/X</label>
          <input 
            type="text" 
            value={twitterUrl} 
            onChange={e => setTwitterUrl(e.target.value)} 
            placeholder="https://x.com/username" 
          />
        </div>

        <button 
          type="submit" 
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors inline-flex items-center justify-center disabled:opacity-50"
        >
          {isSaving ? 'Saving changes...' : 'Save'}
        </button>
      </form>

      {/* notification block */}
      {message && (
        <div className={`mt-4 text-sm font-medium p-3 rounded-md text-center ${
          message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200' : 'error'
        }`}>
          {message.text}
        </div>
      )}

      <LogoutButton/>
    </div>
  );
}
