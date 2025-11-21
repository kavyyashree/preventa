"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'

type Props = {
  onNavigate?: (tab: string) => void
}

export default function ProfileForm({ onNavigate }: Props) {
  const { user } = useAuth()
  const { toast } = useToast()

  const [form, setForm] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    height: '',
    weight: '',
    bloodType: '',
    ethnicity: ''
  })

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        dateOfBirth: (user as any).dateOfBirth || '',
        gender: (user as any).gender || '',
        height: ((user as any).height || '') as any,
        weight: ((user as any).weight || '') as any,
        bloodType: (user as any).bloodType || '',
        ethnicity: (user as any).ethnicity || ''
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          dateOfBirth: form.dateOfBirth,
          gender: form.gender,
          height: form.height ? Number(form.height) : undefined,
          weight: form.weight ? Number(form.weight) : undefined,
          bloodType: form.bloodType,
          ethnicity: form.ethnicity
        })
      })
      if (res.ok) {
        toast({ title: 'Profile saved', description: 'Your profile was updated successfully' })
        // reload to let AuthProvider re-fetch /api/auth/me
        setTimeout(() => { window.location.reload() }, 700)
      } else {
        const err = await res.json()
        toast({ title: 'Save failed', description: err.error || 'Unknown error' })
      }
    } catch (error) {
      toast({ title: 'Save failed', description: 'Network error' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
        <p className="text-gray-600">Add personal details to improve risk estimation and personalized recommendations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
            </div>
            <div>
              <Label>Gender</Label>
              <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Height (cm)</Label>
                <Input value={form.height as any} onChange={(e) => setForm({ ...form, height: e.target.value })} />
              </div>
              <div>
                <Label>Weight (kg)</Label>
                <Input value={form.weight as any} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Blood Type</Label>
              <Input value={form.bloodType} onChange={(e) => setForm({ ...form, bloodType: e.target.value })} />
            </div>
            <div>
              <Label>Ethnicity</Label>
                <Input value={form.ethnicity} onChange={(e) => setForm({ ...form, ethnicity: e.target.value })} />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onNavigate && onNavigate('dashboard')}>Cancel</Button>
              <Button type="submit">Save Profile</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
