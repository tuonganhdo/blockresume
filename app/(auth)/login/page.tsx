"use client"

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  // initialize state vars for form inputs
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [error, setError] = useState<string | null>(null) // for auth errors from supabase
  const router = useRouter()
  const supabase = createClient()

  // form submission handler
  const handleLogin = async (e : React.SyntheticEvent) => {
    e.preventDefault() // prevent default full-page reload on submit
    setError(null) // clear previous errors

    // authenticate user using email and password with supabase
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    // displays error if there is one, otherwise redirect to dashboard
    if (loginError) {
      setError(loginError.message)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="layout-shell min-h-screen flex items-center justify-center p-4">
      <div className="card-surface w-full max-w-md p-8 rounded-xl shadow-sm flex flex-col gap-6">
        <h2 className="text-2xl font-bold tracking-tight">Log in</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* email input */}
          <label className="form-label">Email address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            required
          />

          {/* password input */}
          <label className="form-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          {/* submit button */}
          <button type="submit" className="btn-primary w-full mt-2">Log in</button>
        </form>

        <p className="text-sm opacity-60 text-center mt-2">
          New here? <Link href="/signup" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Sign up</Link>
        </p>

        {/* render error message if exists */}
        { error && <p className="banner-error">{error}</p>}
      </div>
    </div>
  );
}
