'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, AlertTriangle } from 'lucide-react'

export default function ClinicalSchedulingDashboard() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Screening & Appointments</h2>
        <p className="text-gray-600">Schedule health screenings and medical appointments</p>
      </div>

      <Card className="text-center p-12">
        <Calendar className="w-16 h-16 mx-auto text-blue-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Scheduled</h3>
        <p className="text-gray-600 mb-4">Get your risk assessment to receive personalized screening recommendations</p>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Calendar className="w-4 h-4 mr-2" />
          Start Risk Assessment
        </Button>
      </Card>
    </div>
  )
}