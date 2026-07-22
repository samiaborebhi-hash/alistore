import { NextRequest, NextResponse } from 'next/server'

export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '').trim().slice(0, 5000)
}
