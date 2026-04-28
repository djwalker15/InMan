import type { ReactNode } from 'react'
import { UserButton } from '@clerk/clerk-react'
import { TopNav } from '@/components/top-nav'
import { BottomNav } from './bottom-nav'

export function SignedInLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-surface">
      <TopNav rightAction={<UserAvatarMenu />} />
      <main className="mx-auto w-full max-w-[512px] flex-1 px-4 pb-24 pt-2">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

function UserAvatarMenu() {
  return (
    <UserButton
      afterSignOutUrl="/sign-in"
      appearance={{
        elements: {
          avatarBox: 'h-10 w-10 bg-brand-500',
          userButtonTrigger: 'focus:shadow-none',
        },
      }}
    />
  )
}
