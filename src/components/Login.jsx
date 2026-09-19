import { useState } from "react";
import { T } from "../data/constants";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const users = [
    { id: "A001", email: "admin@school.gh", password: "admin123", role: "admin", name: "Administrator" },
    { id: "F002", email: "accountant@school.gh", password: "accountant123", role: "accountant", name: "Mrs. Akua Nkrumah", department: "Accounts", phone: "0244400002" },
    { id: "L001", email: "library@school.gh", password: "library123", role: "library", name: "Ms. Adwoa Library", department: "Library", phone: "0244400003" },
    { id: "T001", email: "k.adu@school.gh", password: "teacher123", role: "teacher", name: "Mr. Kwame Adu", cls: "Grade 1" },
    { id: "T002", email: "e.barimah@school.gh", password: "teacher123", role: "teacher", name: "Mrs. Esi Barimah", cls: "Grade 2" },
    { id: "T003", email: "y.darko@school.gh", password: "teacher123", role: "teacher", name: "Mr. Yaw Darko", cls: "Grade 3" },
    { id: "S001", email: "ama@school.gh", password: "student123", role: "student", name: "Ama Owusu" },
    { id: "S002", email: "kweku@school.gh", password: "student123", role: "student", name: "Kweku Mensah" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", email)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profile) {
          throw new Error("Profile not found for this account.");
        }

        onLogin({
          id: data.user.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          phone: profile.phone,
          department: profile.department,
        });
        setLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        onLogin(user);
      } else {
        setError("Invalid email or password");
        setPassword("");
      }
    } catch (err) {
      setError(err?.message || "Login failed. Please try again.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: `linear-gradient(135deg, ${T.accent} 0%, ${T.sidebar} 100%)`, fontFamily: "system-ui, -apple-system, sans-serif", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 420, padding: 40, background: T.surface, borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,.3)", textAlign: "center" }}>
        
        {/* Logo/Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏫</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: T.textPrimary, margin: "0 0 8px 0" }}>Accra Prestige</h1>
          <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>School Management System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 20, textAlign: "left" }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 8 }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@school.gh"
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: 14,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                boxSizing: "border-box",
                fontFamily: "inherit",
                transition: "border-color .2s",
              }}
              onFocus={(e) => e.target.style.borderColor = T.accent}
              onBlur={(e) => e.target.style.borderColor = T.border}
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: 8, textAlign: "left" }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 8 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: 14,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                boxSizing: "border-box",
                fontFamily: "inherit",
                transition: "border-color .2s",
              }}
              onFocus={(e) => e.target.style.borderColor = T.accent}
              onBlur={(e) => e.target.style.borderColor = T.border}
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ marginBottom: 20, padding: "12px 14px", background: T.dangerBg, border: `1px solid ${T.danger}`, borderRadius: 8, fontSize: 13, color: T.danger, fontWeight: 500 }}>
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 16px",
              marginBottom: 20,
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              background: loading ? "#999" : T.accent,
              border: "none",
              borderRadius: 8,
              cursor: loading ? "wait" : "pointer",
              transition: "background .2s",
            }}
            onMouseEnter={(e) => !loading && (e.target.style.background = "#2F5FD8")}
            onMouseLeave={(e) => !loading && (e.target.style.background = T.accent)}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Demo Credentials */}
        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 12 }}>Demo Credentials</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <div style={{ padding: "10px 12px", background: "#F3F4F6", borderRadius: 6, fontSize: 11 }}>
              <div style={{ fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>Admin</div>
              <div style={{ fontSize: 10, color: T.textMuted, lineHeight: 1.4, wordBreak: "break-all" }}>
                <div>admin@school.gh</div>
                <div>admin123</div>
              </div>
            </div>
            <div style={{ padding: "10px 12px", background: "#F3F4F6", borderRadius: 6, fontSize: 11 }}>
              <div style={{ fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>Accountant</div>
              <div style={{ fontSize: 10, color: T.textMuted, lineHeight: 1.4, wordBreak: "break-all" }}>
                <div>accountant@school.gh</div>
                <div>accountant123</div>
              </div>
            </div>
            <div style={{ padding: "10px 12px", background: "#F3F4F6", borderRadius: 6, fontSize: 11 }}>
              <div style={{ fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>Library</div>
              <div style={{ fontSize: 10, color: T.textMuted, lineHeight: 1.4, wordBreak: "break-all" }}>
                <div>library@school.gh</div>
                <div>library123</div>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 8 }}>
            <div style={{ padding: "10px 12px", background: "#F3F4F6", borderRadius: 6, fontSize: 11 }}>
              <div style={{ fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>Teacher</div>
              <div style={{ fontSize: 10, color: T.textMuted, lineHeight: 1.4, wordBreak: "break-all" }}>
                <div>k.adu@school.gh</div>
                <div>teacher123</div>
              </div>
            </div>
            <div style={{ padding: "10px 12px", background: "#F3F4F6", borderRadius: 6, fontSize: 11 }}>
              <div style={{ fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>Student</div>
              <div style={{ fontSize: 10, color: T.textMuted, lineHeight: 1.4, wordBreak: "break-all" }}>
                <div>ama@school.gh</div>
                <div>student123</div>
              </div>
            </div>
            <div style={{ padding: "10px 12px", background: "#F3F4F6", borderRadius: 6, fontSize: 11 }}>
              <div style={{ fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>Library</div>
              <div style={{ fontSize: 10, color: T.textMuted, lineHeight: 1.4, wordBreak: "break-all" }}>
                <div>library@school.gh</div>
                <div>library123</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
