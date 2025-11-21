'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Utensils, AlertTriangle } from 'lucide-react'

export default function DietPlanDashboard() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personalized Diet Plans</h2>
        <p className="text-gray-600">Evidence-based nutrition recommendations based on your health risks</p>
      </div>

      <Card className="text-center p-12">
        <Utensils className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Diet Plans Available</h3>
        <p className="text-gray-600 mb-4">Complete your risk assessment to receive personalized diet recommendations</p>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Utensils className="w-4 h-4 mr-2" />
          Get Risk Assessment First
        </Button>
      </Card>
    </div>
  )
}