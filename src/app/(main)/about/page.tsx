import { Metadata } from 'next'
import TeamCard from '@/components/TeamCard'
import GlassCard from '@/components/GlassCard'

export const metadata: Metadata = {
  title: 'About - ShortsFlow | Built for Serious YouTube Creators',
  description: 'Learn about Dillon, the creator behind ShortsFlow. Built from countless hours grinding on YouTube, this tool saves creators massive amounts of time.',
  keywords: 'ShortsFlow creator, about ShortsFlow, YouTube creator tools, content creation software',
}

const creator = {
  name: 'Dillon',
  role: 'Creator & Developer',
  bio: 'After spending countless hours grinding on YouTube, I built ShortsFlow to solve my own problems. What started as a personal tool to save time has become something I\'m proud to share with other creators.',
  initial: 'D',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase glass-gradient text-accent-cyan mb-6">
            About
          </span>
          <h1 className="mb-6">
            One Creator&apos;s <span className="gradient-text">Obsession</span>, Now Yours
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            ShortsFlow was born from countless hours grinding on YouTube. Jumping between tabs,
            losing track of scripts, manually formatting voiceovers — I knew
            there had to be a better way.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-accent-violet/30 via-accent-cyan/20 to-accent-violet/30 blur-[1px]" />
            <GlassCard className="p-8 md:p-12 relative" hover={false}>
              <h2 className="text-2xl font-sora font-bold mb-6 text-center">
                The <span className="gradient-text">Mission</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-sora font-semibold mb-3 text-white/90">
                    Why I Built This
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    Growing a YouTube channel is hard enough without fighting your tools.
                    I built ShortsFlow to bring every part of the content creation
                    workflow into one focused, beautifully designed desktop app — saving myself hours every week.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-sora font-semibold mb-3 text-white/90">
                    What I Believe
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    Creators deserve tools that respect their time and intelligence.
                    No bloat, no subscriptions with hidden limits, no dark patterns.
                    Just powerful software that helps you create better content, faster.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-secondary/30 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-sora font-bold mb-12 text-center">
            What I <span className="gradient-text">Stand For</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <GlassCard className="p-6 group" hover={false}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-sora font-semibold mb-2 gradient-text">Speed</h3>
              <p className="text-white/60 text-sm">
                Every feature is optimized for speed. No loading spinners,
                no waiting. Your workflow should feel instant.
              </p>
            </GlassCard>
            <GlassCard className="p-6 group" hover={false}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-sora font-semibold mb-2 gradient-text">Focus</h3>
              <p className="text-white/60 text-sm">
                I only build features that matter. No feature creep,
                no distractions. Everything serves your content goals.
              </p>
            </GlassCard>
            <GlassCard className="p-6 group" hover={false}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 flex items-center justify-center mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-sora font-semibold mb-2 gradient-text">Privacy</h3>
              <p className="text-white/60 text-sm">
                Your data stays on your machine. I don&apos;t track your
                content, your scripts, or your channel data.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Creator */}
      <section className="py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-sora font-bold mb-12 text-center">
            Meet <span className="gradient-text">Dillon</span>
          </h2>
          <div className="max-w-md mx-auto">
            <TeamCard {...creator} />
          </div>
        </div>
      </section>
    </>
  )
}
