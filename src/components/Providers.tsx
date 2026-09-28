"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CoursesProvider } from "@/context/CoursesContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CoursesProvider>{children}</CoursesProvider>
    </AuthProvider>
  );
}
