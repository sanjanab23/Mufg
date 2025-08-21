"use client"

import Link from "next/link"
import RiskChart from "@/components/ui/chart"
import { Shield, Zap, LineChart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

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

export default function Page() {
  // Cursor glow state
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

        <TiltWrapper>
          <motion.div
            initial={{ opacity: 0, rotateY: 15 }}
            whileInView={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-2xl border p-6 shadow-xl transition-transform"
          >
            <RiskChart />
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
      <section id="how-it-works" className="space-y-10">
        <h2 className="text-3xl font-bold text-center">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { step: 1, title: "Input Data", desc: "Provide key information or connect your data source securely." },
            { step: 2, title: "AI Risk Scan", desc: "Our engine processes the signals and detects potential threats instantly." },
            { step: 3, title: "Get Insights", desc: "Receive your personalized risk score and recommendations right away." }
          ].map((item, i) => (
            <TiltWrapper key={i}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="rounded-2xl shadow-md hover:shadow-xl transition-transform">
                  <CardContent className="p-6 space-y-3 text-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <span className="font-bold text-primary">{item.step}</span>
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </TiltWrapper>
          ))}
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
