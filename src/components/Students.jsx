import { useState, useMemo } from "react";
import { StatCard, Avatar, Btn, Card, Table, Input, Select, Modal, SectionHeader, statusBadge } from "./ui";
import { CLASSES } from "../data/constants";

export default function Students({ students, setStudents, user }) {
  const [search, setSearch] = useState("");
  const [filterCls, setFilterCls] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [modal, setModal] = useState(null);
  const statusOptions = ["Active", "Inactive", "Suspended"];
  const isTeacher = user?.role === "teacher";
  const isAdmin = user?.role === "admin";

  function updateStudentStatus(id, status) {
    if (!isTeacher) setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  }

  const displayStudents = useMemo(() => {
    if (isTeacher) return students.filter(s => s.cls === user.cls);
    return students;
  }, [students, isTeacher, user?.cls]);

  const filtered = useMemo(() => displayStudents.filter(s =>
    (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search)) &&
    (!filterCls || s.cls === filterCls) &&
    (!filterStatus || s.status === filterStatus)
  ), [displayStudents, search, filterCls, filterStatus]);

  const classes = [...new Set(displayStudents.map(s => s.cls))].sort();

  function handleDelete(id) {
    if (window.confirm("Remove this student?")) setStudents(prev => prev.filter(s => s.id !== id));
  }

  const cols = [
    { key:"name",    label:"Name",    render: r => <div style={{display:"flex",alignItems:"center",gap:10}}><Avatar name={r.name} /><div><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:11,color:"#9CA3AF"}}>{r.id}</div></div></div> },
    { key:"cls",     label:"Class",   render: r => r.cls },
    { key:"gender",  label:"Gender",  render: r => r.gender },
    { key:"status",  label:"Status",  render: r => isTeacher ? (
        <div style={{padding:"4px 8px",borderRadius:"4px",background:"#F3F4F6",fontSize:13,fontWeight:500}}>{r.status}</div>
      ) : (
        <Select value={r.status} onChange={v => updateStudentStatus(r.id, v)}>
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
      ) },
    { key:"phone",   label:"Phone",   render: r => r.phone },
    { key:"actions", label:"",        render: r => (
      <div style={{display:"flex",gap:6}}>
        <Btn small onClick={() => setModal(r)}>View</Btn>
        {!isTeacher && <Btn small variant="danger" onClick={() => handleDelete(r.id)}>Remove</Btn>}
      </div>
    )},
  ];

  return (
    <div>
      <SectionHeader title={isTeacher ? `My Students (${user.cls})` : "Students"}
        action={!isTeacher && <Btn variant="primary" onClick={() => setModal("add")}>+ Add student</Btn>}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        <StatCard label="Total" value={displayStudents.length} color="#3B6FE8" />
        <StatCard label="Active" value={displayStudents.filter(s=>s.status==='Active').length} color="#16A34A" />
        <StatCard label="Inactive" value={displayStudents.filter(s=>s.status==='Inactive').length} color="#D97706" />
        <StatCard label="Suspended" value={displayStudents.filter(s=>s.status==='Suspended').length} color="#DC2626" />
      </div>
      <Card>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid #E4E8EF`, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Input placeholder="Search name or ID…" value={search} onChange={setSearch} style={{ maxWidth: 240 }} />
          <Select value={filterCls} onChange={setFilterCls}><option value="">All classes</option>{classes.map(c=><option key={c}>{c}</option>)}</Select>
          <Select value={filterStatus} onChange={setFilterStatus}><option value="">All statuses</option>{["Active","Inactive","Suspended"].map(s=><option key={s}>{s}</option>)}</Select>
          <span style={{ fontSize: 12, color: "#9CA3AF", alignSelf: "center", marginLeft: "auto" }}>{filtered.length} of {students.length}</span>
        </div>
        <Table cols={cols} rows={filtered} />
      </Card>

      {modal === "add" && <AddStudentModal onClose={() => setModal(null)} onSave={d => { setStudents(p => [...p, { ...d, id:`S${String(p.length+1).padStart(3,"0")}` }]); setModal(null); }} />}
      {modal && modal !== "add" && <StudentDetailModal student={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

function AddStudentModal({ onClose, onSave }) {
  const [f, setF] = useState({ name:"", gender:"Male", cls:CLASSES[0]?.name || "Grade 1", status:"Active", email:"", phone:"", dob:"", guardian:"", gPhone:"" });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <Modal title="Add student" onClose={onClose}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[ ["Full name","name","text"], ["Date of birth","dob","date"], ["Email","email","email"], ["Phone","phone","text"], ["Guardian","guardian","text"], ["Guardian phone","gPhone","text"] ].map(([label, key, type]) => (
          <div key={key}>
            <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>{label}</div>
            <Input type={type} value={f[key]} onChange={v => set(key, v)} placeholder={label} />
          </div>
        ))}
        <div>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Gender</div>
          <Select value={f.gender} onChange={v => set("gender", v)}><option>Male</option><option>Female</option></Select>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Class</div>
          <Select value={f.cls} onChange={v => set("cls", v)}>{CLASSES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}</Select>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Status</div>
          <Select value={f.status} onChange={v => set("status", v)}>{["Active","Inactive","Suspended"].map(s=><option key={s}>{s}</option>)}</Select>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" onClick={() => f.name.trim() && onSave(f)}>Save student</Btn>
      </div>
    </Modal>
  );
}

function StudentDetailModal({ student, onClose }) {
  return (
    <Modal title="Student profile" onClose={onClose}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <Avatar name={student.name} size={52} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{student.name}</div>
          <div style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "monospace" }}>{student.id}</div>
          {statusBadge(student.status)}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[ ["Class", student.cls], ["Gender", student.gender], ["Date of birth", student.dob], ["Email", student.email], ["Phone", student.phone], ["Guardian", student.guardian], ["Guardian phone", student.gPhone] ].map(([k, v]) => (
          <div key={k} style={{ background: "#F4F6F9", borderRadius: "8px", padding: "10px 14px" }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>{k}</div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{v || "—"}</div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
