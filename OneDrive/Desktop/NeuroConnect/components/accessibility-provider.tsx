"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type FontSize = "small" | "medium" | "large"
type Language = "en" | "hi"

interface AccessibilityContextType {
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
  language: Language
  setLanguage: (lang: Language) => void
  highContrast: boolean
  setHighContrast: (enabled: boolean) => void
  reducedMotion: boolean
  setReducedMotion: (enabled: boolean) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>("medium")
  const [language, setLanguage] = useState<Language>("en")
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Load saved preferences
    const savedFontSize = localStorage.getItem("fontSize") as FontSize
    const savedLanguage = localStorage.getItem("language") as Language
    const savedHighContrast = localStorage.getItem("highContrast") === "true"
    const savedReducedMotion = localStorage.getItem("reducedMotion") === "true"

    if (savedFontSize) setFontSize(savedFontSize)
    if (savedLanguage) setLanguage(savedLanguage)
    setHighContrast(savedHighContrast)
    setReducedMotion(savedReducedMotion)
  }, [])

  useEffect(() => {
    // Apply font size to document
    document.documentElement.className = document.documentElement.className
      .replace(/font-(small|medium|large)/g, "")
      .concat(` font-${fontSize}`)

    localStorage.setItem("fontSize", fontSize)
  }, [fontSize])

  useEffect(() => {
    // Apply language
    document.documentElement.lang = language
    localStorage.setItem("language", language)
  }, [language])

  useEffect(() => {
    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
    localStorage.setItem("highContrast", highContrast.toString())
  }, [highContrast])

  useEffect(() => {
    // Apply reduced motion
    if (reducedMotion) {
      document.documentElement.style.setProperty("--motion-reduce", "1")
    } else {
      document.documentElement.style.removeProperty("--motion-reduce")
    }
    localStorage.setItem("reducedMotion", reducedMotion.toString())
  }, [reducedMotion])

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        language,
        setLanguage,
        highContrast,
        setHighContrast,
        reducedMotion,
        setReducedMotion,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
