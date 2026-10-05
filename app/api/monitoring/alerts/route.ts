import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const channels = Array.isArray(body.channels) ? body.channels.filter((channel: unknown) => channel === 'email' || channel === 'telegram') : []
  return NextResponse.json({ delivered: false, mode: 'configuration-required', channels, message: 'Alert event accepted. Connect email or Telegram credentials in production to deliver notifications.' }, { status: 202 })
}

export async function GET() {
  return NextResponse.json({ email: { configured: false, status: 'not connected' }, telegram: { configured: false, status: 'not connected' } })
}
