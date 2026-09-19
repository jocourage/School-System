import { useState } from "react";
import { StatCard, Avatar, Badge, Btn, Card, Table, Modal, Input, SectionHeader } from "./ui";

export default function Library({ books, setBooks, user }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const isLibraryRole = user?.role === "library";

  function updateQuantity(id, delta) {
    setBooks(prev => prev.map(book => {
      if (book.id !== id || (delta < 0 && book.available === 0)) return book;
      return { ...book, copies: book.copies + delta, available: book.available + delta };
    }));
  }

  const filtered = books.filter(b => !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));

  const cols = [
    { key:"title",     label:"Title",     render: r => <span style={{fontWeight:600}}>{r.title}</span> },
    { key:"author",    label:"Author",    render: r => r.author },
    { key:"isbn",      label:"ISBN",      render: r => <span style={{fontFamily:"monospace",fontSize:12,color:"#9CA3AF"}}>{r.isbn}</span> },
    { key:"copies",    label:"Copies",    render: r => isLibraryRole ? (
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        <Btn small onClick={() => updateQuantity(r.id, -1)} disabled={r.available === 0}>−</Btn>
        <span style={{ minWidth:20, textAlign:"center", fontWeight:600 }}>{r.copies}</span>
        <Btn small onClick={() => updateQuantity(r.id, 1)}>+</Btn>
      </div>
    ) : r.copies },
    { key:"available", label:"Available", render: r => <Badge label={`${r.available} available`} type={r.available>0?"success":"danger"} /> },
    { key:"act",       label:"",          render: r => (
      <div style={{display:"flex",gap:6}}>
        {isLibraryRole && <Btn small variant="primary" onClick={() => setBooks(p => p.map(b => b.id===r.id && b.available>0 ? {...b, available:b.available-1} : b))}>Issue</Btn>}
        {isLibraryRole && <Btn small onClick={() => setBooks(p => p.map(b => b.id===r.id && b.available<b.copies ? {...b, available:b.available+1} : b))}>Return</Btn>}
      </div>
    )},
  ];

  return (
    <div>
      <SectionHeader title="Library" action={isLibraryRole && <Btn variant="primary" onClick={() => setModal(true)}>+ Add book</Btn>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        <StatCard label="Total titles"   value={books.length} color="#3B6FE8" />
        <StatCard label="Total copies"   value={books.reduce((a,b)=>a+b.copies,0)} color="#7C3AED" />
        <StatCard label="On loan"        value={books.reduce((a,b)=>a+(b.copies-b.available),0)} color="#D97706" />
      </div>
      <Card>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid #E4E8EF` }}>
          <Input placeholder="Search by title or author…" value={search} onChange={setSearch} style={{ maxWidth: 280 }} />
        </div>
        <Table cols={cols} rows={filtered} />
      </Card>
      {modal && (
        <Modal title="Add book" onClose={() => setModal(false)}>
          <AddBookForm onSave={d => { setBooks(p => [...p, { ...d, id:`B${String(p.length+1).padStart(3,"0")}`, copies:parseInt(d.copies)||1, available:parseInt(d.copies)||1 }]); setModal(false); }} onClose={() => setModal(false)} />
        </Modal>
      )}
    </div>
  );
}

function AddBookForm({ onSave, onClose }) {
  const [f, setF] = useState({ title:"", author:"", isbn:"", copies:"1" });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <div style={{ display: "grid", gap: 14 }}>
      {[ ["Title","title"], ["Author","author"], ["ISBN","isbn"], ["Number of copies","copies"] ].map(([label,key]) => (
        <div key={key}>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>{label}</div>
          <Input value={f[key]} onChange={v => set(key, v)} placeholder={label} />
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" onClick={() => f.title.trim() && onSave(f)}>Add book</Btn>
      </div>
    </div>
  );
}
