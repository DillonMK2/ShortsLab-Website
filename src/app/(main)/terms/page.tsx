import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - ShortsFlow',
  description: 'Terms of Service for ShortsFlow, the all-in-one YouTube automation studio.',
}

export default function TermsPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase glass-gradient text-accent-cyan mb-6">
            Legal
          </span>
          <h1 className="mb-6">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="text-white/60">
            Last updated: March 25, 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-invert prose-lg max-w-none">

            <div className="space-y-12">
              {/* Introduction */}
              <div className="space-y-4">
                <p className="text-white/80 leading-relaxed">
                  Welcome to ShortsFlow! These Terms of Service (&quot;Terms&quot;) govern your use of the ShortsFlow
                  desktop application and related services (collectively, the &quot;Service&quot;) operated by ShortsFlow
                  (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
                </p>
                <p className="text-white/80 leading-relaxed">
                  By downloading, installing, or using ShortsFlow, you agree to be bound by these Terms. If you
                  disagree with any part of these Terms, you may not use our Service.
                </p>
              </div>

              {/* Section 1 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">1. Description of Service</h2>
                <p className="text-white/80 leading-relaxed">
                  ShortsFlow is a desktop application designed for YouTube content creators. The Service provides
                  tools for competitor research, AI-powered script generation, and voiceover creation to help
                  streamline your content creation workflow.
                </p>
              </div>

              {/* Section 2 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">2. Account Registration</h2>
                <p className="text-white/80 leading-relaxed">
                  To use ShortsFlow, you must create an account using a valid email address. You are responsible for:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Ensuring your account information is accurate and up-to-date</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">3. Subscription Plans & Pricing</h2>
                <p className="text-white/80 leading-relaxed">
                  ShortsFlow offers the following subscription plans:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                  <li><strong className="text-white">Starter Plan:</strong> $15.99 per month</li>
                  <li><strong className="text-white">Pro Plan:</strong> $34.99 per month (includes 7-day free trial)</li>
                </ul>
                <p className="text-white/80 leading-relaxed">
                  Subscriptions are billed on a recurring monthly basis. You authorize us to charge your payment
                  method automatically each billing cycle until you cancel your subscription.
                </p>
              </div>

              {/* Section 4 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">4. Free Trial</h2>
                <p className="text-white/80 leading-relaxed">
                  The Pro Plan includes a 7-day free trial for new subscribers. During the trial period, you have
                  full access to Pro features. If you do not cancel before the trial ends, your subscription will
                  automatically convert to a paid subscription and you will be charged the applicable fee.
                </p>
              </div>

              {/* Section 5 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">5. Refund Policy</h2>
                <p className="text-white/80 leading-relaxed">
                  We want you to be satisfied with ShortsFlow. Our refund policy is as follows:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                  <li><strong className="text-white">Pro Plan Trial:</strong> Cancel anytime during your 7-day trial at no charge</li>
                  <li><strong className="text-white">Paid Subscriptions:</strong> You may request a refund within 7 days of your billing date if you haven&apos;t extensively used the Service during that period</li>
                  <li><strong className="text-white">Cancellation:</strong> You can cancel your subscription at any time. You&apos;ll retain access until the end of your current billing period</li>
                </ul>
                <p className="text-white/80 leading-relaxed">
                  To request a refund, contact us at{' '}
                  <a href="mailto:support@shortsflow.io" className="text-accent-cyan hover:underline">
                    support@shortsflow.io
                  </a>.
                </p>
              </div>

              {/* Section 6 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">6. User Responsibilities</h2>
                <p className="text-white/80 leading-relaxed">
                  When using ShortsFlow, you agree to:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                  <li>Use the Service only for lawful purposes</li>
                  <li>Comply with YouTube&apos;s Terms of Service and Community Guidelines</li>
                  <li>Not use the Service to create content that is illegal, harmful, or infringes on others&apos; rights</li>
                  <li>Not attempt to reverse engineer, decompile, or hack the software</li>
                  <li>Not share your account credentials with others</li>
                  <li>Not use automated systems to abuse the Service</li>
                  <li>Respect intellectual property rights when using AI-generated content</li>
                </ul>
              </div>

              {/* Section 7 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">7. Intellectual Property</h2>
                <p className="text-white/80 leading-relaxed">
                  The ShortsFlow application, including its design, features, and code, is owned by ShortsFlow and
                  protected by intellectual property laws. Your subscription grants you a limited, non-exclusive,
                  non-transferable license to use the software.
                </p>
                <p className="text-white/80 leading-relaxed">
                  Content you create using ShortsFlow (scripts, voiceovers, etc.) belongs to you. You retain full
                  ownership of your creative work.
                </p>
              </div>

              {/* Section 8 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">8. Third-Party Services</h2>
                <p className="text-white/80 leading-relaxed">
                  ShortsFlow integrates with third-party services to provide its features. By using ShortsFlow,
                  you acknowledge and agree to the terms of these services:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                  <li>YouTube API Services (subject to YouTube Terms of Service)</li>
                  <li>AI services for script generation</li>
                  <li>Voice synthesis services for voiceovers</li>
                </ul>
                <p className="text-white/80 leading-relaxed">
                  We are not responsible for the availability, accuracy, or policies of third-party services.
                </p>
              </div>

              {/* Section 9 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">9. Service Availability</h2>
                <p className="text-white/80 leading-relaxed">
                  We strive to keep ShortsFlow available at all times, but we do not guarantee uninterrupted
                  access. The Service may be temporarily unavailable due to maintenance, updates, or circumstances
                  beyond our control. We are not liable for any losses resulting from service interruptions.
                </p>
              </div>

              {/* Section 10 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">10. Termination</h2>
                <p className="text-white/80 leading-relaxed">
                  We reserve the right to suspend or terminate your account if you:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                  <li>Violate these Terms of Service</li>
                  <li>Engage in fraudulent or illegal activity</li>
                  <li>Abuse the Service or its resources</li>
                  <li>Fail to pay subscription fees</li>
                </ul>
                <p className="text-white/80 leading-relaxed">
                  You may terminate your account at any time by canceling your subscription and contacting us.
                  Upon termination, your right to use the Service ceases immediately.
                </p>
              </div>

              {/* Section 11 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">11. Limitation of Liability</h2>
                <p className="text-white/80 leading-relaxed">
                  To the maximum extent permitted by law, ShortsFlow shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages, including but not limited to loss of
                  profits, data, or business opportunities arising from your use of the Service.
                </p>
                <p className="text-white/80 leading-relaxed">
                  Our total liability for any claims arising from these Terms or your use of the Service shall
                  not exceed the amount you paid us in the 12 months preceding the claim.
                </p>
              </div>

              {/* Section 12 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">12. Disclaimer of Warranties</h2>
                <p className="text-white/80 leading-relaxed">
                  ShortsFlow is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either
                  express or implied. We do not guarantee that:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                  <li>The Service will meet your specific requirements</li>
                  <li>The Service will be error-free or uninterrupted</li>
                  <li>AI-generated content will be accurate or suitable for your purposes</li>
                  <li>The results you achieve using the Service will be successful</li>
                </ul>
              </div>

              {/* Section 13 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">13. Changes to Terms</h2>
                <p className="text-white/80 leading-relaxed">
                  We may update these Terms from time to time. When we make significant changes, we will notify
                  you via email or through the application. Your continued use of the Service after changes take
                  effect constitutes acceptance of the new Terms.
                </p>
              </div>

              {/* Section 14 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">14. Governing Law</h2>
                <p className="text-white/80 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with applicable laws, without
                  regard to conflict of law principles. Any disputes arising from these Terms shall be resolved
                  through binding arbitration or in the courts of competent jurisdiction.
                </p>
              </div>

              {/* Section 15 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">15. Contact Us</h2>
                <p className="text-white/80 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <p className="text-white/80">
                  <strong className="text-white">Email:</strong>{' '}
                  <a href="mailto:support@shortsflow.io" className="text-accent-cyan hover:underline">
                    support@shortsflow.io
                  </a>
                </p>
                <p className="text-white/80">
                  <strong className="text-white">Company:</strong> ShortsFlow
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}
