import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-[26px] p-8">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight text-[rgb(88,86,202)]">Samvaad Todo</h1>
        <p className="text-gray-400 text-lg bg-white">Practice interviews out loud, with an AI that pushes back</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-[50vw] space-y-4">
        <div className="space-y-1 mb-[30px]">
          <h2 className="font-semibold text-lg mb-[20px]">System Design Interview</h2>
          <p className="text-gray-400 text-sm">Design WhatsApp — 30 minutes</p>
        </div>
        <p className="text-gray-500 text-sm">
          Practice a realistic system design interview. The AI will ask follow-up
          questions and probe your reasoning. Speak naturally.
        </p>
        <Link
          href="/interview"
          className="block w-full bg-[red] text-gray-900 font-semibold text-center py-3 rounded-xl hover:bg-gray-100 transition-colors"
        >
          Start Interview
        </Link>
      </div>
    </main>
  );
}
