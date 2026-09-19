import { useState } from "react";
import { Card, SectionHeader, Btn, Input } from "./ui";

export default function Settings() {
  const [school, setSchool] = useState({ name:"Accra Prestige School", motto:"Knowledge is Power", address:"P.O. Box 123, Accra, Ghana", email:"info@accraprestige.edu.gh", phone:"030 200 0001", term:"Term 1", year:"2023/2024" });
  const [saved, setSaved] = useState(false);

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  const ROLES = [
    { role:"Admin",     access:"Full system access", user:"admin@school.gh" },
    { role:"Teacher",   access:"Students, attendance, grades", user:"teacher@school.gh" },
    { role:"Accountant",access:"Fees & finance only", user:"accounts@school.gh" },
    { role:"Librarian", access:"Library module only", user:"library@school.gh" },
    { role:"Parent",    access:"View own child only", user:"parent@school.gh" },
  ];

  return (
    <div>
      <SectionHeader title="Settings & access control" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>School information</div>
          <div style={{ display: "grid", gap: 12 }}>
            {Object.entries(school).map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4, textTransform: "capitalize" }}>{k.replace(/([A-Z])/g," $1")}</div>
                <Input value={v} onChange={val => setSchool(p => ({ ...p, [k]: val }))} placeholder={k} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <Btn variant={saved ? "success" : "primary"} onClick={save}>{saved ? "✓ Saved" : "Save settings"}</Btn>
          </div>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>Role-based access</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ROLES.map(r => (
              <div key={r.role} style={{ background: "#F4F6F9", borderRadius: "8px", padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{r.role}</span>
                  <span style={{ background: "#DCFCE7", color: "#16A34A", padding: "2px 8px", borderRadius: 20, fontSize: 11 }}>Active</span>
                </div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{r.access}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2, fontFamily: "monospace" }}>{r.user}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
