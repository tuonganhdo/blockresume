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
    <div className="auth-container">
        <h2>Log in</h2>
        <form onSubmit={handleLogin}>
          {/* email input */}
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            required
          />

          {/* password input */}
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          {/* submit button */}
          <button type="submit">Log in</button>
        </form>

        <p>New here? <Link href="/signup">Sign up</Link></p>

        {/* render error message if exists */}
        { error && <p className="error">{error}</p>}
    </div>
  );
}
