 'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Navigation from '@/components/layout/Navigation'
import Dashboard from '@/components/health/Dashboard'
import FamilyHistoryForm from '@/components/health/FamilyHistoryForm'
import FamilyTreeVisualization from '@/components/health/FamilyTreeVisualization'
import RiskAssessmentDashboard from '@/components/health/RiskAssessmentDashboard'
import DietPlanDashboard from '@/components/health/DietPlanDashboard'
import ClinicalSchedulingDashboard from '@/components/health/ClinicalSchedulingDashboard'
import HealthTracking from '@/components/health/HealthTracking'
import ProfileForm from '@/components/health/ProfileForm'
import { DayPlan, RiskResult } from '@/lib/diet'

type MedicalCondition = {
  id: string
  condition: string
  diagnosisDate: string
  severity: 'mild' | 'moderate' | 'severe'
  treatment: string
  notes: string
}

type MedicalDocument = {
  id: string
  name: string
  type: string
  uploadDate: string
  size: string
}

type FamilyMember = {
  id: string
  name: string
  relationship: string
  age: number
  gender: string
  medicalHistory: MedicalCondition[]
  documents: MedicalDocument[]
}

type Appointment = {
  id: string
  memberId: string
  memberName: string
  condition: string
  severity: 'mild' | 'moderate' | 'severe'
  date: string
  clinic: string
}

export default function Home() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showSplash, setShowSplash] = useState(true)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [dietPlan, setDietPlan] = useState<DayPlan[] | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [riskResult, setRiskResult] = useState<RiskResult | null>(null)

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} familyCount={familyMembers.length} />
      case 'family-history':
        return (
          <FamilyHistoryForm
            familyMembers={familyMembers}
            setFamilyMembers={setFamilyMembers}
            onNavigate={setActiveTab}
            onGenerateDiet={(plan: DayPlan[]) => {
              setDietPlan(plan)
              setActiveTab('diet-plans')
            }}
            onSetAppointments={(appts) => setAppointments(appts)}
          />
        )
      case 'profile':
        return <ProfileForm onNavigate={setActiveTab} />
      case 'family-tree':
        return <FamilyTreeVisualization familyMembers={familyMembers} setFamilyMembers={setFamilyMembers} />
      case 'risk-assessment':
        return <RiskAssessmentDashboard onNavigate={setActiveTab} familyMembers={familyMembers} onSetRisk={(r) => setRiskResult(r)} />
      case 'diet-plans':
        return <DietPlanDashboard dietPlan={dietPlan} risk={riskResult} familyMembers={familyMembers} />
      case 'appointments':
        return <ClinicalSchedulingDashboard appointments={appointments} />
      case 'health-tracking':
        return <HealthTracking />
      default:
        return <Dashboard onNavigate={setActiveTab} familyCount={familyMembers.length} />
    }
  }
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Splash overlay shown before entering the app */}
        {showSplash && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center mx-4">
              <h2 className="text-2xl font-semibold mb-4">Welcome to PHN System</h2>
              <p className="text-sm text-gray-600 mb-6">Choose an option to continue</p>
              <div className="flex gap-4 justify-center">
                <button
                  className="px-6 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none"
                  onClick={() => setShowSplash(false)}
                >
                  Home
                </button>
                <button
                  className="px-6 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 focus:outline-none"
                  onClick={() => router.push('/emergency')}
                >
                  Emergency
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          {renderContent()}
        </main>
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500">
              <p className="text-lg font-semibold mb-2">&copy; 2024 PHN System - Personalized Health Network</p>
              <p className="text-sm text-gray-400 max-w-2xl mx-auto">
                Empowering individuals with personalized health insights through genetic risk analysis
              </p>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  )
}