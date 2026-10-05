import { NextResponse } from 'next/server'

const failedSshPattern = /Failed password for (?:invalid user )?(?<user>\S+) from (?<ip>\S+) port (?<port>\d+)/i
const acceptedSshPattern = /Accepted (?:password|publickey) for (?<user>\S+) from (?<ip>\S+)/i

function explain(event: { user: string; ip: string; attempts: number }) {
  const severity = event.attempts >= 8 ? 'critical' : event.attempts >= 3 ? 'high' : 'medium'
  return {
    severity,
    title: `${event.attempts} failed SSH attempts detected`,
    explanation: `Repeated authentication failures for ${event.user} from ${event.ip} indicate a likely password-spraying or brute-force attempt. Investigate the source, enforce key-based access, and rate-limit or block the address if it is not trusted.`,
    recommendations: ['Disable password authentication where possible', 'Review sshd and firewall logs for the same source', 'Add a temporary block or rate limit after validation'],
    mode: 'rule-assisted',
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const lines = String(body.logs ?? '').split(/\r?\n/).filter(Boolean)
    const failures = new Map<string, { user: string; ip: string; attempts: number; lastSeen: string }>()
    const accepted: Array<{ user: string; ip: string; line: string }> = []

    for (const line of lines) {
      const failed = line.match(failedSshPattern)
      if (failed?.groups) {
        const key = `${failed.groups.user}:${failed.groups.ip}`
        const current = failures.get(key) ?? { user: failed.groups.user, ip: failed.groups.ip, attempts: 0, lastSeen: line.slice(0, 15) }
        current.attempts += 1
        failures.set(key, current)
      }
      const success = line.match(acceptedSshPattern)
      if (success?.groups) accepted.push({ user: success.groups.user, ip: success.groups.ip, line })
    }

    const threats = [...failures.values()].map((event) => ({ ...event, ...explain(event) }))
    return NextResponse.json({ received: lines.length, failedAttempts: threats.reduce((sum, item) => sum + item.attempts, 0), acceptedLogins: accepted.length, threats, accepted })
  } catch {
    return NextResponse.json({ error: 'Invalid log payload' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ready', collector: 'linux-auth-log', patterns: ['Failed password', 'Accepted password', 'Accepted publickey'] })
}
