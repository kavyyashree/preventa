'use client'

import { useState } from 'react'
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

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'family-history':
        return <FamilyHistoryForm />
      case 'family-tree':
        return <FamilyTreeVisualization />
      case 'risk-assessment':
        return <RiskAssessmentDashboard />
      case 'diet-plans':
        return <DietPlanDashboard />
      case 'appointments':
        return <ClinicalSchedulingDashboard />
      case 'health-tracking':
        return <HealthTracking />
      default:
        return <Dashboard />
    }
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
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