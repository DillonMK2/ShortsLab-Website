import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackgroundAnimation from '@/components/BackgroundAnimation'
import FeatureDetailSection from '@/components/FeatureDetailSection'

export const metadata: Metadata = {
  title: 'Features - ShortsLab | AI-Powered YouTube Creation Tools',
  description: 'Explore ShortsLab features: AI Assistant, Research & Analytics, Script Scraper, Script Rewriter, VoiceLab, and The Vault. Everything you need for YouTube automation.',
  keywords: 'YouTube tools, AI assistant, script scraper, voiceover generator, channel analytics, content creation',
}

const features = [
  {
    id: 'ai-assistant',
    title: 'AI Assistant',
    description: 'Your personal YouTube strategy advisor powered by advanced AI. Get actionable insights, content recommendations, and growth strategies tailored to your niche.',
    bullets: [
      'Real-time strategy recommendations based on your channel data',
      'Content gap analysis to find untapped opportunities',
      'Trend prediction to stay ahead of the curve',
      'Personalized growth roadmap for your channel',
      'Q&A support for any YouTube-related questions',
    ],
    icon: '🤖',
  },
  {
    id: 'research-analytics',
    title: 'Research & Analytics',
    description: 'Deep dive into competitor channels and niche health. Track normalized view performance, identify underperforming categories, and discover what works in your space.',
    bullets: [
      'Track unlimited competitor channels in one dashboard',
      'Normalized view performance metrics (views per 1K subscribers)',
      'Niche health scoring to validate content ideas',
      'Identify trending topics before they peak',
      'Export comprehensive reports for your records',
    ],
    icon: '📊',
  },
  {
    id: 'my-channels',
    title: 'My Channels',
    description: 'All-in-one personal channel tracker that consolidates your YouTube analytics. Monitor revenue, views, watch time, and subscriber growth across multiple time periods.',
    bullets: [
      'Multi-channel support in a single view',
      'Revenue tracking with trend visualization',
      'Watch time analytics over 7D, 28D, 3M, 1Y periods',
      'Subscriber growth patterns and predictions',
      'Custom alerts for important milestones',
    ],
    icon: '📺',
  },
  {
    id: 'script-scraper',
    title: 'Script Scraper',
    description: 'Extract and analyze scripts from any YouTube channel. Build a library of successful content patterns organized by category for easy reference.',
    bullets: [
      'Scrape transcripts from any public video',
      'Auto-categorize scripts by topic and style',
      'Search across your entire script library',
      'Identify hook patterns that drive engagement',
      'Export scripts in multiple formats',
    ],
    icon: '📝',
  },
  {
    id: 'script-rewriter',
    title: 'Script Rewriter',
    description: 'Transform scraped content into original scripts using JSON style profiles. Replicate creator styles while maintaining your unique voice through AI-powered rewriting.',
    bullets: [
      'JSON-based style profiles for consistent output',
      'AI rewriting that preserves core messaging',
      'Ideation Lab generates ideas from scraped content',
      'Multiple tone and style variations per script',
      'Side-by-side comparison with original content',
    ],
    icon: '✨',
  },
  {
    id: 'voicelab',
    title: 'VoiceLab',
    description: 'Professional voiceover generation and editing in one place. Auto-format scripts, generate natural-sounding voices, and fine-tune timing with the built-in timeline editor.',
    bullets: [
      'Auto-format scripts line by line for recording',
      'Multiple AI voice options with emotion control',
      'Automatic silence trimming for clean audio',
      'Timeline editor with zoom, reorder, cut, and crop',
      'Export in multiple audio formats and qualities',
    ],
    icon: '🎙️',
  },
  {
    id: 'the-vault',
    title: 'The Vault',
    description: 'Centralized storage for all your finished audio content. Track production status, mark items as edited or posted, and never lose track of your content pipeline.',
    bullets: [
      'Organized storage for all generated audio',
      'Status tracking: draft, edited, posted',
      'Quick preview and playback functionality',
      'Batch operations for efficient workflow',
      'Integration with your publishing schedule',
    ],
    icon: '🗄️',
  },
]

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background relative">
      <BackgroundAnimation />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase glass-gradient text-accent-cyan mb-6">
            Features
          </span>
          <h1 className="mb-6">
            Every Tool You <span className="gradient-text">Need</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            ShortsLab brings together research, writing, voiceovers, and analytics
            in one powerful desktop application built for serious YouTube creators.
          </p>
        </div>
      </section>

      {/* Features */}
      <div className="relative z-10">
        {features.map((feature, index) => (
          <FeatureDetailSection
            key={feature.title}
            {...feature}
            reversed={index % 2 === 1}
          />
        ))}
      </div>

      <Footer />
    </main>
  )
}
