import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#09120e]/90">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-sm text-white/55 sm:flex-row sm:px-6 lg:px-8">
        <div>© {new Date().getFullYear()} National Teams Dashboard</div>
        <div className="text-[#b7ff3f]">Built with ❤️ • Tailwind CSS</div>
      </div>
    </footer>
  )
}
