import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminPublicProfileEditor() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [renderSidebar, setRenderSidebar] = useState(true);
  const [shotTitle, setShotTitle] = useState("");
  const previewSrc = (location.state as any)?.previewSrc as string | null;

  useEffect(() => {
    if (isSidebarOpen) {
      setRenderSidebar(true);
      return;
    }

    const timeout = window.setTimeout(() => {
      setRenderSidebar(false);
    }, 280);

    return () => window.clearTimeout(timeout);
  }, [isSidebarOpen]);

  const handleClose = useCallback(() => {
    navigate('/admin/public-profiles');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#111827]">
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <button
            onClick={handleClose}
            className="inline-flex items-center justify-center rounded-full border border-[#e5e7ef] bg-white px-5 py-3 text-sm font-semibold text-[#111827] shadow-sm transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <button className="rounded-full border border-[#e5e7ef] bg-white px-5 py-3 text-sm font-semibold text-[#111827] shadow-sm transition hover:bg-slate-50">
              Save as draft
            </button>
            <button className="rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900">
              Continue
            </button>
          </div>
        </div>

        <div className="mt-14 grid">
          <main className="space-y-6">
            <div className="rounded-[1.75rem] border border-[#e5e7ef] bg-white px-6 py-6 shadow-sm sm:px-8 sm:py-8">
              <div className="max-w-2xl">
                <label htmlFor="shot-title" className="text-xs font-semibold uppercase tracking-[0.32em] text-[#6b7280]">
                  Shot title
                </label>
                <input
                  id="shot-title"
                  value={shotTitle}
                  onChange={(event) => setShotTitle(event.target.value)}
                  placeholder="Start by giving this shot a name"
                  className="mt-4 w-full border-0 bg-transparent text-3xl font-semibold leading-tight text-[#111827] outline-none placeholder:text-[#9ca3af] sm:text-4xl"
                />
              </div>

              <div className="mt-8 overflow-hidden rounded-[2rem] border border-[#e5e7ef] bg-[#f8fafc] shadow-sm">
                {previewSrc ? (
                  <img src={previewSrc} alt="Uploaded" className="h-[760px] w-full object-cover" />
                ) : (
                  <div className="flex h-[760px] items-center justify-center text-[#6b7280]">
                    No image selected
                  </div>
                )}
              </div>

              <div className="mt-5 rounded-[2rem] border border-[#e5e7ef] bg-white px-5 py-4 shadow-sm">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-[2rem] border border-[#e5e7ef] bg-white px-5 py-4 text-sm font-semibold text-[#111827] transition hover:bg-slate-50"
                >
                  <span className="text-xl leading-none">+</span>
                  Insert block
                </button>
              </div>
            </div>

          </main>
        </div>

        {renderSidebar ? (
          <div
            className={`fixed inset-y-0 right-0 z-50 w-[360px] max-w-full border-l border-slate-200 bg-white shadow-2xl transition-transform duration-280 ease-out ${
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex h-full flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <p className="text-sm font-semibold text-slate-900">Insert block</p>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6">
                <div className="space-y-6">
                  <div>
                    <p className="mb-4 text-xs uppercase tracking-[0.3em] text-slate-400">Basic</p>
                    <button className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                      Text
                      <span className="text-slate-400">→</span>
                    </button>
                    <button className="mt-3 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                      Image
                      <span className="text-slate-400">→</span>
                    </button>
                    <button className="mt-3 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                      Video
                      <span className="text-slate-400">→</span>
                    </button>
                  </div>

                  <div>
                    <p className="mb-4 text-xs uppercase tracking-[0.3em] text-slate-400">Rich media</p>
                    <button className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                      Gallery
                      <span className="text-slate-400">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
