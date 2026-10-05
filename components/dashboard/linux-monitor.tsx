'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const sampleLogs = `Sep 03 09:14:22 ethiolab sshd[1842]: Failed password for invalid user admin from 185.73.44.19 port 51022 ssh2
Sep 03 09:14:25 ethiolab sshd[1843]: Failed password for invalid user admin from 185.73.44.19 port 51023 ssh2
Sep 03 09:14:29 ethiolab sshd[1844]: Failed password for root from 185.73.44.19 port 51024 ssh2
Sep 03 09:15:02 ethiolab sshd[1848]: Accepted publickey for ops from 10.10.2.15 port 42311 ssh2`

type Result = { received: number; failedAttempts: number; acceptedLogins: number; threats: Array<{ ip: string; user: string; attempts: number; severity: string; title: string; explanation: string; recommendations: string[]; mode: string }> }

export function LinuxMonitor() {
  const [logs, setLogs] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const summary = useMemo(() => result ? `${result.received} lines parsed · ${result.failedAttempts} failed attempts · ${result.acceptedLogins} successful logins` : 'Paste /var/log/auth.log or journald output to begin', [result])

  async function analyze() {
    if (!logs.trim()) return
    setLoading(true)
    const response = await fetch('/api/monitoring/ingest', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ logs }) })
    const data = await response.json()
    setResult(data)
    setLastUpdated(new Date().toLocaleTimeString())
    setLoading(false)
  }

  return (
    <Card className="border-border/70 bg-card/80 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /><p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Linux auth collector</p></div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">SSH activity monitor</h2>
          <p className="mt-1 text-sm text-muted-foreground">Detect failed SSH logins and turn raw events into clear response guidance.</p>
        </div>
        <Badge variant="outline" className="w-fit">{lastUpdated ? `Updated ${lastUpdated}` : 'Collector ready'}</Badge>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-3">
          <label htmlFor="auth-log" className="text-sm font-medium">Authentication logs</label>
          <textarea id="auth-log" value={logs} onChange={(event) => setLogs(event.target.value)} placeholder="Paste Linux /var/log/auth.log entries here…" className="min-h-44 w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-xs leading-5 outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" />
          <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={() => setLogs(sampleLogs)}>Load sample events</Button><Button type="button" onClick={analyze} disabled={!logs.trim() || loading}>{loading ? 'Analyzing…' : 'Analyze events'}</Button></div>
        </div>
        <div className="rounded-md border border-border/70 bg-background/60 p-4"><p className="text-xs text-muted-foreground">Pipeline status</p><p className="mt-2 text-sm leading-6">{summary}</p>{result?.threats?.length ? <div className="mt-4 flex flex-col gap-3">{result.threats.map((threat) => <div key={`${threat.ip}-${threat.user}`} className="rounded-md border border-destructive/30 bg-destructive/5 p-3"><div className="flex items-center justify-between gap-3"><p className="font-medium">{threat.title}</p><Badge variant="destructive">{threat.severity}</Badge></div><p className="mt-2 text-sm leading-6 text-muted-foreground">{threat.explanation}</p><p className="mt-2 font-mono text-xs text-muted-foreground">{threat.ip} · user {threat.user}</p><ul className="mt-3 list-disc pl-5 text-xs leading-5 text-muted-foreground">{threat.recommendations.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div> : <p className="mt-4 text-sm text-muted-foreground">No suspicious SSH activity has been analyzed yet.</p>}</div>
      </div>
    </Card>
  )
}
