import { useEffect, useMemo, useState } from "react";
import { STUDENTS } from "../data/constants";

const T = {
  bg: "#F7F9FC",
  surface: "#FFFFFF",
  surfaceAlt: "#F0F4F8",
  border: "#DDE3ED",
  borderStrong: "#B8C4D8",
  text: "#0D1B2A",
  textSec: "#4A5568",
  textMuted: "#8A9BB0",
  navy: "#0A2342",
  navySoft: "#EBF0F8",
  gold: "#C8941A",
  goldSoft: "#FDF3DC",
  goldBorder: "#E8C44A",
  green: "#157347",
  greenSoft: "#D8F3E3",
  red: "#B91C1C",
  redSoft: "#FDEAEA",
  amber: "#92500A",
  amberSoft: "#FEF0D6",
  slate: "#5A6A7E",
  slateSoft: "#EEF2F7",
  purple: "#6D28D9",
  purpleSoft: "#F3E8FF",
  r: "8px",
  rLg: "14px",
  rXl: "18px",
};

const TERMS = ["Term 1", "Term 2", "Term 3"];
const CLASSES = ["Nursery", "Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9"];
const FEE_BANDS = [
  { id: "nursery", label: "Nursery" },
  { id: "kindergarten", label: "Kindergarten" },
  { id: "grade-1-6", label: "Grade 1-6" },
  { id: "upper-primary", label: "Grade 7-9" },
];
const FEE_TYPES = ["Tuition", "Sports", "Library", "Lab", "Exam", "Uniform", "Boarding"];
const PAYMENT_METHODS = ["Mobile Money", "Cash", "Bank Transfer"];

function cedi(value) {
  return `GH₵ ${Number(value || 0).toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function feeStatus(fee) {
  const balance = fee.amount - fee.paid;
  if (balance <= 0) return "Paid";
  if (fee.paid > 0) return "Partial";
  return "Unpaid";
}

function statusStyle(value) {
  if (value === "Paid") return { fg: T.green, bg: T.greenSoft };
  if (value === "Partial") return { fg: T.amber, bg: T.amberSoft };
  return { fg: T.red, bg: T.redSoft };
}

const AVT = [
  ["#DBEAFE", "#1E40AF"], ["#D1FAE5", "#065F46"], ["#EDE9FE", "#5B21B6"],
  ["#FCE7F3", "#9D174D"], ["#FEF3C7", "#92400E"], ["#CFFAFE", "#164E63"],
  ["#FEE2E2", "#991B1B"], ["#F0FDF4", "#14532D"],
];

function Avatar({ name, size = 32 }) {
  const i = ((name || "").charCodeAt(0) || 0) + ((name || "").charCodeAt(1) || 0);
  const [bg, color] = AVT[i % AVT.length];
  const parts = (name || "?").trim().split(" ");
  const ini = (parts[0]?.[0] || "?") + (parts[1]?.[0] || "");

  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 700, flexShrink: 0 }}>
      {ini.toUpperCase()}
    </div>
  );
}

function Badge({ label, fg, bg }) {
  return (
    <span style={{ background: bg, color: fg, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap", display: "inline-block" }}>
      {label}
    </span>
  );
}

function Card({ children, style: sx = {}, p = 20 }) {
  return <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.rLg, padding: p, ...sx }}>{children}</div>;
}

function Select({ value, onChange, children, style: sx = {} }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ border: `1px solid ${T.border}`, borderRadius: T.r, padding: "8px 11px", fontSize: 13, background: T.surface, color: T.text, outline: "none", cursor: "pointer", ...sx }}>
      {children}
    </select>
  );
}

function Input({ value, onChange, placeholder, type = "text", style: sx = {} }) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ border: `1px solid ${T.border}`, borderRadius: T.r, padding: "8px 11px", fontSize: 13, background: T.surface, color: T.text, outline: "none", width: "100%", boxSizing: "border-box", ...sx }} />
  );
}

function Button({ children, onClick, variant = "ghost", small, disabled }) {
  const map = {
    ghost: { bg: "#EEF2F7", color: T.text },
    primary: { bg: T.navy, color: "#fff" },
    gold: { bg: T.gold, color: "#fff" },
    success: { bg: T.green, color: "#fff" },
    danger: { bg: T.red, color: "#fff" },
    outline: { bg: "transparent", color: T.navy, border: `1.5px solid ${T.navy}` },
  };
  const s = map[variant] || map.ghost;

  return (
    <button onClick={onClick} disabled={disabled} style={{ background: s.bg, color: s.color, border: s.border || "none", borderRadius: T.r, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.55 : 1, fontWeight: 700, fontSize: small ? 12 : 13, padding: small ? "5px 12px" : "9px 18px", display: "inline-flex", alignItems: "center", gap: 5, transition: "opacity .15s" }}>
      {children}
    </button>
  );
}

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: T.navy, color: "#fff", padding: "11px 22px", borderRadius: T.r, fontSize: 13, fontWeight: 700, zIndex: 999, pointerEvents: "none", boxShadow: "0 6px 24px rgba(10,35,66,.3)" }}>
      {msg}
    </div>
  );
}

function CollectionRing({ pct }) {
  const r = 44;
  const cx = 54;
  const cy = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <svg width={108} height={108} viewBox="0 0 108 108">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.surfaceAlt} strokeWidth={10} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={pct >= 80 ? T.green : pct >= 50 ? T.gold : T.red} strokeWidth={10} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: "stroke-dashoffset .6s ease" }} />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize={16} fontWeight={800} fill={pct >= 80 ? T.green : pct >= 50 ? T.gold : T.red}>{pct}%</text>
    </svg>
  );
}

function Overview({ fees, payments }) {
  const normalizedFees = fees.map((fee) => ({
    ...fee,
    type: fee.type || "Tuition",
    amount: Number(fee.amount || 0),
    paid: Number(fee.paid || 0),
    status: fee.status || feeStatus({ amount: Number(fee.amount || 0), paid: Number(fee.paid || 0) }),
  }));

  const totalBilled = normalizedFees.reduce((a, fee) => a + fee.amount, 0);
  const totalCollected = normalizedFees.reduce((a, fee) => a + fee.paid, 0);
  const totalOutstanding = totalBilled - totalCollected;
  const collectionPct = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;
  const paidCount = normalizedFees.filter((fee) => fee.status === "Paid").length;
  const partialCount = normalizedFees.filter((fee) => fee.status === "Partial").length;
  const unpaidCount = normalizedFees.filter((fee) => fee.status === "Unpaid").length;

  const byType = FEE_TYPES.map((type) => {
    const typeFees = normalizedFees.filter((fee) => fee.type === type);
    const billed = typeFees.reduce((a, fee) => a + fee.amount, 0);
    const collected = typeFees.reduce((a, fee) => a + fee.paid, 0);
    return { type, billed, collected };
  }).filter((item) => item.billed > 0);

  const recentPayments = [...payments].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  const methodTotals = PAYMENT_METHODS.map((method) => ({
    method,
    total: payments.filter((payment) => payment.method === method).reduce((a, payment) => a + payment.amount, 0),
  })).filter((item) => item.total > 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, marginBottom: 22 }}>
        <Card style={{ display: "flex", alignItems: "center", gap: 24, padding: "22px 28px" }}>
          <div style={{ textAlign: "center" }}>
            <CollectionRing pct={collectionPct} />
            <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, marginTop: 4 }}>Collection rate</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, marginBottom: 2 }}>Total billed</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.navy }}>{cedi(totalBilled)}</div>
            </div>
            <div style={{ height: 1, background: T.border, margin: "8px 0" }} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, marginBottom: 2 }}>Collected</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.green }}>{cedi(totalCollected)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, marginBottom: 2 }}>Outstanding</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.red }}>{cedi(totalOutstanding)}</div>
            </div>
          </div>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gridTemplateRows: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
          {[
            { label: "Fully paid", value: paidCount, fg: T.green, bg: T.greenSoft },
            { label: "Part paid", value: partialCount, fg: T.amber, bg: T.amberSoft },
            { label: "Unpaid", value: unpaidCount, fg: T.red, bg: T.redSoft },
            { label: "Fee records", value: fees.length, fg: T.navy, bg: T.navySoft },
            { label: "Payments made", value: payments.length, fg: T.green, bg: T.greenSoft },
            { label: "Avg per student", value: cedi(STUDENTS.length ? Math.round(totalCollected / STUDENTS.length) : 0), fg: T.gold, bg: T.goldSoft },
          ].map((item) => (
            <div key={item.label} style={{ background: item.bg, border: `1px solid ${T.border}`, borderRadius: T.r, padding: "14px 16px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: item.fg, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: item.fg }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Revenue by fee type</div>
          {byType.length === 0 ? (
            <div style={{ padding: "18px 12px", textAlign: "center", color: T.textMuted, fontSize: 13 }}>
              No fee records yet. Add a fee record to see revenue by type.
            </div>
          ) : byType.map((item) => {
            const pct = item.billed > 0 ? Math.round((item.collected / item.billed) * 100) : 0;
            return (
              <div key={item.type} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{item.type}</span>
                  <span style={{ fontSize: 12, color: T.textSec }}>{cedi(item.collected)} / {cedi(item.billed)}</span>
                </div>
                <div style={{ height: 7, background: T.surfaceAlt, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: pct >= 80 ? T.green : pct >= 50 ? T.gold : T.red, borderRadius: 4, transition: "width .5s" }} />
                </div>
              </div>
            );
          })}
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card p={18}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Payment methods</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {methodTotals.map((method) => (
                <div key={method.method} style={{ flex: 1, minWidth: 100, background: T.navySoft, borderRadius: T.r, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, color: T.navy, fontWeight: 700, marginBottom: 3 }}>{method.method}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: T.navy }}>{cedi(method.total)}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card p={0} style={{ flex: 1 }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, fontWeight: 700, fontSize: 14 }}>Recent payments</div>
            {recentPayments.map((payment, index) => {
              const student = STUDENTS.find((item) => item.id === payment.studentId) || {};
              return (
                <div key={payment.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: index < recentPayments.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <Avatar name={student.name || "?"} size={30} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{student.name}</div>
                    <div style={{ fontSize: 11, color: T.textMuted }}>{payment.method} · {payment.date}</div>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: 14, color: T.green }}>+{cedi(payment.amount)}</span>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}

function FeeRecords({ fees, setFees, payments, setPayments, toast, canManageFees }) {
  const [filterTerm, setFilterTerm] = useState("");
  const [filterCls, setFilterCls] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [payModal, setPayModal] = useState(null);

  const enriched = useMemo(() => fees.map((fee) => {
    const student = STUDENTS.find((item) => item.id === fee.studentId) || {};
    return { ...fee, studentName: student.name || fee.studentId, cls: student.cls || "", balance: fee.amount - fee.paid };
  }), [fees]);

  const filtered = useMemo(() => enriched.filter((fee) => (
    (!filterTerm || fee.term === filterTerm) &&
    (!filterCls || fee.cls === filterCls) &&
    (!filterStatus || fee.status === filterStatus) &&
    (!filterType || fee.type === filterType) &&
    (!search || fee.studentName.toLowerCase().includes(search.toLowerCase()) || fee.studentId.toLowerCase().includes(search.toLowerCase()))
  )), [enriched, filterTerm, filterCls, filterStatus, filterType, search]);

  const totalBilled = filtered.reduce((a, fee) => a + fee.amount, 0);
  const totalPaid = filtered.reduce((a, fee) => a + fee.paid, 0);

  function deleteFee(id) {
    setFees((prev) => prev.filter((fee) => fee.id !== id));
    toast("Fee record removed");
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Billed", value: cedi(totalBilled), fg: T.navy, bg: T.navySoft },
          { label: "Collected", value: cedi(totalPaid), fg: T.green, bg: T.greenSoft },
          { label: "Outstanding", value: cedi(totalBilled - totalPaid), fg: T.red, bg: T.redSoft },
          { label: "Records", value: filtered.length, fg: T.slate, bg: T.slateSoft },
        ].map((item) => (
          <div key={item.label} style={{ background: item.bg, border: `1px solid ${T.border}`, borderRadius: T.r, padding: "12px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: item.fg, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 5 }}>{item.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: item.fg }}>{item.value}</div>
          </div>
        ))}
      </div>

      <Card p={0}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search student…" style={{ border: `1px solid ${T.border}`, borderRadius: T.r, padding: "7px 11px", fontSize: 13, outline: "none", background: T.surface, color: T.text, maxWidth: 200 }} />
          <Select value={filterTerm} onChange={setFilterTerm} style={{ minWidth: 100 }}>
            <option value="">All terms</option>
            {TERMS.map((term) => <option key={term}>{term}</option>)}
          </Select>
          <Select value={filterCls} onChange={setFilterCls} style={{ minWidth: 110 }}>
            <option value="">All classes</option>
            {CLASSES.map((cls) => <option key={cls}>{cls}</option>)}
          </Select>
          <Select value={filterType} onChange={setFilterType} style={{ minWidth: 110 }}>
            <option value="">All types</option>
            {FEE_TYPES.map((type) => <option key={type}>{type}</option>)}
          </Select>
          <Select value={filterStatus} onChange={setFilterStatus} style={{ minWidth: 110 }}>
            <option value="">All statuses</option>
            {["Paid", "Partial", "Unpaid"].map((status) => <option key={status}>{status}</option>)}
          </Select>
          {canManageFees && (
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <Button variant="primary" onClick={() => setModal("add")}>+ Add fee record</Button>
            </div>
          )}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: T.bg }}>
                {[
                  "Student", "Class", "Type", "Term", "Amount", "Paid", "Balance", "Status", "Due", ""
                ].map((header) => (
                  <th key={header} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: T.textMuted, borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} style={{ padding: 48, textAlign: "center", color: T.textMuted }}>No fee records match these filters.</td></tr>
              ) : filtered.map((fee) => {
                const color = statusStyle(fee.status);
                return (
                  <tr key={fee.id} onMouseEnter={(event) => { event.currentTarget.style.background = T.bg; }} onMouseLeave={(event) => { event.currentTarget.style.background = "transparent"; }} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar name={fee.studentName} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{fee.studentName}</div>
                          <div style={{ fontSize: 11, color: T.textMuted }}>{fee.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "11px 14px", color: T.textSec }}>{fee.cls}</td>
                    <td style={{ padding: "11px 14px", fontWeight: 500 }}>{fee.type}</td>
                    <td style={{ padding: "11px 14px", color: T.textSec }}>{fee.term}</td>
                    <td style={{ padding: "11px 14px", fontWeight: 600 }}>{cedi(fee.amount)}</td>
                    <td style={{ padding: "11px 14px", color: T.green, fontWeight: 700 }}>{cedi(fee.paid)}</td>
                    <td style={{ padding: "11px 14px", color: fee.balance > 0 ? T.red : T.green, fontWeight: 700 }}>{fee.balance > 0 ? cedi(fee.balance) : "—"}</td>
                    <td style={{ padding: "11px 14px" }}><Badge label={fee.status} fg={color.fg} bg={color.bg} /></td>
                    <td style={{ padding: "11px 14px", color: T.textMuted, fontSize: 12 }}>{fee.dueDate || "—"}</td>
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {canManageFees && fee.status !== "Paid" && (<Button small variant="gold" onClick={() => setPayModal(fee)}>Pay</Button>)}
                        <Button small onClick={() => setModal(fee)}>View</Button>
                        {canManageFees && (<Button small variant="danger" onClick={() => deleteFee(fee.id)}>×</Button>)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {modal === "add" && (
        <AddFeeModal onClose={() => setModal(null)} onSave={(nextFee) => {
          const id = `F${String(Date.now()).slice(-5)}`;
          const balance = nextFee.amount - (nextFee.paid || 0);
          const status = balance <= 0 ? "Paid" : nextFee.paid > 0 ? "Partial" : "Unpaid";
          setFees((prev) => [...prev, { ...nextFee, id, status, lastPayment: nextFee.paid > 0 ? new Date().toISOString().split("T")[0] : null }]);
          toast("Fee record added");
          setModal(null);
        }} />
      )}

      {modal && modal !== "add" && (
        <FeeDetailModal fee={modal} payments={payments.filter((payment) => payment.feeId === modal.id)} onClose={() => setModal(null)} />
      )}

      {payModal && (
        <RecordPaymentModal fee={payModal} onClose={() => setPayModal(null)} onSave={(amount, method, ref, note) => {
          const newPaid = Math.min(payModal.amount, payModal.paid + amount);
          const newStatus = newPaid >= payModal.amount ? "Paid" : "Partial";
          const today = new Date().toISOString().split("T")[0];

          setFees((prev) => prev.map((fee) => fee.id === payModal.id ? { ...fee, paid: newPaid, status: newStatus, lastPayment: today } : fee));
          setPayments((prev) => [...prev, { id: `P${String(Date.now()).slice(-5)}`, feeId: payModal.id, studentId: payModal.studentId, amount, date: today, method, ref, note }]);
          toast(`Payment of ${cedi(amount)} recorded`);
          setPayModal(null);
        }} />
      )}
    </div>
  );
}

function AddFeeModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    studentId: STUDENTS[0].id,
    type: "Tuition",
    term: "Term 1",
    amount: "1200",
    paid: "0",
    dueDate: "",
    note: "",
  });

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const valid = form.studentId && form.amount && !Number.isNaN(parseInt(form.amount, 10));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,35,66,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 16 }}>
      <div style={{ background: T.surface, borderRadius: T.rXl, width: 520, maxWidth: "100%", maxHeight: "92vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 64px rgba(10,35,66,.25)" }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: T.navy }}>Add fee record</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: T.textMuted, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 22, overflowY: "auto", flex: 1 }}>
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.textSec }}>Student</label>
              <Select value={form.studentId} onChange={(value) => set("studentId", value)} style={{ minWidth: 100 }}>
                {STUDENTS.map((student) => <option key={student.id} value={student.id}>{student.name} — {student.cls}</option>)}
              </Select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: T.textSec }}>Fee type</label>
                <Select value={form.type} onChange={(value) => { set("type", value); set("amount", String(value === "Tuition" ? 1200 : value === "Sports" ? 150 : value === "Library" ? 80 : value === "Lab" ? 200 : value === "Exam" ? 120 : value === "Uniform" ? 250 : 1800)); }}>
                  {FEE_TYPES.map((type) => <option key={type}>{type}</option>)}
                </Select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: T.textSec }}>Term</label>
                <Select value={form.term} onChange={(value) => set("term", value)}>
                  {TERMS.map((term) => <option key={term}>{term}</option>)}
                </Select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: T.textSec }}>Amount (GH₵)</label>
                <Input type="number" value={form.amount} onChange={(value) => set("amount", value)} placeholder="1200" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: T.textSec }}>Already paid (GH₵)</label>
                <Input type="number" value={form.paid} onChange={(value) => set("paid", value)} placeholder="0" />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.textSec }}>Due date</label>
              <Input type="date" value={form.dueDate} onChange={(value) => set("dueDate", value)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.textSec }}>Note (optional)</label>
              <Input value={form.note} onChange={(value) => set("note", value)} placeholder="e.g. scholarship deduction applied" />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button variant="primary" disabled={!valid} onClick={() => valid && onSave({ ...form, amount: Number(form.amount), paid: Number(form.paid) || 0 })}>Save fee record</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeeDetailModal({ fee, payments, onClose }) {
  const student = STUDENTS.find((item) => item.id === fee.studentId) || {};
  const style = statusStyle(fee.status);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,35,66,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 16 }}>
      <div style={{ background: T.surface, borderRadius: T.rXl, width: 520, maxWidth: "100%", maxHeight: "92vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 64px rgba(10,35,66,.25)" }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: T.navy }}>Fee details</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: T.textMuted, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 22, overflowY: "auto", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <Avatar name={student.name || "?"} size={46} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 17 }}>{student.name}</div>
              <div style={{ fontSize: 12, color: T.textMuted }}>{fee.studentId} · {student.cls || ""} · {fee.term}</div>
            </div>
            <div style={{ marginLeft: "auto" }}><Badge label={fee.status} fg={style.fg} bg={style.bg} /></div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: T.textSec }}>Payment progress</div>
            <div style={{ flex: 1, height: 8, background: T.surfaceAlt, borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${Math.min(100, (fee.paid / fee.amount) * 100 || 0)}%`, height: "100%", background: fee.status === "Paid" ? T.green : fee.status === "Partial" ? T.gold : T.red, borderRadius: 999 }} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 12, color: T.textSec }}>{Math.round((fee.paid / fee.amount) * 100 || 0)}%</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              ["Fee type", fee.type],
              ["Total due", cedi(fee.amount)],
              ["Paid", cedi(fee.paid)],
              ["Balance", cedi(fee.amount - fee.paid)],
              ["Due date", fee.dueDate || "—"],
              ["Last payment", fee.lastPayment || "—"],
            ].map(([label, value]) => (
              <div key={label} style={{ background: T.surfaceAlt, borderRadius: T.r, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 2 }}>{label}</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{value}</div>
              </div>
            ))}
          </div>

          {payments.length > 0 && (
            <>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Payment history</div>
              {payments.map((payment) => (
                <div key={payment.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${T.border}` }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{payment.method}</div>
                    <div style={{ fontSize: 11, color: T.textMuted }}>Ref: {payment.ref || "—"} · {payment.date}</div>
                  </div>
                  <span style={{ fontWeight: 800, color: T.green }}>{cedi(payment.amount)}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function RecordPaymentModal({ fee, onClose, onSave }) {
  const student = STUDENTS.find((item) => item.id === fee.studentId) || {};
  const balance = fee.amount - fee.paid;
  const [amount, setAmount] = useState(String(balance));
  const [method, setMethod] = useState("Mobile Money");
  const [ref, setRef] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  function handleSave() {
    const value = Number(amount);
    if (Number.isNaN(value) || value <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (value > balance) {
      setError(`Max payable is ${cedi(balance)}.`);
      return;
    }
    onSave(value, method, ref, note);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,35,66,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 16 }}>
      <div style={{ background: T.surface, borderRadius: T.rXl, width: 440, maxWidth: "100%", maxHeight: "92vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 64px rgba(10,35,66,.25)" }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: T.navy }}>Record payment</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: T.textMuted, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 22, overflowY: "auto", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <Avatar name={student.name || "?"} size={38} />
            <div>
              <div style={{ fontWeight: 700 }}>{student.name}</div>
              <div style={{ fontSize: 12, color: T.textMuted }}>{fee.type} · {fee.term}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 8, background: T.surfaceAlt, borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${Math.min(100, (fee.paid / fee.amount) * 100 || 0)}%`, height: "100%", background: fee.status === "Paid" ? T.green : fee.status === "Partial" ? T.gold : T.red, borderRadius: 999 }} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 12, color: T.textSec }}>{cedi(fee.paid)} / {cedi(fee.amount)}</div>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.textSec }}>Amount to pay (balance: {cedi(balance)})</label>
              <Input type="number" value={amount} onChange={setAmount} placeholder={String(balance)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.textSec }}>Payment method</label>
              <Select value={method} onChange={setMethod}>
                {PAYMENT_METHODS.map((item) => <option key={item}>{item}</option>)}
              </Select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.textSec }}>Reference / receipt no.</label>
              <Input value={ref} onChange={setRef} placeholder="e.g. MoMo-7821 or CHQ-001" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.textSec }}>Note (optional)</label>
              <Input value={note} onChange={setNote} placeholder="Any additional notes" />
            </div>
            {error && <div style={{ fontSize: 12, color: T.red, fontWeight: 600 }}>{error}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button variant="gold" onClick={handleSave}>Record payment</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Payments({ payments, fees }) {
  const [filterMethod, setFilterMethod] = useState("");
  const [search, setSearch] = useState("");

  const enriched = useMemo(() => payments.map((payment) => {
    const student = STUDENTS.find((item) => item.id === payment.studentId) || {};
    const fee = fees.find((item) => item.id === payment.feeId) || {};
    return { ...payment, studentName: student.name || payment.studentId, cls: student.cls || "", feeType: fee.type || "" };
  }), [payments, fees]);

  const filtered = useMemo(() => enriched.filter((payment) => (
    (!filterMethod || payment.method === filterMethod) &&
    (!search || payment.studentName.toLowerCase().includes(search.toLowerCase()) || (payment.ref || "").toLowerCase().includes(search.toLowerCase()))
  )), [enriched, filterMethod, search]);

  const total = filtered.reduce((a, payment) => a + payment.amount, 0);
  const methodBreakdown = PAYMENT_METHODS.map((method) => ({
    method,
    total: filtered.filter((payment) => payment.method === method).reduce((a, payment) => a + payment.amount, 0),
    count: filtered.filter((payment) => payment.method === method).length,
  })).filter((item) => item.count > 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>
        <div style={{ background: T.navySoft, border: `1px solid ${T.border}`, borderRadius: T.r, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.navy, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 5 }}>Total collected</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.navy }}>{cedi(total)}</div>
        </div>
        {methodBreakdown.map((item) => (
          <div key={item.method} style={{ background: T.greenSoft, border: `1px solid ${T.border}`, borderRadius: T.r, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.green, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 5 }}>{item.method}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.green }}>{cedi(item.total)}</div>
            <div style={{ fontSize: 11, color: T.textMuted }}>{item.count} payments</div>
          </div>
        ))}
      </div>

      <Card p={0}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search student or ref…" style={{ border: `1px solid ${T.border}`, borderRadius: T.r, padding: "7px 11px", fontSize: 13, outline: "none", background: T.surface, color: T.text, maxWidth: 220 }} />
          <Select value={filterMethod} onChange={setFilterMethod} style={{ minWidth: 140 }}>
            <option value="">All methods</option>
            {PAYMENT_METHODS.map((method) => <option key={method}>{method}</option>)}
          </Select>
          <span style={{ fontSize: 12, color: T.textMuted, marginLeft: "auto" }}>{filtered.length} payment{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: T.bg }}>
                {[
                  "Student", "Class", "Fee type", "Amount", "Method", "Reference", "Date"
                ].map((header) => (
                  <th key={header} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: T.textMuted, borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: T.textMuted }}>No payments found.</td></tr>
              ) : filtered.map((payment) => (
                <tr key={payment.id} onMouseEnter={(event) => { event.currentTarget.style.background = T.bg; }} onMouseLeave={(event) => { event.currentTarget.style.background = "transparent"; }} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={payment.studentName} size={30} />
                      <span style={{ fontWeight: 600 }}>{payment.studentName}</span>
                    </div>
                  </td>
                  <td style={{ padding: "11px 14px", color: T.textSec }}>{payment.cls}</td>
                  <td style={{ padding: "11px 14px" }}>{payment.feeType}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 800, color: T.green }}>{cedi(payment.amount)}</td>
                  <td style={{ padding: "11px 14px" }}><Badge label={payment.method} fg={payment.method === "Mobile Money" ? T.purple : payment.method === "Cash" ? T.green : T.navy} bg={payment.method === "Mobile Money" ? T.purpleSoft : payment.method === "Cash" ? T.greenSoft : T.navySoft} /></td>
                  <td style={{ padding: "11px 14px", fontFamily: "monospace", fontSize: 12, color: T.textMuted }}>{payment.ref || "—"}</td>
                  <td style={{ padding: "11px 14px", color: T.textSec }}>{payment.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function FeeStructure({ toast, canManageFees }) {
  const [structures, setStructures] = useState({
    nursery: { Tuition: 900, Sports: 100, Library: 60, Lab: 120, Exam: 80, Uniform: 200, Boarding: 1500 },
    kindergarten: { Tuition: 1050, Sports: 120, Library: 70, Lab: 150, Exam: 100, Uniform: 220, Boarding: 1650 },
    "grade-1-6": { Tuition: 1200, Sports: 150, Library: 80, Lab: 200, Exam: 120, Uniform: 250, Boarding: 1800 },
    "upper-primary": { Tuition: 1500, Sports: 180, Library: 100, Lab: 250, Exam: 150, Uniform: 250, Boarding: 2000 },
  });
  const [band, setBand] = useState(FEE_BANDS[0].id);
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [term, setTerm] = useState("Term 1");
  const [termTotal, setTermTotal] = useState(0);
  const [boardingEnabled, setBoardingEnabled] = useState({
    nursery: true,
    kindergarten: true,
    "grade-1-6": true,
    "upper-primary": true,
  });
  const structure = structures[band];
  const activeFeeTypes = FEE_TYPES.filter((type) => type !== "Boarding" || boardingEnabled[band]);

  const total = activeFeeTypes.reduce((sum, type) => sum + Number(structure[type] || 0), 0);

  useEffect(() => {
    setTermTotal(total);
  }, [total]);

  function save(type) {
    const value = Number(editValue);
    if (!Number.isNaN(value) && value >= 0) {
      setStructures((prev) => ({ ...prev, [band]: { ...prev[band], [type]: value } }));
      toast(`${type} fee updated to ${cedi(value)}`);
    }
    setEditing(null);
  }

  function applyTermTotal(nextTotal) {
    const value = Number(nextTotal);
    if (!Number.isFinite(value) || value <= 0) return;

    const currentTotal = activeFeeTypes.reduce((sum, type) => sum + Number(structure[type] || 0), 0) || 1;
    const ratio = value / currentTotal;

    setStructures((prev) => ({
      ...prev,
      [band]: Object.fromEntries(
        Object.entries(prev[band]).map(([type, amount]) => [type, activeFeeTypes.includes(type) ? Math.round(Number(amount) * ratio) : amount])
      ),
    }));

    toast(`${FEE_BANDS.find((item) => item.id === band).label} fee total for ${term} set to ${cedi(value)}`);
  }

  const typeColors = {
    Tuition: [T.navy, T.navySoft],
    Sports: [T.green, T.greenSoft],
    Library: [T.gold, T.goldSoft],
    Lab: [T.purple, T.purpleSoft],
    Exam: [T.red, T.redSoft],
    Uniform: [T.amber, T.amberSoft],
    Boarding: ["#0891B2", "#CFFAFE"],
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 2 }}>Showing structure for</div>
          <div style={{ display: "flex", gap: 8 }}>
            {TERMS.map((item) => (
              <button key={item} onClick={() => setTerm(item)} style={{ border: `1px solid ${term === item ? T.navy : T.border}`, background: term === item ? T.navy : "#fff", color: term === item ? "#fff" : T.textSec, borderRadius: T.r, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 2 }}>Total fees per student</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: T.navy }}>{cedi(total)}</div>
        </div>
      </div>

      <Card style={{ marginBottom: 20 }} p={16}>
        <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".05em" }}>Class fee band</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {FEE_BANDS.map((item) => (
            <button key={item.id} onClick={() => setBand(item.id)} style={{ border: `1px solid ${band === item.id ? T.navy : T.border}`, background: band === item.id ? T.navy : T.surface, color: band === item.id ? "#fff" : T.textSec, borderRadius: T.r, padding: "9px 14px", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
              {item.label}
            </button>
          ))}
        </div>
      </Card>

      {canManageFees && (
        <Card style={{ background: T.navySoft, border: `1px solid ${T.border}`, marginBottom: 20 }} p={16}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 3, textTransform: "uppercase", letterSpacing: ".05em" }}>Set total for {term}</div>
              <div style={{ fontSize: 13, color: T.textSec }}>This updates the {FEE_BANDS.find((item) => item.id === band).label} bundle proportionally.</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="number"
                min="0"
                value={termTotal}
                onChange={(e) => setTermTotal(e.target.value)}
                style={{ border: `1px solid ${T.border}`, borderRadius: T.r, padding: "8px 10px", fontSize: 14, fontWeight: 700, width: 150, color: T.navy, outline: "none" }}
              />
              <Button small variant="primary" onClick={() => applyTermTotal(termTotal)}>Set total</Button>
            </div>
          </div>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, marginBottom: 20 }}>
        {FEE_TYPES.map((type) => {
          const amount = structure[type] || 0;
          const isBoarding = type === "Boarding";
          const isEnabled = !isBoarding || boardingEnabled[band];
          const pct = isEnabled && total > 0 ? Math.round((amount / total) * 100) : 0;
          const [fg, bg] = typeColors[type] || [T.slate, T.slateSoft];

          return (
            <Card key={type} p={18}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{type}</div>
                  <div style={{ fontSize: 11, color: T.textMuted }}>{isEnabled ? `${pct}% of total` : "Excluded from total"}</div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: fg }}>
                  {type === "Tuition" ? "🎓" : type === "Sports" ? "⚽" : type === "Library" ? "📚" : type === "Lab" ? "🔬" : type === "Exam" ? "📝" : type === "Uniform" ? "👔" : "🏠"}
                </div>
              </div>

              {isBoarding && (
                <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 12, fontWeight: 700, color: T.textSec, cursor: "pointer" }}>
                  <input type="checkbox" checked={boardingEnabled[band]} onChange={(event) => setBoardingEnabled((prev) => ({ ...prev, [band]: event.target.checked }))} />
                  Include boarding in total
                </label>
              )}

              {canManageFees && isEnabled && editing === type ? (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && save(type)} autoFocus style={{ flex: 1, border: `1.5px solid ${fg}`, borderRadius: T.r, padding: "7px 10px", fontSize: 15, fontWeight: 700, outline: "none" }} />
                  <Button small variant="primary" onClick={() => save(type)}>✓</Button>
                  <Button small onClick={() => setEditing(null)}>×</Button>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: isEnabled ? fg : T.textMuted, cursor: canManageFees && isEnabled ? "pointer" : "default", borderBottom: canManageFees && isEnabled ? `2px dashed ${fg}` : "none" }} title={canManageFees && isEnabled ? "Click to edit" : "View only"} onClick={() => { if (canManageFees && isEnabled) { setEditing(type); setEditValue(String(amount)); } }}>{cedi(amount)}</span>
                  <div style={{ height: 32, width: 60 }}>
                    <svg viewBox="0 0 60 32" width="60" height="32">
                      <rect x={0} y={32 - Math.round(pct * 0.32)} width={60} height={Math.round(pct * 0.32)} rx={4} fill={isEnabled ? bg : T.slateSoft} />
                      <rect x={2} y={32 - Math.round(pct * 0.3)} width={56} height={Math.round(pct * 0.3)} rx={3} fill={isEnabled ? fg : T.textMuted} opacity={0.7} />
                    </svg>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 10, height: 5, background: T.border, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: isEnabled ? fg : T.textMuted, borderRadius: 3 }} />
              </div>
            </Card>
          );
        })}
      </div>

      <Card style={{ background: T.goldSoft, border: `1px solid ${T.goldBorder}` }} p={18}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: T.navy }}>Full fees summary — {term}</div>
            <div style={{ fontSize: 13, color: T.textSec, marginTop: 4 }}>Click any fee amount above to update it. Changes apply to new bills only.</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: T.amber, fontWeight: 600 }}>Total per student</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: T.navy }}>{cedi(total)}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "records", label: "Fee records" },
  { id: "payments", label: "Payments" },
  { id: "structure", label: "Fee structure" },
];

export default function Fees({ fees: initialFees = [], setFees: setFeesState = () => {}, user }) {
  const [tab, setTab] = useState("overview");
  const [fees, setFees] = useState(initialFees.length ? initialFees : [
    { id: "F001", studentId: "S001", type: "Tuition", term: "Term 1", amount: 1200, paid: 1200, dueDate: "2024-01-31", lastPayment: "2024-01-10", status: "Paid", note: "" },
    { id: "F002", studentId: "S001", type: "Sports", term: "Term 1", amount: 150, paid: 150, dueDate: "2024-01-31", lastPayment: "2024-01-10", status: "Paid", note: "" },
    { id: "F003", studentId: "S002", type: "Tuition", term: "Term 1", amount: 1200, paid: 600, dueDate: "2024-01-31", lastPayment: "2024-01-14", status: "Partial", note: "Balance by Feb 10" },
    { id: "F004", studentId: "S002", type: "Exam", term: "Term 1", amount: 120, paid: 0, dueDate: "2024-01-31", lastPayment: null, status: "Unpaid", note: "" },
    { id: "F005", studentId: "S003", type: "Tuition", term: "Term 1", amount: 1200, paid: 0, dueDate: "2024-01-31", lastPayment: null, status: "Unpaid", note: "Contact parent" },
    { id: "F006", studentId: "S004", type: "Tuition", term: "Term 1", amount: 1200, paid: 1200, dueDate: "2024-01-31", lastPayment: "2024-01-08", status: "Paid", note: "" },
  ]);
  const [payments, setPayments] = useState([
    { id: "P001", feeId: "F001", studentId: "S001", amount: 1200, date: "2024-01-10", method: "Mobile Money", ref: "MoMo-441A", note: "" },
    { id: "P002", feeId: "F002", studentId: "S001", amount: 150, date: "2024-01-10", method: "Mobile Money", ref: "MoMo-441B", note: "" },
    { id: "P003", feeId: "F003", studentId: "S002", amount: 600, date: "2024-01-14", method: "Bank Transfer", ref: "GT-8821", note: "Part payment" },
    { id: "P004", feeId: "F006", studentId: "S004", amount: 1200, date: "2024-01-08", method: "Cash", ref: "CSH-001", note: "" },
  ]);
  const [toastMsg, setToastMsg] = useState("");

  const isFinanceRole = user?.role === "accountant";
  const isAdminRole = user?.role === "admin";
  const canManageFees = user?.role === "admin" || isFinanceRole;

  function toast(message) {
    setToastMsg(message);
    setTimeout(() => setToastMsg(""), 2600);
  }

  const setFeesWithSync = (updater) => {
    setFees((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      setFeesState(next);
      return next;
    });
  };

  if (user?.role === "student") {
    const studentFees = fees.filter((fee) => fee.studentId === user.id);
    const totalCollected = studentFees.reduce((a, fee) => a + fee.paid, 0);
    const totalOutstanding = studentFees.reduce((a, fee) => a + (fee.amount - fee.paid), 0);

    return (
      <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", color: T.text }}>
        <div style={{ padding: "24px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginBottom: 20 }}>
            <Card>
              <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".05em" }}>Total fee</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: T.navy }}>{cedi(studentFees.reduce((a, fee) => a + fee.amount, 0))}</div>
            </Card>
            <Card>
              <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".05em" }}>Paid</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: T.green }}>{cedi(totalCollected)}</div>
            </Card>
            <Card>
              <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".05em" }}>Balance due</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: totalOutstanding > 0 ? T.red : T.green }}>{cedi(totalOutstanding)}</div>
            </Card>
          </div>

          <Card p={0}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>My School Fees</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: T.bg }}>
                    {['Term', 'Type', 'Amount', 'Paid', 'Balance', 'Status'].map((header) => (
                      <th key={header} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: T.textMuted, borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {studentFees.length === 0 ? (
                    <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: T.textMuted }}>No fee records found.</td></tr>
                  ) : studentFees.map((fee) => {
                    const status = feeStatus(fee);
                    const style = statusStyle(status);
                    return (
                      <tr key={fee.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                        <td style={{ padding: "11px 14px" }}>{fee.term}</td>
                        <td style={{ padding: "11px 14px" }}>{fee.type}</td>
                        <td style={{ padding: "11px 14px" }}>{cedi(fee.amount)}</td>
                        <td style={{ padding: "11px 14px", color: T.green, fontWeight: 700 }}>{cedi(fee.paid)}</td>
                        <td style={{ padding: "11px 14px", color: fee.amount - fee.paid > 0 ? T.red : T.green, fontWeight: 700 }}>{cedi(Math.max(0, fee.amount - fee.paid))}</td>
                        <td style={{ padding: "11px 14px" }}><Badge label={status} fg={style.fg} bg={style.bg} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", color: T.text }}>
      <div style={{ background: T.navy, padding: "22px 28px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.5)", letterSpacing: ".06em", marginBottom: 4 }}>Accra Prestige School</div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.1 }}>{isFinanceRole ? "Fees & Finance" : "Fees & finance"}</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.55)", margin: "6px 0 0" }}>Manage fee records, record payments, and track collection across all terms.</p>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", fontWeight: 600 }}>Collected</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.goldSoft }}>{cedi(fees.reduce((a, fee) => a + fee.paid, 0))}</div>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,.15)" }} />
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", fontWeight: 600 }}>Outstanding</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#FCA5A5" }}>{cedi(fees.reduce((a, fee) => a + (fee.amount - fee.paid), 0))}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 2 }}>
          {TABS.map((item) => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{ padding: "10px 20px", border: "none", borderRadius: "8px 8px 0 0", cursor: "pointer", fontWeight: 700, fontSize: 13, background: tab === item.id ? T.bg : "rgba(255,255,255,.08)", color: tab === item.id ? T.navy : "rgba(255,255,255,.65)", transition: "background .12s" }}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 28px" }}>
        {tab === "overview" && <Overview fees={fees} payments={payments} />}
        {tab === "records" && <FeeRecords fees={fees} setFees={setFeesWithSync} payments={payments} setPayments={setPayments} toast={toast} canManageFees={canManageFees} />}
        {tab === "payments" && <Payments payments={payments} fees={fees} />}
        {tab === "structure" && <FeeStructure toast={toast} canManageFees={canManageFees} />}
      </div>

      <Toast msg={toastMsg} />
    </div>
  );
}
