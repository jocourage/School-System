import { useMemo } from "react";
import { Card, SectionHeader, Select } from "./ui";
import { GRADE_NAMES } from "../data/constants";

export default function Classes({ classes, setClasses, staff, students = [], user }) {
  const isTeacher = user?.role === "teacher";
  const orderedClasses = [...classes].sort((a, b) => GRADE_NAMES.indexOf(a.name) - GRADE_NAMES.indexOf(b.name));
  const visibleClasses = isTeacher ? orderedClasses.filter(cls => cls.name === user.cls) : orderedClasses;
  const teacherOptions = useMemo(
    () => ["", ...staff.filter(s => !isTeacher || s.cls === user?.cls).map(s => s.name).sort()],
    [staff, isTeacher, user?.cls]
  );

  function assignTeacher(classId, teacher) {
    if (isTeacher) return;
    setClasses(prev => prev.map(c => c.id === classId ? { ...c, teacher } : c));
  }

  return (
    <div>
      <SectionHeader title={isTeacher ? `My class` : "Class management"} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginBottom: 20 }}>
        {visibleClasses.map(cls => (
          <Card key={cls.id} style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>{cls.name}</div>
            <div style={{ color: "#6B7280", marginBottom: 8 }}>Room: {cls.room}</div>
            <div style={{ color: "#6B7280", marginBottom: 8 }}>Students: {students.filter(student => student.cls === cls.name).length}</div>
            <div style={{ color: "#6B7280", marginBottom: 12 }}>Teacher: {cls.teacher || "Unassigned"}</div>
            {!isTeacher && (
              <Select value={cls.teacher || ""} onChange={value => assignTeacher(cls.id, value)}>
                <option value="">Unassigned</option>
                {teacherOptions.filter(t => t).map(name => <option key={name} value={name}>{name}</option>)}
              </Select>
            )}
          </Card>
        ))}
      </div>
      {!isTeacher && (
        <Card>
          <div style={{ padding: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 10, marginBottom: 12, color: "#6B7280", fontSize: 11, textTransform: "uppercase", letterSpacing: ".05em" }}>
              <div>Class</div>
              <div>Room</div>
              <div>Teacher</div>
              <div>Students</div>
            </div>
            {visibleClasses.map(cls => (
              <div key={cls.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 10, alignItems: "center", padding: "12px 0", borderTop: "1px solid #E4E8EF" }}>
                <div style={{ fontWeight: 600 }}>{cls.name}</div>
                <div style={{ color: "#6B7280" }}>{cls.room}</div>
                <div>
                  <Select value={cls.teacher || ""} onChange={value => assignTeacher(cls.id, value)}>
                    <option value="">Unassigned</option>
                    {teacherOptions.filter(t => t).map(name => <option key={name} value={name}>{name}</option>)}
                  </Select>
                </div>
                <div style={{ color: "#6B7280" }}>{students.filter(student => student.cls === cls.name).length}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
