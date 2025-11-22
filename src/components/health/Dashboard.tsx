'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import React from 'react';
import { 
  Heart, 
  Users, 
  Utensils, 
  Calendar, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Shield
} from 'lucide-react'

interface Props {
  onNavigate?: (tab: string) => void
  familyCount?: number
}

export default function Dashboard({ onNavigate }: Props) {
  const { user } = useAuth();
  const [familyCount, setFamilyCount] = useState(0);
  const [riskFactors, setRiskFactors] = useState(0);
  const [activePlans, setActivePlans] = useState(0);
  const [healthScore, setHealthScore] = useState('N/A');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    // Fetch family members
    fetch('/api/family', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setFamilyCount(data.familyMembers ? data.familyMembers.length : 0);
      });
    // Fetch risk factors (replace with your endpoint)
    fetch('/api/risk-factors', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setRiskFactors(data.riskFactors || 0);
      })
      .catch(() => setRiskFactors(0));
    // Fetch active plans (replace with your endpoint)
    fetch('/api/plans', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setActivePlans(data.plans ? data.plans.length : 0);
      })
      .catch(() => setActivePlans(0));
    // Fetch health score (replace with your endpoint)
    fetch('/api/health-score', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setHealthScore(data.healthScore ? `${data.healthScore}%` : 'N/A');
      })
      .catch(() => setHealthScore('N/A'));
  }, [user]);

  const computeProfilePercent = () => {
    const fields = ['name', 'dateOfBirth', 'gender', 'height', 'weight', 'bloodType', 'ethnicity'];
    let filled = 0;
    if (user) {
      fields.forEach(f => {
        // @ts-ignore
        if (user[f]) filled += 1;
      });
    }
    if (familyCount > 0) filled += 1;
    const percent = Math.round((filled / (fields.length + 1)) * 100);
    return percent;
  };
  const profilePercent = computeProfilePercent();

  // consider profile complete when core fields are filled
  const isProfileComplete = !!(user && user.name && (user as any).dateOfBirth && (user as any).gender && (user as any).height && (user as any).weight)

  const quickStats = [
    {
      title: 'Health Score',
      value: healthScore,
      description: 'Overall health rating',
      icon: Heart,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Family Members',
      value: String(familyCount),
      description: 'Added to your profile',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Risk Factors',
      value: String(riskFactors),
      description: 'Identified risks',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Active Plans',
      value: String(activePlans),
      description: 'Diet & screening plans',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const getStartedSteps = [
    {
      title: 'Complete Your Profile',
      description: 'Add your personal health information',
      icon: Users,
      action: 'profile',
      completed: isProfileComplete
    },
    {
      title: 'Add Family Members',
      description: 'Input your family medical history',
      icon: Users,
      action: 'family-history',
      completed: false
    },
    {
      title: 'Get Risk Assessment',
      description: 'Analyze your genetic health risks',
      icon: TrendingUp,
      action: 'risk-assessment',
      completed: false
    },
    {
      title: 'Create Diet Plan',
      description: 'Get personalized nutrition recommendations',
      icon: Utensils,
      action: 'diet-plans',
      completed: false
    }
  ]

  const healthTips = [
    {
      title: 'Stay Hydrated',
      description: 'Drink at least 8 glasses of water daily for optimal health',
      icon: '💧'
    },
    {
      title: 'Regular Exercise',
      description: 'Aim for 30 minutes of moderate activity most days of week',
      icon: '🏃‍♂️'
    },
    {
      title: 'Balanced Nutrition',
      description: 'Eat a variety of fruits, vegetables, and whole grains',
      icon: '🥗'
    },
    {
      title: 'Quality Sleep',
      description: 'Get 7-9 hours of sleep each night for recovery',
      icon: '😴'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to PHN System
        </h1>
        {user?.name && (
          <p className="text-xl text-gray-600 mb-4">
            Hello, {user.name}!
          </p>
        )}
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your personalized health journey starts here. Understand your genetic risks and take control of your health.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className={`p-3 rounded-full mb-4 ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Get Started */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-blue-600 mr-2" />
              <CardTitle>Get Started</CardTitle>
            </div>
            <CardDescription>
              Complete these steps to unlock your personalized health insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getStartedSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={index} className="flex items-center p-3 border rounded-lg">
                    <div className={`p-2 rounded-full mr-4 ${step.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Icon className={`w-4 h-4 ${step.completed ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                          <Button size="sm" variant="outline" onClick={() => onNavigate && onNavigate(step.action)}>
                            Start
                          </Button>
                        )}
                  </div>
                )
              })}
            </div>
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                <span className="text-sm font-bold text-gray-900">{profilePercent}%</span>
              </div>
              <Progress value={profilePercent} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Health Tips */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Heart className="w-6 h-6 text-red-600 mr-2" />
              <CardTitle>Daily Health Tips</CardTitle>
            </div>
            <CardDescription>
              Quick tips to improve your health today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthTips.map((tip, index) => (
                <div key={index} className="flex items-start p-3 border rounded-lg">
                  <span className="text-2xl mr-3">{tip.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{tip.title}</h4>
                    <p className="text-sm text-gray-600">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>How PHN System Works</CardTitle>
          <CardDescription>
            Your journey to personalized health management in 4 simple steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                bgColor: 'bg-blue-100',
                iconColor: 'text-blue-600',
                title: '1. Input Family History',
                description: 'Add family members and their medical conditions to build your genetic profile'
              },
              {
                icon: TrendingUp,
                bgColor: 'bg-purple-100',
                iconColor: 'text-purple-600',
                title: '2. Get Risk Assessment',
                description: 'Our AI analyzes your family history to calculate personalized health risks'
              },
              {
                icon: Utensils,
                bgColor: 'bg-green-100',
                iconColor: 'text-green-600',
                title: '3. Receive Diet Plan',
                description: 'Get personalized nutrition plans to mitigate your specific health risks'
              },
              {
                icon: Calendar,
                bgColor: 'bg-orange-100',
                iconColor: 'text-orange-600',
                title: '4. Schedule Screenings',
                description: 'Receive personalized screening recommendations and schedule appointments'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${feature.bgColor}`}>
                  <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Important Medical Disclaimer</h4>
              <p className="text-sm text-yellow-700">
                PHN System provides personalized health insights based on family history and genetic factors. 
                This information is for educational purposes and should not replace professional medical advice. 
                Always consult with qualified healthcare providers for medical decisions and treatment planning.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}