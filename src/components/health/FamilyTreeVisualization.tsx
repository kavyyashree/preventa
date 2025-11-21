'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Users, Heart, AlertTriangle, FileText, ZoomIn, Filter } from 'lucide-react'

interface FamilyMember {
  id: string
  name: string
  relationship: string
  age: number
  gender: string
  medicalHistory: MedicalCondition[]
  documents: MedicalDocument[]
}

interface MedicalCondition {
  id: string
  condition: string
  diagnosisDate: string
  severity: 'mild' | 'moderate' | 'severe'
  treatment: string
  notes: string
}

interface MedicalDocument {
  id: string
  name: string
  type: string
  uploadDate: string
  size: string
}

export default function FamilyTreeVisualization() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)
  const [filterCondition, setFilterCondition] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree')

  // In a real app, this would come from a database or API
  useEffect(() => {
    // Load sample data for demonstration
    const sampleData: FamilyMember[] = [
      {
        id: '1',
        name: 'John Smith',
        relationship: 'Father',
        age: 65,
        gender: 'male',
        medicalHistory: [
          {
            id: '1',
            condition: 'Heart Disease',
            diagnosisDate: '2015-03-15',
            severity: 'moderate',
            treatment: 'Beta blockers, statins',
            notes: 'Family history of heart conditions'
          },
          {
            id: '2',
            condition: 'Hypertension',
            diagnosisDate: '2010-08-20',
            severity: 'mild',
            treatment: 'ACE inhibitors',
            notes: 'Well controlled with medication'
          }
        ],
        documents: [
          {
            id: '1',
            name: 'Cardiology_Report_2023.pdf',
            type: 'application/pdf',
            uploadDate: '2023-11-15',
            size: '2.4 MB'
          }
        ]
      },
      {
        id: '2',
        name: 'Mary Smith',
        relationship: 'Mother',
        age: 62,
        gender: 'female',
        medicalHistory: [
          {
            id: '3',
            condition: 'Diabetes Type 2',
            diagnosisDate: '2018-05-10',
            severity: 'moderate',
            treatment: 'Metformin, diet control',
            notes: 'Managed through lifestyle changes'
          }
        ],
        documents: []
      },
      {
        id: '3',
        name: 'Robert Smith',
        relationship: 'Grandfather (Paternal)',
        age: 85,
        gender: 'male',
        medicalHistory: [
          {
            id: '4',
            condition: 'Prostate Cancer',
            diagnosisDate: '2005-02-28',
            severity: 'severe',
            treatment: 'Surgery, radiation therapy',
            notes: 'In remission since 2006'
          }
        ],
        documents: []
      }
    ]
    setFamilyMembers(sampleData)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800 border-green-200'
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'severe': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male': return '👨'
      case 'female': return '👩'
      default: return '👤'
    }
  }

  const filteredMembers = familyMembers.filter(member => {
    if (filterCondition === 'all') return true
    return member.medicalHistory.some(condition => 
      condition.condition.toLowerCase().includes(filterCondition.toLowerCase())
    )
  })

  const getAllConditions = () => {
    const conditions = new Set<string>()
    familyMembers.forEach(member => {
      member.medicalHistory.forEach(condition => {
        conditions.add(condition.condition)
      })
    })
    return Array.from(conditions)
  }

  const FamilyMemberNode = ({ member, isDetailed = false }: { member: FamilyMember; isDetailed?: boolean }) => (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
        isDetailed ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'
      }`}
      onClick={() => setSelectedMember(member)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getGenderIcon(member.gender)}</span>
          <div>
            <h3 className={`font-semibold ${isDetailed ? 'text-lg' : 'text-sm'}`}>{member.name}</h3>
            <p className="text-xs text-gray-600">{member.relationship}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Age: {member.age}</p>
          {member.medicalHistory.length > 0 && (
            <Badge variant="secondary" className="text-xs mt-1">
              {member.medicalHistory.length} conditions
            </Badge>
          )}
        </div>
      </div>
      
      {member.medicalHistory.length > 0 && (
        <div className="mt-3 space-y-2">
          {member.medicalHistory.slice(0, isDetailed ? undefined : 2).map(condition => (
            <div key={condition.id} className="flex items-center justify-between">
              <span className="text-xs font-medium">{condition.condition}</span>
              <Badge className={`text-xs ${getSeverityColor(condition.severity)}`}>
                {condition.severity}
              </Badge>
            </div>
          ))}
          {!isDetailed && member.medicalHistory.length > 2 && (
            <p className="text-xs text-gray-500">+{member.medicalHistory.length - 2} more</p>
          )}
        </div>
      )}
      
      {member.documents.length > 0 && (
        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
          <FileText className="w-3 h-3" />
          <span>{member.documents.length} documents</span>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Family Tree Visualization</h2>
          <p className="text-gray-600">Visualize your family health patterns and relationships</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={filterCondition} onValueChange={setFilterCondition}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              {getAllConditions().map(condition => (
                <SelectItem key={condition} value={condition}>{condition}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'tree' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('tree')}
              className="rounded-r-none"
            >
              Tree View
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-l-none"
            >
              Grid View
            </Button>
          </div>
        </div>
      </div>

      {familyMembers.length === 0 ? (
        <Card className="text-center p-12">
          <div className="text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Family Members Added</h3>
            <p className="text-gray-600">Add family members in the Family History section to see your family tree</p>
          </div>
        </Card>
      ) : (
        <>
          {viewMode === 'tree' ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Family Health Tree
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Grandparents Generation */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Grandparents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredMembers.filter(m => m.relationship.includes('Grand')).map(member => (
                        <FamilyMemberNode key={member.id} member={member} />
                      ))}
                    </div>
                  </div>

                  {/* Parents Generation */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Parents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredMembers.filter(m => m.relationship.includes('Parent') || m.relationship.includes('Father') || m.relationship.includes('Mother')).map(member => (
                        <FamilyMemberNode key={member.id} member={member} />
                      ))}
                    </div>
                  </div>

                  {/* Current Generation */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Other Family Members</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredMembers.filter(m => !m.relationship.includes('Grand') && !m.relationship.includes('Parent') && !m.relationship.includes('Father') && !m.relationship.includes('Mother')).map(member => (
                        <FamilyMemberNode key={member.id} member={member} />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map(member => (
                <FamilyMemberNode key={member.id} member={member} isDetailed={true} />
              ))}
            </div>
          )}

          {/* Health Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Health Risk Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {familyMembers.reduce((acc, member) => 
                      acc + member.medicalHistory.filter(c => c.severity === 'severe').length, 0
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Severe Conditions</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {familyMembers.reduce((acc, member) => 
                      acc + member.medicalHistory.filter(c => c.severity === 'moderate').length, 0
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Moderate Conditions</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {familyMembers.reduce((acc, member) => 
                      acc + member.medicalHistory.filter(c => c.severity === 'mild').length, 0
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Mild Conditions</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Most Common Conditions</h4>
                <div className="flex flex-wrap gap-2">
                  {getAllConditions().map(condition => {
                    const count = familyMembers.reduce((acc, member) => 
                      acc + member.medicalHistory.filter(c => c.condition === condition).length, 0
                    )
                    return (
                      <Badge key={condition} variant="outline" className="flex items-center gap-1">
                        {condition} ({count})
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Member Detail Modal */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedMember && getGenderIcon(selectedMember.gender)}</span>
              {selectedMember?.name} - {selectedMember?.relationship}
            </DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Age:</span> {selectedMember.age}
                </div>
                <div>
                  <span className="font-semibold">Gender:</span> {selectedMember.gender}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Medical Conditions ({selectedMember.medicalHistory.length})</h4>
                <div className="space-y-3">
                  {selectedMember.medicalHistory.map(condition => (
                    <div key={condition.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{condition.condition}</span>
                        <Badge className={getSeverityColor(condition.severity)}>
                          {condition.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Diagnosed: {condition.diagnosisDate}</p>
                      {condition.treatment && (
                        <p className="text-sm text-gray-700 mb-1"><strong>Treatment:</strong> {condition.treatment}</p>
                      )}
                      {condition.notes && (
                        <p className="text-sm text-gray-600"><strong>Notes:</strong> {condition.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedMember.documents.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Medical Documents ({selectedMember.documents.length})</h4>
                  <div className="space-y-2">
                    {selectedMember.documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.type} • {doc.size} • {doc.uploadDate}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <ZoomIn className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}