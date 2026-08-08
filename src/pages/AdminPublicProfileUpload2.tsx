import { useCallback, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ImagePlus } from "lucide-react";

export default function AdminPublicProfileUpload2() {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setSelectedFiles(arr);
    if (arr.length > 0) {
      const url = URL.createObjectURL(arr[0]);
      setPreviewSrc(url);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (previewSrc) URL.revokeObjectURL(previewSrc);
    };
  }, [previewSrc]);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragActive(false);
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles],
  );

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f7f8] text-[#111827]">
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link
            to="/admin/public-profiles"
            className="inline-flex items-center justify-center rounded-full border border-[#e5e7ef] bg-white px-5 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#f8fafc]"
          >
            Cancel
          </Link>

          <div className="flex items-center gap-3 justify-end">
            <button className="rounded-full border border-[#e5e7ef] bg-white px-5 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#f8fafc]">
              Save as draft
            </button>
            <button
              className="rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
              onClick={() => navigate('/admin/public-profiles/editor', { state: { previewSrc } })}
            >
              Continue
            </button>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h1 className="text-4xl font-semibold tracking-[-0.03em] text-[#111827] sm:text-5xl">What have you been working on?</h1>
        </div>

        <div className="mt-14 flex justify-center">
          <div
            className={`w-full max-w-4xl rounded-[2rem] border border-dashed px-8 py-16 text-center transition ${
              isDragActive ? "border-[#111827] bg-[#fafafa]" : "border-[#d9d9dc] bg-white"
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#f8f4ff] text-[#7c3aed] shadow-sm">
              <ImagePlus size={32} />
            </div>
            <div className="mt-8 flex flex-col items-center gap-4">
              <p className="text-base font-semibold text-[#111827]">
                Drag and drop an image, or{' '}
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="font-semibold text-[#111827] underline"
                >
                  Browse
                </button>
              </p>
              <p className="max-w-xl text-sm text-[#6b7280]">Minimum 1600px width recommended. Max 10MB each (20MB for videos)</p>
            </div>

            <div className="mt-12 grid gap-4 text-left text-sm text-[#4b5563] sm:grid-cols-2">
              <div className="space-y-3">
                <p className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#111827]" />
                  High resolution images (png, jpg, gif, webp)
                </p>
                <p className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#111827]" />
                  Animated gifs
                </p>
              </div>
              <div className="space-y-3">
                <p className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#111827]" />
                  Videos (mp4)
                </p>
                <p className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#111827]" />
                  Only upload media you own the rights to
                </p>
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp,video/mp4"
              multiple
              className="hidden"
              onChange={(event) => handleFiles(event.target.files)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
