"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";
import dynamic from "next/dynamic";
import {
  FileText,
  Link as LinkIcon,
  Plus,
} from "lucide-react";

type ResumeItem = {
  id: string;
  title: string;
  url: string;           // ← this is the image-type URL (preview + download source)
  size?: number;
  uploadedAt: string;
  pages?: number;
};

const PdfViewer = dynamic(() => import("./PdfViewer"), {
  // adjust path if needed: "@/components/PdfViewer"
  ssr: false,
  loading: () => (
    <div className="flex h-[90vh] items-center justify-center text-white bg-slate-950">
      Preparing PDF viewer...
    </div>
  ),
});

const STORAGE_KEY = "admin_resumes";
const ACTIVE_KEY = "active_resume_url";

export default function ResumeAdminPage() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [activeUrl, setActiveUrl] = useState<string>("");
  const [hydrated, setHydrated] = useState(false);
  const [fullscreenUrl, setFullscreenUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && fullscreenUrl) {
        setFullscreenUrl(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [fullscreenUrl]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const active = localStorage.getItem(ACTIVE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ResumeItem[];
        if (Array.isArray(parsed)) setResumes(parsed);
      } catch { }
    }
    if (active) setActiveUrl(active);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
  }, [hydrated, resumes]);

  useEffect(() => {
    if (!hydrated) return;
    if (activeUrl) {
      localStorage.setItem(ACTIVE_KEY, activeUrl);
    } else {
      localStorage.removeItem(ACTIVE_KEY);
    }
  }, [hydrated, activeUrl]);

  const activeResume = useMemo(
    () => resumes.find((r) => r.url === activeUrl),
    [resumes, activeUrl],
  );

  const addResume = (data: {
    title: string;
    url: string;
    size?: number;
    pages?: number;
  }) => {
    const id = crypto?.randomUUID?.() ?? String(Date.now());
    const newItem: ResumeItem = {
      id,
      title: data.title,
      url: data.url,
      size: data.size,
      uploadedAt: new Date().toISOString(),
      pages: data.pages,
    };
    setResumes((prev) => [newItem, ...prev]);
    setActiveUrl(data.url);
  };

  const replaceResume = (
    id: string,
    data: { title: string; url: string; size?: number; pages?: number },
  ) => {
    setResumes((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, ...data, uploadedAt: new Date().toISOString() } : r,
      ),
    );
    setActiveUrl(data.url);
  };

  const removeResume = (id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
    if (activeResume?.id === id) setActiveUrl("");
  };

  return (
    <div className="w-full space-y-6">
      <section className="rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-slate-300" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300">
            All Resumes
          </h3>
        </div>

        <div className="space-y-3 flex gap-5 flex-wrap">
          <div className="w-80 h-full">
            <CldUploadWidget
              uploadPreset={
                process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
              }
              options={{
                resourceType: "image",
                clientAllowedFormats: ["pdf"],
              }}
              onSuccess={(result: any) => {
                const info = result?.info;
                if (!info?.secure_url) return;
                addResume({
                  title:
                    info.original_filename ||
                    `Resume ${new Date().toLocaleDateString()}`,
                  url: info.secure_url,
                  size: info.bytes,
                  pages: info.pages || 1,
                });
              }}
              onClose={() => {
                document.body.style.overflow = "";
                document.body.style.paddingRight = "";
              }}
            >
              {({ open }) => (
                <button
                  onClick={() => open()}
                  className="w-full text-left min-h-110 h-full bg-slate-900/80 border border-slate-800 rounded-xl hover:bg-slate-900/80 transition"
                >
                  <div className="flex flex-col gap-5 items-center h-full">
                    <div className="p-2 rounded-lg  h-full bg-purple-500/10 text-purple-300">
                      <Plus className="w-10 h-10" />
                    </div>
                    <div className="flex flex-col  h-full items-center justify-center">
                      <div className="text-sm  h-full text-white font-medium">
                        Add New Resume
                      </div>
                      <div className="text-xs h-full text-slate-500">
                        Upload a new PDF
                      </div>
                    </div>
                  </div>
                </button>
              )}
            </CldUploadWidget>
          </div>

          {resumes.length === 0 ? (
            <div className="text-sm text-slate-500">No resumes added yet.</div>
          ) : (
            resumes.map((resume) => {
              const isActive = resume.url === activeUrl;
              return (
                <div
                  key={resume.id}
                  className="bg-slate-900/60 border w-100 border-slate-800 rounded-xl p-4 max-h-110"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium truncate">
                      {resume.title}
                    </span>
                    {isActive && (
                      <span className="text-[10px] uppercase tracking-widest text-emerald-400">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatDate(resume.uploadedAt)}
                    {resume.size ? `  ${formatBytes(resume.size)}` : ""}
                  </div>
                  <button
                    onClick={() => setFullscreenUrl(resume.url)}
                    className="mt-4 w-full border border-slate-800 rounded-lg overflow-hidden bg-slate-950/40 text-left hover:border-slate-700 transition"
                    title="Open fullscreen preview"
                  >
                    {getPreviewImageUrl(resume.url) ? (
                      <img
                        src={getPreviewImageUrl(resume.url)}
                        alt={`${resume.title} preview`}
                        className="w-full h-72 object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <iframe
                        src={getPreviewUrl(resume.url)}
                        title={`${resume.title} preview`}
                        className="w-full h-72 pointer-events-none"
                        loading="lazy"
                      />
                    )}
                  </button>

                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setActiveUrl(resume.url)}
                      className={`px-3 py-2 text-[10px] uppercase tracking-widest rounded-lg ${isActive
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60"
                        }`}
                    >
                      {isActive ? "Active" : "Set Active"}
                    </button>

                    <button
                      onClick={() => removeResume(resume.id)}
                      className="px-3 py-2 text-[10px] uppercase tracking-widest rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                    >
                      Delete
                    </button>

                    <CldUploadWidget
                      uploadPreset={
                        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
                      }
                      options={{
                        resourceType: "image", // ← also "image" for replace
                        clientAllowedFormats: ["pdf"],
                      }}
                      onSuccess={(result: any) => {
                        const info = result?.info;
                        if (!info?.secure_url) return;
                        replaceResume(resume.id, {
                          title:
                            info.original_filename ||
                            `Resume ${new Date().toLocaleDateString()}`,
                          url: info.secure_url,
                          size: info.bytes,
                          pages: info.pages || 1,
                        });
                      }}
                      onClose={() => {
                        document.body.style.overflow = "";
                        document.body.style.paddingRight = "";
                      }}
                    >
                      {({ open }) => (
                        <button
                          onClick={() => open()}
                          className="px-3 py-2 text-[10px] uppercase tracking-widest rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60"
                        >
                          Replace
                        </button>
                      )}
                    </CldUploadWidget>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {fullscreenUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setFullscreenUrl(null)
          }
        >

          <div className="w-full h-full max-w-[100vw] max-h-[100vh] bg-slate-900/95 flex flex-col relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl z-30">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide truncate max-w-sm md:max-w-xl">
                    {resumes.find((r) => r.url === fullscreenUrl)?.title || "Resume Preview"}
                  </h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                    PDF Preview Mode
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={fullscreenUrl}
                  target="_blank"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <LinkIcon className="w-4 h-4" />
                  View Original
                </Link>
                <button
                  onClick={() => setFullscreenUrl(null)}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all hover:rotate-90 active:scale-95"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <PdfViewer
                file={fullscreenUrl}
                numPages={resumes.find(r => r.url === fullscreenUrl)?.pages || 1}
              />
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white bg-slate-900/90 backdrop-blur-md px-8 py-4 rounded-2xl text-[10px] uppercase tracking-widest border border-slate-700/50 shadow-2xl z-20 pointer-events-none">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                Scroll for all pages
              </span>
              <span className="w-px h-4 bg-slate-700"></span>
              <span className="flex items-center gap-2">
                <span className="text-purple-400">Pinch or wheel</span>
                to zoom
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const formatBytes = (bytes: number) => {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const getPreviewUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return "";
  return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(trimmed)}`;
};

const getPreviewImageUrl = (url: string): string => {
  if (!url || !url.includes("res.cloudinary.com")) return "";

  const parts = url.split("/upload/");
  if (parts.length < 2) return "";

  const base = parts[0] + "/upload/";
  const publicId = parts[1].split("?")[0];

  return `${base}pg_1,f_auto,q_auto,w_1200,c_limit/${publicId}`;
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString();
};
