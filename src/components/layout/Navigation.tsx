'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Heart, 
  Utensils, 
  Calendar, 
  BarChart3,
  Home,
  Menu,
  X,
  Activity
} from 'lucide-react'

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { user } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'family-history', label: 'Family History', icon: Users },
    { id: 'family-tree', label: 'Family Tree', icon: Heart },
    { id: 'risk-assessment', label: 'Risk Assessment', icon: BarChart3 },
    { id: 'diet-plans', label: 'Diet Plans', icon: Utensils },
    { id: 'appointments', label: 'Screening & Appointments', icon: Calendar },
    { id: 'health-tracking', label: 'Health Tracking', icon: Activity }
  ]

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Navigation</h2>
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "default" : "ghost"}
                      className={`w-full justify-start h-12 ${
                        activeTab === item.id 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => handleTabClick(item.id)}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Button>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <nav className="hidden md:block">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center mb-4">
            <Heart className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "outline"}
                  className={`h-12 text-sm ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTabClick(item.id)}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {item.label}
                </Button>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}