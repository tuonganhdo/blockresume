import { useEffect, useState } from "react"

export default function ThemeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(false)

    // sync theme state with DOM
    useEffect(() => {
      const isDark = document.documentElement.classList.contains('dark') || 
                  (!document.documentElement.classList.contains('light') && 
                      window.matchMedia('(prefers-color-scheme: dark)').matches)
      setIsDarkMode(isDark)
    }, [])

    // toggle theme and manage hooks
    const toggleTheme = () => {
      if (isDarkMode) {
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
        setIsDarkMode(false)
      } else {
        document.documentElement.classList.remove('light')
        document.documentElement.classList.add('dark')
        setIsDarkMode(true)
      }
    }

    return (
      <button
      onClick={toggleTheme}
      className="w-full text-left px-4 py-3 rounded-md text-xs font-medium border border-app bg-app text-app hover:opacity-80 transition-all flex items-center justify-between"
      >
        <span>Theme Mode</span>
        <span>{isDarkMode ? '🌙 Dark' : '☀️ Light'}</span>
      </button>
    )
}