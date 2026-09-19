import { useState } from "react";
import { Card, SectionHeader, Btn, Input } from "./ui";
import { STUDENTS, T } from "../data/constants";

export default function BioData({ user }) {
  const isStudent = user?.role === "student";
  const isFinanceStaff = user?.role === "accountant";
  const studentData = STUDENTS.find(s => s.id === user.id);
  const financeProfile = isFinanceStaff ? {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || "N/A",
    department: user.department || "Finance",
    role: "Accountant",
    status: "Active",
  } : null;
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState((studentData || financeProfile) || {});
  const [saved, setSaved] = useState(false);

  if (!studentData && !financeProfile) {
    return <div style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}>Profile data not found</div>;
  }

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    if (isStudent) return;
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const displayTitle = isFinanceStaff ? "My Profile" : "My Bio Data";

  return (
    <div>
      <SectionHeader title={displayTitle} action={
        !isStudent && (!isEditing ? (
          <Btn variant="primary" onClick={() => setIsEditing(true)}>✎ Edit</Btn>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={() => { setData(studentData || financeProfile); setIsEditing(false); }}>Cancel</Btn>
            <Btn variant="primary" onClick={handleSave}>Save Changes</Btn>
          </div>
        ))
      } />

      {saved && (
        <div style={{ padding: "12px 16px", background: "#DCFCE7", border: `1px solid ${T.success}`, borderRadius: 8, marginBottom: 20, color: T.success, fontWeight: 600, fontSize: 13 }}>
          ✓ Changes saved successfully
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Personal Information */}
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, marginTop: 0, marginBottom: 16 }}>Personal Information</h3>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>{isFinanceStaff ? "Employee ID" : "Student ID"}</label>
            <div style={{ padding: "10px 12px", background: "#F3F4F6", borderRadius: 8, fontSize: 13, color: T.textSecondary, fontFamily: "monospace" }}>{data.id}</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>Full Name</label>
            {!isStudent && isEditing ? (
              <Input value={data.name || ""} onChange={v => handleChange("name", v)} placeholder="Full name" />
            ) : (
              <div style={{ padding: "10px 12px", background: "#F3F4F6", borderRadius: 8, fontSize: 13 }}>{data.name}</div>
            )}
          </div>

          {!isFinanceStaff && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>Gender</label>
                {!isStudent && isEditing ? (
                  <select value={data.gender || ""} onChange={e => handleChange("gender", e.target.value)} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, outline: "none", cursor: "pointer", fontFamily: "inherit" }}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                ) : (
                  <div style={{ padding: "10px 12px", background: "#F3F4F6", borderRadius: 8, fontSize: 13 }}>{data.gender}</div>
                )}
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>Date of Birth</label>
                {!isStudent && isEditing ? (
                  <Input type="date" value={data.dob || ""} onChange={v => handleChange("dob", v)} />
                ) : (
                  <div style={{ padding: "10px 12px", background: "#F3F4F6", borderRadius: 8, fontSize: 13 }}>{data.dob}</div>
                )}
              </div>
            </>
          )}
        </Card>

        {/* Contact Information */}
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, marginTop: 0, marginBottom: 16 }}>Contact Information</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>Email Address</label>
            {!isStudent && isEditing ? (
              <Input type="email" value={data.email || ""} onChange={v => handleChange("email", v)} placeholder="your.email@school.gh" />
            ) : (
              <div style={{ padding: "10px 12px", background: "#F3F4F6", borderRadius: 8, fontSize: 13 }}>{data.email}</div>
            )}
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>{isFinanceStaff ? "Office Phone" : "Phone Number"}</label>
            {!isStudent && isEditing ? (
              <Input value={data.phone || ""} onChange={v => handleChange("phone", v)} placeholder="0244100000" />
            ) : (
              <div style={{ padding: "10px 12px", background: "#F3F4F6", borderRadius: 8, fontSize: 13 }}>{data.phone}</div>
            )}
          </div>
        </Card>

        {/* Academic Information */}
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, marginTop: 0, marginBottom: 16 }}>Academic Information</h3>

          {!isFinanceStaff && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>Class/Grade</label>
              <div style={{ padding: "10px 12px", background: "#F3F4F6", borderRadius: 8, fontSize: 13 }}>{data.cls}</div>
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>Role</label>
            <div style={{ padding: "10px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: "#E0F2FE", color: "#0F172A" }}>
              {isFinanceStaff ? data.role : data.status}
            </div>
          </div>
        </Card>

        {!isFinanceStaff && (
          <Card style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, marginTop: 0, marginBottom: 16 }}>Guardian Information</h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>Guardian Name</label>
              {!isStudent && isEditing ? (
                <Input value={data.guardian || ""} onChange={v => handleChange("guardian", v)} placeholder="Guardian full name" />
              ) : (
                <div style={{ padding: "10px 12px", background: "#F3F4F6", borderRadius: 8, fontSize: 13 }}>{data.guardian}</div>
              )}
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>Guardian Phone</label>
              {!isStudent && isEditing ? (
                <Input value={data.gPhone || ""} onChange={v => handleChange("gPhone", v)} placeholder="0244200000" />
              ) : (
                <div style={{ padding: "10px 12px", background: "#F3F4F6", borderRadius: 8, fontSize: 13 }}>{data.gPhone}</div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Info Banner */}
      <div style={{ marginTop: 20, padding: "12px 16px", background: "#F3F4F6", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12, color: T.textSecondary }}>
        <div style={{ fontWeight: 600, marginBottom: 4, color: T.textPrimary }}>ℹ Important</div>
        Some fields like Student ID, Class, and Status are read-only and managed by your school administrator. Contact your school for changes to these fields.
      </div>
    </div>
  );
}
