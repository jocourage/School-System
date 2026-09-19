import { useState } from "react";
import { StatCard, Avatar, Badge, Btn, Card, Table, Modal, Input, Select, SectionHeader } from "./ui";
import { SCHOOL_SUBJECTS } from "../data/constants";

export default function Grades({ students, grades: initialGrades = [], user }) {
  const [grades, setGrades] = useState(initialGrades);
  const [pendingUploads, setPendingUploads] = useState([]);
  const [modal, setModal] = useState(false);
  const [filterSubject, setFilterSubject] = useState("");

  const teacherClass = user?.role === "teacher" ? user.cls : null;

  // If student, show only their grades
  // If teacher, show only grades for their class
  const teacherStudentIds = teacherClass
    ? students.filter(s => s.cls === teacherClass).map(s => s.id)
    : null;

  const pendingTeacherGrades = teacherStudentIds
    ? pendingUploads.filter(g => teacherStudentIds.includes(g.studentId))
    : [];

  const allSubjects = SCHOOL_SUBJECTS;

  const studentGrades = user?.role === "student"
    ? grades.filter(g => g.studentId === user.id)
    : user?.role === "teacher"
      ? pendingTeacherGrades
      : grades;

  const subjects = [...new Set([...allSubjects, ...studentGrades.map(g => g.subject)])];
  const filtered = filterSubject ? studentGrades.filter(g => g.subject === filterSubject) : studentGrades;

  const avg = filtered.length ? (filtered.reduce((a,g)=>a+g.score,0)/filtered.length).toFixed(1) : 0;
  const top = filtered.length ? Math.max(...filtered.map(g=>g.score)) : 0;

  function getStudentName(id) { return students.find(s => s.id === id)?.name || id; }

  const adminCols = [
    { key:"studentId", label:"Student",  render: r => <div style={{display:"flex",alignItems:"center",gap:10}}><Avatar name={getStudentName(r.studentId)} /><span style={{fontWeight:600}}>{getStudentName(r.studentId)}</span></div> },
    { key:"subject",   label:"Subject",  render: r => r.subject },
    { key:"term",      label:"Term",     render: r => r.term },
    { key:"score",     label:"Score",    render: r => <div style={{ display:"flex", alignItems:"center", gap:8 }}><div style={{ width:60, height:6, borderRadius:4, background:"#E4E8EF", overflow:"hidden" }}><div style={{ width:`${r.score}%`, height:"100%", background: r.score>=80?"#16A34A":r.score>=60?"#D97706":"#DC2626", borderRadius:4 }} /></div><span style={{fontWeight:700}}>{r.score}</span></div> },
    { key:"grade",     label:"Grade",    render: r => <Badge label={r.grade} type={r.score>=80?"success":r.score>=60?"warning":"danger"} /> },
  ];

  const studentCols = [
    { key:"subject",   label:"Subject",  render: r => <span style={{fontWeight:600}}>{r.subject}</span> },
    { key:"term",      label:"Term",     render: r => r.term },
    { key:"score",     label:"Score",    render: r => <div style={{ display:"flex", alignItems:"center", gap:8 }}><div style={{ width:60, height:6, borderRadius:4, background:"#E4E8EF", overflow:"hidden" }}><div style={{ width:`${r.score}%`, height:"100%", background: r.score>=80?"#16A34A":r.score>=60?"#D97706":"#DC2626", borderRadius:4 }} /></div><span style={{fontWeight:700, fontSize:14}}>{r.score}</span></div> },
    { key:"grade",     label:"Grade",    render: r => <Badge label={r.grade} type={r.score>=80?"success":r.score>=60?"warning":"danger"} /> },
  ];

  const cols = user?.role === "student" ? studentCols : adminCols;

  // Student view
  // Teacher view is handled below in the non-student branch
  if (user?.role === "student") {
    return (
      <div>
        <SectionHeader title="My Academic Grades" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
          <StatCard label="Total Subjects" value={subjects.length} color="#3B6FE8" />
          <StatCard label="Average Score" value={`${avg}%`} color={avg>=80?"#16A34A":avg>=60?"#D97706":"#DC2626"} />
          <StatCard label="Best Score" value={top} color="#7C3AED" />
        </div>
        <Card>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid #E4E8EF`, display: "flex", gap: 10 }}>
            <Select value={filterSubject} onChange={setFilterSubject}>
              <option value="">All subjects</option>
              {subjects.map(s => <option key={s}>{s}</option>)}
            </Select>
            <span style={{ marginLeft: "auto", fontSize: 12, color: "#9CA3AF", alignSelf: "center" }}>{filtered.length} grades</span>
          </div>
          <Table cols={cols} rows={filtered} />
        </Card>
      </div>
    );
  }

  const title = user?.role === "teacher" ? "Submitted class grades" : "Grades & results";

  const uploadPending = (entryKey) => {
    const nextPending = pendingUploads.filter(item => {
      const key = `${item.studentId}|${item.subject}|${item.term}`;
      return key !== entryKey;
    });

    const item = pendingUploads.find(p => `${p.studentId}|${p.subject}|${p.term}` === entryKey);
    if (!item) return;

    setGrades(prev => {
      const merged = [...prev];
      const idx = merged.findIndex(g => g.studentId === item.studentId && g.subject === item.subject && g.term === item.term);
      if (idx >= 0) merged[idx] = item;
      else merged.push(item);
      return merged;
    });

    setPendingUploads(nextPending);
  };

  const uploadAllPending = () => {
    if (!pendingUploads.length) return;
    setGrades(prev => {
      const merged = [...prev];
      pendingUploads.forEach(item => {
        const idx = merged.findIndex(g => g.studentId === item.studentId && g.subject === item.subject && g.term === item.term);
        if (idx >= 0) merged[idx] = item;
        else merged.push(item);
      });
      return merged;
    });
    setPendingUploads([]);
  };

  // Admin/Teacher view
  return (
    <div>
      <SectionHeader title={title} action={user?.role === "teacher" ? <Btn variant="primary" onClick={() => setModal(true)}>+ Submit grades</Btn> : null} />
      {user?.role === "admin" && (
        <Card style={{ padding: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 700 }}>Approve and publish teacher grades</div>
            <Btn variant="primary" onClick={uploadAllPending} disabled={!pendingUploads.length}>
              Upload all to students
            </Btn>
          </div>
          {pendingUploads.length === 0 ? (
            <div style={{ fontSize: 13, color: "#6B7280" }}>
              No teacher submissions yet. Grades submitted by teachers will appear here for approval and publishing.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {pendingUploads.map(item => (
                <div key={`${item.studentId}-${item.subject}-${item.term}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "#F4F6F9", borderRadius: 8, padding: "10px 12px" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{getStudentName(item.studentId)}</div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>{item.subject} · {item.term} · {item.score}%</div>
                  </div>
                  <Btn small variant="primary" onClick={() => uploadPending(`${item.studentId}|${item.subject}|${item.term}`)}>Upload</Btn>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        <StatCard label="Records" value={filtered.length} color="#3B6FE8" />
        <StatCard label="Average" value={`${avg}%`} color="#16A34A" />
        <StatCard label="Top score" value={top} color="#7C3AED" />
      </div>
      <Card>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid #E4E8EF`, display: "flex", gap: 10 }}>
          <Select value={filterSubject} onChange={setFilterSubject}>
            <option value="">All subjects</option>
            {subjects.map(s => <option key={s}>{s}</option>)}
          </Select>
        </div>
        <Table cols={cols} rows={filtered} />
      </Card>
      {modal && user?.role === "teacher" && (
        <Modal title="Submit class grades" onClose={() => setModal(false)}>
          <AddGradeForm
            students={teacherClass ? students.filter(s => s.cls === teacherClass) : students}
            subjects={subjects}
            teacherClass={teacherClass}
            role={user?.role}
            onSave={d => {
              const nextGrades = Array.isArray(d) ? d : [d];
              setPendingUploads(prev => {
                const merged = [...prev];
                nextGrades.forEach(item => {
                  const key = `${item.studentId}|${item.subject}|${item.term}`;
                  const idx = merged.findIndex(g => `${g.studentId}|${g.subject}|${g.term}` === key);
                  if (idx >= 0) merged[idx] = item;
                  else merged.push(item);
                });
                return merged;
              });
              setModal(false);
            }}
            onClose={() => setModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}

function AddGradeForm({ students, subjects, teacherClass, role, onSave, onClose }) {
  const isTeacherSubmit = role === "teacher";
  const isClassUpload = Boolean(teacherClass) || isTeacherSubmit;
  const subjectOptions = SCHOOL_SUBJECTS;
  const [f, setF] = useState(isClassUpload
    ? { subject: subjectOptions[0], term: "Term 1", scores: Object.fromEntries(students.map(s => [s.id, ""])) }
    : { studentId: students[0]?.id || "", subject: subjectOptions[0], score: "", term: "Term 1" }
  );
  const [subjectStep, setSubjectStep] = useState(isTeacherSubmit ? "select" : "form");
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const setStudentScore = (studentId, value) => setF(p => ({ ...p, scores: { ...p.scores, [studentId]: value } }));

  function getGrade(score) {
    if (score >= 90) return "A+"; if (score >= 80) return "A"; if (score >= 75) return "A-";
    if (score >= 70) return "B+"; if (score >= 65) return "B"; if (score >= 60) return "B-";
    if (score >= 55) return "C+"; if (score >= 50) return "C"; return "F";
  }

  const canSubmit = isClassUpload
    ? students.every(s => {
        const raw = f.scores?.[s.id];
        const value = parseInt(raw, 10);
        return !Number.isNaN(value) && value >= 0 && value <= 100;
      })
    : (() => {
        const sc = parseInt(f.score, 10);
        return !Number.isNaN(sc) && sc >= 0 && sc <= 100;
      })();

  const handleSave = () => {
    if (isClassUpload) {
      const entries = students.map(s => {
        const score = parseInt(f.scores[s.id], 10);
        return { studentId: s.id, subject: f.subject, score, grade: getGrade(score), term: f.term };
      });
      onSave(entries);
      return;
    }

    const sc = parseInt(f.score, 10);
    if (!Number.isNaN(sc) && sc >= 0 && sc <= 100) {
      onSave({ studentId: f.studentId, subject: f.subject, score: sc, grade: getGrade(sc), term: f.term });
    }
  };

  if (isClassUpload) {
    if (isTeacherSubmit && subjectStep === "select") {
      return (
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Choose a subject</div>
          <div style={{ display: "grid", gap: 10 }}>
            {subjectOptions.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  set("subject", s);
                  setSubjectStep("form");
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 14px",
                  border: "1px solid #E4E8EF",
                  borderRadius: 8,
                  background: "#F9FAFB",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#111827"
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Btn onClick={onClose}>Cancel</Btn>
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: "grid", gap: 14 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ fontSize: 12, color: "#6B7280" }}>Subject</div>
            {isTeacherSubmit && (
              <button type="button" onClick={() => setSubjectStep("select")} style={{ border: "none", background: "transparent", color: "#3B6FE8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                Change subject
              </button>
            )}
          </div>
          <div style={{ padding: "10px 12px", background: "#F3F4F6", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>{f.subject}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Term</div>
          <Select value={f.term} onChange={v => set("term", v)} style={{ width: "100%" }}>
            {["Term 1","Term 2","Term 3"].map(t => <option key={t}>{t}</option>)}
          </Select>
        </div>
        <div style={{ padding: "8px 10px", background: "#F3F4F6", borderRadius: 8, fontSize: 12, color: "#6B7280" }}>
          Record a score for every student in this class before uploading.
        </div>
        <div style={{ display: "grid", gap: 10, maxHeight: 320, overflowY: "auto" }}>
          {students.map(s => (
            <div key={s.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 10, alignItems: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
              <Input type="number" value={f.scores[s.id] ?? ""} onChange={v => setStudentScore(s.id, v)} placeholder="0–100" />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" disabled={!canSubmit} onClick={handleSave}>{isTeacherSubmit ? "Submit grades" : "Upload grades"}</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div>
        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Student</div>
        <Select value={f.studentId} onChange={v => set("studentId", v)} style={{ width: "100%" }}>
          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </Select>
      </div>
      <div>
        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Subject</div>
        <Select value={f.subject} onChange={v => set("subject", v)} style={{ width: "100%" }}>
          {subjects.map(s => <option key={s}>{s}</option>)}
          <option>Other</option>
        </Select>
      </div>
      <div>
        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Score (0–100)</div>
        <Input type="number" value={f.score} onChange={v => set("score", v)} placeholder="e.g. 85" />
      </div>
      <div>
        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Term</div>
        <Select value={f.term} onChange={v => set("term", v)} style={{ width: "100%" }}>
          {["Term 1","Term 2","Term 3"].map(t => <option key={t}>{t}</option>)}
        </Select>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" disabled={!canSubmit} onClick={handleSave}>Save</Btn>
      </div>
    </div>
  );
}
