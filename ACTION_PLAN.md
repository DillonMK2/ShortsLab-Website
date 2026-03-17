# ShortsLab - Action Plan

## What's Done

### Supabase Auth
- [x] Supabase project connected
- [x] Environment variables configured (`.env.local`)
- [x] Email/password signup working
- [x] Email verification working
- [x] Custom branded email templates created (`email-templates/`)
- [x] Password reset flow built (`/account/reset-password`)

### Payments (LemonSqueezy)
- [x] LemonSqueezy account created
- [x] Store set up (shortslab.lemonsqueezy.com)
- [x] Products created:
  - Starter: $15.99/month
  - Pro: $34.99/month (7-day free trial)
- [x] Checkout URLs added to `.env.local`
- [x] Webhook handler code ready (`/api/webhooks/lemonsqueezy`)
- [x] Pricing page links to LemonSqueezy checkout

### Database
- [x] `subscriptions` table created in Supabase
- [x] Row Level Security (RLS) enabled
- [x] Auto-creates subscription row on user signup
- [x] Plans: free, starter, pro
- [x] Statuses: active, inactive, on_trial, cancelled, past_due, paused

### Website Features
- [x] Account settings page (`/account`)
- [x] Shows current plan, credits, status
- [x] Change password with confirmation
- [x] Header shows "Account" button when logged in

### Desktop App (Tauri)
- [x] Same Supabase credentials configured
- [x] Plan/status types aligned with website
- [x] `canUseFeature()` helper added
- [x] Ready to sync with website subscriptions

---

## What's Left (Tomorrow)

### 1. Buy a Domain
- [ ] Choose a domain name (shortslab alternatives since .com is taken)
- [ ] Buy from Namecheap, Cloudflare, or Porkbun
- [ ] Suggestions: `getshortslab.com`, `shortslab.io`, `shortslab.co`

### 2. Deploy Website to Vercel
- [ ] Create Vercel account (vercel.com)
- [ ] Connect GitHub repo
- [ ] Add environment variables in Vercel dashboard:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://fchpwgjeapgfzsrxzslr.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_fNAfeR81DfVzFsER4x8tsQ_LMMVBOgx
  SUPABASE_SERVICE_ROLE_KEY=sb_secret_DU8OHYRjs18cg_Lc8_Ro0g_tzFFmhxa
  NEXT_PUBLIC_LEMONSQUEEZY_STARTER_URL=https://shortslab.lemonsqueezy.com/checkout/buy/4d0f3ec9-25df-4b32-84e7-1ce6e53aacc3
  NEXT_PUBLIC_LEMONSQUEEZY_PRO_URL=https://shortslab.lemonsqueezy.com/checkout/buy/d838e960-2704-464e-88a8-e071bdedaf65
  LEMONSQUEEZY_WEBHOOK_SECRET=(get from LemonSqueezy after setting up webhook)
  ```
- [ ] Deploy
- [ ] Connect custom domain

### 3. Configure LemonSqueezy Webhook
- [ ] Go to LemonSqueezy > Settings > Webhooks
- [ ] Add webhook URL: `https://yourdomain.com/api/webhooks/lemonsqueezy`
- [ ] Select events: subscription_created, subscription_updated, subscription_cancelled
- [ ] Copy signing secret
- [ ] Add `LEMONSQUEEZY_WEBHOOK_SECRET` to Vercel env vars
- [ ] Redeploy

### 4. Update Supabase Auth Settings
- [ ] Go to Supabase > Authentication > URL Configuration
- [ ] Update Site URL to your domain: `https://yourdomain.com`
- [ ] Add redirect URL: `https://yourdomain.com/auth/callback`

### 5. Update LemonSqueezy Redirect
- [ ] Go to LemonSqueezy > Settings > Store
- [ ] Set confirmation button link to: `https://yourdomain.com/?subscribed=true`

### 6. Test End-to-End
- [ ] Sign up with new email
- [ ] Subscribe to a plan (use test mode)
- [ ] Check Supabase `subscriptions` table updates
- [ ] Check `/account` page shows correct plan
- [ ] Test login on Tauri desktop app
- [ ] Verify `canUseFeature()` works

---

## Future Tasks (When Ready to Rebrand)

- [ ] Choose new name/domain
- [ ] Find-and-replace "ShortsLab" across codebase
- [ ] Regenerate logo SVGs
- [ ] Update email templates
- [ ] Update Supabase project name
- [ ] Update LemonSqueezy store name
- [ ] Update Tauri app branding

---

## Quick Reference

**Supabase Dashboard:**
https://supabase.com/dashboard/project/fchpwgjeapgfzsrxzslr

**LemonSqueezy Dashboard:**
https://app.lemonsqueezy.com

**Local Dev:**
```bash
npm run dev
```

**Key Files:**
- `.env.local` - Environment variables
- `src/app/account/page.tsx` - Account settings
- `src/app/api/webhooks/lemonsqueezy/route.ts` - Payment webhook
- `supabase/subscriptions-table.sql` - Database schema
- `email-templates/` - Branded email templates
