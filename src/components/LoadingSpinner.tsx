export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8" aria-live="polite">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
    </div>
  )
}
