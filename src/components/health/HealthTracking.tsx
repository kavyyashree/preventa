'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Activity } from 'lucide-react'

type Habit = { id: string; title: string; streak: number; doneToday: boolean }

export default function HealthTracking() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabit, setNewHabit] = useState('')

  useEffect(() => {
    const raw = localStorage.getItem('habits')
    if (raw) setHabits(JSON.parse(raw))
  }, [])

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits))
  }, [habits])

  const addHabit = () => {
    if (!newHabit.trim()) return
    const h: Habit = { id: Date.now().toString(), title: newHabit.trim(), streak: 0, doneToday: false }
    setHabits(prev => [h, ...prev])
    setNewHabit('')
  }

  const toggleDone = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h
      const doneToday = !h.doneToday
      return { ...h, doneToday, streak: doneToday ? h.streak + 1 : Math.max(0, h.streak - 1) }
    }))
  }

  const removeHabit = (id: string) => setHabits(prev => prev.filter(h => h.id !== id))

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Health Tracking</h2>
        <p className="text-gray-600">Monitor small habits and build healthy routines</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5" /> Habits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input placeholder="New habit (e.g., Walk 30 mins)" value={newHabit} onChange={(e) => setNewHabit(e.target.value)} />
            <Button onClick={addHabit}>Add</Button>
          </div>

          {habits.length === 0 ? (
            <div className="text-center text-gray-500">No habits yet — add one to get started.</div>
          ) : (
            <div className="grid gap-2">
              {habits.map(h => (
                <div key={h.id} className="flex items-center justify-between border rounded p-2">
                  <div>
                    <div className="font-medium">{h.title}</div>
                    <div className="text-sm text-gray-500">Streak: {h.streak} days</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant={h.doneToday ? 'default' : 'outline'} onClick={() => toggleDone(h.id)}>{h.doneToday ? 'Done' : 'Mark'}</Button>
                    <Button variant="ghost" onClick={() => removeHabit(h.id)}>Remove</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}