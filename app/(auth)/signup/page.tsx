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
    <div className="layout-shell min-h-screen flex items-center justify-center p-4">
      <div className="card-surface w-full max-w-md p-8 rounded-xl shadow-sm flex flex-col gap-6">
        <h2 className="text-2xl font-bold tracking-tight">Sign up</h2>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
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
          <button type="submit" className="btn-primary w-full mt-2">Sign up</button>
        </form>

        <p className="text-sm opacity-60 text-center mt-2">
          Returning user? <Link href="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Log in</Link>
        </p>

        {/* render error message if exists */}
        { error && <p className="banner-error">{error}</p>}
      </div>
    </div>
  );
}
