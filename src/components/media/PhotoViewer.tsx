"use client";

import { Contrast, Eye, EyeOff, Maximize2, Volume2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import type { Photo } from "@/lib/cases/types";

/** Настоящий снимок или ЭКГ. Разметку находок студент открывает сам, когда посмотрит снимок. */
export function PhotoViewer({ photo }: { photo: Photo }) {
  const t = useT();
  const [showAnnotated, setShowAnnotated] = useState(false);
  const [inverted, setInverted] = useState(false);
  const picture = showAnnotated && photo.annotated ? photo.annotated : photo.image;

  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <figcaption className="font-heading text-sm font-bold text-ink">{photo.caption}</figcaption>
        <div className="flex items-center gap-1">
          {photo.annotated && (
            <button
              type="button"
              onClick={() => setShowAnnotated((v) => !v)}
              aria-pressed={showAnnotated}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-sky-dark hover:bg-sky-light"
            >
              {showAnnotated ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showAnnotated ? t.photo.hideMarks : t.photo.showMarks}
            </button>
          )}
          {photo.kind !== "ecg" && (
            <button
              type="button"
              onClick={() => setInverted((v) => !v)}
              aria-pressed={inverted}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                inverted ? "bg-gold text-ink" : "text-slate-600 hover:bg-slate-100 hover:text-ink"
              }`}
            >
              <Contrast className="h-4 w-4" /> {t.photo.invert}
            </button>
          )}
          <a
            href={picture.src}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-ink"
          >
            <Maximize2 className="h-4 w-4" /> {t.photo.open}
          </a>
        </div>
      </div>
      <a href={picture.src} target="_blank" rel="noopener" className={`block ${inverted ? "bg-white" : "bg-black"}`}>
        <Image
          key={picture.src}
          src={picture.src}
          alt={showAnnotated ? t.photo.annotatedAlt(photo.alt) : photo.alt}
          width={picture.width}
          height={picture.height}
          sizes="(min-width: 1024px) 560px, 100vw"
          className={`h-auto max-h-[70vh] w-full object-contain ${inverted ? "invert" : ""}`}
        />
      </a>
      {photo.audio && (
        <div className="flex items-center gap-3 border-t border-slate-100 px-4 py-3">
          <Volume2 className="h-4 w-4 shrink-0 text-sky-dark" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="mb-1.5 text-xs font-semibold text-slate-500">{t.photo.auscultation}</p>
            <audio controls preload="none" src={photo.audio} className="h-9 w-full">
              {t.photo.audioUnsupported}
            </audio>
          </div>
        </div>
      )}
    </figure>
  );
}
