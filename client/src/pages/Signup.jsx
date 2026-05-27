import { useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";

const Signup = () => {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate =
    useNavigate();

  const motivationQuotes = [
    "🚀 Your future is built today.",
    "🔥 Build habits that build you.",
    "⚡ Productivity starts with consistency.",
    "🎯 One focused day changes everything.",
    "🏆 Success is hidden in daily routines.",
    "💡 Start small. Stay consistent.",
  ];

  const [randomQuote] =
  useState(() => {
    return motivationQuotes[
      Math.floor(
        Math.random() *
          motivationQuotes.length
      )
    ];
  });

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        const res =
          await fetch(
            "http://localhost:5000/api/auth/register",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                name,
                email,
                password,
              }),
            }
          );

        const data =
          await res.json();

        if (res.ok) {
          localStorage.setItem(
            "token",
            data.token
          );

          navigate("/");
        } else {
          console.log(
            "Signup failed:",
            data
          );
        }
      } catch (error) {
        console.log(
          "Server error:",
          error
        );
      }
    };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundGlow1} />

      <div style={styles.backgroundGlow2} />

      <div style={styles.card}>
        <p style={styles.badge}>
          ✨ Start Your Journey
        </p>

        <h1 style={styles.title}>
          Create Account
        </h1>

        <p style={styles.subtitle}>
          Build your productivity
          system
        </p>

        <div style={styles.quoteBox}>
          <p style={styles.quoteText}>
            {randomQuote}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={styles.form}
        >
          <div
            style={styles.formGroup}
          >
            <label
              style={styles.label}
            >
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="Enter your name"
              required
              style={styles.input}
            />
          </div>

          <div
            style={styles.formGroup}
          >
            <label
              style={styles.label}
            >
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              placeholder="Enter your email"
              required
              style={styles.input}
            />
          </div>

          <div
            style={styles.formGroup}
          >
            <label
              style={styles.label}
            >
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Enter your password"
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0px)";
            }}
          >
            Sign Up
          </button>

          <p style={styles.linkText}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={styles.link}
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background:
      "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #e0f2fe 100%)",
    overflow: "hidden",
    position: "relative",
  },

  backgroundGlow1: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background:
      "rgba(16,185,129,0.15)",
    borderRadius: "50%",
    filter: "blur(80px)",
    top: "-100px",
    left: "-100px",
  },

  backgroundGlow2: {
    position: "absolute",
    width: "350px",
    height: "350px",
    background:
      "rgba(37,99,235,0.12)",
    borderRadius: "50%",
    filter: "blur(80px)",
    bottom: "-100px",
    right: "-100px",
  },

  card: {
    width: "100%",
    maxWidth: "500px",
    padding: "50px",
    borderRadius: "32px",
    background:
      "rgba(255,255,255,0.75)",
    backdropFilter: "blur(14px)",
    border:
      "1px solid rgba(255,255,255,0.45)",
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.08)",
    animation:
      "fadeIn 0.5s ease",
    transition:
      "all 0.3s ease",
    position: "relative",
    zIndex: 2,
  },

  badge: {
    display: "inline-block",
    padding: "10px 18px",
    borderRadius: "999px",
    background:
      "rgba(16,185,129,0.08)",
    color: "#10b981",
    fontWeight: "700",
    fontSize: "14px",
    marginBottom: "22px",
  },

  title: {
    fontSize: "52px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "12px",
    letterSpacing: "-1px",
  },

  subtitle: {
    color: "#64748b",
    marginBottom: "24px",
    fontSize: "17px",
    lineHeight: "1.6",
  },

  quoteBox: {
    padding: "18px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(37,99,235,0.08))",
    marginBottom: "28px",
    border:
      "1px solid rgba(16,185,129,0.08)",
    boxShadow:
      "0 6px 18px rgba(16,185,129,0.06)",
  },

  quoteText: {
    textAlign: "center",
    fontSize: "15px",
    fontWeight: "700",
    color: "#065f46",
    lineHeight: "1.6",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  label: {
    fontWeight: "700",
    color: "#334155",
    fontSize: "15px",
  },

  input: {
    padding: "16px 18px",
    borderRadius: "16px",
    border:
      "1px solid rgba(203,213,225,0.7)",
    fontSize: "15px",
    outline: "none",
    background:
      "rgba(255,255,255,0.85)",
    transition:
      "all 0.25s ease",
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.03)",
    color: "#0f172a",
  },

  button: {
    width: "100%",
    padding: "16px",
    border: "none",
    borderRadius: "18px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "16px",
    background:
      "linear-gradient(135deg, #10b981, #2563eb)",
    color: "white",
    boxShadow:
      "0 10px 25px rgba(16,185,129,0.2)",
    transition:
      "all 0.25s ease",
  },

  linkText: {
    textAlign: "center",
    color: "#64748b",
    marginTop: "5px",
    fontSize: "15px",
  },

  link: {
    color: "#2563eb",
    fontWeight: "700",
    textDecoration: "none",
  },
};

export default Signup;