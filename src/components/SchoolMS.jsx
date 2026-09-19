import { useEffect, useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Students from "./Students";
import Staff from "./Staff";
import Attendance from "./Attendance";
import Grades from "./Grades";
import Fees from "./Fees";
import Library from "./Library";
import Timetable from "./Timetable";
import Communication from "./Communication";
import Reports from "./Reports";
import Settings from "./Settings";
import Classes from "./Classes";
import BioData from "./BioData";
import { T, STUDENTS, STAFF, FEES, BOOKS, GRADES, CLASSES } from "../data/constants";
import { loadSchoolData } from "../lib/schoolData";

const NAV = [
  { id:"dashboard",      label:"Dashboard",     icon:"⊞" },
  { id:"students",       label:"Students",      icon:"👥" },
  { id:"staff",            label:"Staff",         icon:"💼" },
  { id:"attendance",       label:"Attendance",    icon:"✓" },
  { id:"grades",           label:"Grades",        icon:"📈" },
  { id:"fees",             label:"Fees",          icon:"₵" },
  { id:"library",          label:"Library",       icon:"📚" },
  { id:"classes",          label:"Classes",       icon:"🏫" },
  { id:"timetable",        label:"Timetable",     icon:"📅" },
  { id:"communication",    label:"Communication", icon:"📣" },
  { id:"reports",          label:"Reports",       icon:"📊" },
  { id:"settings",         label:"Settings",      icon:"⚙" },
];

export default function SchoolMS() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [students, setStudents] = useState(STUDENTS);
  const [staff, setStaff] = useState(STAFF);
  const [fees, setFees] = useState(FEES);
  const [books, setBooks] = useState(BOOKS);
  const [classes, setClasses] = useState(CLASSES);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      const data = await loadSchoolData();
      if (!active) return;

      setStudents(data.students || STUDENTS);
      setStaff(data.staff || STAFF);
      setFees(data.fees || FEES);
      setBooks(data.books || BOOKS);
      setClasses(data.classes || CLASSES);
    }

    loadData();
    return () => { active = false; };
  }, []);

  const shared = { students, setStudents, staff, setStaff, fees, setFees, user };

  const getDefaultPage = (role) => {
    if (role === "admin") return "dashboard";
    if (role === "teacher") return "grades";
    if (role === "accountant") return "fees";
    if (role === "library") return "library";
    return "biodata";
  };

  // Role-based navigation
  const getNavigation = () => {
    if (!user) return [];
    
    const baseNav = [
      { id:"dashboard",      label:"Dashboard",     icon:"⊞" },
      { id:"biodata",        label:"Bio Data",      icon:"👤" },
      { id:"students",       label:"Students",      icon:"👥" },
      { id:"staff",          label:"Staff",         icon:"💼" },
      { id:"attendance",     label:"Attendance",    icon:"✓" },
      { id:"grades",         label:"Grades",        icon:"📈" },
      { id:"fees",           label:"Fees",          icon:"₵" },
      { id:"library",        label:"Library",       icon:"📚" },
      { id:"classes",        label:"Classes",       icon:"🏫" },
      { id:"timetable",      label:"Timetable",     icon:"📅" },
      { id:"communication",  label:"Communication", icon:"📣" },
      { id:"reports",        label:"Reports",       icon:"📊" },
      { id:"settings",       label:"Settings",      icon:"⚙" },
    ];

    // Filter by role
    if (user.role === "student") {
      return baseNav.filter(n => ["biodata", "grades", "fees", "timetable", "communication"].includes(n.id));
    }
    if (user.role === "teacher") {
      return baseNav.filter(n => ["students", "attendance", "grades", "classes", "timetable", "communication"].includes(n.id));
    }
    if (user.role === "accountant") {
      return baseNav.filter(n => ["biodata", "fees", "communication"].includes(n.id));
    }
    if (user.role === "library") {
      return baseNav.filter(n => ["library", "communication"].includes(n.id));
    }
    return baseNav.filter(n => n.id !== "biodata"); // Admin sees all except Bio Data
  };

  const nav = getNavigation();

  useEffect(() => {
    if (!user) return;

    const allowedPages = new Set(nav.map(item => item.id));
    if (!allowedPages.has(page)) {
      setPage(getDefaultPage(user.role));
    }
  }, [user, nav, page]);

  const currentPage = user && nav.some(item => item.id === page) ? page : getDefaultPage(user?.role || "admin");

  const PAGES = {
    dashboard:     user?.role === "admin" ? <Dashboard {...shared} grades={GRADES} /> : null,
    biodata:       <BioData user={user} />,
    students:      <Students {...shared} />,
    staff:            <Staff {...shared} />,
    attendance:       <Attendance {...shared} />,
    grades:           <Grades students={students} grades={GRADES} user={user} />,
    fees:             <Fees {...shared} />,
    library:          <Library books={books} setBooks={setBooks} user={user} />,
    classes:          <Classes classes={classes} setClasses={setClasses} staff={staff} students={students} user={user} />,
    timetable:        <Timetable user={user} />,
    communication:    <Communication user={user} />,
    reports:          <Reports {...shared} />,
    settings:         <Settings />,
  };

  // Show login if not authenticated
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bg, fontFamily: "system-ui, -apple-system, sans-serif", color: T.textPrimary, overflow: "hidden" }}>
      <div style={{ width: sidebarOpen ? 220 : 64, background: T.sidebar, display: "flex", flexDirection: "column", flexShrink: 0, transition: "width .2s", overflow: "hidden" }}>
        <div style={{ padding: "16px 14px", borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setSidebarOpen(p => !p)}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🏫</div>
          {sidebarOpen && <div style={{ overflow: "hidden" }}><div style={{ fontWeight: 700, fontSize: 13, color: "#fff", whiteSpace: "nowrap" }}>Accra Prestige</div><div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", whiteSpace: "nowrap" }}>School Management</div></div>}
        </div>
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 10px", border: "none", borderRadius: T.radius, cursor: "pointer", background: currentPage === n.id ? T.sidebarActive : "transparent", color: currentPage === n.id ? "#fff" : "rgba(255,255,255,.65)", fontWeight: currentPage === n.id ? 700 : 400, fontSize: 13, textAlign: "left", marginBottom: 2, transition: "background .12s", whiteSpace: "nowrap", overflow: "hidden" }}
              onMouseEnter={e => { if (page !== n.id) e.currentTarget.style.background = T.sidebarHover; }}
              onMouseLeave={e => { if (page !== n.id) e.currentTarget.style.background = "transparent" }}>
              <span style={{ fontSize: 16, flexShrink: 0, width: 24, textAlign: "center" }}>{n.icon}</span>
              {sidebarOpen && <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{n.label}</span>}
            </button>
          ))}
        </nav>
        {sidebarOpen && (
          <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{user.name.charAt(0)}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.role}</div>
              </div>
            </div>
            <button
              onClick={() => setUser(null)}
              style={{ padding: "4px 8px", background: "rgba(255,255,255,.1)", border: "none", borderRadius: 4, color: "rgba(255,255,255,.7)", fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "background .2s" }}
              onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,.2)"}
              onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,.1)"}
              title="Logout"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "12px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>{nav.find(n => n.id === currentPage)?.label}</span>
          <span style={{ marginLeft: "auto", fontSize: 12, color: T.textMuted }}>{new Date().toLocaleDateString("en-GH", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}</span>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {PAGES[currentPage]}
        </div>
      </div>
    </div>
  );
}
