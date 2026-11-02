
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Campaign from "./Campaign";
import MyCampaigns from "./MyCampaigns";
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Handle successful login
  const handleLoginSuccess = (newToken, userData) => {
    if (!newToken || !userData) {
      console.error("Login token or user data is missing");
      return;
    }

    setToken(newToken);
    setUser(userData);
    setPage("dashboard");
  };

  // Handle successful registration
  const handleRegisterSuccess = () => {
    setPage("login");
  };

  // Handle logout
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setPage("home");
  };

  // Navigation functions
  const openHome = () => setPage("home");

  const openDashboard = () => {
    if (token) setPage("dashboard");
    else setPage("login");
  };

  const openCampaign = () => {
    if (token) setPage("campaign");
    else setPage("login");
  };

  const openMyCampaigns = () => {
    if (token) setPage("myCampaigns");
    else setPage("login");
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 px-md-4 py-3">
        <div className="container-fluid">

          <span
            className="navbar-brand fw-bold"
            style={{ cursor: "pointer" }}
            onClick={openHome}
          >
            ✉ AI Email Marketing Builder
          </span>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="mainNavbar"
          >
            <div className="navbar-nav ms-auto align-items-lg-center gap-2 mt-3 mt-lg-0">

              {token && user ? (
                <>
                  <button
                    type="button"
                    className={`btn ${
                      page === "home"
                        ? "btn-primary"
                        : "btn-outline-light"
                    }`}
                    onClick={openHome}
                  >
                    Home
                  </button>

                  <button
                    type="button"
                    className={`btn ${
                      page === "dashboard"
                        ? "btn-primary"
                        : "btn-outline-light"
                    }`}
                    onClick={openDashboard}
                  >
                    Dashboard
                  </button>

                  <button
                    type="button"
                    className={`btn ${
                      page === "campaign"
                        ? "btn-primary"
                        : "btn-outline-light"
                    }`}
                    onClick={openCampaign}
                  >
                    Create Campaign
                  </button>

                  <button
                    type="button"
                    className={`btn ${
                      page === "myCampaigns"
                        ? "btn-primary"
                        : "btn-outline-light"
                    }`}
                    onClick={openMyCampaigns}
                  >
                    My Campaigns
                  </button>

                  <span className="text-white fw-semibold px-2">
                    Welcome, {user.name || "User"}
                  </span>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-outline-light"
                    onClick={openHome}
                  >
                    Home
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-light"
                    onClick={() => setPage("login")}
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => setPage("register")}
                  >
                    Register
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      </nav>

      {/* Home Page */}
      {page === "home" && (
        <div className="container text-center mt-5">
          <h1 className="fw-bold">
            AI Email Marketing Campaign Builder
          </h1>

          <p className="lead mt-3">
            Create professional marketing emails using
            Artificial Intelligence.
          </p>

          <button
            type="button"
            className="btn btn-primary btn-lg mt-3"
            onClick={openCampaign}
          >
            Create Campaign
          </button>

          <button
            type="button"
            className="btn btn-outline-primary btn-lg mt-3 ms-2"
            onClick={openMyCampaigns}
          >
            My Campaigns
          </button>

          <button
            type="button"
            className="btn btn-success btn-lg mt-3 ms-2"
            onClick={openDashboard}
          >
            Campaign Dashboard
          </button>
        </div>
      )}

      {/* Login Page */}
      {page === "login" && !token && (
        <Login
          onBack={openHome}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Register Page */}
      {page === "register" && !token && (
        <Register
          onBack={openHome}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

      {/* Campaign Page */}
      {page === "campaign" && token && (
        <Campaign
          token={token}
          onBack={openHome}
        />
      )}

      {/* My Campaigns Page */}
      {page === "myCampaigns" && token && (
        <MyCampaigns
          token={token}
          onBack={openHome}
        />
      )}

      {/* Dashboard Page */}
      {page === "dashboard" && token && (
        <Dashboard token={token} />
      )}

    </div>
  );
}

export default App;
