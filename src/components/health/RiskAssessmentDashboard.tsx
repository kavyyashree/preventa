'use client'

import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

type MedicalCondition = {
  id: string
  condition: string
  diagnosisDate: string
  severity: 'mild' | 'moderate' | 'severe'
  treatment: string
  notes: string
}

type FamilyMember = {
  id: string
  name: string
  relationship: string
  age: number
  gender: string
  medicalHistory: MedicalCondition[]
  documents: any[]
}

type Props = {
  familyMembers?: FamilyMember[]
}

export default function RiskAssessmentDashboard({ familyMembers = [] }: Props) {
  // Aggregate disease scores from family history and map to percentage
  const diseaseRisks = useMemo(() => {
    const baseRiskMap: Record<string, number> = {
      'diabetes': 8,
      'heart disease': 10,
      'hypertension': 12,
      'cancer': 5,
      'stroke': 4,
      "alzheimer's": 3,
      'arthritis': 6,
      'asthma': 5,
      'depression': 7,
      'osteoporosis': 4,
      'breast cancer': 5,
      'prostate cancer': 5
    }

    const relWeight = (rel: string) => {
      const r = (rel || '').toLowerCase()
      if (r.includes('parent') || r.includes('father') || r.includes('mother') || r.includes('sibling') || r.includes('child') || r.includes('spouse')) return 1
      if (r.includes('grand') || r.includes('aunt') || r.includes('uncle') || r.includes('cousin')) return 0.5
      return 0.5
    }

    const severityFactor = (s: string) => s === 'severe' ? 12 : s === 'moderate' ? 8 : 4

    const scores: Record<string, { base: number; score: number }> = {}

    ;(familyMembers || []).forEach(member => {
      ;(member.medicalHistory || []).forEach(cond => {
        if (!cond || !cond.condition) return
        const key = cond.condition
        const keyLower = key.toLowerCase()
        // find matching base key if available
        const matched = Object.keys(baseRiskMap).find(k => keyLower.includes(k) || k.includes(keyLower))
        const base = matched ? baseRiskMap[matched] : 5
        const increment = relWeight(member.relationship) * severityFactor(cond.severity)
        if (!scores[key]) scores[key] = { base, score: 0 }
        scores[key].score += increment
      })
    })

    // map to percentage: base + score, capped
    const result = Object.entries(scores).map(([disease, { base, score }]) => {
      const raw = base + score
      const percent = Math.min(95, Math.max(1, Math.round(raw)))
      return { disease, percent }
    })

    // sort by percent desc
    result.sort((a, b) => b.percent - a.percent)
    return result
  }, [familyMembers])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Risk Assessment</h2>
        <p className="text-gray-600">Estimated risk percentages computed from family history</p>
      </div>

      <Card className="p-6">
        {diseaseRisks.length === 0 ? (
          <div className="text-center text-gray-600">No family history found. Add family members to compute risk.</div>
        ) : (
          <div className="space-y-4">
            {diseaseRisks.map(item => (
              <div key={item.disease}>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{item.disease}</div>
                  <div className="text-sm text-gray-600">{item.percent}%</div>
                </div>
                <Progress value={item.percent} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}