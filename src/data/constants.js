export const T = {
  bg: "#F4F6F9",
  surface: "#FFFFFF",
  sidebar: "#1B2A4A",
  sidebarHover: "#243455",
  sidebarActive: "#2E4272",
  accent: "#3B6FE8",
  accentLight: "#EBF0FD",
  border: "#E4E8EF",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  success: "#16A34A",
  successBg: "#DCFCE7",
  warning: "#D97706",
  warningBg: "#FEF3C7",
  danger: "#DC2626",
  dangerBg: "#FEE2E2",
  radius: "8px",
  radiusLg: "12px",
};

export const STUDENTS = [
  { id:"S001", name:"Ama Owusu",     gender:"Female", cls:"Grade 1", status:"Active",    dob:"2018-03-12", email:"ama@school.gh",    phone:"0244100001", guardian:"Kofi Owusu",    gPhone:"0244200001" },
  { id:"S002", name:"Kweku Mensah",  gender:"Male",   cls:"Grade 2", status:"Active",    dob:"2017-07-22", email:"kweku@school.gh",  phone:"0244100002", guardian:"Akosua Mensah", gPhone:"0244200002" },
  { id:"S003", name:"Abena Darko",   gender:"Female", cls:"Grade 1", status:"Inactive",  dob:"2018-01-05", email:"abena@school.gh",  phone:"0244100003", guardian:"Yaw Darko",     gPhone:"0244200003" },
  { id:"S004", name:"Kofi Appiah",   gender:"Male",   cls:"Grade 3", status:"Active",    dob:"2016-11-30", email:"kofi@school.gh",   phone:"0244100004", guardian:"Esi Appiah",    gPhone:"0244200004" },
  { id:"S005", name:"Efua Amoah",    gender:"Female", cls:"Grade 2", status:"Suspended", dob:"2017-09-14", email:"efua@school.gh",   phone:"0244100005", guardian:"Nana Amoah",    gPhone:"0244200005" },
  { id:"S006", name:"Yaw Boateng",   gender:"Male",   cls:"Grade 1", status:"Active",    dob:"2018-04-18", email:"yaw@school.gh",    phone:"0244100006", guardian:"Adwoa Boateng", gPhone:"0244200006" },
  { id:"S007", name:"Akua Asante",   gender:"Female", cls:"Grade 3", status:"Active",    dob:"2016-06-20", email:"akua@school.gh",   phone:"0244100007", guardian:"Kojo Asante",   gPhone:"0244200007" },
  { id:"S008", name:"Fiifi Mensah",  gender:"Male",   cls:"Grade 2", status:"Active",    dob:"2017-12-01", email:"fiifi@school.gh",  phone:"0244100008", guardian:"Ama Mensah",    gPhone:"0244200008" },
];

export const STAFF = [
  { id:"T001", name:"Mr. Kwame Adu",     role:"Mathematics",    dept:"Sciences",    status:"Active",  phone:"0244300001", email:"k.adu@school.gh",     salary:3200, cls:"Grade 1" },
  { id:"T002", name:"Mrs. Esi Barimah",  role:"English",        dept:"Languages",   status:"Active",  phone:"0244300002", email:"e.barimah@school.gh",  salary:2900, cls:"Grade 2" },
  { id:"T003", name:"Mr. Yaw Darko",     role:"Science",        dept:"Sciences",    status:"Active",  phone:"0244300003", email:"y.darko@school.gh",    salary:3100, cls:"Grade 3" },
  { id:"T004", name:"Ms. Abena Kusi",    role:"History",        dept:"Humanities",  status:"On leave",phone:"0244300004", email:"a.kusi@school.gh",     salary:2800, cls:"Grade 1" },
  { id:"T005", name:"Mr. Kojo Asante",   role:"ICT",            dept:"Sciences",    status:"Active",  phone:"0244300005", email:"k.asante@school.gh",   salary:3000, cls:"Grade 2" },
  { id:"T006", name:"Mrs. Adwoa Boadu",  role:"Guidance",       dept:"Admin",       status:"Active",  phone:"0244300006", email:"a.boadu@school.gh",    salary:2700, cls:"Grade 3" },
];

export const GRADE_NAMES = ["Nursery", "Kindergarten", ...Array.from({ length: 9 }, (_, i) => `Grade ${i + 1}`)];

export const CLASSES = GRADE_NAMES.map((name, index) => ({
  id: `C${String(index + 1).padStart(3, "0")}`,
  name,
  teacher: STAFF.find(staffMember => staffMember.cls === name)?.name || "",
  students: 20 + ((index + 1) % 6) * 2,
  room: `Room ${101 + index}`,
}));

export const TODAY = new Date().toISOString().split("T")[0];
export const ATT_DATES = [TODAY];
export const ATTENDANCE = STUDENTS.map((s, i) => ({

  studentId: s.id,
  records: ATT_DATES.map(d => ({ date: d, status: i % 5 === 4 ? "Absent" : "Present" })),
}));

export const GRADES = [
  { studentId:"S001", subject:"Mathematics", score:88, grade:"A",  term:"Term 1" },
  { studentId:"S001", subject:"English",     score:74, grade:"B",  term:"Term 1" },
  { studentId:"S002", subject:"Mathematics", score:92, grade:"A+", term:"Term 1" },
  { studentId:"S002", subject:"Science",     score:67, grade:"B-", term:"Term 1" },
  { studentId:"S003", subject:"Mathematics", score:55, grade:"C",  term:"Term 1" },
  { studentId:"S004", subject:"History",     score:81, grade:"A-", term:"Term 1" },
  { studentId:"S005", subject:"English",     score:70, grade:"B",  term:"Term 1" },
  { studentId:"S006", subject:"ICT",         score:95, grade:"A+", term:"Term 1" },
  { studentId:"S007", subject:"Science",     score:78, grade:"B+", term:"Term 1" },
  { studentId:"S008", subject:"Mathematics", score:63, grade:"C+", term:"Term 1" },
];

export const SCHOOL_SUBJECTS = [
  "Mathematics",
  "English",
  "Science",
  "History",
  "ICT",
  "Art",
  "Physical Education",
  "French",
  "Music",
];

export const FEES = [
  { id:"F001", studentId:"S001", studentName:"Ama Owusu",    amount:1200, paid:1200, date:"2024-01-10", status:"Paid",    term:"Term 1" },
  { id:"F002", studentId:"S002", studentName:"Kweku Mensah", amount:1200, paid:600,  date:"2024-01-12", status:"Partial", term:"Term 1" },
  { id:"F003", studentId:"S003", studentName:"Abena Darko",  amount:1200, paid:0,    date:null,         status:"Unpaid",  term:"Term 1" },
  { id:"F004", studentId:"S004", studentName:"Kofi Appiah",  amount:1200, paid:1200, date:"2024-01-08", status:"Paid",    term:"Term 1" },
  { id:"F005", studentId:"S005", studentName:"Efua Amoah",   amount:1200, paid:400,  date:"2024-01-15", status:"Partial", term:"Term 1" },
  { id:"F006", studentId:"S006", studentName:"Yaw Boateng",  amount:1200, paid:1200, date:"2024-01-09", status:"Paid",    term:"Term 1" },
];

export const BOOKS = [
  { id:"B001", title:"Advanced Mathematics",   author:"Kwame Asante",  copies:5, available:3, isbn:"978-001" },
  { id:"B002", title:"English Grammar Today",  author:"Esi Morrison",  copies:8, available:8, isbn:"978-002" },
  { id:"B003", title:"Ghana History Vol. 1",   author:"J.K. Agyeman",  copies:4, available:1, isbn:"978-003" },
  { id:"B004", title:"Introduction to Physics",author:"R. Boateng",    copies:6, available:4, isbn:"978-004" },
  { id:"B005", title:"ICT Fundamentals",        author:"Tech Team",     copies:10,available:7, isbn:"978-005" },
];

export const ANNOUNCEMENTS = [
  { id:"A001", title:"End of term exams", body:"Term 1 exams begin 15th February. All students must be present.", date:"2024-01-20", type:"Academic" },
  { id:"A002", title:"School fees reminder", body:"Parents are reminded to clear outstanding fees before exams.", date:"2024-01-18", type:"Finance" },
  { id:"A003", title:"Sports day", body:"Annual sports day scheduled for 28th January on the school grounds.", date:"2024-01-15", type:"Event" },
];

const TIMETABLE_TEMPLATE = [
  ["Mathematics","English","—","Science","History","ICT","—","Art","Music"],
  ["English","Science","—","Mathematics","ICT","Physical Education","—","French","Art"],
  ["History","Mathematics","—","English","Science","Music","—","French","Art"],
  ["Science","—","—","English","Mathematics","History","—","ICT","Physical Education"],
  ["ICT","History","—","Mathematics","Science","English","—","Physical Education","Music"],
];

const TIMETABLE_ALT = [
  ["English","Mathematics","—","Science","ICT","Music","—","Art","French"],
  ["Science","English","—","History","Mathematics","French","—","Art","Music"],
  ["—","ICT","—","Science","English","Mathematics","—","Physical Education","French"],
  ["Mathematics","—","—","English","History","Science","—","ICT","Art"],
  ["History","Science","—","Mathematics","English","Art","—","French","Physical Education"],
];

export const TIMETABLE = Object.fromEntries(GRADE_NAMES.map((name, idx) => [
  name,
  idx % 2 === 0 ? TIMETABLE_TEMPLATE : TIMETABLE_ALT,
]));

export const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
export const PERIODS = ["Period 1\n7:00–8:00","Period 2\n8:00–9:00","Break\n9:00–9:15","Period 3\n9:15–10:15","Period 4\n10:15–11:15","Period 5\n11:15–12:15","Break\n12:15–12:45","Period 6\n12:45–1:45","Period 7\n1:45–3:00"];
export const SUBJ_COLORS = {
  Mathematics:"#DBEAFE", English:"#D1FAE5", Science:"#EDE9FE", History:"#FEF3C7", ICT:"#FCE7F3", "—":"transparent",
};
export const SUBJ_TEXT = {
  Mathematics:"#1E40AF", English:"#065F46", Science:"#5B21B6", History:"#92400E", ICT:"#9D174D", "—":T.textMuted,
};
