import { Card, SectionHeader } from "./ui";

export default function Reports({ students, staff, fees }) {
  const feesByStatus = ["Paid","Partial","Unpaid"].map(s => ({ label: s, count: fees.filter(f=>f.status===s).length }));
  const studentsByClass = [...new Set(students.map(s=>s.cls))].map(c => ({ cls: c, count: students.filter(s=>s.cls===c).length }));
  const totalRevenue = fees.reduce((a, f) => a + f.paid, 0);
  const collectionRate = Math.round((totalRevenue / (fees.reduce((a,f)=>a+f.amount,0) || 1)) * 100);

  return (
    <div>
      <SectionHeader title="Reports & analytics" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Total students</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#3B6FE8" }}>{students.length}</div>
        </Card>
        <Card style={{ padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Active staff</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#7C3AED" }}>{staff.filter(s=>s.status==='Active').length}</div>
        </Card>
        <Card style={{ padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Fee collection</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#16A34A" }}>{collectionRate}%</div>
        </Card>
        <Card style={{ padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Revenue</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#16A34A" }}>GH₵{totalRevenue.toLocaleString()}</div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>Students by class</div>
          {studentsByClass.map(({ cls, count }) => (
            <div key={cls} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13 }}>{cls}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{count}</span>
              </div>
              <div style={{ height: 8, background: "#E4E8EF", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${(count/students.length)*100}%`, height: "100%", background: "#3B6FE8", borderRadius: 4, transition: "width .4s" }} />
              </div>
            </div>
          ))}
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>Fee collection status</div>
          {feesByStatus.map(({ label, count }) => {
            const typeColor = label === "Paid" ? "#16A34A" : label === "Partial" ? "#D97706" : "#DC2626";
            return (
              <div key={label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13 }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{count} students</span>
                </div>
                <div style={{ height: 8, background: "#E4E8EF", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${(count/fees.length)*100}%`, height: "100%", background: typeColor, borderRadius: 4, transition: "width .4s" }} />
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      <Card style={{ padding: 20 }}>
        <div style={{ fontWeight: 700, marginBottom: 16 }}>Staff by department</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
          {[...new Set(staff.map(s=>s.dept))].map(dept => (
            <div key={dept} style={{ background: "#EBF0FD", borderRadius: 8, padding: "14px 16px" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#3B6FE8" }}>{staff.filter(s=>s.dept===dept).length}</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{dept}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
