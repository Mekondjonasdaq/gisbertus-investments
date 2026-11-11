// Shown only when the .env file has not been filled in yet.
export default function SetupNeeded() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="max-w-xl rounded-2xl border border-white/10 bg-ink-850 p-8">
        <h1 className="text-3xl font-semibold">One more step: connect the database</h1>
        <p className="mt-3 text-ink-300">
          The website cannot find your Supabase keys. Copy <code className="rounded bg-ink-700 px-1.5 py-0.5">.env.example</code> to
          a new file named <code className="rounded bg-ink-700 px-1.5 py-0.5">.env</code>, paste in your project URL and anon key,
          then stop and restart <code className="rounded bg-ink-700 px-1.5 py-0.5">npm run dev</code>.
        </p>
        <p className="mt-3 text-sm text-ink-400">Full instructions are in README.md.</p>
      </div>
    </div>
  )
}
