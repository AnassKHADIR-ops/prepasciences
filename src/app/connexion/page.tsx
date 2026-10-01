import { Metadata } from "next";
import { AuthSplitScreen } from "@/components/auth/AuthSplitScreen";

export const metadata: Metadata = {
  title: "Connexion · Portail E-learning Physics Pr. Eddams | Prépasciences CPGE",
  description:
    "Espace de connexion unifié aux cours, annales corrigées en HD et fiches de synthèse de Physique-Chimie CPGE.",
};

export default function ConnexionPage() {
  return <AuthSplitScreen initialMode="login" />;
}
