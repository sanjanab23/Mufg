"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { useRouter } from "next/navigation"

// --- Risk category helper ---
const getRiskCategory = (score: number) => {
  if (score < 50) return { label: "Low Risk", color: "#10b981" } // green
  if (score < 75) return { label: "Moderate Risk", color: "#facc15" } // yellow
  return { label: "High Risk", color: "#ef4444" } // red
}

// --- Circular Gauge Component ---
const RiskGauge = ({ score }: { score: number }) => {
  const radius = 60
  const stroke = 10
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (score / 100) * circumference
  const category = getRiskCategory(score)

  return (
    <motion.div
      className="flex flex-col items-center justify-center mt-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={category.color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-lg font-semibold fill-current text-gray-900 dark:text-gray-100"
        >
          {score}
        </text>
      </svg>
      <p className="mt-2 font-medium">{category.label}</p>
    </motion.div>
  )
}

// --- Tinder-style swipe cards ---
const TinderCards = ({
  scores,
  resetKey,
}: {
  scores: { label: string; value: number; description: string }[]
  resetKey: number
}) => {
  const [cards, setCards] = useState(scores)

  useEffect(() => {
    setCards(scores)
  }, [resetKey, scores])

  const handleSwipe = (index: number) => {
    setCards((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="relative w-full h-60 flex justify-center items-center mt-6">
      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.div
            key={`${card.label}-${index}`}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={(event, info) => {
              if (Math.abs(info.offset.x) > 100) handleSwipe(index)
            }}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ x: 500, opacity: 0 }}
            whileHover={{ rotate: 1.5, scale: 1.02 }}
            className="absolute w-72 rounded-xl p-4 shadow-xl flex-shrink-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-transform"
          >
            <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              {card.label}
            </h3>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="mt-1 text-sm">{card.description}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// --- Floating animated background blobs ---
const BackgroundBlobs = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute w-72 h-72 bg-purple-400/30 rounded-full blur-3xl"
        animate={{ x: [0, 100, -100, 0], y: [0, -50, 50, 0] }}
        transition={{ repeat: Infinity, duration: 20 }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-blue-400/30 rounded-full blur-3xl top-40 right-10"
        animate={{ x: [0, -80, 80, 0], y: [0, 60, -60, 0] }}
        transition={{ repeat: Infinity, duration: 25 }}
      />
    </div>
  )
}

// --- Main Risk Assessment Page ---
export default function RiskAssessmentPage() {
  const router = useRouter()
  const [age, setAge] = useState(30)
  const [smoke, setSmoke] = useState<string | null>(null)
  const [illness, setIllness] = useState<string | null>(null)
  const [income, setIncome] = useState<string | null>(null)
  const [education, setEducation] = useState<string | null>(null)
  const [timeline, setTimeline] = useState<string | null>(null)
  const [expenses, setExpenses] = useState<number>(0)
  const [loan, setLoan] = useState<number>(0)
  const [riskScore, setRiskScore] = useState<number | null>(null)
  const [subScores, setSubScores] = useState({ financial: 0, health: 0, time: 0 })
  const [error, setError] = useState<string | null>(null)
  const [resetKey, setResetKey] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [submitted, setSubmitted] = useState(false) // trigger API after score calculation

  const cardsData = [
    { label: "Financial Score", value: subScores.financial, description: "Based on income, expenses, and loan obligations." },
    { label: "Health Score", value: subScores.health, description: "Based on age, smoking status, and chronic illness." },
    { label: "Time Horizon Score", value: subScores.time, description: "Based on investment timeline and education level." },
  ]

  // --- Score calculation ---
  const calculateScores = () => {
    let healthScore = 0
    if (age < 30) healthScore += 5
    else if (age <= 50) healthScore += 10
    else healthScore += 20
    if (smoke === "yes") healthScore += 15
    if (illness === "yes") healthScore += 15

    let financialScore = 0
    if (income === "<5L") financialScore += 10
    else if (income === "5-10L") financialScore += 7
    else if (income === "10-20L") financialScore += 5
    else if (income === "20L+") financialScore += 3

    if (expenses > 50000) financialScore += 20
    else if (expenses > 30000) financialScore += 15
    else if (expenses > 10000) financialScore += 10
    else financialScore += 5

    if (loan > 500000) financialScore += 15
    else if (loan > 200000) financialScore += 10
    else financialScore += 5

    let timeScore = 0
    if (timeline === "short") timeScore += 10
    else if (timeline === "medium") timeScore += 7
    else if (timeline === "long") timeScore += 5

    if (education === "highschool") timeScore += 3
    else if (education === "bachelor") timeScore += 5
    else if (education === "master") timeScore += 7
    else if (education === "phd") timeScore += 10

    setSubScores({ financial: financialScore, health: healthScore, time: timeScore })
    const total = healthScore + financialScore + timeScore
    const normalized = Math.min(Math.round((total / 150) * 100), 100)
    setRiskScore(normalized)
    setResetKey((prev) => prev + 1)
  }

  // --- Form submit ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!income || !education || !timeline || !smoke || !illness) {
      setError("Please answer all required fields before submitting.")
      return
    }
    if (expenses <= 0) {
      setError("Please enter valid monthly expenses.")
      return
    }
    setError(null)
    calculateScores()
    setSubmitted(true)
  }

  // --- Send score to DB after calculation ---
  useEffect(() => {
    const sendScoreToDB = async () => {
      if (riskScore === null || !submitted) return

      try {
        const userToken = localStorage.getItem("token")
        if (!userToken) throw new Error("User not logged in")

        const response = await fetch(`${window.location.origin}/api/risk-scores`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${userToken}`,
  },
  body: JSON.stringify({
    Tscore: riskScore,
    Financial: subScores.financial,
    Health: subScores.health,
    TimeHori: subScores.time,
  }),
})


        const data = await response.json()
        if (!response.ok) {
          console.error("Error saving score:", data)
          setError("Failed to save score to database")
        } else {
          console.log("Score saved successfully:", data)
          setShowPopup(true)
          setTimeout(() => setShowPopup(false), 3000)
          setSubmitted(false)
        }
      } catch (err) {
        console.error(err)
        setError("Unexpected error occurred while saving score")
        setSubmitted(false)
      }
    }
    sendScoreToDB()
  }, [riskScore])

  return (
    <div className="relative max-w-3xl mx-auto py-12 space-y-8">
      <BackgroundBlobs />

      {/* Popup */}
      {showPopup && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in">
          Form submitted successfully!
        </div>
      )}

      <Card className="shadow-lg rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur text-gray-900 dark:text-gray-100 relative z-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
            Risk Assessment Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Age */}
            <motion.div className="space-y-2" whileHover={{ scale: 1.01 }}>
              <Label>Age: {age}</Label>
              <Slider min={18} max={100} step={1} value={[age]} onValueChange={(val) => setAge(val[0])} />
            </motion.div>

            {/* Smoking */}
            <div className="space-y-2">
              <Label>Do you smoke? *</Label>
              <div className="flex space-x-2">
                <Button type="button" variant={smoke === "yes" ? "default" : "outline"} onClick={() => setSmoke("yes")}>Yes</Button>
                <Button type="button" variant={smoke === "no" ? "default" : "outline"} onClick={() => setSmoke("no")}>No</Button>
              </div>
            </div>

            {/* Illness */}
            <div className="space-y-2">
              <Label>Do you have any chronic illness? *</Label>
              <div className="flex space-x-2">
                <Button type="button" variant={illness === "yes" ? "default" : "outline"} onClick={() => setIllness("yes")}>Yes</Button>
                <Button type="button" variant={illness === "no" ? "default" : "outline"} onClick={() => setIllness("no")}>No</Button>
              </div>
            </div>

            {/* Income */}
            <div className="space-y-2">
              <Label>Annual Income Range *</Label>
              <Select value={income ?? ""} onValueChange={setIncome}>
                <SelectTrigger><SelectValue placeholder="Select income range" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="<5L">Less than 5 Lakhs</SelectItem>
                  <SelectItem value="5-10L">5 - 10 Lakhs</SelectItem>
                  <SelectItem value="10-20L">10 - 20 Lakhs</SelectItem>
                  <SelectItem value="20L+">20 Lakhs+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <Label>Education Level *</Label>
              <Select value={education ?? ""} onValueChange={setEducation}>
                <SelectTrigger><SelectValue placeholder="Select education" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="highschool">High School</SelectItem>
                  <SelectItem value="bachelor">Bachelor’s Degree</SelectItem>
                  <SelectItem value="master">Master’s Degree</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <Label>Investment Timeline *</Label>
              <Select value={timeline ?? ""} onValueChange={setTimeline}>
                <SelectTrigger><SelectValue placeholder="Select timeline" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short Term</SelectItem>
                  <SelectItem value="medium">Medium Term</SelectItem>
                  <SelectItem value="long">Long Term</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Expenses & Loan */}
            <div className="flex space-x-4">
              <motion.div className="flex-1 space-y-2" whileHover={{ scale: 1.01 }}>
                <Label>Monthly Expenses *</Label>
                <Input type="number" value={expenses || ""} onChange={(e) => setExpenses(Number(e.target.value))} />
              </motion.div>
              <motion.div className="flex-1 space-y-2" whileHover={{ scale: 1.01 }}>
                <Label>Loan Amount *</Label>
                <Input type="number" value={loan || ""} onChange={(e) => setLoan(Number(e.target.value))} />
              </motion.div>
            </div>

            {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}

            <motion.div whileHover={{ scale: 1.02 }}>
              <Button type="submit" className="w-full">Get My Risk Score</Button>
            </motion.div>
          </form>

          {/* Results */}
<AnimatePresence>
  {riskScore !== null && (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
      <RiskGauge score={riskScore} />
      <TinderCards scores={cardsData} resetKey={resetKey} />

      {/* Buttons: Reset Cards + AI Assist */}
      <div className="mt-4 flex space-x-2">
  <Button
    variant="outline"
    className="flex-1"
    onClick={() => setResetKey((prev) => prev + 1)}
  >
    Reset Cards
  </Button>
  
  <Button
  variant="default"
  className="flex-1"
  onClick={() => {
    if (riskScore !== null) {
      const url = `/ai-assistant?riskScore=${riskScore}&financial=${subScores.financial}&health=${subScores.health}&time=${subScores.time}`;
      router.push(url);
    }
  }}
>
  AI Assist
</Button>

</div>
    </motion.div>
  )}
</AnimatePresence>

        </CardContent>
      </Card>
    </div>
  )
}
