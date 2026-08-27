import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Samvaad Title</h1>
        <p className="text-gray-400 text-lg">Practice interviews out loud, with an AI that pushes back</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-lg w-full space-y-4">
        <div className="space-y-1">
          <h2 className="font-semibold text-lg mb-[15px]">System Design Interview</h2>
          <p className="text-gray-400 text-sm">Design WhatsApp — 30 minutes</p>
        </div>
        <p className="text-gray-500 text-sm">
          Practice a realistic system design interview. The AI will ask follow-up
          questions and probe your reasoning. Speak naturally.
        </p>
        <Link
          href="/interview"
          className="block w-full bg-red-500 text-white font-semibold text-center py-3 rounded-xl hover:bg-red-600 transition-colors"
        >
          Start Interview
        </Link>
      </div>
    </main>
  );
}
