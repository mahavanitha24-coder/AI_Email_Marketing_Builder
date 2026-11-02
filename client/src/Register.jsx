
import { useState } from "react";

function Register({ onBack, onRegisterSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters!");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        if (typeof onRegisterSuccess === "function") {
          onRegisterSuccess();
        } else {
          setMessage("Registration successful! Please login.");
        }
      } else {
        setMessage(data.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Cannot connect to backend server!");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    borderRadius: "10px",
    fontSize: "15px",
    padding: "12px"
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center py-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e8edff, #f5eaff)"
      }}
    >
      <div
        className="card border-0 p-4 p-md-5"
        style={{
          width: "100%",
          maxWidth: "480px",
          borderRadius: "20px",
          boxShadow: "0 12px 40px rgba(35, 45, 100, 0.12)"
        }}
      >
        <div className="text-center mb-4">
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center text-white"
            style={{
              width: "65px",
              height: "65px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #4055d6, #7956d9)",
              fontSize: "28px"
            }}
          >
            ✉
          </div>

          <h2 className="fw-bold mb-2" style={{ color: "#26345b" }}>
            Create Account
          </h2>

          <p className="text-muted mb-0">
            Join our AI Email Marketing Builder
          </p>
        </div>

        {message && (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Full Name
            </label>

            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              style={inputStyle}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Email Address
            </label>

            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              style={inputStyle}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Password
            </label>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control form-control-lg"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                autoComplete="new-password"
                required
                style={{
                  ...inputStyle,
                  borderRadius: "10px 0 0 10px"
                }}
              />

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                style={{ borderRadius: "0 10px 10px 0" }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">
              Confirm Password
            </label>

            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control form-control-lg"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                style={{
                  ...inputStyle,
                  borderRadius: "10px 0 0 10px"
                }}
              />

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                style={{ borderRadius: "0 10px 10px 0" }}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-lg w-100 text-white fw-semibold"
            disabled={loading}
            style={{
              borderRadius: "10px",
              background: "linear-gradient(135deg, #4055d6, #7956d9)",
              border: "none"
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            className="btn btn-link text-decoration-none"
            onClick={onBack}
          >
            ← Back to Home
          </button>
        </div>

        <p className="text-center text-muted small mt-3 mb-0">
          AI Email Marketing Builder
        </p>
      </div>
    </div>
  );
}

export default Register;
