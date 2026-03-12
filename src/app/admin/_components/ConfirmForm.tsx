'use client'

/**
 * ConfirmForm — client component used by all admin management pages.
 *
 * Wraps a server action in a <form> and shows a browser confirm() dialog
 * before the form is submitted. Event handlers cannot live in server
 * components (RSC cannot serialize functions), so this thin client wrapper
 * owns the onClick logic while the actual mutation stays a server action.
 *
 * Usage:
 *   <ConfirmForm
 *     action={deleteUser}
 *     fields={{ userId: user.id }}
 *     message={`Delete ${user.name}?`}
 *     className="..."
 *   >
 *     Delete
 *   </ConfirmForm>
 */

interface Props {
  action: (formData: FormData) => Promise<void>
  fields: Record<string, string>
  message: string
  children: React.ReactNode
  className?: string
}

export default function ConfirmForm({ action, fields, message, children, className }: Props) {
  return (
    <form action={action}>
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button
        type="submit"
        className={className}
        onClick={(e) => {
          if (!confirm(message)) e.preventDefault()
        }}
      >
        {children}
      </button>
    </form>
  )
}
