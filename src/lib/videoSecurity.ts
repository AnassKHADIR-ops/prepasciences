"use client";

import { useEffect, useState } from "react";

// Clé de chiffrement interne pour masquer les identifiants vidéo dans le DOM
const TOKEN_SALT = "PREPASCIENCES_SECURE_V2026_TOKEN";

/**
 * Chiffre / Masque l'identifiant ou l'URL de la vidéo afin qu'aucun lien YouTube
 * n'apparaisse en clair dans le code source HTML ou les attributs du DOM.
 */
export function obfuscateVideoToken(rawUrl: string): string {
  if (!rawUrl) return "";
  try {
    const chars = Array.from(rawUrl);
    const saltChars = Array.from(TOKEN_SALT);
    const encoded = chars
      .map((c, i) => {
        const code = c.charCodeAt(0) ^ saltChars[i % saltChars.length].charCodeAt(0);
        return code.toString(16).padStart(2, "0");
      })
      .join("");
    return `ps_tok_${encoded}`;
  } catch {
    return btoa(rawUrl);
  }
}

/**
 * Déchiffre le jeton sécurisé en mémoire uniquement au micro-moment de la lecture
 */
export function deobfuscateVideoToken(token: string): string {
  if (!token) return "";
  try {
    if (!token.startsWith("ps_tok_")) {
      return token; // Déjà en clair (pour rétrocompatibilité)
    }
    const hex = token.replace("ps_tok_", "");
    const saltChars = Array.from(TOKEN_SALT);
    const chunks = hex.match(/.{1,2}/g) || [];
    const decoded = chunks
      .map((byte, i) => {
        const code = parseInt(byte, 16) ^ saltChars[i % saltChars.length].charCodeAt(0);
        return String.fromCharCode(code);
      })
      .join("");
    return decoded;
  } catch {
    return token;
  }
}

/**
 * Hook de détection et neutralisation des Outils de Développement (F12, Inspect Element)
 * Si l'étudiant tente d'inspecter, la vidéo est instantanément masquée et interrompue.
 */
export function useAntiInspection(isActive: boolean) {
  const [isDevToolsDetected, setIsDevToolsDetected] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    // 1. Bloquer le clic droit (Menu contextuel -> "Inspecter l'élément")
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // 2. Bloquer les raccourcis claviers DevTools (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        setIsDevToolsDetected(true);
        return false;
      }

      // Ctrl + Shift + I (Inspect) / J (Console) / C (Inspect Element)
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")
      ) {
        e.preventDefault();
        e.stopPropagation();
        setIsDevToolsDetected(true);
        return false;
      }

      // Ctrl + U (Afficher le code source)
      if ((e.ctrlKey || e.metaKey) && (e.key === "U" || e.key === "u")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl + S (Enregistrer la page)
      if ((e.ctrlKey || e.metaKey) && (e.key === "S" || e.key === "s")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // 3. Détecteur dynamique de fenêtre DevTools (Vérifie si les dimensions internes/externes diffèrent)
    const checkDevTools = () => {
      if (typeof window === "undefined") return;

      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;

      if (widthDiff || heightDiff) {
        setIsDevToolsDetected(true);
      } else {
        // Si fermé, on réactive doucement
        setIsDevToolsDetected(false);
      }
    };

    window.addEventListener("contextmenu", handleContextMenu, { capture: true });
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    const interval = setInterval(checkDevTools, 500);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu, { capture: true });
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      clearInterval(interval);
    };
  }, [isActive]);

  return { isDevToolsDetected, dismissWarning: () => setIsDevToolsDetected(false) };
}
