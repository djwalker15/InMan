export function clerkErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'errors' in err) {
    const errors = (err as {
      errors?: Array<{ message?: string; longMessage?: string }>
    }).errors
    if (errors && errors.length > 0) {
      return (
        errors[0]?.longMessage ??
        errors[0]?.message ??
        'Something went wrong.'
      )
    }
  }
  if (err instanceof Error) return err.message
  return 'Something went wrong.'
}
