import { Metadata } from "next";
import { AuthSplitScreen } from "@/components/auth/AuthSplitScreen";

export const metadata: Metadata = {
  title: "Inscription · Portail E-learning Physics Pr. Eddams | Prépasciences CPGE",
  description:
    "Inscription rapide et simplifiée en 3 champs au portail de Physique-Chimie CPGE du Pr. Hassan Eddams.",
};

export default function InscriptionPage() {
  return <AuthSplitScreen initialMode="register" />;
}
