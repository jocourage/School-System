import { supabase, isSupabaseConfigured } from "./supabase";
import {
  STUDENTS,
  STAFF,
  FEES,
  BOOKS,
  GRADES,
  CLASSES,
  ATTENDANCE,
  ANNOUNCEMENTS,
  TIMETABLE,
} from "../data/constants";

export const fallbackData = {
  students: STUDENTS,
  staff: STAFF,
  fees: FEES,
  books: BOOKS,
  grades: GRADES,
  classes: CLASSES,
  attendance: ATTENDANCE,
  announcements: ANNOUNCEMENTS,
  timetable: TIMETABLE,
};

function mapStudentRow(row) {
  return {
    id: row.id ?? row.student_code ?? "unknown",
    name: row.full_name || row.name || "Unnamed student",
    gender: row.gender || "Male",
    cls: row.class_name || row.cls || "Grade 1",
    status: row.status || "Active",
    dob: row.dob || "",
    email: row.email || "",
    phone: row.phone || row.guardian_phone || "",
    guardian: row.guardian_name || "",
    gPhone: row.guardian_phone || "",
    ...row,
  };
}

function mapStaffRow(row) {
  return {
    id: row.id ?? row.staff_code ?? "unknown",
    name: row.full_name || row.name || "Unnamed staff",
    role: row.role_title || row.role || "Teacher",
    dept: row.department || "General",
    status: row.status || "Active",
    phone: row.phone || "",
    email: row.email || "",
    salary: Number(row.salary || 0),
    cls: row.class_name || row.cls || "Grade 1",
    ...row,
  };
}

function mapFeeRow(row) {
  return {
    id: row.id ?? "fee-unknown",
    studentId: row.student_id ?? row.studentId ?? "",
    studentName: row.student_name || row.studentName || "Unknown student",
    amount: Number(row.amount || 0),
    paid: Number(row.paid_amount ?? row.paid ?? 0),
    date: row.date || row.due_date || null,
    status: row.status || "Unpaid",
    term: row.term || "Term 1",
    type: row.fee_type || row.type || "Tuition",
    ...row,
  };
}

function mapBookRow(row) {
  return {
    id: row.id ?? row.isbn ?? "book-unknown",
    title: row.title || "Untitled",
    author: row.author || "Unknown author",
    copies: Number(row.copies || 0),
    available: Number(row.available_copies ?? row.available ?? 0),
    isbn: row.isbn || "",
    ...row,
  };
}

function mapClassRow(row) {
  return {
    id: row.id ?? `class-${row.name || "unknown"}`,
    name: row.name || "Unnamed class",
    teacher: row.teacher_name || row.teacher || "",
    students: Number(row.student_count || row.students || 0),
    room: row.room || "",
    ...row,
  };
}

function mapGradeRow(row) {
  return {
    id: row.id ?? `${row.student_id}-${row.subject_id}-${row.term_id}`,
    studentId: row.student_id ?? row.studentId ?? "",
    subject: row.subject_name || row.subject || "Unknown",
    score: Number(row.score || 0),
    grade: row.grade || "",
    term: row.term || "Term 1",
    ...row,
  };
}

export async function loadSchoolData() {
  if (!isSupabaseConfigured) {
    return fallbackData;
  }

  const [studentsRes, staffRes, feesRes, booksRes, classesRes, gradesRes, attendanceRes, announcementsRes] = await Promise.allSettled([
    supabase.from("students").select("*, classes(name as class_name), profiles(name, email)"),
    supabase.from("staff").select("*, classes(name as class_name), profiles(name, email)"),
    supabase.from("fees").select("*"),
    supabase.from("library_books").select("*"),
    supabase.from("classes").select("*"),
    supabase.from("grades").select("*, subjects(name as subject_name), terms(name as term)"),
    supabase.from("attendance").select("*"),
    supabase.from("announcements").select("*"),
  ]);

  const students = studentsRes.status === "fulfilled" ? (studentsRes.value.data || []).map(mapStudentRow) : STUDENTS;
  const staff = staffRes.status === "fulfilled" ? (staffRes.value.data || []).map(mapStaffRow) : STAFF;
  const fees = feesRes.status === "fulfilled" ? (feesRes.value.data || []).map(mapFeeRow) : FEES;
  const books = booksRes.status === "fulfilled" ? (booksRes.value.data || []).map(mapBookRow) : BOOKS;
  const classes = classesRes.status === "fulfilled" ? (classesRes.value.data || []).map(mapClassRow) : CLASSES;
  const grades = gradesRes.status === "fulfilled" ? (gradesRes.value.data || []).map(mapGradeRow) : GRADES;
  const attendance = attendanceRes.status === "fulfilled" ? (attendanceRes.value.data || []) : ATTENDANCE;
  const announcements = announcementsRes.status === "fulfilled" ? (announcementsRes.value.data || []) : ANNOUNCEMENTS;

  return {
    students,
    staff,
    fees,
    books,
    classes,
    grades,
    attendance,
    announcements,
    timetable: TIMETABLE,
  };
}
