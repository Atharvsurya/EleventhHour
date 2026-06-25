import React, { useState } from "react";
import { loginUser, registerUser } from "../api/client";

export default function LoginView({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "", email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        // 1. Register the user
        await registerUser(formData);
        alert("Registration successful! Please log in.");
        setIsRegistering(false); // Switch to login view
      } else {
        // 2. Log the user in
        const res = await loginUser({ username: formData.username, password: formData.password });

        // 3. Save the token and trigger the app to unlock!
        if (res.data && res.data.token) {
          localStorage.setItem("jwt_token", res.data.token);
          onLogin(res.data.username); // Pass username up to main app
        }
      }
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>EleventhHour</h2>
        <p style={styles.subtitle}>
          {isRegistering ? "Create a new account" : "Sign in to manage your tasks"}
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          {isRegistering && (
            <input
              style={styles.input}
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          )}
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Processing..." : isRegistering ? "Register" : "Sign In"}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isRegistering ? "Already have an account? " : "Don't have an account? "}
          <span style={styles.toggleLink} onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Log in here" : "Register here"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--navy)" },
  card: { background: "var(--navy-2)", padding: 40, borderRadius: 16, width: "100%", maxWidth: 400, border: "1px solid var(--border-lt)", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" },
  title: { fontSize: 28, color: "var(--white)", marginBottom: 8, textAlign: "center", fontFamily: "var(--font-display)" },
  subtitle: { color: "var(--slate-400)", textAlign: "center", marginBottom: 24 },
  error: { background: "rgba(244,63,94,0.1)", color: "var(--rose)", padding: 12, borderRadius: 8, marginBottom: 16, textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  input: { background: "var(--navy-3)", border: "1px solid var(--border-lt)", padding: "12px 16px", borderRadius: 8, color: "var(--white)", outline: "none" },
  button: { background: "var(--indigo)", color: "var(--white)", padding: "12px", borderRadius: 8, fontWeight: 600, marginTop: 8, transition: "0.2s" },
  toggleText: { color: "var(--slate-400)", textAlign: "center", marginTop: 24, fontSize: 14 },
  toggleLink: { color: "var(--cyan)", cursor: "pointer", fontWeight: 500 }
};