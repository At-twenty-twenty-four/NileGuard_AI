'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ThreatMetricsProps {
  locale: string;
}

const threatTypeData = [
  { name: 'Intrusion', value: 45, color: '#0ea5e9' },
  { name: 'Malware', value: 32, color: '#06b6d4' },
  { name: 'Phishing', value: 18, color: '#10b981' },
  { name: 'DDoS', value: 5, color: '#f59e0b' },
];

const timeSeriesData = [
  { time: '00:00', threats: 12, blocked: 11 },
  { time: '04:00', threats: 15, blocked: 14 },
  { time: '08:00', threats: 28, blocked: 25 },
  { time: '12:00', threats: 35, blocked: 33 },
  { time: '16:00', threats: 42, blocked: 40 },
  { time: '20:00', threats: 38, blocked: 36 },
  { time: '23:59', threats: 24, blocked: 23 },
];

export function ThreatMetrics({ locale }: ThreatMetricsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Threat Distribution */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Threat Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={threatTypeData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {threatTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} threats`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 24-Hour Threat Timeline */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">24-Hour Timeline</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              labelStyle={{ color: '#f1f5f9' }}
            />
            <Legend />
            <Line type="monotone" dataKey="threats" stroke="#ef4444" name="Detected" strokeWidth={2} />
            <Line type="monotone" dataKey="blocked" stroke="#10b981" name="Blocked" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
