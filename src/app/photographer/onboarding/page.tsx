'use client'

/**
 * /photographer/onboarding
 *
 * FREE MODE: Platform is free — no subscription upsell needed.
 * Redirect immediately to the photographer dashboard.
 *
 * The original subscription-prompt UI is preserved below in comments.
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PhotographerOnboardingPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/photographer/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#C0A4A3] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

/*
 * ── ORIGINAL ONBOARDING CODE (kept for future use) ───────────────────────────
 *
 * Showed a card after photographer registration with:
 *  - Title: "حسابك تم إنشاؤه بنجاح"
 *  - Info card: "للظهور في البحث واستقبال الطلبات يجب تفعيل الاشتراك الشهري بقيمة 49 ريال"
 *  - Feature list: search visibility, receiving requests, submitting bids
 *  - Primary CTA: href="/pricing" → "فعّل اشتراكك الآن"
 *  - Skip link: href="/photographer/dashboard" → "متابعة بدون اشتراك"
 */
