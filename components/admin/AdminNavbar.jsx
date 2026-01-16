'use client'
import Link from "next/link"
import { ThemeToggle } from "../ThemeToggle"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import { UserCircle } from "lucide-react"
import { useState } from "react"

const AdminNavbar = () => {
    const { data: session } = useSession()
    const [showDropdown, setShowDropdown] = useState(false)

    return (
        <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-all">
            <Link href="/" className="relative text-4xl font-semibold text-slate-700 dark:text-slate-200">
                <span className="text-green-600">go</span>cart<span className="text-green-600 text-5xl leading-0">.</span>
                <p className="absolute text-xs font-semibold -top-1 -right-13 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                    Admin
                </p>
            </Link>
            <div className="flex items-center gap-3">
                <p className="text-slate-700 dark:text-slate-200">Hi, Admin</p>
                <ThemeToggle />
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 hover:opacity-80 transition"
                    >
                        {session?.user?.image ? (
                            <Image
                                src={session.user.image}
                                alt={session.user.name || "Admin"}
                                width={40}
                                height={40}
                                className="rounded-full border-2 border-slate-200 dark:border-slate-700"
                            />
                        ) : (
                            <UserCircle size={40} className="text-slate-600 dark:text-slate-400" />
                        )}
                    </button>
                    
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                            <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                                <p className="font-medium text-slate-800 dark:text-slate-200">{session?.user?.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{session?.user?.email}</p>
                            </div>
                            <Link href="/profile" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700" onClick={() => setShowDropdown(false)}>
                                My Profile
                            </Link>
                            <Link href="/" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700" onClick={() => setShowDropdown(false)}>
                                Back to Store
                            </Link>
                            <hr className="my-2 dark:border-slate-700" />
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminNavbar