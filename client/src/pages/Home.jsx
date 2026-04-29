import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import LoginModal from '../components/LoginModal'
import { useDispatch, useSelector } from 'react-redux'
import { Coins, ChevronRight, Zap, Code, Smartphone } from "lucide-react"
import { serverUrl } from '../App'
import axios from 'axios'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'

function Home() {
    const highlights = [
        { title: "AI Generated Code", desc: "GenWeb.ai builds real websites — clean code, animations, responsiveness and scalable structure.", icon: <Code className="w-6 h-6 text-purple-400" /> },
        { title: "Fully Responsive Layouts", desc: "Every generated site is mobile-first and looks stunning on any device screen size.", icon: <Smartphone className="w-6 h-6 text-blue-400" /> },
        { title: "Production Ready Output", desc: "Export your project knowing it's built with modern standards and ready to be deployed.", icon: <Zap className="w-6 h-6 text-yellow-400" /> },
    ]

    const [openLogin, setOpenLogin] = useState(false)
    const { userData } = useSelector(state => state.user)
    const [openProfile, setOpenProfile] = useState(false)
    const [websites, setWebsites] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            dispatch(setUserData(null))
            setOpenProfile(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!userData) return;
        const handleGetAllWebsites = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-all`, { withCredentials: true })
                setWebsites(result.data || [])
            } catch (error) {
                console.log(error)
            }
        }
        handleGetAllWebsites()
    }, [userData])

    return (
        <div className='relative min-h-screen bg-[#030303] text-white overflow-hidden font-sans selection:bg-purple-500/30 selection:text-purple-200'>
            {/* Dynamic Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none z-0 animate-[pulse_8s_ease-in-out_infinite]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none z-0 animate-[pulse_10s_ease-in-out_infinite_1s]" />
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-500/20 blur-[100px] rounded-full pointer-events-none z-0 animate-[pulse_9s_ease-in-out_infinite_2s]" />

            <motion.nav
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className='fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/5'
            >
                <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
                    <div className='text-xl flex items-center gap-2 font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70'>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                            <Zap size={18} className="fill-current text-white" />
                        </div>
                        GenWeb.ai
                    </div>
                    <div className='flex items-center gap-6'>
                        <div className='hidden md:inline text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer' onClick={() => navigate("/pricing")}>
                            Pricing
                        </div>
                        {userData && (
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className='hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10 transition shadow-sm' 
                                onClick={() => navigate("/pricing")}
                            >
                                <Coins size={14} className='text-yellow-400' />
                                <span className='text-zinc-300 font-medium'>Credits</span>
                                <span className="font-semibold text-white">{userData.credits}</span>
                                <span className='font-bold text-yellow-400'>+</span>
                            </motion.div>
                        )}

                        {!userData ? (
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className='px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-sm'
                                onClick={() => setOpenLogin(true)}
                            >
                                Get Started
                            </motion.button>
                        ) : (
                            <div className='relative'>
                                <button className='flex items-center hover:opacity-80 transition-opacity' onClick={() => setOpenProfile(!openProfile)}>
                                    <img src={userData?.avatar || `https://ui-avatars.com/api/?name=${userData.name}&background=random`} alt="User avatar" referrerPolicy='no-referrer' className='w-10 h-10 rounded-full border-2 border-white/10 shadow-lg object-cover' />
                                </button>
                                <AnimatePresence>
                                    {openProfile && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-3 w-64 z-50 rounded-2xl bg-[#0b0b0b]/90 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden"
                                        >
                                            <div className='px-5 py-4 border-b border-white/10 bg-white/[0.02]'>
                                                <p className='text-sm font-semibold text-white truncate'>{userData.name}</p>
                                                <p className='text-xs text-zinc-400 truncate mt-0.5'>{userData.email}</p>
                                            </div>

                                            <button className='md:hidden w-full px-5 py-3 flex items-center gap-2 text-sm border-b border-white/10 hover:bg-white/5 transition-colors'>
                                                <Coins size={14} className='text-yellow-400' />
                                                <span className='text-zinc-300 font-medium'>Credits</span>
                                                <span className='font-semibold text-white'>{userData.credits}</span>
                                                <span className='font-bold text-yellow-400'>+</span>
                                            </button>

                                            <div className="p-2 flex flex-col gap-1">
                                                <button className='w-full px-3 py-2.5 rounded-lg text-left text-sm font-medium hover:bg-white/10 transition-colors flex justify-between' onClick={() => navigate("/dashboard")}>
                                                    Dashboard
                                                    <ChevronRight size={16} className="text-zinc-500" />
                                                </button>
                                                <button className='w-full px-3 py-2.5 rounded-lg text-left text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors' onClick={handleLogOut}>Logout</button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </motion.nav>

            <main className='relative pt-48 pb-32 px-6 flex flex-col items-center justify-center min-h-[85vh] z-10 overflow-hidden md:overflow-visible'>
                {/* Floating Elements */}
                <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
                    <motion.div 
                        animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }} 
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} 
                        className="absolute top-[20%] left-[15%] w-40 h-40 bg-gradient-to-br from-purple-500/10 to-transparent rounded-[2rem] border border-white/5 backdrop-blur-3xl hidden lg:block shadow-[0_0_30px_rgba(168,85,247,0.1)]"
                    />
                    <motion.div 
                        animate={{ y: [0, 40, 0], rotate: [0, -15, 0] }} 
                        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
                        className="absolute bottom-[20%] right-[10%] w-56 h-56 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full border border-white/5 backdrop-blur-3xl hidden lg:block shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                    />
                    <motion.div 
                        animate={{ y: [0, -20, 0], x: [0, 20, 0] }} 
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }} 
                        className="absolute top-[35%] right-[25%] w-24 h-24 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-xl border border-white/5 backdrop-blur-3xl hidden md:block shadow-[0_0_20px_rgba(236,72,153,0.1)]"
                    />
                </div>

                {/* Hero Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2 text-xs font-medium text-zinc-300 shadow-[0_0_15px_rgba(255,255,255,0.03)] hover:bg-white/10 transition-colors cursor-pointer"
                >
                    <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse"></span>
                    GenWeb AI Engine 2.0 Now Live
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-center leading-[1.1] max-w-5xl"
                >
                    Build Stunning Websites <br className="hidden md:block"/>
                    <span className='bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent inline-block pb-2'>at the Speed of Thought</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className='mt-8 max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl text-center leading-relaxed font-light'
                >
                    Describe your idea and let AI generate a modern,
                    responsive, production-ready website in seconds. No coding required.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 flex flex-col sm:flex-row items-center gap-4"
                >
                    <button 
                        className="group relative px-8 py-4 rounded-full bg-white text-black font-semibold text-base transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] flex items-center gap-2 overflow-hidden" 
                        onClick={() => userData ? navigate("/dashboard") : setOpenLogin(true)}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                           {userData ? "Go to dashboard" : "Start Generating for Free"}
                           <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-zinc-200 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                    {!userData && (
                        <button 
                            className="px-8 py-4 rounded-full bg-white/5 border border-white/10 font-semibold text-base transition-all hover:bg-white/10 active:scale-95 flex items-center gap-2 backdrop-blur-sm" 
                            onClick={() => navigate("/pricing")}
                        >
                            View Pricing
                        </button>
                    )}
                </motion.div>
            </main>

            {!userData && (
                <section className='relative max-w-7xl mx-auto px-6 pb-40 z-10'>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10'>
                        {highlights.map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group relative rounded-3xl bg-white/[0.03] border border-white/5 p-8 hover:bg-white/[0.08] hover:border-white/20 transition-all hover:-translate-y-3 backdrop-blur-md shadow-lg hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-inner">
                                    {h.icon}
                                </div>
                                <h1 className='text-xl font-bold mb-3 text-white tracking-tight'>{h.title}</h1>
                                <p className='text-sm text-zinc-400 leading-relaxed font-light'>
                                    {h.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {userData && websites?.length > 0 && (
                <section className='relative max-w-7xl mx-auto px-6 pb-40 z-10'>
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
                        <div>
                            <h3 className='text-3xl font-bold tracking-tight'>Your Projects</h3>
                            <p className="text-zinc-400 mt-2 text-sm font-light">Jump back in and continue editing.</p>
                        </div>
                        <button className="text-sm font-medium px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-1 transition-all" onClick={() => navigate("/dashboard")}>
                            View all <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {websites.slice(0, 3).map((w, i) => (
                            <motion.div
                                key={w._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                whileHover={{ y: -8, scale: 1.01 }}
                                onClick={() => navigate(`/editor/${w._id}`)}
                                className="group cursor-pointer rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden hover:border-white/20 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] flex flex-col"
                            >
                                <div className='relative h-56 bg-[#0a0a0a] border-b border-white/5 overflow-hidden'>
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10 opacity-70"></div>
                                    {w.latestCode ? (
                                        <iframe
                                            srcDoc={w.latestCode}
                                            className='w-[200%] h-[200%] scale-[0.5] origin-top-left pointer-events-none'
                                            title={`Preview for ${w.title}`}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 bg-zinc-900/50">
                                            <Code size={32} className="mb-2 opacity-50" />
                                            <p className="text-sm">No Preview Available</p>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 z-20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
                                        <div className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            Open Editor
                                        </div>
                                    </div>
                                </div>
                                <div className='p-6 flex-1 flex flex-col justify-center'>
                                    <h3 className='text-lg font-bold truncate group-hover:text-purple-400 transition-colors'>{w.title || "Untitled Project"}</h3>
                                    <p className='text-xs text-zinc-500 mt-2 font-medium flex items-center gap-1.5'>
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                                        Updated {new Date(w.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            <footer className='relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-xl'>
                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8 text-sm text-zinc-500">
                    <div className="flex items-center gap-2.5 font-bold text-white/90 text-lg">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white">
                            <Zap size={14} className="fill-current text-white" />
                        </div>
                        GenWeb.ai
                    </div>
                    
                    <div className="flex flex-col items-center justify-center gap-1">
                         <p>&copy; {new Date().getFullYear()} GenWeb.ai. All rights reserved.</p>
                         <p className="flex items-center justify-center gap-1.5 mt-2 text-zinc-400 text-sm font-medium">
                             Made with <motion.span 
                                animate={{ scale: [1, 1.2, 1] }} 
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} 
                                className="text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                             >💗</motion.span> by <span className="text-white hover:text-purple-400 transition-colors cursor-pointer">Aashu</span>
                         </p>
                    </div>

                    <div className="flex gap-6 font-medium">
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="mailto:ashishmahato650@gmail.com" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>

            {openLogin && <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />}
        </div>
    )
}

export default Home
