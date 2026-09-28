import { Clapperboard } from 'lucide-react'

export default function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mb-5 shadow-lg">
        <Clapperboard size={30} className="text-[#e50914]" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-500 text-sm max-w-sm">
        This module will be unlocked in the upcoming development phases.
      </p>
    </div>
  )
}
