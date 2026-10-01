"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { UserProfile, StudentStatus, StudentOffer } from "@/types/auth";
import {
  getCurrentSession,
  setCurrentSession,
  getUsersDB,
  loginUser,
  registerUser,
  registerStudent,
  updateStudentStatus,
  deleteStudent,
  getTeacherViewMode,
  setTeacherViewMode as persistTeacherViewMode,
  syncProfilesFromSupabase,
} from "@/lib/authStore";

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isTeacher: boolean;
  teacherViewMode: "teacher" | "preview-student";
  students: UserProfile[];
  login: (id: string, pass?: string) => { success: boolean; user?: UserProfile; error?: string };
  register: (data: {
    fullName: string;
    email: string;
    password?: string;
    phone?: string;
    filiere?: "MP" | "MP*" | "TSI" | "Autre";
    center?: string;
    offer?: StudentOffer;
    notes?: string;
  }) => { success: boolean; user?: UserProfile; error?: string };
  registerUser: (data: {
    fullName: string;
    email: string;
    password: string;
  }) => { success: boolean; user?: UserProfile; error?: string };
  logout: () => void;
  toggleTeacherViewMode: () => void;
  updateStatus: (studentId: string, status: StudentStatus) => void;
  deleteStudentById: (studentId: string) => void;
  refreshUsers: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentSession());
  const [teacherViewMode, setTeacherViewModeState] = useState<"teacher" | "preview-student">(() => getTeacherViewMode());
  const [students, setStudents] = useState<UserProfile[]>(() => {
    const all = getUsersDB();
    return all.filter((u) => u.role === "student");
  });

  const refreshUsers = useCallback(() => {
    const all = getUsersDB();
    setStudents(all.filter((u) => u.role === "student"));
  }, []);

  useEffect(() => {
    syncProfilesFromSupabase().then((all) => {
      if (all && all.length > 0) {
        setStudents(all.filter((u) => u.role === "student"));
      }
    });
  }, []);

  const login = (id: string, pass = "") => {
    const res = loginUser(id, pass);
    if (res.success && res.user) {
      setCurrentUser(res.user);
    }
    refreshUsers();
    return res;
  };

  const registerUserAction = (data: {
    fullName: string;
    email: string;
    password: string;
  }) => {
    const res = registerUser(data);
    if (res.success && res.user) {
      setCurrentUser(res.user);
    }
    refreshUsers();
    return res;
  };

  const register = (data: {
    fullName: string;
    email: string;
    password?: string;
    phone?: string;
    filiere?: "MP" | "MP*" | "TSI" | "Autre";
    center?: string;
    offer?: StudentOffer;
    notes?: string;
  }) => {
    // If called with only 3 required fields and password
    if (data.password && (!data.phone || data.phone === "") && (!data.center || data.center === "")) {
      return registerUserAction({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
    }

    const res = registerStudent({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || "",
      password: data.password,
      filiere: data.filiere || "MP*",
      center: data.center || "Centre CPGE",
      offer: data.offer || "pc",
      notes: data.notes,
    });
    refreshUsers();
    return res;
  };

  const logout = () => {
    setCurrentSession(null);
    setCurrentUser(null);
  };

  const toggleTeacherViewMode = () => {
    const next = teacherViewMode === "teacher" ? "preview-student" : "teacher";
    setTeacherViewModeState(next);
    persistTeacherViewMode(next);
  };

  const updateStatus = (studentId: string, status: StudentStatus) => {
    const approver = currentUser ? currentUser.fullName : "Professeur CPGE";
    updateStudentStatus(studentId, status, approver);
    refreshUsers();
  };

  const deleteStudentById = (studentId: string) => {
    deleteStudent(studentId);
    refreshUsers();
  };

  const isTeacher =
    currentUser?.role === "teacher" || currentUser?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        isTeacher,
        teacherViewMode,
        students,
        login,
        register,
        registerUser: registerUserAction,
        logout,
        toggleTeacherViewMode,
        updateStatus,
        deleteStudentById,
        refreshUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
