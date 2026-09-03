import React from 'react'
import fifalogo from '../assets/fifa_logo.jpg'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(11,20,16,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img
            src={fifalogo}
            alt="logo"
            className="h-12 w-12 rounded-xl object-cover ring-1 ring-[#b7ff3f]/25 shadow-[0_0_20px_-8px_rgba(183,255,63,0.7)]"
          />
          <div className="leading-tight">
            <h1 className="sn-display text-2xl tracking-wide text-white sm:text-3xl">National Teams Dashboard</h1>
            <p className="text-xs uppercase tracking-[0.28em] text-white/55 sm:text-[11px]">
              Manage national teams, flags and staff
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-white/70 lg:flex">
          <a
            href="/dashboard"
            className="border-b-2 border-transparent pb-1 transition hover:border-[#b7ff3f] hover:text-white"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="border-b-2 border-transparent pb-1 transition hover:border-[#b7ff3f] hover:text-white"
          >
            Teams
          </a>
        </nav>
      </div>
    </header>
  )
}
