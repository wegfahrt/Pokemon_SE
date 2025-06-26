"use client"

import { cn } from "@/lib/utils"

// Props interface for the PokeballIcon component
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
      {/* Outer Circle (Border) */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-gray-800 dark:text-gray-200"
      />

      {/* Upper Half (Red) */}
      <path d="M2.1 12C2.1 6.5 6.5 2.1 12 2.1C17.5 2.1 21.9 6.5 21.9 12" fill="currentColor" className="text-red-500" />

      {/* Lower Half (White/Light) */}
      <path
        d="M21.9 12C21.9 17.5 17.5 21.9 12 21.9C6.5 21.9 2.1 17.5 2.1 12"
        fill="currentColor"
        className="text-white dark:text-gray-100"
        stroke="currentColor"
        strokeWidth="0.2"
        strokeLinecap="round"
      />

      {/* Middle Line */}
      <line
        x1="2"
        y1="12"
        x2="22"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-gray-800 dark:text-gray-200"
      />

      {/* Central Button (Outer Ring) */}
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

      {/* Central Button (Inner Circle) */}
      <circle cx="12" cy="12" r="1.2" fill="currentColor" className="text-gray-800 dark:text-gray-200" />

      {/* Highlight on the Button */}
      <circle cx="11.2" cy="11.2" r="0.4" fill="currentColor" className="text-white dark:text-gray-300 opacity-80" />
    </svg>
  )
}

// Simple version of the Pokeball Icon
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
      {/* Outer Circle (Border) */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-gray-800 dark:text-gray-200"
      />

      {/* Upper Half (Red) */}
      <path d="M2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12" fill="currentColor" className="text-red-500" />

      {/* Middle Line */}
      <line
        x1="2"
        y1="12"
        x2="22"
        y2="12"
        stroke="currentColor"
        strokeWidth="2"
        className="text-gray-800 dark:text-gray-200"
      />

      {/* Central Button */}
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

// Premium Pokeball Icon with Gradient and Glow Effect
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
      {/* Shadow/Glow Effect */}
      <circle cx="12" cy="12.5" r="10.5" fill="currentColor" className="text-black opacity-10 dark:opacity-20" />

      {/* Outer Circle with Gradient Effect */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-gray-700 dark:text-gray-300"
      />

      {/* Upper Half with Gradient Simulation */}
      <path
        d="M2.1 12C2.1 6.5 6.5 2.1 12 2.1C17.5 2.1 21.9 6.5 21.9 12"
        fill="url(#redGradient)"
        className="text-red-500"
      />

      {/* Highlight on the Upper Half */}
      <path
        d="M4 8C6 4.5 9 2.5 12 2.1C15 2.5 18 4.5 20 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-red-300 opacity-60"
      />

      {/* Lower Half */}
      <path
        d="M21.9 12C21.9 17.5 17.5 21.9 12 21.9C6.5 21.9 2.1 17.5 2.1 12"
        fill="currentColor"
        className="text-gray-100 dark:text-gray-200"
      />

      {/* Middle Line with Shadow */}
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

      {/* Central Button - Outer Ring */}
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="currentColor"
        className="text-gray-200 dark:text-gray-300"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Central Button - Middle Ring */}
      <circle cx="12" cy="12" r="2" fill="currentColor" className="text-white dark:text-gray-100" />

      {/* Central Button - Inner Circle */}
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

// Animated Pokeball Icon with Spin Effect
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
        {/* Outer Circle (Border) */}
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-800 dark:text-gray-200"
        />

        {/* Upper Half */}
        <path d="M2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12" fill="currentColor" className="text-red-500" />

        {/* Middle Line */}
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

      {/* Central Button (stationary) */}
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
