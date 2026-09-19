import { useState, useCallback, useMemo, useEffect } from "react";
import { StatCard, Avatar, Card, SectionHeader, Select } from "./ui";
import { TODAY, ATTENDANCE } from "../data/constants";

export default function Attendance({ students, user }) {
  const isTeacher = user?.role === "teacher";
  const availableClasses = isTeacher ? [user.cls] : [...new Set(students.map(s => s.cls))].sort();
  const classOptions = useMemo(() => availableClasses, [availableClasses]);
  const [cls, setCls] = useState("");
  const [date, setDate] = useState(TODAY);
  const [recordsByClassDate, setRecordsByClassDate] = useState(() => {
    const base = {};
    const initialStatus = {};
    ATTENDANCE.forEach(a => {
      const r = a.records.find(x => x.date === TODAY);
      initialStatus[a.studentId] = r ? r.status : "Present";
    });
    students.forEach(s => {
      base[s.cls] = base[s.cls] || {};
      base[s.cls][TODAY] = base[s.cls][TODAY] || {};
      base[s.cls][TODAY][s.id] = initialStatus[s.id] || "Present";
    });
    return base;
  });

  useEffect(() => {
    if (!cls && classOptions.length) setCls(classOptions[0]);
  }, [classOptions, cls]);

  const filteredStudents = useMemo(() => students.filter(s => s.cls === cls), [students, cls]);

  const currentRecords = useMemo(() => {
    if (!cls) return {};
    const classDates = recordsByClassDate[cls] || {};
    if (classDates[date]) return classDates[date];
    return filteredStudents.reduce((acc, s) => {
      acc[s.id] = "Present";
      return acc;
    }, {});
  }, [cls, date, filteredStudents, recordsByClassDate]);

  const toggle = useCallback((id) => {
    setRecordsByClassDate(prev => {
      const classDates = { ...(prev[cls] || {}) };
      const dateRecords = { ...(classDates[date] || {}) };
      dateRecords[id] = dateRecords[id] === "Present" ? "Absent" : "Present";
      classDates[date] = dateRecords;
      return { ...prev, [cls]: classDates };
    });
  }, [cls, date]);

  const presentCount = filteredStudents.filter(s => currentRecords[s.id] === "Present").length;
  const absentCount  = filteredStudents.filter(s => currentRecords[s.id] === "Absent").length;
  const rate = filteredStudents.length ? Math.round((presentCount / filteredStudents.length) * 100) : 0;

  return (
    <div>
      <SectionHeader title="Attendance register" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        <StatCard label="Class" value={cls || "-"} color="#3B6FE8" />
        <StatCard label="Present" value={presentCount} color="#16A34A" />
        <StatCard label="Absent"  value={absentCount}  color="#DC2626" />
        <StatCard label="Rate"    value={`${rate}%`}    color="#3B6FE8" />
      </div>
      <Card>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid #E4E8EF`, display: "flex", gap: 12, alignItems: "center" }}>
          {!isTeacher && (
            <>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Class</span>
              <Select value={cls} onChange={setCls} style={{ maxWidth: 200 }}>
                {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </>
          )}
          {isTeacher && <span style={{ fontWeight: 600, fontSize: 14, color: "#3B6FE8 " }}>My Class: {cls}</span>}
          <span style={{ fontWeight: 600, fontSize: 14 }}>Date</span>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{ border: `1px solid #E4E8EF`, borderRadius: "8px", padding: "7px 12px", fontSize: 13, background: "#F4F6F9", color: "#111827", outline: "none" }} />
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#9CA3AF" }}>Click a row to toggle presence</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid #E4E8EF` }}>
              { ["#","Student","Class","Status"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".05em" }}>{h}</th>
              )) }
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, i) => (
              <tr key={s.id} onClick={() => toggle(s.id)} style={{ borderBottom: `1px solid #E4E8EF`, cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F4F6F9"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "10px 14px", color: "#6B7280", width: 40 }}>{i+1}</td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={s.name} />
                    <span style={{ fontWeight: 600 }}>{s.name}</span>
                  </div>
                </td>
                <td style={{ padding: "10px 14px", color: "#6B7280" }}>{s.cls}</td>
                <td style={{ padding: "10px 14px", color: currentRecords[s.id] === "Present" ? "#16A34A" : "#DC2626", fontWeight: 600 }}>{currentRecords[s.id] || "Present"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
