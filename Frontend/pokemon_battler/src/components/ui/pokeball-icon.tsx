"use client"

import { cn } from "@/lib/utils"

interface PokeballIconProps {
  className?: string
  size?: number
}

export function PokeballIcon({ className, size = 24 }: PokeballIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      {/* Äußerer Kreis (Border) */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-gray-800 dark:text-gray-200"
      />

      {/* Obere Hälfte (Rot) */}
      <path d="M2.1 12C2.1 6.5 6.5 2.1 12 2.1C17.5 2.1 21.9 6.5 21.9 12" fill="currentColor" className="text-red-500" />

      {/* Untere Hälfte (Weiß/Hell) */}
      <path
        d="M21.9 12C21.9 17.5 17.5 21.9 12 21.9C6.5 21.9 2.1 17.5 2.1 12"
        fill="currentColor"
        className="text-white dark:text-gray-100"
        stroke="currentColor"
        strokeWidth="0.2"
        strokeLinecap="round"
      />

      {/* Mittellinie */}
      <line
        x1="2"
        y1="12"
        x2="22"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-gray-800 dark:text-gray-200"
      />

      {/* Zentraler Button (Äußerer Ring) */}
      <circle
        cx="12"
        cy="12"
        r="2.5"
        fill="currentColor"
        className="text-white dark:text-gray-100"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Zentraler Button (Innerer Kreis) */}
      <circle cx="12" cy="12" r="1.2" fill="currentColor" className="text-gray-800 dark:text-gray-200" />

      {/* Highlight auf dem Button */}
      <circle cx="11.2" cy="11.2" r="0.4" fill="currentColor" className="text-white dark:text-gray-300 opacity-80" />
    </svg>
  )
}

// Vereinfachte Version (verbessert)
export function SimplePokeballIcon({ className, size = 24 }: PokeballIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      {/* Äußerer Kreis */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-gray-800 dark:text-gray-200"
      />

      {/* Obere Hälfte (Rot) */}
      <path d="M2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12" fill="currentColor" className="text-red-500" />

      {/* Mittellinie */}
      <line
        x1="2"
        y1="12"
        x2="22"
        y2="12"
        stroke="currentColor"
        strokeWidth="2"
        className="text-gray-800 dark:text-gray-200"
      />

      {/* Zentraler Button */}
      <circle
        cx="12"
        cy="12"
        r="2.5"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-white dark:text-gray-100"
      />

      {/* Button-Detail */}
      <circle cx="12" cy="12" r="1" fill="currentColor" className="text-gray-800 dark:text-gray-200" />
    </svg>
  )
}

// Neue Premium-Version
export function PremiumPokeballIcon({ className, size = 24 }: PokeballIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      {/* Schatten/Glow-Effekt */}
      <circle cx="12" cy="12.5" r="10.5" fill="currentColor" className="text-black opacity-10 dark:opacity-20" />

      {/* Äußerer Kreis mit Gradient-Effekt */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-gray-700 dark:text-gray-300"
      />

      {/* Obere Hälfte mit Gradient-Simulation */}
      <path
        d="M2.1 12C2.1 6.5 6.5 2.1 12 2.1C17.5 2.1 21.9 6.5 21.9 12"
        fill="url(#redGradient)"
        className="text-red-500"
      />

      {/* Highlight auf oberer Hälfte */}
      <path
        d="M4 8C6 4.5 9 2.5 12 2.1C15 2.5 18 4.5 20 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-red-300 opacity-60"
      />

      {/* Untere Hälfte */}
      <path
        d="M21.9 12C21.9 17.5 17.5 21.9 12 21.9C6.5 21.9 2.1 17.5 2.1 12"
        fill="currentColor"
        className="text-gray-100 dark:text-gray-200"
      />

      {/* Mittellinie mit Schatten */}
      <line
        x1="2"
        y1="12.2"
        x2="22"
        y2="12.2"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-black opacity-20"
      />
      <line
        x1="2"
        y1="12"
        x2="22"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-gray-700 dark:text-gray-300"
      />

      {/* Zentraler Button - Äußerer Ring */}
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="currentColor"
        className="text-gray-200 dark:text-gray-300"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Zentraler Button - Mittlerer Ring */}
      <circle cx="12" cy="12" r="2" fill="currentColor" className="text-white dark:text-gray-100" />

      {/* Zentraler Button - Innerer Kreis */}
      <circle cx="12" cy="12" r="1" fill="currentColor" className="text-gray-700 dark:text-gray-400" />

      {/* Button-Highlight */}
      <circle cx="11.3" cy="11.3" r="0.3" fill="currentColor" className="text-white opacity-90" />

      {/* Gradient-Definition */}
      <defs>
        <linearGradient id="redGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" className="text-red-400" />
          <stop offset="100%" stopColor="currentColor" className="text-red-600" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Animierte Version (verbessert - ohne styled-jsx)
export function AnimatedPokeballIcon({ className, size = 24 }: PokeballIconProps) {
  return (
    <div className="relative inline-block">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("animate-spin", className)}
        style={{
          animationDuration: "3s",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {/* Äußerer Kreis */}
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-800 dark:text-gray-200"
        />

        {/* Obere Hälfte */}
        <path d="M2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12" fill="currentColor" className="text-red-500" />

        {/* Mittellinie */}
        <line
          x1="2"
          y1="12"
          x2="22"
          y2="12"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-800 dark:text-gray-200"
        />
      </svg>

      {/* Zentraler Button (bleibt stationär) */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          animation: "reverse-spin 3s linear infinite",
        }}
      >
        <svg width={size * 0.25} height={size * 0.25} viewBox="0 0 6 6" className="text-white dark:text-gray-100">
          <circle
            cx="3"
            cy="3"
            r="2.5"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-white dark:text-gray-100"
          />
          <circle cx="3" cy="3" r="1" fill="currentColor" className="text-gray-800 dark:text-gray-200" />
        </svg>
      </div>

      <style>{`
        @keyframes reverse-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  )
}
