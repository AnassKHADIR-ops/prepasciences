"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { X, Download, ExternalLink, Loader2, AlertCircle, FileText } from "lucide-react";
import { getEmbedUrl, getDownloadUrl } from "@/lib/driveUtils";

export interface PdfDocOption {
  label: string;
  url: string;
}

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string | null;
  title: string;
  docs?: PdfDocOption[];
  initialIndex?: number;
}

export function PdfViewerModal({
  isOpen,
  onClose,
  url,
  title,
  docs,
  initialIndex = 0,
}: PdfViewerModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);

  const normalizedDocs: PdfDocOption[] =
    docs && docs.length > 0
      ? docs.filter((d) => Boolean(d.url && d.url.trim()))
      : url
      ? [{ label: title || "Document PDF", url }]
      : [];

  const clampedInitial =
    initialIndex >= 0 && initialIndex < normalizedDocs.length ? initialIndex : 0;
  const docSessionKey = `${isOpen ? "1" : "0"}|${url ?? ""}|${clampedInitial}|${normalizedDocs.length}`;
  const [selection, setSelection] = useState<{ key: string; index: number }>({
    key: docSessionKey,
    index: clampedInitial,
  });

  const activeIndex =
    selection.key === docSessionKey ? selection.index : clampedInitial;
  const safeIndex =
    activeIndex >= 0 && activeIndex < normalizedDocs.length ? activeIndex : 0;
  const activeDoc = normalizedDocs[safeIndex] ?? (url ? { label: title, url } : null);
  const activeUrl = activeDoc?.url || url || "";

  // Ouverture / fermeture via l'API native <dialog>.showModal() (top-layer, Esc, inert auto)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && activeUrl) {
      if (!dialog.open) {
        try {
          dialog.showModal();
        } catch {
          // Déjà ouvert en modal
        }
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen, activeUrl]);

  // Écoute de l'événement natif `close` + fallback Safari pour `closedby="any"`
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose();
    };
    dialog.addEventListener("close", handleClose);

    // Fallback light-dismiss uniquement si `closedBy` n'est pas nativement supporté (Safari)
    let cleanupFallback: (() => void) | undefined;
    if (
      typeof HTMLDialogElement !== "undefined" &&
      !("closedBy" in HTMLDialogElement.prototype)
    ) {
      let pressedOutside = false;
      const isOutside = (e: PointerEvent) => {
        const r = dialog.getBoundingClientRect();
        return (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        );
      };
      const onPointerDown = (e: PointerEvent) => {
        pressedOutside = isOutside(e);
      };
      const onPointerUp = (e: PointerEvent) => {
        if (pressedOutside && isOutside(e)) {
          dialog.close();
        }
        pressedOutside = false;
      };
      dialog.addEventListener("pointerdown", onPointerDown);
      dialog.addEventListener("pointerup", onPointerUp);
      cleanupFallback = () => {
        dialog.removeEventListener("pointerdown", onPointerDown);
        dialog.removeEventListener("pointerup", onPointerUp);
      };
    }

    return () => {
      dialog.removeEventListener("close", handleClose);
      cleanupFallback?.();
    };
  }, [onClose]);

  const embedUrl = activeUrl ? getEmbedUrl(activeUrl) : "";
  const downloadUrl = activeUrl ? getDownloadUrl(activeUrl) : "";
  const displayTitle =
    normalizedDocs.length > 1 && activeDoc?.label
      ? `${title || "Document CPGE"} — ${activeDoc.label}`
      : title || "Document CPGE";
  const isCorrige = displayTitle.toLowerCase().includes("corrigé") || displayTitle.toLowerCase().includes("correction");
  const isLoading = Boolean(embedUrl && loadedUrl !== embedUrl);

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: "any" } as Record<string, string>)}
      aria-labelledby={titleId}
      className="ps-pdf-dialog"
    >
      {isOpen && activeUrl ? (
        <>
          {/* Header minimaliste académique */}
          <header className="px-4 sm:px-6 py-3.5 bg-[#080d1a] border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white shrink-0 ${
                  isCorrige
                    ? "bg-emerald-700"
                    : "bg-[#5B21B6]"
                }`}
              >
                {isCorrige ? "Corrigé" : "Document"}
              </span>

              <div className="min-w-0">
                <h1
                  id={titleId}
                  className="font-display text-sm sm:text-base font-bold text-white truncate"
                >
                  {displayTitle}
                </h1>
                <p className="text-[11px] text-slate-400 hidden sm:block truncate">
                  Physique-Chimie CPGE · Pr. Hassan EDDAMS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs font-semibold text-white bg-[#5B21B6] hover:bg-[#4C1D95] rounded-full transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Télécharger</span>
                </a>
              )}

              <a
                href={activeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-full transition-colors"
                title="Ouvrir dans Google Drive"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Drive</span>
              </a>

              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Fermer le lecteur PDF"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Sélecteur multi-documents (quand une séance ou un TD contient plusieurs PDFs) */}
          {normalizedDocs.length > 1 && (
            <div
              role="tablist"
              aria-label="Documents disponibles"
              className="ps-h-scroll px-4 sm:px-6 py-2 bg-[#0d1424] border-b border-slate-800/90 items-center gap-1.5 shrink-0"
            >
              {normalizedDocs.map((doc, idx) => {
                const isSelected = idx === safeIndex;
                return (
                  <button
                    key={`${doc.url}-${idx}`}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelection({ key: docSessionKey, index: idx })}
                    className={`flex-none inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-white text-[#0F172A] border-white shadow-xs"
                        : "bg-slate-900/80 text-slate-300 border-slate-700/80 hover:border-slate-500 hover:text-white"
                    }`}
                  >
                    <FileText className="w-3 h-3 shrink-0" />
                    <span className="max-w-[200px] truncate">{doc.label || `Document ${idx + 1}`}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Corps iframe avec indicateur de chargement & bandeau d'assistance */}
          <div className="flex-1 bg-[#111827] relative overflow-hidden flex flex-col min-h-0">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#111827] text-slate-300 z-10 pointer-events-none">
                <Loader2 className="w-7 h-7 animate-spin text-purple-400" />
                <span className="text-xs font-medium text-slate-400">
                  Chargement sécurisé du document PDF...
                </span>
              </div>
            )}
            <iframe
              key={embedUrl}
              src={embedUrl}
              className="w-full flex-1 border-0 bg-[#111827]"
              title={displayTitle}
              allow="autoplay"
              onLoad={() => setLoadedUrl(embedUrl)}
            />

            {/* Bandeau d'aide discret */}
            <div className="bg-[#080d1a] border-t border-slate-800 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <AlertCircle className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                <span className="hidden sm:inline truncate">
                  Si Google Drive restreint la prévisualisation intégrée, ouvrez le document directement :
                </span>
                <span className="sm:hidden">Un souci d&apos;affichage ?</span>
              </div>
              <a
                href={activeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-purple-300 hover:text-purple-200 underline inline-flex items-center gap-1 shrink-0 ml-2"
              >
                <span>Ouvrir sur Drive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </>
      ) : null}
    </dialog>
  );
}
