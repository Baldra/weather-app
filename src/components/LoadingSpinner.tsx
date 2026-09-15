export function LoadingSpinner() {
  return (
    <div className="flex justify-center py-16" role="status" aria-label="Loading weather">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-haze border-t-sea" />
    </div>
  )
}