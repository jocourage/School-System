import { useState } from "react";
import { StatCard, Avatar, Btn, Card, Table, Modal, Input, Select, SectionHeader } from "./ui";

export default function Staff({ staff, setStaff, user }) {
  const [modal, setModal] = useState(false);
  const isTeacher = user?.role === "teacher";
  const statusOptions = ["Active", "On leave"];
  const visibleStaff = isTeacher ? staff.filter(member => member.cls === user.cls) : staff;

  function handleDelete(id) {
    if (isTeacher) return;
    if (window.confirm("Remove this staff member?")) setStaff(p => p.filter(s => s.id !== id));
  }

  function updateStaffStatus(id, status) {
    if (isTeacher) return;
    setStaff(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  }

  const cols = [
    { key:"name",   label:"Name",       render: r => <div style={{display:"flex",alignItems:"center",gap:10}}><Avatar name={r.name} /><div><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:11,color:"#9CA3AF"}}>{r.id}</div></div></div> },
    { key:"role",   label:"Subject",    render: r => r.role },
    { key:"dept",   label:"Department", render: r => r.dept },
    { key:"status", label:"Status",     render: r => isTeacher ? r.status : (
        <Select value={r.status} onChange={v => updateStaffStatus(r.id, v)}>
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
      ) },
    { key:"email",  label:"Email",      render: r => <span style={{color:"#3B6FE8"}}>{r.email}</span> },
    { key:"salary", label:"Salary",     render: r => `GH₵${r.salary.toLocaleString()}` },
    { key:"act",    label:"",           render: r => !isTeacher ? <Btn small variant="danger" onClick={() => handleDelete(r.id)}>Remove</Btn> : null },
  ];

  return (
    <div>
      <SectionHeader title={isTeacher ? `${user.cls} teachers` : "Staff & teachers"} action={!isTeacher && <Btn variant="primary" onClick={() => setModal(true)}>+ Add staff</Btn>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        <StatCard label="Total staff" value={visibleStaff.length} color="#3B6FE8" />
        <StatCard label="Active" value={visibleStaff.filter(s=>s.status==='Active').length} color="#16A34A" />
        <StatCard label="Monthly payroll" value={`GH₵${visibleStaff.reduce((a,s)=>a+s.salary,0).toLocaleString()}`} color="#7C3AED" />
      </div>
      <Card><Table cols={cols} rows={visibleStaff} /></Card>
      {!isTeacher && modal && (
        <Modal title="Add staff member" onClose={() => setModal(false)}>
          <AddStaffForm onSave={d => { setStaff(p => [...p, { ...d, id:`T${String(p.length+1).padStart(3,"0")}`, salary: parseInt(d.salary)||0 }]); setModal(false); }} onClose={() => setModal(false)} />
        </Modal>
      )}
    </div>
  );
}

function AddStaffForm({ onSave, onClose }) {
  const [f, setF] = useState({ name:"", role:"", dept:"Sciences", status:"Active", email:"", phone:"", salary:"" });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[ ["Full name","name"], ["Subject/role","role"], ["Email","email"], ["Phone","phone"], ["Salary (GH₵)","salary"] ].map(([label, key]) => (
          <div key={key}>
            <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>{label}</div>
            <Input value={f[key]} onChange={v => set(key, v)} placeholder={label} />
          </div>
        ))}
        <div>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Department</div>
          <Select value={f.dept} onChange={v => set("dept", v)}>{["Sciences","Languages","Humanities","Admin"].map(d=><option key={d}>{d}</option>)}</Select>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Status</div>
          <Select value={f.status} onChange={v => set("status", v)}>{["Active","On leave"].map(s=><option key={s}>{s}</option>)}</Select>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" onClick={() => f.name.trim() && onSave(f)}>Save</Btn>
      </div>
    </div>
  );
}
