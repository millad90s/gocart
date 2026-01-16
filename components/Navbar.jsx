'use client'
import { Search, ShoppingCart, UserCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

const Navbar = () => {

    const router = useRouter();
    const { data: session, status } = useSession();

    const [search, setSearch] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const cartCount = useSelector(state => state.cart.total)

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    return (
        <nav className="relative bg-white">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4  transition-all">

                    <Link href="/" className="relative text-4xl font-semibold text-slate-700">
                        <span className="text-green-600">go</span>cart<span className="text-green-600 text-5xl leading-0">.</span>
                        <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                            plus
                        </p>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                        <Link href="/">Home</Link>
                        <Link href="/shop">Shop</Link>
                        <Link href="/">About</Link>
                        <Link href="/">Contact</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                            <Search size={18} className="text-slate-600" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-600" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
                            <ShoppingCart size={18} />
                            Cart
                            <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">{cartCount}</button>
                        </Link>

                        {status === "loading" ? (
                            <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>
                        ) : session ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-2 hover:opacity-80 transition"
                                >
                                    {session.user.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt={session.user.name || "User"}
                                            width={40}
                                            height={40}
                                            className="rounded-full border-2 border-slate-200"
                                        />
                                    ) : (
                                        <UserCircle size={40} className="text-slate-600" />
                                    )}
                                </button>
                                
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                                        <div className="px-4 py-2 border-b border-slate-200">
                                            <p className="font-medium text-slate-800">{session.user.name}</p>
                                            <p className="text-xs text-slate-500">{session.user.email}</p>
                                        </div>
                                        <Link href="/profile" className="block px-4 py-2 text-slate-600 hover:bg-slate-50" onClick={() => setShowDropdown(false)}>
                                            My Profile
                                        </Link>
                                        <Link href="/orders" className="block px-4 py-2 text-slate-600 hover:bg-slate-50" onClick={() => setShowDropdown(false)}>
                                            My Orders
                                        </Link>
                                        <Link href="/store" className="block px-4 py-2 text-slate-600 hover:bg-slate-50" onClick={() => setShowDropdown(false)}>
                                            My Store
                                        </Link>
                                        <Link href="/admin" className="block px-4 py-2 text-slate-600 hover:bg-slate-50" onClick={() => setShowDropdown(false)}>
                                            Admin Panel
                                        </Link>
                                        <hr className="my-2" />
                                        <button
                                            onClick={() => {
                                                setShowDropdown(false)
                                                signOut()
                                            }}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => signIn('google')}
                                className="flex items-center gap-2 px-6 py-2 bg-white border-2 border-slate-200 hover:border-slate-300 hover:shadow-md transition text-slate-700 rounded-full font-medium"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Sign in with Google
                            </button>
                        )}

                    </div>

                    {/* Mobile User Button  */}
                    <div className="sm:hidden">
                        {status === "loading" ? (
                            <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>
                        ) : session ? (
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center"
                            >
                                {session.user.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        width={32}
                                        height={32}
                                        className="rounded-full border-2 border-slate-200"
                                    />
                                ) : (
                                    <UserCircle size={32} className="text-slate-600" />
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={() => signIn('google')}
                                className="flex items-center gap-2 px-5 py-2 bg-white border-2 border-slate-200 hover:border-slate-300 hover:shadow-md transition text-slate-700 rounded-full text-sm font-medium"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Google
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <hr className="border-gray-300" />
        </nav>
    )
}

export default Navbar