import { useState } from "react";
import { Card, SectionHeader } from "./ui";
import { TIMETABLE, DAYS, PERIODS, SUBJ_COLORS, SUBJ_TEXT, GRADE_NAMES, STUDENTS, SCHOOL_SUBJECTS } from "../data/constants";

export default function Timetable({ user }) {
  const isAdmin = user?.role === "admin";
  const isStudentOrTeacher = user?.role === "student" || user?.role === "teacher";
  const studentClass = user?.role === "student" ? STUDENTS.find(s => s.id === user.id)?.cls : null;
  const initialCls = user?.role === "teacher" ? user.cls : (studentClass || GRADE_NAMES[0] || "Grade 1");
  const [cls, setCls] = useState(initialCls);
  const [timetableData, setTimetableData] = useState(TIMETABLE);
  const [periods, setPeriods] = useState(() => PERIODS.map(period => {
    const [label, time] = period.split("\n");
    return { label, time };
  }));
  const grid = timetableData[cls] || TIMETABLE[GRADE_NAMES[0]];

  const handleCellChange = (dayIndex, periodIndex, value) => {
    if (!isAdmin) return;
    setTimetableData(prev => ({
      ...prev,
      [cls]: prev[cls].map((row, rowIndex) => {
        if (rowIndex !== dayIndex) return row;
        return row.map((cell, cellIndex) => cellIndex === periodIndex ? value : cell);
      }),
    }));
  };

  const handlePeriodTimeChange = (periodIndex, time) => {
    if (!isAdmin) return;
    setPeriods(prev => prev.map((period, index) => index === periodIndex ? { ...period, time } : period));
  };

  return (
    <div>
      <SectionHeader title={isStudentOrTeacher ? "My Class Timetable" : "Timetable"} />
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {!isStudentOrTeacher && (
          <div style={{ padding: "12px 16px", borderBottom: `1px solid #E4E8EF`, display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Class:</span>
            <select value={cls} onChange={e => setCls(e.target.value)} style={{ border: `1px solid #E4E8EF`, borderRadius: "8px", padding: "8px 12px", fontSize: 13, background: "#F4F6F9", color: "#111827", outline: "none", cursor: "pointer" }}>
              {Object.keys(timetableData).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        )}
        {isStudentOrTeacher && (
          <div style={{ padding: "12px 16px", borderBottom: `1px solid #E4E8EF`, background: "#EBF0FD", fontWeight: 600, color: "#3B6FE8" }}>
            {cls}
          </div>
        )}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 600 }}>
            <thead>
              <tr style={{ background: "#F4F6F9" }}>
                <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#6B7280", fontSize: 11, borderBottom: `1px solid #E4E8EF`, width: 100 }}>Period</th>
                {DAYS.map(d => <th key={d} style={{ padding: "10px 14px", fontWeight: 600, fontSize: 11, textAlign: "center", borderBottom: `1px solid #E4E8EF`, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".04em" }}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map((period, pi) => (
                <tr key={pi} style={{ borderBottom: `1px solid #E4E8EF` }}>
                  <td style={{ padding: "12px 14px", fontSize: 11, color: "#6B7280", fontWeight: 600, lineHeight: 1.4 }}>
                    <div>{periods[pi]?.label || period.split("\n")[0]}</div>
                    {isAdmin ? (
                      <input
                        value={periods[pi]?.time || period.split("\n")[1] || ""}
                        onChange={e => handlePeriodTimeChange(pi, e.target.value)}
                        aria-label={`${periods[pi]?.label || period.split("\n")[0]} time`}
                        style={{ width: 104, marginTop: 4, border: "1px solid #E4E8EF", borderRadius: "6px", padding: "4px 5px", fontSize: 11, color: "#111827", outline: "none" }}
                      />
                    ) : (
                      <div>{periods[pi]?.time || period.split("\n")[1]}</div>
                    )}
                  </td>
                  {DAYS.map((_, di) => {
                    const subj = grid[di]?.[pi] || "—";
                    return (
                      <td key={di} style={{ padding: "10px 8px", textAlign: "center" }}>
                        {isAdmin ? (
                          <select
                            value={subj}
                            onChange={e => handleCellChange(di, pi, e.target.value)}
                            style={{
                              background: SUBJ_COLORS[subj] || "#F4F6F9",
                              color: SUBJ_TEXT[subj] || "#111827",
                              borderRadius: "8px",
                              padding: "6px 10px",
                              fontWeight: 600,
                              fontSize: 12,
                              minWidth: 90,
                              border: "1px solid #E4E8EF",
                              cursor: "pointer",
                              outline: "none"
                            }}
                          >
                            {["—", ...SCHOOL_SUBJECTS].map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          <div style={{ background: SUBJ_COLORS[subj] || "#F4F6F9", color: SUBJ_TEXT[subj] || "#111827", borderRadius: "8px", padding: "6px 10px", fontWeight: subj !== "—" ? 600 : 400, fontSize: 12, display: "inline-block", minWidth: 80 }}>
                            {subj}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
