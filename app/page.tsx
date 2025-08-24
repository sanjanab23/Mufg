"use client"

import Link from "next/link"
import { Shield, Zap, LineChart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

// Tilt effect wrapper
function TiltWrapper({ children }: { children: React.ReactNode }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -5
    const rotateY = ((x - centerX) / centerX) * 5
    setRotate({ x: rotateX, y: rotateY })
  }

  function handleMouseLeave() {
    setRotate({ x: 0, y: 0 })
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  )
}

// Futuristic Gauge Component
function FuturisticGauge() {
  const [direction, setDirection] = useState(1)
  const [angle, setAngle] = useState(60)
  const labels = ["Financial", "Health", "Time Horizon", "Analysis"]
  const [activeLabel, setActiveLabel] = useState(0)

  // Sweep needle back and forth
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection((prev) => -prev)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Sequential floating panels
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLabel((prev) => (prev + 1) % labels.length)
    }, 2000) // 2 seconds per label
    return () => clearInterval(interval)
  }, [])

  const riskColor =
    angle < -20 ? "text-green-400" : angle < 20 ? "text-yellow-400" : "text-red-400"
  const riskLabel =
    angle < -20 ? "Low" : angle < 20 ? "Medium" : "High"

  return (
    <div className="relative flex flex-col items-center">
      {/* Gauge */}
      <div className="w-48 h-24 rounded-b-full border-4 border-primary relative overflow-hidden bg-black/30 backdrop-blur-lg shadow-lg">
        {/* Needle */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-1 h-20 origin-bottom shadow-[0_0_15px_rgba(0,255,255,0.8)]"
          style={{ backgroundColor: "#00f0ff" }}
          animate={{ rotate: direction === 1 ? 60 : -60 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          onUpdate={(latest) => {
            if (typeof latest.rotate === "number") setAngle(latest.rotate)
          }}
        />

        {/* Floating Panels */}
        <div className="relative w-32 h-12">
      <AnimatePresence>
        {labels.map((label, i) =>
          i === activeLabel ? (
            <motion.div
              key={label}
              className="absolute top-0 left-1/2 w-20 h-8 flex items-center justify-center
                         text-xs font-semibold text-white bg-white/10 backdrop-blur-md
                         rounded-lg border border-white/20 shadow-lg"
              initial={{ y: -40, opacity: 0, scale: 0.6 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.6 }}
              transition={{
                y: { type: "spring", stiffness: 120, damping: 12 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.5 },
              }}
            >
              {label}
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
    </div>



      </div>

      {/* Dynamic Risk */}
      <p className={`mt-2 text-sm font-semibold ${riskColor}`}>
        Risk Level: {riskLabel}
      </p>
    </div>
  )
}

// Main Page
export default function Page() {
  useEffect(() => {
    const glow = document.querySelector(".cursor-glow") as HTMLElement
    const move = (e: MouseEvent) => {
      if (glow) {
        glow.style.left = `${e.clientX}px`
        glow.style.top = `${e.clientY}px`
      }
    }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])

  return (
    <div className="relative space-y-20 perspective-[1000px]">
      {/* Hero */}
      <section className="relative grid items-center gap-10 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-5"
        >
          <h1 className="text-4xl font-bold tracking-tight leading-tight bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
            Measure, monitor & explain <span className="text-primary">risk</span> at a glance.
          </h1>
          <p className="text-lg text-muted-foreground">
            RISK LENS turns complex signals into simple, actionable insights so you can make faster, smarter decisions.
          </p>
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/riskassessment"
                className="rounded-xl bg-primary px-5 py-2 text-sm text-primary-foreground shadow hover:opacity-90"
              >
                Get My Risk Score
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/about"
                className="rounded-xl border px-5 py-2 text-sm shadow-sm hover:bg-muted"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Futuristic Gauge in Hero */}
        <TiltWrapper>
          <motion.div
            initial={{ opacity: 0, rotateY: 15 }}
            whileInView={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-2xl border p-6 shadow-xl transition-transform"
          >
            <FuturisticGauge />
          </motion.div>
        </TiltWrapper>
      </section>

      {/* Features */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: Shield, title: "Trusted Protection", desc: "Identify potential threats early and prevent costly incidents before they happen." },
          { icon: Zap, title: "Fast Insights", desc: "Transform raw data into clear, actionable signals in seconds." },
          { icon: LineChart, title: "Visual Analytics", desc: "Intuitive charts help you track, compare, and explain risks effortlessly." }
        ].map((feature, i) => (
          <TiltWrapper key={i}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border shadow-md transition-transform hover:shadow-xl hover:-translate-y-2"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}
              >
                <feature.icon className="h-6 w-6 text-primary mb-3" />
              </motion.div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          </TiltWrapper>
        ))}
      </section>

      {/* How It Works */}
      
      <section id="how-it-works" className="relative my-20 flex flex-col items-center">
  <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

  {/* Timeline container */}
  <div className="relative w-full max-w-3xl flex flex-col items-center">
    {/* Timeline line (stops before last node) */}
    <motion.div
      className="absolute left-1/2 w-1 bg-blue-400/50 rounded-full"
      initial={{ height: 0 }}
      animate={{ height: "calc(100% - 40px)" }} // subtract last node height so line stops
      transition={{ duration: 1.5, ease: "easeInOut" }}
      style={{ top: 0 }}
    />

    {/* Timeline nodes */}
    {[
      { title: "Input Data", desc: "Provide key information or connect your data source securely." },
      { title: "AI Risk Scan", desc: "Our engine processes the signals and detects potential threats instantly." },
      { title: "Get Insights", desc: "Receive your personalized risk score and recommendations right away." },
      { title: "Actionable Decisions", desc: "Take fast, informed actions to mitigate potential risks." }
    ].map((step, i) => {
      const [activeNodes, setActiveNodes] = useState<number[]>([])

      // Handle hover or click to activate node
      const handleActivate = () => {
        setActiveNodes((prev) => {
          if (!prev.includes(i)) return [...prev, i]
          return prev
        })
      }

      return (
        <div key={i} className="relative flex flex-col items-center mb-20">
          {/* Node circle */}
          <div
            className="w-6 h-6 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(0,255,255,0.6)] cursor-pointer"
            onMouseEnter={handleActivate}
            onClick={handleActivate}
          />

          {/* Card */}
          <AnimatePresence>
            {activeNodes.includes(i) && (
              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg p-4 text-center mt-4 w-64"
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-sm font-semibold mb-1">{step.title}</h3>
                <p className="text-[10px] text-muted-foreground">{step.desc}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    })}
  </div>
</section>



      {/* Final CTA */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center space-y-5"
      >
        <h2 className="text-3xl font-bold">Ready to assess your risk?</h2>
        <p className="text-muted-foreground">
          Get started with a free assessment today and take control of your security.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/riskassessment"
            className="rounded-xl bg-primary px-6 py-3 text-sm text-primary-foreground shadow hover:opacity-90"
          >
            Start Now
          </Link>
        </motion.div>
      </motion.section>
    </div>
  )
}
