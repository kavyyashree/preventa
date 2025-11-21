type MealItem = { name: string; vitamins: string[]; minerals: string[] }
type DayPlan = { day: string; meals: { breakfast: MealItem; lunch: MealItem; dinner: MealItem } }

type MedicalCondition = {
  id: string
  condition: string
  diagnosisDate: string
  severity: 'mild' | 'moderate' | 'severe'
  treatment: string
  notes: string
}

type FamilyMember = {
  id: string
  name: string
  relationship: string
  age: number
  gender: string
  medicalHistory: MedicalCondition[]
  documents: any[]
}

type RiskResult = { disease: string; percent: number; base: number }

export function generateWeeklyDietPlan(members: FamilyMember[], risk?: RiskResult): DayPlan[] {
  const conditions = (members || []).flatMap(m => (m.medicalHistory || []).map(c => (c.condition || '').toLowerCase()))

  // meal pools per template with vitamins/minerals metadata
  const templates: Record<string, { breakfast: MealItem[]; lunch: MealItem[]; dinner: MealItem[] }> = {
    diabetes: {
      breakfast: [
        { name: 'Oatmeal with walnuts & blueberries', vitamins: ['B1','B6','Vitamin C'], minerals: ['Magnesium','Potassium'] },
        { name: 'Greek yogurt with chia & berries', vitamins: ['Vitamin D','B12'], minerals: ['Calcium','Phosphorus'] }
      ],
      lunch: [
        { name: 'Grilled chicken salad with mixed greens', vitamins: ['Vitamin A','Vitamin K'], minerals: ['Iron','Potassium'] },
        { name: 'Lentil & quinoa bowl with vegetables', vitamins: ['Folate','Vitamin C'], minerals: ['Iron','Magnesium'] }
      ],
      dinner: [
        { name: 'Baked salmon with steamed broccoli', vitamins: ['Vitamin D','B12'], minerals: ['Omega-3','Selenium'] },
        { name: 'Tofu stir-fry with broccoli and peppers', vitamins: ['Vitamin C','K'], minerals: ['Calcium','Iron'] }
      ]
    },
    heart: {
      breakfast: [
        { name: 'Whole grain toast with avocado', vitamins: ['E','K'], minerals: ['Potassium','Magnesium'] },
        { name: 'Steel-cut oats with almonds', vitamins: ['B1'], minerals: ['Magnesium','Calcium'] }
      ],
      lunch: [
        { name: 'Quinoa salad with chickpeas & greens', vitamins: ['Folate','C'], minerals: ['Iron','Magnesium'] },
        { name: 'Grilled tuna salad', vitamins: ['D','B12'], minerals: ['Selenium','Potassium'] }
      ],
      dinner: [
        { name: 'Lentil stew with spinach', vitamins: ['A','K'], minerals: ['Iron','Folate'] },
        { name: 'Roasted vegetables with olive oil', vitamins: ['C','E'], minerals: ['Potassium','Manganese'] }
      ]
    },
    cancer: {
      breakfast: [
        { name: 'Green smoothie with spinach, banana & protein', vitamins: ['A','C'], minerals: ['Iron','Potassium'] },
        { name: 'Berry & seed porridge', vitamins: ['C'], minerals: ['Magnesium','Zinc'] }
      ],
      lunch: [
        { name: 'Roasted vegetable bowl with quinoa', vitamins: ['C','K'], minerals: ['Fiber','Magnesium'] },
        { name: 'Grilled salmon & kale salad', vitamins: ['D','A'], minerals: ['Omega-3','Calcium'] }
      ],
      dinner: [
        { name: 'Grilled fish with sweet potato', vitamins: ['A','C'], minerals: ['Potassium','Beta-carotene'] },
        { name: 'Stir-fried tofu with mixed vegetables', vitamins: ['B','C'], minerals: ['Iron','Calcium'] }
      ]
    },
    default: {
      breakfast: [
        { name: 'Greek yogurt with fruit and seeds', vitamins: ['B12','C'], minerals: ['Calcium','Magnesium'] },
        { name: 'Smoothie bowl with mixed fruit', vitamins: ['C','A'], minerals: ['Potassium'] }
      ],
      lunch: [
        { name: 'Turkey & avocado sandwich on whole grain', vitamins: ['B3','B6'], minerals: ['Potassium','Magnesium'] },
        { name: 'Chickpea salad with veggie mix', vitamins: ['C','Folate'], minerals: ['Iron','Magnesium'] }
      ],
      dinner: [
        { name: 'Stir-fry vegetables with tofu and brown rice', vitamins: ['B','C'], minerals: ['Iron','Magnesium'] },
        { name: 'Grilled chicken with roasted vegetables', vitamins: ['B6','C'], minerals: ['Potassium','Phosphorus'] }
      ]
    }
  }

  // choose template
  let chosenKey = 'default'
  if (conditions.some(c => c.includes('diabetes'))) chosenKey = 'diabetes'
  else if (conditions.some(c => c.includes('heart')) || conditions.some(c => c.includes('hypertension'))) chosenKey = 'heart'
  else if (conditions.some(c => c.includes('cancer'))) chosenKey = 'cancer'

  const chosen = templates[chosenKey]

  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

  // rotate options each day for variety
  return days.map((day, i) => {
    const b = chosen.breakfast[i % chosen.breakfast.length]
    const l = chosen.lunch[i % chosen.lunch.length]
    const d = chosen.dinner[i % chosen.dinner.length]
    return { day, meals: { breakfast: b, lunch: l, dinner: d } }
  })
}

export type { MealItem, DayPlan, RiskResult, FamilyMember, MedicalCondition }
