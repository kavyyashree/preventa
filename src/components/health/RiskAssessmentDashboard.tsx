'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, AlertTriangle } from 'lucide-react'

export default function RiskAssessmentDashboard() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Risk Assessment Dashboard</h2>
        <p className="text-gray-600">AI-powered analysis of your genetic health risks</p>
      </div>

      <Card className="text-center p-12">
        <AlertTriangle className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Risk Data Available</h3>
        <p className="text-gray-600 mb-4">Add family members and their medical conditions to get personalized risk assessments</p>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <TrendingUp className="w-4 h-4 mr-2" />
          Add Family Data First
        </Button>
      </Card>
    </div>
  )
}