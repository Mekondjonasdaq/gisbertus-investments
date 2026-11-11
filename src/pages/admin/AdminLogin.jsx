import { useState } from 'react'
import AuthShell from '../../components/AuthShell'
import PasswordField from '../../components/PasswordField'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const result = await signIn(email, password)
    setBusy(false)
    if (!result.ok) setError(result.error)
  }

  return (
    <AuthShell title="Owner sign in" subtitle="Private area for the business owner.">
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="owner-email" className="label">Email</label>
          <input id="owner-email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </div>
        <PasswordField id="owner-pass" value={password} onChange={setPassword} />
        {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </AuthShell>
  )
}
