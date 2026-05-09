import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

const Login = () => {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const navigate =
    useNavigate();

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setError("");

      try {
        const res =
          await fetch(
            "http://localhost:5000/api/auth/login",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
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
          setError(
            data.message ||
            "Login failed"
          );

          setTimeout(
            () =>
              setError(""),
            3000
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
      
      <div style={styles.card}>
        
        <p style={styles.badge}>
          🚀 Welcome Back
        </p>

        <h1 style={styles.title}>
          Login
        </h1>

        <p style={styles.subtitle}>
          Continue your productivity journey
        </p>

        <form
          onSubmit={
            handleSubmit
          }
          style={
            styles.form
          }
        >

          <div
            style={
              styles.formGroup
            }
          >
            <label
              style={
                styles.label
              }
            >
              Email
            </label>

            <input
              type="email"
              value={
                email
              }
              onChange={(
                e
              ) =>
                setEmail(
                  e.target
                    .value
                )
              }
              placeholder="Enter your email"
              required
              style={
                styles.input
              }
            />
          </div>

          <div
            style={
              styles.formGroup
            }
          >
            <label
              style={
                styles.label
              }
            >
              Password
            </label>

            <input
              type="password"
              value={
                password
              }
              onChange={(
                e
              ) =>
                setPassword(
                  e.target
                    .value
                )
              }
              placeholder="Enter your password"
              required
              style={
                styles.input
              }
            />
          </div>

          {error && (
            <p
              style={
                styles.errorText
              }
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            style={
              styles.button
            }
          >
            Login
          </button>

          <p
            style={
              styles.linkText
            }
          >
            Don’t have an account?{" "}

            <Link
              to="/signup"
              style={
                styles.link
              }
            >
              Signup
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
    justifyContent:
      "center",
    alignItems:
      "center",
    padding: "20px",
    background:
      "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #e0f2fe 100%)",
  },

  card: {
    width: "100%",
    maxWidth: "450px",
    padding: "45px",
    borderRadius: "24px",
    background:
      "rgba(255,255,255,0.85)",
    backdropFilter:
      "blur(10px)",
    boxShadow:
      "0 12px 35px rgba(0,0,0,0.08)",
  },

  badge: {
    display:
      "inline-block",
    padding:
      "8px 16px",
    borderRadius:
      "999px",
    background:
      "rgba(37,99,235,0.08)",
    color:
      "#2563eb",
    fontWeight:
      "600",
    fontSize:
      "14px",
    marginBottom:
      "20px",
  },

  title: {
    fontSize:
      "42px",
    fontWeight:
      "800",
    color:
      "#0f172a",
    marginBottom:
      "10px",
  },

  subtitle: {
    color:
      "#64748b",
    marginBottom:
      "35px",
    fontSize:
      "16px",
  },

  form: {
    display:
      "flex",
    flexDirection:
      "column",
    gap: "22px",
  },

  formGroup: {
    display:
      "flex",
    flexDirection:
      "column",
    gap: "8px",
  },

  label: {
    fontWeight:
      "700",
    color:
      "#334155",
  },

  input: {
    padding:
      "14px 16px",
    borderRadius:
      "12px",
    border:
      "1px solid #cbd5e1",
    fontSize:
      "15px",
    outline:
      "none",
  },

  button: {
    width: "100%",
    padding:
      "15px",
    border:
      "none",
    borderRadius:
      "14px",
    cursor:
      "pointer",
    fontWeight:
      "700",
    fontSize:
      "16px",
    background:
      "linear-gradient(135deg, #2563eb, #7c3aed)",
    color:
      "white",
  },

  errorText: {
    color:
      "#dc2626",
    textAlign:
      "center",
    fontWeight:
      "600",
  },

  linkText: {
    textAlign:
      "center",
    color:
      "#64748b",
  },

  link: {
    color:
      "#2563eb",
    fontWeight:
      "700",
    textDecoration:
      "none",
  },
};

export default Login;