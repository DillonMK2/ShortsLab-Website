'use client'

import { motion } from 'framer-motion'
import Button from './Button'

export default function DownloadSection() {
  return (
    <section id="download" className="py-24 px-6 relative">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-t from-accent-cyan/10 via-accent-violet/5 to-transparent blur-[100px]" />
      </div>

      <div className="max-w-3xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase glass-gradient text-accent-violet mb-4">
            Get Started
          </span>
          <h2 className="mb-4">
            Download <span className="gradient-text">ShortsFlow</span>
          </h2>
          <p className="text-white/60 text-lg mb-10">
            Start creating better content today. Get started with a 7-day free trial.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Gradient border card */}
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-accent-violet via-accent-cyan to-accent-violet opacity-50 blur-[1px]" aria-hidden="true" />

          <div className="relative glass-gradient rounded-2xl p-8 md:p-12">
            {/* Download button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                href="#"
                variant="gradient"
                size="lg"
                glow
                className="text-lg"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  role="img"
                >
                  <title>Windows</title>
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                </svg>
                Download for Windows
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-white/40 text-sm">
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
                v1.0.0 Stable
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                2,500+ Downloads
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5">
                64-bit
              </span>
            </div>

            {/* Platform info */}
            <div className="mt-6 text-white/40 text-sm">
              <p>Windows 10+ required</p>
              <p className="mt-1 text-white/30">Mac and Linux versions coming soon</p>
            </div>

            {/* System requirements */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-8 pt-8 border-t border-white/10"
            >
              <h4 className="font-sora font-semibold text-white/80 mb-4 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                System Requirements
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'OS', value: 'Windows 10+' },
                  { label: 'RAM', value: '4GB min' },
                  { label: 'Storage', value: '500MB' },
                  { label: 'Network', value: 'Required' },
                ].map((req) => (
                  <div key={req.label} className="text-center p-3 rounded-lg bg-white/5">
                    <p className="text-white/40 text-xs uppercase tracking-wide">{req.label}</p>
                    <p className="text-white/80 font-medium mt-1">{req.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
