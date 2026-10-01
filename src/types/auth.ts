export type UserRole = "student" | "teacher" | "admin";

export type StudentStatus = "pending" | "active" | "suspended";

export type StudentOffer = "pc" | "maths" | "integral";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  password?: string;
  phone: string;
  role: UserRole;
  filiere: "MP" | "MP*" | "TSI" | "Autre";
  center: string; // Lycée / Centre CPGE
  offer: StudentOffer; // Offre souscrite
  status: StudentStatus;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  notes?: string;
}

export interface AuthState {
  currentUser: UserProfile | null;
  teacherViewMode: "teacher" | "preview-student"; // Permet aux professeurs de prévisualiser comme un étudiant
}
