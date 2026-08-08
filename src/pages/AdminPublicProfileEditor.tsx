import { useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminPublicProfileEditor() {
  const location = useLocation();
  const navigate = useNavigate();
  const previewSrc = (location.state as any)?.previewSrc as string | null;

  const handleClose = useCallback(() => {
    navigate('/admin/public-profiles');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <button onClick={handleClose} className="rounded-full border border-[#e5e7ef] bg-white px-5 py-3 text-sm font-semibold text-[#111827]">Cancel</button>
          <div className="flex items-center gap-3">
            <button className="rounded-full border border-[#e5e7ef] bg-white px-5 py-3 text-sm font-semibold text-[#111827]">Save as draft</button>
            <button className="rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white">Publish</button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <div className="overflow-hidden rounded-[1rem] border border-[#eaeaea] bg-[#fafafa]">
              {previewSrc ? (
                <img src={previewSrc} alt="Uploaded" className="w-full object-contain" />
              ) : (
                <div className="flex h-[640px] items-center justify-center text-[#6b7280]">No image selected</div>
              )}
            </div>

            <div className="mt-6 rounded-[1rem] border border-[#eaeaea] bg-white p-6">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[#6b7280]">Shot title</label>
              <input placeholder="Give me a name" className="w-full rounded-3xl border border-flux-void/10 bg-white px-4 py-3 text-sm outline-none" />
            </div>
          </div>

          <aside className="col-span-4">
            <div className="rounded-[1rem] border border-[#eaeaea] bg-white p-6">
              <h3 className="text-lg font-semibold">Insert block</h3>
              <div className="mt-4 space-y-3 text-sm text-[#4b5563]">
                <button className="w-full rounded-2xl border px-4 py-3 text-left">Text</button>
                <button className="w-full rounded-2xl border px-4 py-3 text-left">Image</button>
                <button className="w-full rounded-2xl border px-4 py-3 text-left">Video</button>
                <button className="w-full rounded-2xl border px-4 py-3 text-left">Gallery</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
