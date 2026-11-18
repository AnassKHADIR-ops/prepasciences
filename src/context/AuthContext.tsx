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
  requestPasswordReset,
  resetPasswordWithCode,
  adminSetStudentPassword,
  quickApproveOrAddStudent,
} from "@/lib/authStore";

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
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
    resourceRequested?: string;
  }) => { success: boolean; user?: UserProfile; error?: string };
  registerUser: (data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    offer?: StudentOffer;
    filiere?: "MP" | "MP*" | "TSI" | "Autre";
    center?: string;
    resourceRequested?: string;
  }) => { success: boolean; user?: UserProfile; error?: string };
  logout: () => void;
  toggleTeacherViewMode: () => void;
  updateStatus: (studentId: string, status: StudentStatus) => void;
  deleteStudentById: (studentId: string) => void;
  refreshUsers: () => void;
  refreshUsersFromCloud: () => Promise<UserProfile[]>;
  requestPasswordResetCode: (email: string) => Promise<{
    success: boolean;
    code?: string;
    student?: UserProfile;
    error?: string;
  }>;
  confirmPasswordReset: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  adminResetPassword: (
    studentId: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  quickApprove: (data: {
    email: string;
    fullName?: string;
    phone?: string;
    offer?: StudentOffer;
  }) => Promise<{ success: boolean; user?: UserProfile; message: string }>;
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

  const refreshUsersFromCloud = useCallback(async () => {
    const all = await syncProfilesFromSupabase();
    const studentsOnly = all.filter((u) => u.role === "student");
    setStudents(studentsOnly);
    return all;
  }, []);

  useEffect(() => {
    refreshUsersFromCloud();
  }, [refreshUsersFromCloud]);

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
    phone?: string;
    offer?: StudentOffer;
    filiere?: "MP" | "MP*" | "TSI" | "Autre";
    center?: string;
    resourceRequested?: string;
  }) => {
    const res = registerUser(data);
    if (res.success && res.user) {
      if (res.user.status === "active") {
        setCurrentUser(res.user);
      }
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
    resourceRequested?: string;
  }) => {
    // If called with minimal fields
    if (data.password && (!data.center || data.center === "")) {
      return registerUserAction({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        offer: data.offer,
        filiere: data.filiere,
        center: data.center,
        resourceRequested: data.resourceRequested,
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
      resourceRequested: data.resourceRequested,
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

  const requestPasswordResetCode = async (email: string) => {
    const res = await requestPasswordReset(email);
    refreshUsers();
    return res;
  };

  const confirmPasswordReset = async (email: string, code: string, newPass: string) => {
    const res = await resetPasswordWithCode(email, code, newPass);
    refreshUsers();
    return res;
  };

  const adminResetPassword = async (studentId: string, newPass: string) => {
    const res = await adminSetStudentPassword(studentId, newPass);
    refreshUsers();
    return res;
  };

  const quickApprove = async (data: {
    email: string;
    fullName?: string;
    phone?: string;
    offer?: StudentOffer;
  }) => {
    const approver = currentUser ? currentUser.fullName : "Professeur CPGE";
    const res = await quickApproveOrAddStudent({ ...data, approvedBy: approver });
    refreshUsers();
    return res;
  };

  const isAdmin = currentUser?.role === "admin";
  const isTeacher =
    currentUser?.role === "teacher" || currentUser?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        isAdmin,
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
        refreshUsersFromCloud,
        requestPasswordResetCode,
        confirmPasswordReset,
        adminResetPassword,
        quickApprove,
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
