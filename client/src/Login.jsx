
import { useState } from "react";

function Login({ onBack, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (response.ok && data.token && data.user) {
        setPassword("");
        setMessage("Login successful!");

        if (typeof onLoginSuccess === "function") {
          onLoginSuccess(data.token, data.user);
        } else {
          setMessage(
            "Login succeeded, but App.jsx is not connected."
          );
        }
      } else if (response.ok) {
        setMessage(
          "Login response is missing token or user details."
        );
      } else {
        setMessage(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Cannot connect to backend server!");
    } finally {
      setLoading(false);
    }
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
          maxWidth: "440px",
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
            Welcome Back!
          </h2>

          <p className="text-muted mb-0">
            Login to your AI Email Marketing Builder
          </p>
        </div>

        {message && (
          <div
            className={`alert ${
              message === "Login successful!"
                ? "alert-success"
                : "alert-danger"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleLogin}>
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
              style={{ borderRadius: "10px", fontSize: "15px" }}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">
              Password
            </label>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control form-control-lg"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                style={{ borderRadius: "10px 0 0 10px", fontSize: "15px" }}
              />

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{ borderRadius: "0 10px 10px 0" }}
              >
                {showPassword ? "Hide" : "Show"}
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
            {loading ? "Logging in..." : "Login to Account"}
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

export default Login;
