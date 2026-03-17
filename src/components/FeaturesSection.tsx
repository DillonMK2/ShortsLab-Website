import FeatureCard from './FeatureCard'

const features = [
  {
    id: 'ai-assistant',
    title: 'AI Assistant',
    description: 'Get personalized YouTube strategy and guidance. Ask questions about your niche, content ideas, and growth tactics.',
    iconPath: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z',
  },
  {
    id: 'research-analytics',
    title: 'Research & Analytics',
    description: 'Track competitor channels with normalised view performance. Discover niche health scores and identify underperforming content categories.',
    iconPath: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  },
  {
    id: 'my-channels',
    title: 'My Channels',
    description: 'All-in-one personal channel tracker. Monitor revenue, views, watch time, and subscribers across 7D, 28D, 3M, and 1Y timeframes.',
    iconPath: 'M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z',
  },
  {
    id: 'script-scraper',
    title: 'Script Scraper',
    description: 'Scrape transcripts from any YouTube channel. Organize and save scripts by category for easy reference and analysis.',
    iconPath: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
  },
  {
    id: 'script-rewriter',
    title: 'Script Rewriter',
    description: 'Create JSON style profiles to replicate creator voices. AI-powered rewriting and an ideation lab that generates ideas from scraped content.',
    iconPath: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10',
  },
  {
    id: 'voicelab',
    title: 'VoiceLab',
    description: 'Auto-format scripts line by line, generate AI voiceovers, trim silence. Full timeline editor with zoom, reorder, cut, crop, and export.',
    iconPath: 'M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z',
  },
  {
    id: 'the-vault',
    title: 'The Vault',
    description: 'Central storage for all finished audio files. Mark content as edited or posted, and track your production progress at a glance.',
    iconPath: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 relative">
      {/* Background gradient accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-accent-violet/5 to-transparent blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header - CSS animation instead of Framer Motion */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase glass-gradient text-accent-cyan mb-4">
            Features
          </span>
          <h2 className="mb-4">
            Everything You <span className="gradient-text">Need</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            A complete toolkit for researching, creating, and managing your YouTube content workflow.
          </p>
        </div>

        {/* Features Grid - flexbox for centered last row */}
        <div className="flex flex-wrap justify-center items-stretch gap-6">
          {features.map((feature, index) => (
            <div key={feature.title} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex">
              <FeatureCard
                iconPath={feature.iconPath}
                title={feature.title}
                description={feature.description}
                index={index}
                href={`/features#${feature.id}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
