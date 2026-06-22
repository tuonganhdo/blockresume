"use client"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import Link from 'next/link'

export default function SignupPage() {
  // initialize state vars for form inputs
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [error, setError] = useState<string | null>(null) // for auth errors from supabase
  const router = useRouter()
  const supabase = createClient()

  // form submission handler
  const handleSignup = async (e : React.SyntheticEvent) => {
    e.preventDefault() // prevent default full-page reload on submit
    setError(null) // clear previous errors

    // register new user credentials with supabase
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`, // specify redirect after clicking verification link
      },
    })

    // displays error if there is one, otherwise redirect to dashboard
    if (signUpError) {
      setError(signUpError.message)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="auth-container">
        <h2>Sign up</h2>
        <form onSubmit={handleSignup}>
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
          <button type="submit">Sign up</button>
        </form>

        <p>Returning user? <Link href="/login">Log in</Link></p>

        {/* render error message if exists */}
        { error && <p className="error">{error}</p>}
    </div>
  );
}
