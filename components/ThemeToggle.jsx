'use client'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-9 h-9" />
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <Sun size={20} className="text-slate-600 dark:text-slate-300" />
            ) : (
                <Moon size={20} className="text-slate-600 dark:text-slate-300" />
            )}
        </button>
    )
}
