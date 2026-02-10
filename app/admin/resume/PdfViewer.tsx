"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FileText } from "lucide-react";

// Important: Set worker source (use CDN or copy to /public for production)
// Use the modern worker setup for Next.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// Optional: better text/annotations rendering (add to your global CSS or import here)
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

type PdfViewerProps = {
  file: string;
  numPages: number;
};

export default function PdfViewer({ file, numPages }: PdfViewerProps) {
  const [pages, setPages] = useState<number>(numPages || 1);
  const [viewMode, setViewMode] = useState<"primary" | "native" | "google" | "images">("primary");
  const [isEscalating, setIsEscalating] = useState(false);

  useEffect(() => {
    if (numPages) setPages(numPages);
  }, [numPages]);

  const isCloudinary = file.includes("res.cloudinary.com");

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setPages(numPages);
    setViewMode("primary");
    setIsEscalating(false);
  }

  const handleEscalation = (err: any) => {
    console.error("PDF load failed in mode:", viewMode, err);
    if (viewMode === "primary") {
      setIsEscalating(true);
      setTimeout(() => {
        // If Cloudinary, images are more reliable than native iframe
        setViewMode(isCloudinary ? "images" : "native");
        setIsEscalating(false);
      }, 1500);
    } else if (viewMode === "images") {
      setViewMode("native");
    } else if (viewMode === "native") {
      setViewMode("google");
    }
  };

  const getCloudinaryPageUrl = (pageIndex: number) => {
    if (!isCloudinary) return "";
    const parts = file.split("/upload/");
    if (parts.length < 2) return file;
    const base = parts[0] + "/upload/";
    const publicIdWithExt = parts[1].split("?")[0];
    const publicId = publicIdWithExt.replace(".pdf", "");
    // Use high quality jpg transformation for the page
    return `${base}pg_${pageIndex + 1},f_auto,q_auto,w_1600,c_limit/${publicId}.jpg`;
  };

  const googleUrl = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(file)}`;

  if (isEscalating) {
    return (
      <div className="h-full w-full bg-slate-950 flex items-center justify-center text-slate-300">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-center space-y-2">
            <p className="text-sm font-bold uppercase tracking-widest">Optimizing View...</p>
            <p className="text-xs text-slate-500">Switching to compatibility mode for better loading</p>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "images" && isCloudinary) {
    return (
      <div className="h-full w-full overflow-auto bg-slate-900/80 p-4 space-y-8 scrollbar-thin scrollbar-thumb-slate-700">
        <div className="sticky top-0 z-10 mx-auto max-w-fit bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full backdrop-blur-md">
          <p className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold">
            Ultra-Compatibility Mode (Page Stream)
          </p>
        </div>
        {Array.from(new Array(pages), (el, index) => (
          <div key={`page_img_${index}`} className="relative mx-auto max-w-4xl shadow-2xl rounded-lg overflow-hidden border border-slate-800 bg-white">
            <img
              src={getCloudinaryPageUrl(index)}
              alt={`Page ${index + 1}`}
              className="w-full h-auto"
              loading="lazy"
            />
            <div className="absolute top-4 right-4 bg-black/40 px-2 py-1 rounded text-[10px] text-white backdrop-blur-sm">
              Page {index + 1}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (viewMode === "native") {
    return (
      <div className="h-full w-full bg-slate-900 flex flex-col">
        <div className="w-full bg-blue-500/10 border-b border-blue-500/20 px-6 py-2 flex items-center justify-between">
          <p className="text-[10px] text-blue-300 uppercase tracking-widest font-bold">
            Browser Native Mode
          </p>
          <button
            onClick={() => setViewMode("google")}
            className="text-[10px] text-slate-400 hover:text-white underline underline-offset-4"
          >
            Try Global Legacy Mode
          </button>
        </div>
        <iframe
          src={`${file}#toolbar=0&navpanes=0&scrollbar=1`}
          className="w-full h-full border-none bg-white"
          title="Native PDF Preview"
        />
      </div>
    );
  }

  if (viewMode === "google") {
    return (
      <div className="h-full w-full bg-slate-900 flex flex-col">
        <div className="w-full bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex items-center justify-between">
          <p className="text-[10px] text-amber-300 uppercase tracking-widest font-bold">
            Global Compatibility Mode
          </p>
          <button
            onClick={() => setViewMode("primary")}
            className="text-[10px] text-slate-400 hover:text-white underline underline-offset-4"
          >
            Reset to Primary
          </button>
        </div>
        <iframe
          src={googleUrl}
          className="w-full h-full border-none bg-white"
          title="Google Docs Preview"
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-auto bg-slate-900/50 scrollbar-thin scrollbar-thumb-slate-700">
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={handleEscalation}
        options={{
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
          cMapPacked: true,
          standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
        }}
        loading={
          <div className="flex h-[80vh] items-center justify-center text-slate-300">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-500/20 rounded-full"></div>
                <div className="absolute top-0 w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-lg font-bold tracking-widest text-white uppercase">Loading PDF</p>
                <p className="text-xs text-slate-500 animate-pulse">Establishing secure connection...</p>
              </div>
            </div>
          </div>
        }
        noData={
          <div className="flex h-[80vh] items-center justify-center text-slate-400">
            <div className="flex flex-col items-center gap-4">
              <FileText className="w-12 h-12 text-slate-700" />
              <p className="text-sm font-medium tracking-wide">No PDF document found</p>
            </div>
          </div>
        }
        className="flex flex-col items-center py-8"
      >
        {Array.from(new Array(pages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={Math.min(
              1200,
              (typeof window !== "undefined" ? window.innerWidth : 1200) * 0.9,
            )}
            className="mb-8 shadow-2xl rounded-lg overflow-hidden mx-auto bg-white"
            renderAnnotationLayer={false}
            renderTextLayer={true}
          />
        ))}
      </Document>
    </div>
  );
}
