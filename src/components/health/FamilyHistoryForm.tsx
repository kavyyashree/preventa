'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Plus, FileText, AlertTriangle, Upload, X, Edit, Trash2 } from 'lucide-react'

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

interface Appointment {
  id: string
  memberId: string
  memberName: string
  condition: string
  severity: 'mild' | 'moderate' | 'severe'
  date: string
  clinic: string
}

import { generateWeeklyDietPlan, DayPlan } from '@/lib/diet'

interface Props {
  familyMembers: FamilyMember[]
  setFamilyMembers: (members: FamilyMember[] | ((m: FamilyMember[]) => FamilyMember[])) => void
  onNavigate?: (tab: string) => void
  onGenerateDiet?: (plan: DayPlan[]) => void
  onSetAppointments?: (appts: Appointment[]) => void
}

export default function FamilyHistoryForm({ familyMembers, setFamilyMembers, onNavigate, onGenerateDiet, onSetAppointments }: Props) {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null)
  const [newMember, setNewMember] = useState({
    name: '',
    relationship: '',
    age: '',
    gender: ''
  })

  const relationships = [
    'Parent', 'Grandparent', 'Sibling', 'Child', 'Aunt/Uncle', 'Cousin', 'Spouse', 'Other'
  ]

  const commonConditions = [
    'Heart Disease', 'Diabetes', 'Hypertension', 'Cancer', 'Stroke', 
    'Alzheimer\'s', 'Arthritis', 'Asthma', 'Depression', 'Osteoporosis'
  ]

  const addFamilyMember = () => {
    if (!newMember.name || !newMember.relationship || !newMember.age || !newMember.gender) {
      alert('Please fill in all required fields')
      return
    }

    const member: FamilyMember = {
      id: Date.now().toString(),
      name: newMember.name,
      relationship: newMember.relationship,
      age: parseInt(newMember.age),
      gender: newMember.gender,
      medicalHistory: [],
      documents: []
    }

    setFamilyMembers([...familyMembers, member])
    setNewMember({ name: '', relationship: '', age: '', gender: '' })
    setShowAddMemberModal(false)
  }

  const deleteFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id))
  }

  const addMedicalCondition = (memberId: string, condition: Omit<MedicalCondition, 'id'>) => {
    setFamilyMembers(members => 
      members.map(member => 
        member.id === memberId 
          ? { 
              ...member, 
              medicalHistory: [...member.medicalHistory, { ...condition, id: Date.now().toString() }] 
            }
          : member
      )
    )
  }

  const deleteMedicalCondition = (memberId: string, conditionId: string) => {
    setFamilyMembers(members => 
      members.map(member => 
        member.id === memberId 
          ? { 
              ...member, 
              medicalHistory: member.medicalHistory.filter(c => c.id !== conditionId) 
            }
          : member
      )
    )
  }

  const handleFileUpload = (memberId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newDocuments: MedicalDocument[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random().toString(),
      name: file.name,
      type: file.type || 'Unknown',
      uploadDate: new Date().toLocaleDateString(),
      size: `${(file.size / 1024).toFixed(1)} KB`
    }))

    setFamilyMembers(members => 
      members.map(member => 
        member.id === memberId 
          ? { 
              ...member, 
              documents: [...member.documents, ...newDocuments] 
            }
          : member
      )
    )
  }

  const deleteDocument = (memberId: string, documentId: string) => {
    setFamilyMembers(members => 
      members.map(member => 
        member.id === memberId 
          ? { 
              ...member, 
              documents: member.documents.filter(doc => doc.id !== documentId) 
            }
          : member
      )
    )
  }

  const computeWeeklyDietPlan = (): DayPlan[] => {
    // Use shared diet generator to include nutrient metadata and day-to-day variety
    return generateWeeklyDietPlan(familyMembers || [])
  }

  const computeAppointments = (): Appointment[] => {
    const appts: Appointment[] = []
    const now = new Date()
    familyMembers.forEach(member => {
      member.medicalHistory.forEach(cond => {
        let daysAhead = 30
        if (cond.severity === 'severe') daysAhead = 7
        else if (cond.severity === 'moderate') daysAhead = 14
        else daysAhead = 30

        const d = new Date(now)
        d.setDate(now.getDate() + daysAhead)
        appts.push({
          id: Date.now().toString() + Math.random().toString().slice(2,6),
          memberId: member.id,
          memberName: member.name,
          condition: cond.condition,
          severity: cond.severity,
          date: d.toISOString().split('T')[0],
          clinic: cond.severity === 'severe' ? 'Urgent Care / Specialist' : 'Primary Care Clinic'
        })
      })
    })
    return appts
  }

  const handleGenerateDiet = () => {
    const weekly = computeWeeklyDietPlan()
    const appts = computeAppointments()
    if (onGenerateDiet) onGenerateDiet(weekly)
    if (onSetAppointments) onSetAppointments(appts)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Family Medical History</h2>
          <p className="text-gray-600">Add family members and their medical conditions to assess your genetic risks</p>
        </div>
        <Dialog open={showAddMemberModal} onOpenChange={setShowAddMemberModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Family Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Family Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Enter family member's name"
                />
              </div>
              <div>
                <Label htmlFor="relationship">Relationship *</Label>
                <Select value={newMember.relationship} onValueChange={(value) => setNewMember({ ...newMember, relationship: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationships.map(rel => (
                      <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={newMember.age}
                    onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                    placeholder="Age"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={newMember.gender} onValueChange={(value) => setNewMember({ ...newMember, gender: value })}>
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
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddMemberModal(false)}>Cancel</Button>
                <Button onClick={addFamilyMember}>Add Member</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {familyMembers.length === 0 ? (
        <Card className="text-center p-8">
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Family Members Added</h3>
          <p className="text-gray-600 mb-4">Start by adding your family members to build your health profile</p>
          <div className="flex items-center justify-center gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddMemberModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Family Member
          </Button>
            <Button variant="outline" onClick={() => onNavigate && onNavigate('risk-assessment')}>Back to Risk</Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {familyMembers.map(member => (
            <FamilyMemberCard 
              key={member.id} 
              member={member} 
              onDelete={() => deleteFamilyMember(member.id)}
              onAddCondition={(condition) => addMedicalCondition(member.id, condition)}
              onDeleteCondition={(conditionId) => deleteMedicalCondition(member.id, conditionId)}
              onFileUpload={(event) => handleFileUpload(member.id, event)}
              onDeleteDocument={(documentId) => deleteDocument(member.id, documentId)}
            />
          ))}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onNavigate && onNavigate('risk-assessment')}>Back</Button>
              <Button onClick={handleGenerateDiet}>Generate Diet Plan</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface FamilyMemberCardProps {
  member: FamilyMember
  onDelete: () => void
  onAddCondition: (condition: Omit<MedicalCondition, 'id'>) => void
  onDeleteCondition: (conditionId: string) => void
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onDeleteDocument: (documentId: string) => void
}

function FamilyMemberCard({ member, onDelete, onAddCondition, onDeleteCondition, onFileUpload, onDeleteDocument }: FamilyMemberCardProps) {
  const [showConditionForm, setShowConditionForm] = useState(false)
  const [newCondition, setNewCondition] = useState({
    condition: '',
    diagnosisDate: '',
    severity: 'moderate' as const,
    treatment: '',
    notes: ''
  })

  const addCondition = () => {
    if (!newCondition.condition || !newCondition.diagnosisDate) {
      alert('Please fill in condition and diagnosis date')
      return
    }
    onAddCondition(newCondition)
    setNewCondition({
      condition: '',
      diagnosisDate: '',
      severity: 'moderate',
      treatment: '',
      notes: ''
    })
    setShowConditionForm(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800'
      case 'moderate': return 'bg-yellow-100 text-yellow-800'
      case 'severe': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{member.name}</CardTitle>
            <p className="text-sm text-gray-600">{member.relationship} • {member.age} years • {member.gender}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="conditions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="conditions">Conditions ({member.medicalHistory.length})</TabsTrigger>
            <TabsTrigger value="documents">Documents ({member.documents.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="conditions" className="space-y-3">
            {member.medicalHistory.length === 0 ? (
              <div className="text-center py-4">
                <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">No medical conditions recorded</p>
              </div>
            ) : (
              member.medicalHistory.map(condition => (
                <div key={condition.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{condition.condition}</span>
                        <Badge className={`text-xs ${getSeverityColor(condition.severity)}`}>
                          {condition.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">Diagnosed: {condition.diagnosisDate}</p>
                      {condition.treatment && (
                        <p className="text-xs text-gray-700 mt-1">Treatment: {condition.treatment}</p>
                      )}
                      {condition.notes && (
                        <p className="text-xs text-gray-600 mt-1">Notes: {condition.notes}</p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onDeleteCondition(condition.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
            
            <Dialog open={showConditionForm} onOpenChange={setShowConditionForm}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Condition
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Medical Condition</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="condition">Condition *</Label>
                    <Select value={newCondition.condition} onValueChange={(value) => setNewCondition({ ...newCondition, condition: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select or type condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Heart Disease', 'Diabetes', 'Hypertension', 'Cancer', 'Stroke', 'Alzheimer\'s', 'Arthritis', 'Asthma', 'Depression', 'Osteoporosis', 'Other'].map(condition => (
                          <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="diagnosisDate">Diagnosis Date *</Label>
                    <Input
                      id="diagnosisDate"
                      type="date"
                      value={newCondition.diagnosisDate}
                      onChange={(e) => setNewCondition({ ...newCondition, diagnosisDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="severity">Severity</Label>
                    <Select value={newCondition.severity} onValueChange={(value: 'mild' | 'moderate' | 'severe') => setNewCondition({ ...newCondition, severity: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mild">Mild</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="treatment">Treatment</Label>
                    <Input
                      id="treatment"
                      value={newCondition.treatment}
                      onChange={(e) => setNewCondition({ ...newCondition, treatment: e.target.value })}
                      placeholder="Current or past treatment"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newCondition.notes}
                      onChange={(e) => setNewCondition({ ...newCondition, notes: e.target.value })}
                      placeholder="Additional notes or details"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowConditionForm(false)}>Cancel</Button>
                    <Button onClick={addCondition}>Add Condition</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-3">
            {member.documents.length === 0 ? (
              <div className="text-center py-4">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">No documents uploaded</p>
              </div>
            ) : (
              member.documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-gray-600">{doc.type} • {doc.size} • {doc.uploadDate}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onDeleteDocument(doc.id)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))
            )}
            
            <div className="mt-4">
              <Label htmlFor={`file-upload-${member.id}`} className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Upload medical documents</p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                </div>
              </Label>
              <Input
                id={`file-upload-${member.id}`}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={onFileUpload}
                className="hidden"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}