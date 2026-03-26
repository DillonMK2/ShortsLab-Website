import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - ShortsFlow',
  description: 'Privacy Policy for ShortsFlow. Learn how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase glass-gradient text-accent-cyan mb-6">
            Legal
          </span>
          <h1 className="mb-6">
            Privacy <span className="gradient-text">Policy</span>
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
                  At ShortsFlow, we take your privacy seriously. This Privacy Policy explains how we collect,
                  use, store, and protect your information when you use the ShortsFlow desktop application and
                  related services (the &quot;Service&quot;).
                </p>
                <p className="text-white/80 leading-relaxed">
                  By using ShortsFlow, you agree to the collection and use of information as described in this
                  policy. We will not use or share your information except as described here.
                </p>
              </div>

              {/* Section 1 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">1. Information We Collect</h2>

                <h3 className="text-lg font-sora font-semibold text-white/90 mt-6">Account Information</h3>
                <p className="text-white/80 leading-relaxed">
                  When you create an account, we collect:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                  <li><strong className="text-white">Email address:</strong> Used for account authentication, communication, and support</li>
                  <li><strong className="text-white">Password:</strong> Securely hashed and stored (we never see your actual password)</li>
                  <li><strong className="text-white">Profile information:</strong> Any optional profile details you choose to provide</li>
                </ul>

                <h3 className="text-lg font-sora font-semibold text-white/90 mt-6">OAuth Tokens</h3>
                <p className="text-white/80 leading-relaxed">
                  When you connect your YouTube account, we receive OAuth tokens that allow the app to access
                  YouTube data on your behalf. These tokens:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                  <li>Are stored securely in our database</li>
                  <li>Are used only to fetch YouTube data you&apos;ve authorized</li>
                  <li>Can be revoked at any time through your YouTube account settings</li>
                  <li>Follow YouTube API Services Terms of Service</li>
                </ul>

                <h3 className="text-lg font-sora font-semibold text-white/90 mt-6">Usage Data</h3>
                <p className="text-white/80 leading-relaxed">
                  We collect anonymous usage data to improve the Service:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                  <li>Feature usage statistics (which features you use and how often)</li>
                  <li>Error reports and crash logs</li>
                  <li>App performance metrics</li>
                  <li>Subscription and billing events</li>
                </ul>

                <h3 className="text-lg font-sora font-semibold text-white/90 mt-6">Content Data</h3>
                <p className="text-white/80 leading-relaxed">
                  When you use our AI features, we process:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                  <li>Script prompts and generated scripts (temporarily processed, not permanently stored on our servers)</li>
                  <li>Voiceover text (sent to voice synthesis services)</li>
                  <li>Research queries and competitor data you request</li>
                </ul>
              </div>

              {/* Section 2 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">2. How We Use Your Information</h2>
                <p className="text-white/80 leading-relaxed">
                  We use the collected information to:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                  <li><strong className="text-white">Provide the Service:</strong> Authenticate your account, enable features, and deliver functionality</li>
                  <li><strong className="text-white">Process payments:</strong> Manage subscriptions and billing through our payment provider</li>
                  <li><strong className="text-white">Improve the Service:</strong> Analyze usage patterns to enhance features and fix bugs</li>
                  <li><strong className="text-white">Communicate with you:</strong> Send important updates, respond to support requests, and notify you of changes</li>
                  <li><strong className="text-white">Ensure security:</strong> Detect and prevent fraud, abuse, and security threats</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">3. Third-Party Services</h2>
                <p className="text-white/80 leading-relaxed">
                  ShortsFlow integrates with the following third-party services. Each has their own privacy
                  policies that govern how they handle your data:
                </p>

                <h3 className="text-lg font-sora font-semibold text-white/90 mt-6">Supabase</h3>
                <p className="text-white/80 leading-relaxed">
                  We use Supabase for authentication and database storage. Your account data, OAuth tokens, and
                  app data are stored securely in Supabase infrastructure.
                </p>

                <h3 className="text-lg font-sora font-semibold text-white/90 mt-6">LemonSqueezy</h3>
                <p className="text-white/80 leading-relaxed">
                  We use LemonSqueezy to process payments and manage subscriptions. They handle your payment
                  information directly &mdash; we do not store your credit card details.
                </p>

                <h3 className="text-lg font-sora font-semibold text-white/90 mt-6">Anthropic (Claude AI)</h3>
                <p className="text-white/80 leading-relaxed">
                  We use Anthropic&apos;s Claude AI for script generation features. Your prompts and generated
                  content are processed through their API. Anthropic may retain data as described in their
                  privacy policy.
                </p>

                <h3 className="text-lg font-sora font-semibold text-white/90 mt-6">ElevenLabs</h3>
                <p className="text-white/80 leading-relaxed">
                  We use ElevenLabs for AI voiceover generation. Text you submit for voiceovers is sent to their
                  service for processing.
                </p>

                <h3 className="text-lg font-sora font-semibold text-white/90 mt-6">YouTube API Services</h3>
                <p className="text-white/80 leading-relaxed">
                  ShortsFlow uses YouTube API Services. By using our Service, you are also bound by the{' '}
                  <a
                    href="https://www.youtube.com/t/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-cyan hover:underline"
                  >
                    YouTube Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-cyan hover:underline"
                  >
                    Google Privacy Policy
                  </a>.
                </p>
              </div>

              {/* Section 4 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">4. Data Storage & Security</h2>
                <p className="text-white/80 leading-relaxed">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                  <li>All data is encrypted in transit using TLS/SSL</li>
                  <li>Passwords are hashed using secure algorithms</li>
                  <li>OAuth tokens are stored securely and encrypted at rest</li>
                  <li>We use secure, reputable cloud infrastructure</li>
                  <li>Access to user data is restricted to essential personnel only</li>
                </ul>
                <p className="text-white/80 leading-relaxed">
                  While we take security seriously, no method of transmission or storage is 100% secure. We
                  cannot guarantee absolute security but strive to protect your information using commercially
                  acceptable means.
                </p>
              </div>

              {/* Section 5 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">5. Data Retention</h2>
                <p className="text-white/80 leading-relaxed">
                  We retain your data for as long as your account is active or as needed to provide the Service.
                  Specifically:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                  <li><strong className="text-white">Account data:</strong> Retained until you delete your account</li>
                  <li><strong className="text-white">Usage data:</strong> Retained in anonymized form for analytics</li>
                  <li><strong className="text-white">AI-generated content:</strong> Not permanently stored on our servers</li>
                  <li><strong className="text-white">Payment records:</strong> Retained as required by law for accounting purposes</li>
                </ul>
                <p className="text-white/80 leading-relaxed">
                  When you delete your account, we will delete or anonymize your personal data within 30 days,
                  except where we are required to retain it for legal obligations.
                </p>
              </div>

              {/* Section 6 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">6. Your Rights</h2>
                <p className="text-white/80 leading-relaxed">
                  You have the following rights regarding your personal data:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                  <li><strong className="text-white">Access:</strong> Request a copy of the personal data we hold about you</li>
                  <li><strong className="text-white">Correction:</strong> Request correction of inaccurate personal data</li>
                  <li><strong className="text-white">Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong className="text-white">Portability:</strong> Request your data in a portable format</li>
                  <li><strong className="text-white">Objection:</strong> Object to certain processing of your data</li>
                  <li><strong className="text-white">Withdraw consent:</strong> Withdraw consent where processing is based on consent</li>
                </ul>
                <p className="text-white/80 leading-relaxed">
                  To exercise any of these rights, contact us at{' '}
                  <a href="mailto:support@shortsflow.io" className="text-accent-cyan hover:underline">
                    support@shortsflow.io
                  </a>.
                </p>
              </div>

              {/* Section 7 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">7. Revoking YouTube Access</h2>
                <p className="text-white/80 leading-relaxed">
                  You can revoke ShortsFlow&apos;s access to your YouTube data at any time through the{' '}
                  <a
                    href="https://security.google.com/settings/security/permissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-cyan hover:underline"
                  >
                    Google Security Settings
                  </a>{' '}
                  page. Once revoked, we will no longer be able to access your YouTube data, and related features
                  will be disabled.
                </p>
              </div>

              {/* Section 8 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">8. Children&apos;s Privacy</h2>
                <p className="text-white/80 leading-relaxed">
                  ShortsFlow is not intended for children under the age of 13. We do not knowingly collect
                  personal information from children under 13. If you believe we have collected information from
                  a child under 13, please contact us immediately and we will take steps to delete such information.
                </p>
              </div>

              {/* Section 9 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">9. International Data Transfers</h2>
                <p className="text-white/80 leading-relaxed">
                  Your information may be transferred to and processed in countries other than your country of
                  residence. These countries may have different data protection laws. By using the Service, you
                  consent to the transfer of your information to these countries.
                </p>
              </div>

              {/* Section 10 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">10. Cookies & Local Storage</h2>
                <p className="text-white/80 leading-relaxed">
                  As a desktop application, ShortsFlow uses local storage to save your preferences and session
                  data. This data is stored locally on your device and is not transmitted to our servers unless
                  necessary for the Service to function.
                </p>
              </div>

              {/* Section 11 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">11. Changes to This Policy</h2>
                <p className="text-white/80 leading-relaxed">
                  We may update this Privacy Policy from time to time. When we make significant changes, we will
                  notify you via email or through the application. The updated policy will be effective when
                  posted, and your continued use of the Service constitutes acceptance of the changes.
                </p>
              </div>

              {/* Section 12 */}
              <div className="space-y-4">
                <h2 className="text-xl font-sora font-bold gradient-text">12. Contact Us</h2>
                <p className="text-white/80 leading-relaxed">
                  If you have any questions about this Privacy Policy or how we handle your data, please contact us:
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
