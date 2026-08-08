import { useParams } from "react-router-dom";

export default function ProjectDraft() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="max-w-6xl mx-auto py-16 px-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Hero header for Briefberry</h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-sky-400 flex items-center justify-center text-white font-bold">B</div>
              <div>
                <div className="text-sm font-medium">Tran Mau Tri Tam • for UI8</div>
                <div className="text-xs text-slate-400">Available for work · Follow</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="h-10 px-4 rounded-full border border-slate-200 bg-white">♡</button>
            <button className="h-10 px-4 rounded-full bg-slate-900 text-white">Get in touch</button>
          </div>
        </div>

        {/* Showcase card */}
        <div className="bg-slate-100 rounded-xl p-8">
          <div className="bg-white rounded-lg shadow-lg mx-auto" style={{ maxWidth: 920 }}>
            <div className="p-20 text-center">
              <h2 className="text-3xl font-extrabold mb-4">AI-powered project briefs for designers</h2>
              <p className="text-sm text-slate-500 max-w-2xl mx-auto">Transform your ideas into comprehensive project briefs in seconds. Let AI create your project brief while you focus on bringing your vision to life.</p>
              <div className="mt-6">
                <button className="px-4 py-2 bg-slate-900 text-white rounded-full">Get started for free</button>
              </div>
            </div>

            <div className="h-72 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
              <div className="w-[80%] h-[88%] bg-gradient-to-br from-white to-slate-50 rounded-lg shadow-inner flex items-center justify-center">
                <div className="text-center text-slate-400">[Mockup screenshot area]</div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower profile / details area (long page feel) */}
        <div className="mt-12">
          <div className="max-w-3xl mx-auto text-center text-slate-400">Join 50,000+ designers</div>

          <div className="mt-12 bg-white rounded-lg shadow p-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center">UI</div>
              <div>
                <div className="font-semibold">UI8</div>
                <div className="text-xs text-slate-500">Design studio / Resources for designers.</div>
              </div>
            </div>

            <div className="mt-8 border-t pt-6 text-sm text-slate-600">
              <p>---</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
