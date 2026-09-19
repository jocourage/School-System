import { T } from "../data/constants";

export function getAvatar(name) {
  const i = name.charCodeAt(0) % 6;
  const parts = name.trim().split(" ");
  const ini = (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  const palette = [
    ["#DBEAFE","#1E40AF"],["#D1FAE5","#065F46"],["#EDE9FE","#5B21B6"],
    ["#FCE7F3","#9D174D"],["#FEF3C7","#92400E"],["#CFFAFE","#164E63"],
  ];
  return { bg: palette[i][0], color: palette[i][1], ini };
}

export function Avatar({ name, size = 32 }) {
  const { bg, color, ini } = getAvatar(name);
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 600, flexShrink: 0 }}>
      {ini}
    </div>
  );
}

export function Badge({ label, type = "neutral" }) {
  const map = {
    success: [T.successBg, T.success],
    danger:  [T.dangerBg, T.danger],
    warning: [T.warningBg, T.warning],
    accent:  [T.accentLight, T.accent],
    neutral: ["#F3F4F6", "#374151"],
  };
  const [bg, color] = map[type] || map.neutral;
  return <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20 }}>{label}</span>;
}

export function statusBadge(s) {
  if (s === "Active" || s === "Paid" || s === "Present") return <Badge label={s} type="success" />;
  if (s === "Suspended" || s === "Unpaid" || s === "Absent") return <Badge label={s} type="danger" />;
  if (s === "Partial" || s === "On leave" || s === "Inactive") return <Badge label={s} type="warning" />;
  return <Badge label={s} />;
}

export function StatCard({ label, value, sub, color = T.accent }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: "16px 20px" }}>
      <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: T.textSecondary, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export function Table({ cols, rows, emptyMsg = "No records found." }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${T.border}` }}>
            {cols.map(c => (
              <th key={c.key} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: ".05em", whiteSpace: "nowrap" }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={cols.length} style={{ textAlign: "center", padding: 32, color: T.textMuted }}>{emptyMsg}</td></tr>
          ) : rows.map((row, ri) => (
            <tr key={ri} style={{ borderBottom: `1px solid ${T.border}` }}
                onMouseEnter={e => e.currentTarget.style.background = T.bg}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {cols.map(c => (
                <td key={c.key} style={{ padding: "11px 14px", color: T.textPrimary, whiteSpace: "nowrap" }}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Input({ placeholder, value, onChange, type = "text", style: sx }) {
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      style={{ border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "8px 12px", fontSize: 13, background: T.bg, color: T.textPrimary, outline: "none", width: "100%", ...sx }} />
  );
}

export function Select({ value, onChange, children, style: sx }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "8px 12px", fontSize: 13, background: T.bg, color: T.textPrimary, outline: "none", cursor: "pointer", ...sx }}>
      {children}
    </select>
  );
}

export function Btn({ children, onClick, variant = "default", small, style: sx }) {
  const base = { border: "none", borderRadius: T.radius, cursor: "pointer", fontWeight: 600, fontSize: small ? 12 : 13, padding: small ? "5px 12px" : "9px 18px", display: "inline-flex", alignItems: "center", gap: 6, transition: "opacity .15s" };
  const vars = {
    default: { background: "#E9EEF6", color: T.textPrimary },
    primary: { background: T.accent, color: "#fff" },
    danger:  { background: T.danger, color: "#fff" },
    success: { background: T.success, color: "#fff" },
  };
  return <button onClick={onClick} style={{ ...base, ...vars[variant], ...sx }}>{children}</button>;
}

export function Modal({ title, onClose, children, width = 480 }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
      <div style={{ background: T.surface, borderRadius: T.radiusLg, width, maxWidth: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: T.textSecondary, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}

export function SectionHeader({ title, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: T.textPrimary }}>{title}</h2>
      {action}
    </div>
  );
}

export function Card({ children, style: sx }) {
  return <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, ...sx }}>{children}</div>;
}
