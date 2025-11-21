'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Activity, AlertTriangle } from 'lucide-react'

export default function HealthTracking() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Health Tracking</h2>
        <p className="text-gray-600">Monitor your health metrics and progress over time</p>
      </div>

      <Card className="text-center p-12">
        <Activity className="w-16 h-16 mx-auto text-purple-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Health Data Tracked</h3>
        <p className="text-gray-600 mb-4">Start tracking your health metrics to see your progress and trends</p>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Activity className="w-4 h-4 mr-2" />
          Add Your First Health Metric
        </Button>
      </Card>
    </div>
  )
}