'use client';

import { useState } from 'react';
import { Key, Lock, Unlock, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PQCProps {
  locale: string;
}

export function PostQuantumCrypto({ locale }: PQCProps) {
  const [keys, setKeys] = useState([
    { id: 1, name: 'ML-KEM-768', algorithm: 'Kyber', status: 'active', created: '2026-06-15', expires: '2027-06-15', strength: 256 },
    { id: 2, name: 'ML-DSA-65', algorithm: 'Dilithium', status: 'active', created: '2026-06-10', expires: '2026-12-10', strength: 192 },
    { id: 3, name: 'CRYSTALS-Kyber', algorithm: 'NIST Selected', status: 'expiring_soon', created: '2026-02-01', expires: '2026-08-01', strength: 256 },
  ]);

  const [copied, setCopied] = useState<number | null>(null);

  const copyToClipboard = (id: number) => {
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-500';
      case 'expiring_soon':
        return 'bg-orange-500/20 text-orange-500';
      case 'expired':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-primary/20 text-primary';
    }
  };

  const texts = {
    en: {
      title: 'Post-Quantum Cryptography Management',
      description: 'Manage quantum-resistant encryption keys and certificates',
      activeKeys: 'Active Keys',
      algorithm: 'Algorithm',
      status: 'Status',
      created: 'Created',
      expires: 'Expires',
      strength: 'Strength',
      bits: 'bits',
      generateNew: 'Generate New Key',
      viewDetails: 'View Details',
      revokeKey: 'Revoke Key',
      keyManagement: 'Key Management',
      encryptionStandards: 'Encryption Standards',
      quantumResistant: 'Quantum-Resistant Encryption Active',
      hybridApproach: 'Hybrid Approach: Post-Quantum + Classic',
    },
    am: {
      title: 'ከኳንተም በኋላ ምስጢር ተ্যাগ ግንኙነት',
      description: 'ኳንተም-ተጋላጭ ምስጢር ቁልፍ እና ሰርተፊኬቶች ያስተዳድሩ',
      activeKeys: 'ንቁ ቁልፎች',
      algorithm: 'ስሌት',
      status: 'ሁኔታ',
      created: 'ተፈጠረ',
      expires: 'ያልቆ',
      strength: 'ጥንካሬ',
      bits: 'ቢት',
      generateNew: 'አዲስ ቁልፍ ጥምጣም',
      viewDetails: 'ዝርዝሮችን ይመልከቱ',
      revokeKey: 'ቁልፍ ተመልሳ',
      keyManagement: 'ቁልፍ ግንኙነት',
      encryptionStandards: 'ምስጢር ደረጃዎች',
      quantumResistant: 'ኳንተም-ተጋላጭ ምስጢር ንቁ',
      hybridApproach: 'ድብልቅ አቀራረብ፡ ከኳንተም በኋላ + ክላሲክ',
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.en;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      {/* Alert */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-green-500">{t.quantumResistant}</p>
          <p className="text-sm text-muted-foreground">{t.hybridApproach}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Keys Table */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              {t.keyManagement}
            </h2>
            <Button className="bg-primary hover:bg-primary/90">
              <Lock className="w-4 h-4 mr-2" />
              {t.generateNew}
            </Button>
          </div>

          {/* Keys List */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">{t.algorithm}</th>
                  <th className="pb-3 font-semibold">{t.status}</th>
                  <th className="pb-3 font-semibold">{t.strength}</th>
                  <th className="pb-3 font-semibold">{t.expires}</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => (
                  <tr key={key.id} className="border-b border-border/50 hover:bg-background/50 transition">
                    <td className="py-3 font-medium text-foreground">{key.name}</td>
                    <td className="py-3 text-muted-foreground">{key.algorithm}</td>
                    <td className="py-3">
                      <Badge className={getStatusColor(key.status)}>
                        {key.status === 'active' ? 'Active' : key.status === 'expiring_soon' ? 'Expiring Soon' : 'Expired'}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">{key.strength} {t.bits}</td>
                    <td className="py-3 text-muted-foreground">{key.expires}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => copyToClipboard(key.id)}
                        className="p-1 hover:bg-background rounded transition text-muted-foreground hover:text-foreground"
                        title="Copy"
                      >
                        {copied === key.id ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Standards & Info */}
        <div className="space-y-6">
          {/* Encryption Standards */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              {t.encryptionStandards}
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-background/50 rounded-lg border border-primary/10">
                <p className="font-semibold text-primary text-sm mb-1">ML-KEM (Key Encapsulation)</p>
                <p className="text-xs text-muted-foreground">NIST FIPS 203 Standardized</p>
              </div>

              <div className="p-3 bg-background/50 rounded-lg border border-accent/10">
                <p className="font-semibold text-accent text-sm mb-1">ML-DSA (Digital Signatures)</p>
                <p className="text-xs text-muted-foreground">NIST FIPS 204 Standardized</p>
              </div>

              <div className="p-3 bg-background/50 rounded-lg border border-orange-500/10">
                <p className="font-semibold text-orange-500 text-sm mb-1">SLH-DSA (Stateless Hash)</p>
                <p className="text-xs text-muted-foreground">NIST FIPS 205 Standardized</p>
              </div>
            </div>
          </div>

          {/* Key Statistics */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Key Statistics</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                <span className="text-sm text-muted-foreground">Active Keys</span>
                <span className="font-semibold text-foreground">{keys.filter(k => k.status === 'active').length}</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                <span className="text-sm text-muted-foreground">Average Strength</span>
                <span className="font-semibold text-foreground">
                  {Math.round(keys.reduce((sum, k) => sum + k.strength, 0) / keys.length)} bits
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                <span className="text-sm text-muted-foreground">Quantum-Safe</span>
                <span className="font-semibold text-green-500">✓ Yes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
