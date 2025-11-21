'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { Utensils } from 'lucide-react'
import { Download, FileText, RefreshCw, Printer } from 'lucide-react'

import { generateWeeklyDietPlan, DayPlan, RiskResult } from '@/lib/diet'

type Props = {
  dietPlan?: DayPlan[] | null
  risk?: RiskResult | null
  familyMembers?: any[]
}

function NutrientList({ vitamins, minerals }: { vitamins?: string[]; minerals?: string[] }) {
  return (
    <div className="mt-2">
      {vitamins && vitamins.length > 0 && (
        <p className="text-sm text-gray-700"><strong>Vitamins:</strong> {vitamins.join(', ')}</p>
      )}
      {minerals && minerals.length > 0 && (
        <p className="text-sm text-gray-700"><strong>Minerals:</strong> {minerals.join(', ')}</p>
      )}
    </div>
  )
}

export default function DietPlanDashboard({ dietPlan, risk, familyMembers }: Props) {
  const { toast } = useToast()

  const handleSave = () => {
    if (!dietPlan) return
    try {
      localStorage.setItem('savedDietPlan', JSON.stringify(dietPlan))
      toast({ title: 'Diet Plan Saved', description: 'Weekly diet plan saved locally.' })
    } catch (e) {
      toast({ title: 'Save failed', description: 'Unable to save plan locally.' })
    }
  }

  const handleExportJSON = () => {
    if (!dietPlan) return
    const blob = new Blob([JSON.stringify(dietPlan, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'weekly-diet-plan.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadCSV = () => {
    if (!dietPlan) return
    const rows: string[] = ['day,meal,type,vitamins,minerals']
    dietPlan.forEach(d => {
      [['breakfast', d.meals.breakfast], ['lunch', d.meals.lunch], ['dinner', d.meals.dinner]].forEach(([mealType, meal]: any) => {
        const vitamins = (meal.vitamins || []).join('|')
        const minerals = (meal.minerals || []).join('|')
        rows.push(`"${d.day}","${mealType}","${meal.name}","${vitamins}","${minerals}"`)
      })
    })
    const csv = rows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'weekly-diet-plan.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleRegenerate = () => {
    if (!familyMembers) return
    const weekly = generateWeeklyDietPlan(familyMembers, risk as any)
    // store regenerated plan in session so parent can pick it up if needed
    sessionStorage.setItem('generatedDiet', JSON.stringify(weekly))
    // reload to emulate navigation
    location.reload()
  }
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personalized Diet Plans</h2>
        <p className="text-gray-600">Evidence-based nutrition recommendations based on your health risks</p>
      </div>

      <Card className="p-6">
        <Utensils className="w-12 h-12 mx-auto text-green-500 mb-4" />
        {dietPlan && dietPlan.length > 0 ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dietPlan.map(day => (
                <div key={day.day} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{day.day}</h4>
                  <div>
                    <p><strong>Breakfast:</strong> {day.meals.breakfast.name}</p>
                    <NutrientList vitamins={day.meals.breakfast.vitamins} minerals={day.meals.breakfast.minerals} />
                  </div>
                  <div className="mt-2">
                    <p><strong>Lunch:</strong> {day.meals.lunch.name}</p>
                    <NutrientList vitamins={day.meals.lunch.vitamins} minerals={day.meals.lunch.minerals} />
                  </div>
                  <div className="mt-2">
                    <p><strong>Dinner:</strong> {day.meals.dinner.name}</p>
                    <NutrientList vitamins={day.meals.dinner.vitamins} minerals={day.meals.dinner.minerals} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>Save Week Plan</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">More</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleExportJSON}><FileText className="w-4 h-4 mr-2" />Export JSON</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadCSV}><Download className="w-4 h-4 mr-2" />Download CSV</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleRegenerate}><RefreshCw className="w-4 h-4 mr-2" />Regenerate Plan</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" />Print</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Diet Plans Available</h3>
            <p className="text-gray-600 mb-4">Generate a diet plan from Family History</p>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
              // If we have familyMembers and risk, generate on the fly
              if (familyMembers && risk) {
                const weekly = generateWeeklyDietPlan(familyMembers, risk)
                // navigate by setting location (parent component should manage state), but we'll store locally in sessionStorage for quick access
                sessionStorage.setItem('generatedDiet', JSON.stringify(weekly))
                location.href = '/'
              } else {
                location.href = '/'
              }
            }}>Go to Risk Assessment</Button>
          </div>
        )}
      </Card>
    </div>
  )
}