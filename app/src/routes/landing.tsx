import type { ReactNode } from 'react'
import { Camera, Users, Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GetStartedPill, TopNav } from '@/components/top-nav'

export default function LandingPage() {
  return (
    <div className="min-h-full bg-paper-150">
      <TopNav rightAction={<GetStartedPill />} />

      <main className="mx-auto flex w-full max-w-[448px] flex-col gap-8 px-6 py-8">
        <div className="relative overflow-hidden rounded-xl shadow-ambient-md">
          <img
            src="/brand/landing-hero.png"
            alt="Pantry and bar shelving with organized containers"
            className="block aspect-square w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div>
          <h1 className="font-display text-[36px] font-extrabold leading-[1.1] tracking-[-0.025em] text-ink-900">
            Know what you have.
            <br />
            Use what you buy.
          </h1>
          <p className="mt-4 text-lg leading-[29px] text-ink-600">
            Track your pantry, bar, and every shelf between. Share with the
            people who share your kitchen.
          </p>
        </div>

        <ul className="flex flex-col gap-4">
          <FeatureCard
            icon={<Camera size={20} strokeWidth={2.25} />}
            iconBg="bg-sage-100"
            heading="Scan, snap, or type"
            detail="Add items as fast as life moves"
          />
          <FeatureCard
            icon={<Users size={20} strokeWidth={2.25} />}
            iconBg="bg-sage-100"
            heading="Shared with your crew"
            detail="Everyone sees the same shelves"
          />
          <FeatureCard
            icon={<Bell size={20} strokeWidth={2.25} />}
            iconBg="bg-accent-peach"
            heading="Less waste, more cooking"
            detail="Know what's running low before you run out"
          />
        </ul>

        <Link
          to="/sign-up"
          className="flex h-[52px] w-full items-center justify-center rounded-lg bg-gradient-to-br from-sage-700 to-sage-600 font-sans text-lg font-semibold text-white shadow-ambient-md transition hover:opacity-95"
        >
          Get started — it's free
        </Link>
      </main>
    </div>
  )
}

interface FeatureCardProps {
  icon: ReactNode
  iconBg: string
  heading: string
  detail: string
}

function FeatureCard({ icon, iconBg, heading, detail }: FeatureCardProps) {
  return (
    <li className="flex items-start gap-4 rounded-xl bg-paper-50 p-6 shadow-ambient-md">
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-full text-ink-900 ${iconBg}`}
      >
        {icon}
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="font-display text-lg font-bold leading-7 text-ink-900">
          {heading}
        </h3>
        <p className="text-sm leading-5 text-ink-600">{detail}</p>
      </div>
    </li>
  )
}
