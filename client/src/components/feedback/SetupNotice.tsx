export const SetupNotice = () => (
  <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
    <section className="max-w-xl rounded-lg border border-amber-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Environment setup needed</p>
      <h1 className="mt-3 text-2xl font-semibold text-slate-950">Add your Clerk publishable key</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Create a <code className="rounded bg-slate-100 px-1.5 py-0.5">.env</code> file in the client folder using
        <code className="ml-1 rounded bg-slate-100 px-1.5 py-0.5">.env.example</code>, then set
        <code className="ml-1 rounded bg-slate-100 px-1.5 py-0.5">VITE_CLERK_PUBLISHABLE_KEY</code>.
      </p>
    </section>
  </main>
);
