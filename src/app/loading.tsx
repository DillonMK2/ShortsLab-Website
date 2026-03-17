export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-accent-violet/30 border-t-accent-violet rounded-full animate-spin" />
        <span className="text-white/40 text-sm">Loading...</span>
      </div>
    </div>
  )
}
