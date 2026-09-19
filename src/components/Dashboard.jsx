import { StatCard, Avatar, Badge, statusBadge, Card, SectionHeader } from "./ui";
import { ATTENDANCE, ANNOUNCEMENTS } from "../data/constants";

export default function Dashboard({ students, staff, fees, grades }) {
  const totalRevenue = fees.reduce((a, f) => a + f.paid, 0);
  const avgScore = (grades.reduce((a, g) => a + g.score, 0) / grades.length).toFixed(1);
  const absent = ATTENDANCE.filter(a => a.records.some(r => r.status === "Absent")).length;

  return (
    <div>
      <SectionHeader title="Dashboard" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard label="Total students" value={students.length} sub={`${students.filter(s=>s.status==='Active').length} active`} color="#3B6FE8" />
        <StatCard label="Teaching staff" value={staff.length} sub={`${staff.filter(s=>s.status==='Active').length} active`} color="#7C3AED" />
        <StatCard label="Avg score" value={`${avgScore}%`} sub="Term 1" color="#16A34A" />
        <StatCard label="Absent today" value={absent} sub="students" color="#D97706" />
        <StatCard label="Fees collected" value={`GH₵${totalRevenue.toLocaleString()}`} sub="Term 1" color="#16A34A" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid #E4E8EF`, fontWeight: 600 }}>Recent enrollments</div>
          <div style={{ padding: "8px 0" }}>
            {students.slice(0, 5).map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px" }}>
                <Avatar name={s.name} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{s.cls}</div>
                </div>
                {statusBadge(s.status)}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid #E4E8EF`, fontWeight: 600 }}>Announcements</div>
          <div style={{ padding: "8px 0" }}>
            {ANNOUNCEMENTS.map(a => (
              <div key={a.id} style={{ padding: "10px 18px", borderBottom: `1px solid #E4E8EF` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{a.title}</span>
                  <Badge label={a.type} type="accent" />
                </div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{a.body}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{a.date}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
