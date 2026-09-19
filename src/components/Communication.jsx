import { useState } from "react";
import { Card, SectionHeader, Btn, Modal, Input, Select } from "./ui";
import { ANNOUNCEMENTS, TODAY } from "../data/constants";

export default function Communication({ user }) {
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS);
  const [modal, setModal] = useState(false);

  function handleDelete(id) { setAnnouncements(p => p.filter(a => a.id !== id)); }

  const isStudent = user?.role === "student";
  const canPost = user?.role === "admin";

  return (
    <div>
      <SectionHeader title={isStudent ? "School Announcements" : "Communication"} action={canPost && <Btn variant="primary" onClick={() => setModal(true)}>+ New announcement</Btn>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {announcements.map(a => (
          <Card key={a.id} style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{a.title}</span>
                <span style={{ background: "#EBF0FD", color: "#3B6FE8", padding: "2px 8px", borderRadius: 20, fontSize: 11 }}>{a.type}</span>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#9CA3AF" }}>{a.date}</span>
                {canPost && <Btn small variant="danger" onClick={() => handleDelete(a.id)}>Delete</Btn>}

              </div>
            </div>
            <p style={{ fontSize: 14, color: "#6B7280", margin: 0, lineHeight: 1.6 }}>{a.body}</p>
          </Card>
        ))}
        {announcements.length === 0 && <div style={{ textAlign: "center", padding: 48, color: "#9CA3AF" }}>No announcements. {!isStudent && "Post the first one."}</div>}
      </div>
      {canPost && modal && (
        <Modal title="New announcement" onClose={() => setModal(false)}>
          <NewAnnouncementForm onSave={d => { setAnnouncements(p => [{ ...d, id:`A${String(p.length+1).padStart(3,"0")}`, date: TODAY }, ...p]); setModal(false); }} onClose={() => setModal(false)} />
        </Modal>
      )}
    </div>
  );
}

function NewAnnouncementForm({ onSave, onClose }) {
  const [f, setF] = useState({ title:"", body:"", type:"Academic" });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div>
        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Title</div>
        <Input value={f.title} onChange={v => set("title", v)} placeholder="Announcement title" />
      </div>
      <div>
        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Type</div>
        <Select value={f.type} onChange={v => set("type", v)} style={{ width: "100%" }}>
          {["Academic","Finance","Event","General"].map(t => <option key={t}>{t}</option>)}
        </Select>
      </div>
      <div>
        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Message</div>
        <textarea value={f.body} onChange={e => set("body", e.target.value)} placeholder="Write your announcement here…"
          style={{ border:`1px solid #E4E8EF`, borderRadius:"8px", padding:"8px 12px", fontSize:13, background:"#F4F6F9", color:"#111827", outline:"none", width:"100%", minHeight:100, resize:"vertical", fontFamily:"inherit" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" onClick={() => f.title.trim() && f.body.trim() && onSave(f)}>Post</Btn>
      </div>
    </div>
  );
}
